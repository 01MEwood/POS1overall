#!/usr/bin/env bash
# ============================================================================
# POS1 Cockpit — Ein-Befehl-Deployment auf Marios Hostinger-VPS
#
# Ausführen von deinem Rechner (Git Bash / WSL / macOS / Linux) im Repo:
#   bash pos1-cockpit/deploy/deploy.sh
#
# Was passiert:
#   1. Quellcode wird gepackt und per SCP auf den VPS geladen
#   2. Auf dem VPS: entpacken nach /opt/pos1-cockpit, .env anlegen
#      (Basic-Auth-Passwort wird generiert und EINMALIG angezeigt)
#   3. Docker-Image wird auf dem VPS gebaut und mit Traefik-Labels gestartet
#   4. Healthcheck wird geprüft
#
# Voraussetzung (einmalig): DNS-A-Record  pos1 → 31.97.122.6  (Hostinger-Panel)
# ============================================================================
set -euo pipefail

VPS="${VPS:-root@31.97.122.6}"
APP_DIR=/opt/pos1-cockpit
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_PARENT="$(cd "$SCRIPT_DIR/../.." && pwd)"   # Ordner, der pos1-cockpit/ enthält
TARBALL="$(mktemp -t pos1-cockpit-XXXX).tgz"

echo "▶ 1/4  Quellcode packen …"
tar czf "$TARBALL" \
  --exclude='pos1-cockpit/backend/node_modules' \
  --exclude='pos1-cockpit/frontend/node_modules' \
  --exclude='pos1-cockpit/frontend/dist' \
  --exclude='pos1-cockpit/backend/data' \
  --exclude='pos1-cockpit/.env' \
  -C "$SRC_PARENT" pos1-cockpit
echo "   $(du -h "$TARBALL" | cut -f1) → $VPS"

echo "▶ 2/4  Upload auf den VPS …"
scp -q "$TARBALL" "$VPS:/tmp/pos1-cockpit.tgz"
rm -f "$TARBALL"

echo "▶ 3/4  Auf dem VPS entpacken, bauen und starten …"
ssh "$VPS" bash -s <<'REMOTE'
set -euo pipefail
mkdir -p /opt
tar xzf /tmp/pos1-cockpit.tgz -C /opt
rm -f /tmp/pos1-cockpit.tgz
cd /opt/pos1-cockpit

# docker compose (Plugin) oder docker-compose (Standalone)?
if docker compose version >/dev/null 2>&1; then DC="docker compose"; else DC="docker-compose"; fi

# .env nur beim Erst-Deploy anlegen — bestehende Konfiguration bleibt erhalten
if [ ! -f .env ]; then
  PW="$(openssl rand -base64 18 | tr -dc 'a-zA-Z0-9' | cut -c1-16)"
  HASH="$(openssl passwd -apr1 "$PW")"
  {
    echo "POS1_BASIC_AUTH=mario:$HASH"
    echo "DATAFORSEO_LOGIN="
    echo "DATAFORSEO_PASSWORD="
  } > .env
  chmod 600 .env
  echo ""
  echo "  ┌─────────────────────────────────────────────────┐"
  echo "  │  LOGIN für https://pos1.meosapp.de              │"
  echo "  │    Benutzer: mario                              │"
  echo "  │    Passwort: $PW               │"
  echo "  │  Jetzt notieren — es wird nur der Hash          │"
  echo "  │  gespeichert! Ändern: deploy/set-password.sh    │"
  echo "  └─────────────────────────────────────────────────┘"
  echo ""
  echo "  Hinweis: DataForSEO-Credentials nachtragen mit:"
  echo "    nano /opt/pos1-cockpit/.env  →  $DC -f docker-compose.prod.yml up -d"
fi

$DC -f docker-compose.prod.yml up -d --build
echo ""
$DC -f docker-compose.prod.yml ps
REMOTE

echo "▶ 4/4  Healthcheck …"
sleep 5
ssh "$VPS" 'curl -sf http://localhost:5317/health >/dev/null 2>&1 || docker exec pos1-cockpit node -e "fetch(\"http://localhost:5317/health\").then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"' \
  && echo "   ✓ Backend antwortet." \
  || { echo "   ✗ Healthcheck fehlgeschlagen — Logs: ssh $VPS 'docker logs pos1-cockpit --tail 50'"; exit 1; }

echo ""
echo "🟢 Deployment fertig: https://pos1.meosapp.de"
echo "   (SSL-Zertifikat kann beim ersten Aufruf 1–2 Minuten brauchen,"
echo "    DNS-A-Record 'pos1' → 31.97.122.6 muss gesetzt sein.)"
