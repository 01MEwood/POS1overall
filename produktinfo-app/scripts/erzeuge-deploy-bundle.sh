#!/usr/bin/env bash
# Baut die App und packt das VPS-Deploy-Bundle:
#   deploy/produktpass-deploy.tar.gz  (dist/ + install.sh + nginx.conf)
#
# Verwendung:  bash scripts/erzeuge-deploy-bundle.sh
# Das Bundle wird mit committet; der Server zieht es per raw.githubusercontent.com
# (Repo ist public) — siehe README „Deployment“.
set -euo pipefail
cd "$(dirname "$0")/.."
BUNDLE="deploy/produktpass-deploy.tar.gz"
RAW_URL="https://raw.githubusercontent.com/01MEwood/POS1overall/claude/carpenter-product-info-app-oo2cvl/produktinfo-app/${BUNDLE}"

echo "▸ Baue Produktions-Build …"
npm run build >/dev/null

echo "▸ Packe Bundle …"
STAGE=$(mktemp -d)
mkdir -p "${STAGE}/produktpass"
cp -r dist "${STAGE}/produktpass/"
cp deploy/install.sh deploy/nginx.conf "${STAGE}/produktpass/"
chmod +x "${STAGE}/produktpass/install.sh"
tar -czf "$BUNDLE" -C "$STAGE" produktpass
rm -rf "$STAGE"

echo "✔ $(du -h "$BUNDLE" | cut -f1) — ${BUNDLE}"
echo
echo "Jetzt committen + pushen, dann in der Hostinger-Webkonsole (ein Befehl):"
echo "  curl -fsSL ${RAW_URL} -o /tmp/pp.tar.gz && rm -rf /opt/produktpass/dist && tar -xzf /tmp/pp.tar.gz -C /opt && bash /opt/produktpass/install.sh"
