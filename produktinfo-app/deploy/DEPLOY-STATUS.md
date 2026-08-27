# Deploy-Status: produktpass.meosapp.de

**Status: FEHLGESCHLAGEN ❌ — Deployment aus dieser Session nicht möglich (Egress-Policy blockiert alle Ziel-Hosts).**

- Zeitstempel: 2026-08-27T13:58 UTC
- Session-Typ: Claude Code Remote (Sandbox mit Policy-Egress-Proxy)

## Was erledigt wurde (Schritt 1 — Vorbereitung)

- `npm install` erfolgreich, 0 Vulnerabilities.
- Produktions-Build + Deploy-Bundle gebaut: `produktinfo-app/produktpass-deploy.tar.gz` (532 KB).
- SHA256: `6eec63600923465329f2d1a5f2019d15bc0d9743e93deac1ee928dd4df0c5316`
- Playwright/Chromium-Setup funktionierte (Browser gestartet, Driver lief).

## Warum das Deployment scheiterte

Die Runbook-Annahme „Umgebung hat vollen Netzwerkzugang" trifft auf diese Session
**nicht** zu. Aller ausgehender HTTPS-Verkehr läuft über einen Policy-Egress-Proxy,
und dieser beantwortet CONNECT-Anfragen an sämtliche benötigten Hosts mit **403
(policy denial)**:

| Host | Ergebnis |
|---|---|
| hpanel.hostinger.com:443 | 403 CONNECT rejected |
| auth.hostinger.com:443 | 403 CONNECT rejected |
| www.hostinger.com:443 | 403 CONNECT rejected |
| produktpass.meosapp.de:443 | 403 CONNECT rejected |
| meosapp.de:443 | 403 CONNECT rejected |

Damit sind weder das Hostinger-Panel (Login/Dateimanager/Browser-Terminal) noch der
Live-Check der Zieldomain erreichbar. Ein Umgehen von Policy-Sperren ist in dieser
Umgebung ausdrücklich untersagt; es wurden keine Umgehungsversuche unternommen.
**Es wurden keine Zugangsdaten angefragt oder verwendet.**

- HTTP-Code Live-Check: nicht durchführbar (000, CONNECT 403)
- Erkannter Proxy-Modus auf dem VPS: unbekannt (Server nicht erreichbar)
- install.sh: nicht ausgeführt

## Offene Punkte / nächste Schritte

1. **Option A (empfohlen):** Deployment von einem Rechner mit SSH-Zugang ausführen:
   ```bash
   scp produktinfo-app/produktpass-deploy.tar.gz root@31.97.122.6:/opt/
   ssh root@31.97.122.6 'cd /opt && tar xzf produktpass-deploy.tar.gz && cd produktpass && bash install.sh'
   ```
2. **Option B:** Neue Claude-Code-Session in einer Umgebung, deren Netzwerk-Policy
   `hpanel.hostinger.com`, `auth.hostinger.com` und `*.meosapp.de` zulässt
   (Umgebungs-Einstellung „Netzwerkzugang" auf claude.ai/code prüfen), dann dieses
   Runbook erneut ausführen — Schritt 1 ist bereits verifiziert.
3. Das Bundle ist deterministisch reproduzierbar über
   `bash scripts/erzeuge-deploy-bundle.sh` (Prüfsumme oben zum Abgleich).
