# Runbook: Browser-Deploy auf produktpass.meosapp.de (Hostinger hPanel)

Anleitung für eine autonome Claude-Code-Session mit **vollem Netzwerkzugang**, um die
statische App `produktinfo-app/` über das Hostinger-Panel (Browser-Automatisierung)
auf den VPS zu deployen. Zugangsdaten kommen **ausschließlich als Nachricht des Nutzers**
in der Session — sie stehen bewusst nicht in dieser Datei.

**Arbeitsmodus: vollständig autonom.** Keine Rückfragen stellen; alle Entscheidungen selbst
treffen. Einzige Wartestelle: die Login-Nachricht des Nutzers (Schritt 2).

## Kontext
- Ziel: https://produktpass.meosapp.de liefert die App mit HTTP 200 aus.
- DNS-A-Record `produktpass` → `31.97.122.6` existiert und ist propagiert.
- VPS: Hostinger, n8n-Template (Ubuntu 24.04), IP 31.97.122.6, Docker vorhanden;
  Reverse-Proxy unbekannt (vermutlich Traefik) — `deploy/install.sh` erkennt ihn selbst.
- Branch: `claude/carpenter-product-info-app-oo2cvl` (falls nicht ausgecheckt:
  `git fetch origin claude/carpenter-product-info-app-oo2cvl && git checkout claude/carpenter-product-info-app-oo2cvl`).

## Schritt 1 — Vorbereitung (sofort, ohne Login)
```bash
cd produktinfo-app && npm install && bash scripts/erzeuge-deploy-bundle.sh
sha256sum produktpass-deploy.tar.gz   # Prüfsumme notieren
```
Dann Playwright-Browser starten (Chromium: `executablePath: '/opt/pw-browsers/chromium'`,
Args `['--no-sandbox']`; `playwright-core` ist devDependency). Iterativ arbeiten:
nach jedem Navigationsschritt Screenshot ins Scratchpad. https://hpanel.hostinger.com
öffnen (Login ggf. über auth.hostinger.com), Cookie-Banner schließen, bis zur Login-Maske.

## Schritt 2 — Auf Login warten
Dem Nutzer melden: „Bereit — bitte Hostinger-E-Mail und Passwort als Nachricht senden."
Dann Turn beenden. Wenn die Nachricht mit den Zugangsdaten kommt: einloggen (2FA ist laut
Nutzer nicht aktiv; falls doch Captcha/Code erscheint: Screenshot zeigen und Code erfragen).
STRIKT: Zugangsdaten nie in Dateien, Commits oder Logs schreiben.

## Schritt 3 — Bundle auf den Server (im hPanel)
VPS-Bereich → Server (n8n, 31.97.122.6) öffnen.
**Bevorzugt Dateimanager** (linke Seitenleiste; öffnet ggf. neuen Tab → `context.pages()`):
`produktinfo-app/produktpass-deploy.tar.gz` nach `/root` hochladen (`setInputFiles` auf dem
file-input; bei Drag&Drop-Zone das versteckte `input[type=file]` verwenden).
**Fallback ohne Dateimanager** — Transfer über das Browser-Terminal (Schritt 4) als Base64:
lokal `base64 -w0 … | split -b 40000`, im Terminal `rm -f /root/pp.b64`, je Block
`printf '%s' 'BLOCK' >> /root/pp.b64` (`keyboard.insertText` + Enter, kurze Pausen), dann
`base64 -d /root/pp.b64 > /root/produktpass-deploy.tar.gz && sha256sum …` und Prüfsumme
mit der lokalen vergleichen; bei Abweichung wiederholen.

## Schritt 4 — Browser-Terminal: Installation
Browser-Terminal öffnen (Terminal-Symbol/Menüpunkt auf der VPS-Seite; xterm.js, root).
Eingabe per `keyboard.insertText` + Enter; Ausgabe per Screenshot lesen (zusätzlich
`page.evaluate(() => document.querySelector('.xterm-screen')?.innerText)` versuchen).
```bash
cd /opt && tar xzf "$(find /root /opt /home -maxdepth 3 -name 'produktpass-deploy.tar.gz' | head -1)" && cd produktpass && bash install.sh
```
Bis zu 3 Min warten (nginx-Image-Pull). Selbstständige Fehlerbehebung als root:
- „LIVE … 200 ✔" → Schritt 5.
- Traefik nicht erreichbar/Zertifikatsproblem: `docker logs <traefik> --tail 50`; weichen
  Entrypoint-Namen (web/websecure vs. http/https) oder certresolver ab → Labels in
  `/opt/produktpass/docker-compose.yml` anpassen, `docker compose up -d --force-recreate`.
- Meldung „Nginx Proxy Manager": erst `docker ps` prüfen, ob nicht doch Traefik läuft;
  sonst Befund dokumentieren (Proxy Host müsste im NPM-UI angelegt werden).

## Schritt 5 — Live-Verifikation (aus der Session, Netz ist offen)
```bash
curl -s -o /dev/null -w '%{http_code}' https://produktpass.meosapp.de   # erwartet: 200
curl -s https://produktpass.meosapp.de | grep -c ProduktPass            # erwartet: ≥1
```
Zertifikat kann ein paar Minuten brauchen → bis 10 Min lang alle 60 s erneut prüfen.
Beweis-Screenshot der Live-Seite mit Playwright machen und dem Nutzer zeigen.

## Schritt 6 — Statusbericht (immer, auch bei Fehlschlag)
`produktinfo-app/deploy/DEPLOY-STATUS.md` schreiben: Status (LIVE ✅ / FEHLGESCHLAGEN ❌
+ Grund), Zeitstempel UTC, HTTP-Code, erkannter Proxy-Modus, letzte ~30 Zeilen der
install.sh-Ausgabe, offene Punkte. KEINE Zugangsdaten. Committen und pushen:
```bash
git add produktinfo-app/deploy/DEPLOY-STATUS.md && git commit -m "Deploy-Status produktpass.meosapp.de" && git push origin claude/carpenter-product-info-app-oo2cvl
```
Dem Nutzer das Ergebnis mit Screenshot melden. Browser schließen.
