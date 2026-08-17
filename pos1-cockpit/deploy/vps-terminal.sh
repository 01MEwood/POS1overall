#!/usr/bin/env bash
# ============================================================================
# POS1 Cockpit — Deployment direkt im Hostinger BROWSER-TERMINAL (Root-Shell).
#
# Kompletter Einzeiler zum Einfügen ins Browser-Terminal:
#
#   rm -rf /opt/pos1-src && git clone --depth 1 \
#     -b claude/website-brand-analysis-app-v1tyf5 \
#     https://github.com/01MEwood/POS1overall.git /opt/pos1-src \
#     && bash /opt/pos1-src/pos1-cockpit/deploy/vps-terminal.sh
#
# Beim Erst-Deploy wird ein Basic-Auth-Passwort generiert und EINMALIG
# angezeigt. Re-Deploy nach Updates: denselben Einzeiler erneut ausführen —
# .env und die SQLite-Daten (Volume pos1-data) bleiben erhalten.
# ============================================================================
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # …/pos1-cockpit im Klon
APP=/opt/pos1-cockpit

command -v docker >/dev/null || { echo "✗ Docker ist auf dem VPS nicht installiert."; exit 1; }
if docker compose version >/dev/null 2>&1; then DC="docker compose"; else DC="docker-compose"; fi

echo "▶ 1/3  Code nach $APP übernehmen …"
if [ "$SRC" != "$APP" ]; then
  mkdir -p /opt
  tar cf - -C "$SRC/.." \
    --exclude='pos1-cockpit/backend/node_modules' \
    --exclude='pos1-cockpit/frontend/node_modules' \
    --exclude='pos1-cockpit/frontend/dist' \
    --exclude='pos1-cockpit/backend/data' \
    --exclude='pos1-cockpit/.env' \
    pos1-cockpit | tar xf - -C /opt
fi
cd "$APP"

# .env nur beim Erst-Deploy anlegen — bestehende Konfiguration bleibt erhalten
if [ ! -f .env ]; then
  PW="$(openssl rand -base64 18 | tr -dc 'a-zA-Z0-9' | cut -c1-16)"
  HASH="$(openssl passwd -apr1 "$PW")"
  printf 'POS1_BASIC_AUTH=mario:%s\nDATAFORSEO_LOGIN=\nDATAFORSEO_PASSWORD=\n' "$HASH" > .env
  chmod 600 .env
  echo ""
  echo "  ┌──────────────────────────────────────────────┐"
  echo "  │  LOGIN für https://pos1.meosapp.de           │"
  echo "  │    Benutzer: mario                           │"
  echo "  │    Passwort: $PW            │"
  echo "  │  JETZT NOTIEREN — nur der Hash wird          │"
  echo "  │  gespeichert!                                │"
  echo "  └──────────────────────────────────────────────┘"
  echo ""
fi

echo "▶ 2/3  Docker-Image bauen und starten (dauert beim ersten Mal einige Minuten) …"
$DC -f docker-compose.prod.yml up -d --build
$DC -f docker-compose.prod.yml ps

echo "▶ 3/3  Healthcheck …"
sleep 6
if docker exec pos1-cockpit node -e "fetch('http://localhost:5317/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then
  echo ""
  echo "🟢 POS1 Cockpit läuft: https://pos1.meosapp.de"
  echo "   Voraussetzung: DNS-A-Record 'pos1' → 31.97.122.6 ist gesetzt."
  echo "   (SSL-Zertifikat kann beim ersten Aufruf 1–2 Minuten brauchen.)"
  echo ""
  echo "   DataForSEO-Live-Modus aktivieren:"
  echo "     nano $APP/.env   → Login/Passwort eintragen, dann:"
  echo "     cd $APP && $DC -f docker-compose.prod.yml up -d"
else
  echo "✗ Healthcheck fehlgeschlagen — letzte Logs:"
  docker logs pos1-cockpit --tail 40
  exit 1
fi
