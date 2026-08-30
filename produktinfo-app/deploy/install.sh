#!/usr/bin/env bash
# ==========================================================================
# ProduktPass — Installation/Update auf dem VPS (produktpass.meosapp.de)
#
# Erkennt automatisch, welcher Reverse-Proxy läuft (Traefik, nginx-proxy,
# Nginx Proxy Manager oder Host-nginx) und richtet die App passend ein.
# Idempotent: erneut ausführen = Update.
#
# Aufruf (im Verzeichnis /opt/produktpass):  bash install.sh
# ==========================================================================
set -euo pipefail

APP="produktpass"
DOMAIN="produktpass.meosapp.de"
DIR="/opt/${APP}"
INTERNER_PORT="8087"   # nur für den Fallback ohne Container-Proxy

sag()  { printf '\033[1;32m▸ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m⚠ %s\033[0m\n' "$*"; }

cd "$(dirname "$0")"
[ -d dist ] || { echo "FEHLER: dist/ fehlt neben install.sh"; exit 1; }
command -v docker >/dev/null || { echo "FEHLER: docker nicht gefunden"; exit 1; }

# docker compose v2 oder v1?
if docker compose version >/dev/null 2>&1; then COMPOSE="docker compose";
elif command -v docker-compose >/dev/null 2>&1; then COMPOSE="docker-compose";
else echo "FEHLER: docker compose nicht gefunden"; exit 1; fi

mkdir -p "$DIR"
if [ "$(pwd)" != "$DIR" ]; then
  sag "Kopiere Dateien nach ${DIR}"
  rm -rf "${DIR}/dist"
  cp -r dist "$DIR/"
  cp nginx.conf install.sh "$DIR/"
  cd "$DIR"
fi

# ——— Proxy-Erkennung ————————————————————————————————————————————————
MODUS="host-nginx"
PROXY_CONTAINER=""
if docker ps --format '{{.Names}} {{.Image}}' | grep -qiE 'traefik'; then
  MODUS="traefik"
  PROXY_CONTAINER=$(docker ps --format '{{.Names}} {{.Image}}' | grep -iE 'traefik' | head -1 | awk '{print $1}')
elif docker ps --format '{{.Names}} {{.Image}}' | grep -qiE 'nginx-proxy-manager|jc21/nginx-proxy-manager'; then
  MODUS="npm"
  PROXY_CONTAINER=$(docker ps --format '{{.Names}} {{.Image}}' | grep -iE 'nginx-proxy-manager|jc21' | head -1 | awk '{print $1}')
elif docker ps --format '{{.Names}} {{.Image}}' | grep -qiE 'nginxproxy/nginx-proxy|jwilder/nginx-proxy|(^| )nginx-proxy '; then
  MODUS="nginx-proxy"
  PROXY_CONTAINER=$(docker ps --format '{{.Names}} {{.Image}}' | grep -iE 'nginxproxy/nginx-proxy|jwilder/nginx-proxy|nginx-proxy' | head -1 | awk '{print $1}')
fi
sag "Erkannter Proxy: ${MODUS}${PROXY_CONTAINER:+ (Container: ${PROXY_CONTAINER})}"

# Netzwerk des Proxy-Containers ermitteln (App muss im selben Netz laufen)
PROXY_NETZ=""
if [ -n "$PROXY_CONTAINER" ]; then
  PROXY_NETZ=$(docker inspect "$PROXY_CONTAINER" -f '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}' | grep -v '^bridge$' | head -1)
  [ -z "$PROXY_NETZ" ] && PROXY_NETZ="bridge"
  sag "Proxy-Netzwerk: ${PROXY_NETZ}"
fi

# ——— docker-compose.yml passend erzeugen ————————————————————————————
case "$MODUS" in
  traefik)
    cat > docker-compose.yml <<YAML
