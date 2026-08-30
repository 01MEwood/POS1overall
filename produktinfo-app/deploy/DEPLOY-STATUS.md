# Deploy-Status: produktpass.meosapp.de

**Status: LIVE ✅**

- Bestätigt: 30.08.2026 — `install.sh`-Smoke-Test auf dem VPS meldet
  `LIVE: https://produktpass.meosapp.de antwortet mit 200 ✔`
- Deployte Version: inkl. Word-Export (.docx) und Betriebsprofil sichern/laden (Commit a1687a1)
- Infrastruktur: Hostinger-VPS 31.97.122.6 (n8n-Template) · Container `produktpass`
  (nginx:1.27-alpine, statisches dist/-Mount) · Reverse-Proxy: **Nginx Proxy Manager**
  (Netzwerk `meos-shared`), Proxy Host `produktpass.meosapp.de` → `produktpass:80`,
  Let's-Encrypt-Zertifikat, Force SSL
- Deploy-Weg: Bundle (`scripts/erzeuge-deploy-bundle.sh`) → Upload via litterbox.catbox.moe →
  Hostinger-Webkonsole: `curl -fL <link> -o /root/produktpass-deploy.tar.gz && cd /opt && tar xzf … && bash install.sh`
- Update-Weg: identisch — `install.sh` ist idempotent.

Hinweis: Die früheren Automatisierungsversuche aus Claude-Cloud-Sessions scheiterten
an deren Netzwerk-Egress-Policy (dokumentiert in der Git-Historie dieses Files);
der Webkonsolen-Weg umgeht das vollständig.
