#!/usr/bin/env bash
# Basic-Auth-Passwort für https://pos1.meosapp.de neu setzen.
# Ausführen von deinem Rechner:  bash pos1-cockpit/deploy/set-password.sh
set -euo pipefail
VPS="${VPS:-root@31.97.122.6}"

read -r -p "Neuer Benutzername [mario]: " USER_IN
USER_IN="${USER_IN:-mario}"
read -r -s -p "Neues Passwort: " PW_IN
echo
case "$PW_IN" in *"'"*) echo "Bitte ein Passwort ohne Hochkomma (') wählen."; exit 1;; esac
[ -n "$PW_IN" ] || { echo "Leeres Passwort — abgebrochen."; exit 1; }

ssh "$VPS" bash -s <<REMOTE
set -euo pipefail
cd /opt/pos1-cockpit
HASH="\$(openssl passwd -apr1 '$PW_IN')"
grep -v '^POS1_BASIC_AUTH=' .env > .env.tmp || true
echo "POS1_BASIC_AUTH=$USER_IN:\$HASH" >> .env.tmp
mv .env.tmp .env
chmod 600 .env
if docker compose version >/dev/null 2>&1; then DC="docker compose"; else DC="docker-compose"; fi
\$DC -f docker-compose.prod.yml up -d
echo "✓ Passwort aktualisiert."
REMOTE