services:
  ${APP}:
    image: nginx:1.27-alpine
    container_name: ${APP}
    restart: unless-stopped
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${APP}.rule=Host(\`${DOMAIN}\`)"
      - "traefik.http.routers.${APP}.entrypoints=websecure"
      - "traefik.http.routers.${APP}.tls.certresolver=myresolver"
      - "traefik.http.services.${APP}.loadbalancer.server.port=80"
      - "traefik.http.routers.${APP}-http.rule=Host(\`${DOMAIN}\`)"
      - "traefik.http.routers.${APP}-http.entrypoints=web"
      - "traefik.http.routers.${APP}-http.middlewares=${APP}-https"
      - "traefik.http.middlewares.${APP}-https.redirectscheme.scheme=https"
    networks:
      - proxynetz
networks:
  proxynetz:
    name: ${PROXY_NETZ}
    external: true
YAML
    ;;
  nginx-proxy)
    cat > docker-compose.yml <<YAML
services:
  ${APP}:
    image: nginx:1.27-alpine
    container_name: ${APP}
    restart: unless-stopped
    environment:
      - VIRTUAL_HOST=${DOMAIN}
      - VIRTUAL_PORT=80
      - LETSENCRYPT_HOST=${DOMAIN}
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - proxynetz
networks:
  proxynetz:
    name: ${PROXY_NETZ}
    external: true
YAML
    ;;
  npm)
    cat > docker-compose.yml <<YAML
services:
  ${APP}:
    image: nginx:1.27-alpine
    container_name: ${APP}
    restart: unless-stopped
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - proxynetz
networks:
  proxynetz:
    name: ${PROXY_NETZ}
    external: true
YAML
    ;;
  host-nginx)
    cat > docker-compose.yml <<YAML
services:
  ${APP}:
    image: nginx:1.27-alpine
    container_name: ${APP}
    restart: unless-stopped
    ports:
      - "127.0.0.1:${INTERNER_PORT}:80"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
YAML
    ;;
esac

# ——— Start / Update ————————————————————————————————————————————————
sag "Starte Container …"
$COMPOSE up -d --force-recreate
docker exec "$APP" nginx -t >/dev/null && sag "nginx-Konfiguration OK"

# ——— Nacharbeiten je Modus ————————————————————————————————————————
case "$MODUS" in
  npm)
    warn "Nginx Proxy Manager erkannt. Falls unten kein LIVE steht: einmalig im NPM-Webinterface einen Proxy Host anlegen:"
    echo "   Domain: ${DOMAIN} → Forward Hostname: ${APP}, Port: 80, Websockets an, SSL: Let's-Encrypt-Zertifikat anfordern."
    ;;
  host-nginx)
    cat > nginx-vhost.conf <<VHOST
# In /etc/nginx/sites-available/${APP} ablegen, dann:
#   ln -s /etc/nginx/sites-available/${APP} /etc/nginx/sites-enabled/
#   nginx -t && systemctl reload nginx
#   certbot --nginx -d ${DOMAIN}
server {
    listen 80;
    server_name ${DOMAIN};
    location / {
        proxy_pass http://127.0.0.1:${INTERNER_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
VHOST
    warn "Kein bekannter Container-Proxy (Traefik/nginx-proxy/NPM) erkannt. App läuft auf 127.0.0.1:${INTERNER_PORT}."
    warn "Vhost-Datei liegt bereit unter ${DIR}/nginx-vhost.conf:"
    warn "  • Läuft nginx direkt auf dem Host: Anleitung im Dateikopf befolgen (sites-available + certbot)."
    warn "  • Ist der Proxy ein eigener nginx-CONTAINER: Datei in dessen conf.d-Mount legen und Container neu laden"
    warn "    (docker exec <proxy-name> nginx -s reload); statt 127.0.0.1 dann den Containernamen '${APP}' als proxy_pass-Ziel"
    warn "    verwenden und '${APP}' ins Netzwerk des Proxys hängen: docker network connect <proxynetz> ${APP}"
    ;;
esac

# ——— Smoke-Test ————————————————————————————————————————————————————
sleep 2
if docker exec "$APP" wget -q -O /dev/null http://127.0.0.1/; then
  sag "Container liefert die App aus."
else
  warn "Container antwortet nicht wie erwartet — Logs: docker logs ${APP}"
fi
if command -v curl >/dev/null; then
  CODE=$(curl -sk -o /dev/null -w '%{http_code}' "https://${DOMAIN}" || true)
  if [ "$CODE" = "200" ]; then
    sag "LIVE: https://${DOMAIN} antwortet mit 200 ✔"
  else
    warn "https://${DOMAIN} antwortet mit '${CODE}'."
    warn "Häufigste Ursache: DNS-A-Record '${APP}' → 31.97.122.6 fehlt noch oder ist nicht propagiert (5–15 Min)."
  fi
fi
sag "Fertig. Update später: neues Bundle entpacken und 'bash install.sh' erneut ausführen."
