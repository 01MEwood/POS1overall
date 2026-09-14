# Deploy-Status: produktpass.meosapp.de

**Status: LIVE ✅** (v2 seit 30.08.2026 · v3 „DPP-ready“ bereit zum Einspielen, 14.09.2026)

- Bestätigt: 30.08.2026 — `install.sh`-Smoke-Test auf dem VPS meldet
  `LIVE: https://produktpass.meosapp.de antwortet mit 200 ✔`
- v3 (dieser Commit): QR-Code mit maschinenlesbarer Produktidentifikation auf PDF/Word-Deckblatt,
  DPP-Kennung je Auftrag, Export „DPP-Datensatz (.json)“ nach ESPR/CPR-Inhaltskategorien
  (siehe `docs/dpp.md`)
- Infrastruktur: Hostinger-VPS 31.97.122.6 (n8n-Template) · Container `produktpass`
  (nginx:1.27-alpine, statisches dist/-Mount) · Reverse-Proxy: **Nginx Proxy Manager**
  (Netzwerk `meos-shared`), Proxy Host `produktpass.meosapp.de` → `produktpass:80`,
  Let's-Encrypt-Zertifikat, Force SSL

## Update einspielen (ein Befehl)

Das Bundle `deploy/produktpass-deploy.tar.gz` liegt im Repo (public). In der
Hostinger-Webkonsole (VPS → Webkonsole, als root):

```bash
curl -fsSL https://raw.githubusercontent.com/01MEwood/POS1overall/claude/carpenter-product-info-app-oo2cvl/produktinfo-app/deploy/produktpass-deploy.tar.gz -o /tmp/pp.tar.gz && rm -rf /opt/produktpass/dist && tar -xzf /tmp/pp.tar.gz -C /opt && bash /opt/produktpass/install.sh
```

Erwartete letzte Zeile: `LIVE: https://produktpass.meosapp.de antwortet mit 200 ✔`.
`install.sh` ist idempotent (Proxy-Erkennung, Compose, Smoke-Test) — derselbe Befehl gilt für
jedes künftige Update; nur das Bundle im Repo ändert sich.

Hinweis: Frühere Automatisierungsversuche aus Claude-Cloud-Sessions scheiterten an deren
Netzwerk-Egress-Policy; der Webkonsolen-Weg umgeht das vollständig. Der frühere Umweg über
litterbox.catbox.moe entfällt, seit das Bundle direkt aus GitHub geladen wird.
