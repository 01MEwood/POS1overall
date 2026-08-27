#!/usr/bin/env bash
# Baut die App und packt das VPS-Deploy-Bundle:
#   produktpass-deploy.tar.gz  (dist/ + install.sh + nginx.conf)
#
# Verwendung:  bash scripts/erzeuge-deploy-bundle.sh
# Danach auf den VPS bringen und dort entpacken — siehe README „Deployment“.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▸ Baue Produktions-Build …"
npm run build >/dev/null

echo "▸ Packe Bundle …"
STAGE=$(mktemp -d)
mkdir -p "${STAGE}/produktpass"
cp -r dist "${STAGE}/produktpass/"
cp deploy/install.sh deploy/nginx.conf "${STAGE}/produktpass/"
chmod +x "${STAGE}/produktpass/install.sh"
tar -czf produktpass-deploy.tar.gz -C "$STAGE" produktpass
rm -rf "$STAGE"

echo "✔ $(du -h produktpass-deploy.tar.gz | cut -f1) — produktpass-deploy.tar.gz"
echo
echo "Deploy (vom eigenen Rechner aus):"
echo "  scp produktpass-deploy.tar.gz root@31.97.122.6:/opt/"
echo "  ssh root@31.97.122.6 'cd /opt && tar xzf produktpass-deploy.tar.gz && cd produktpass && bash install.sh'"
