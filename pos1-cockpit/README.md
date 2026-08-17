# POS1 Cockpit 🎯

**Website- & Marken-Benchmark für Schreinerhelden, Finverk und IHR-Möbel-Schreiner.**

Ein Cockpit, das deine Domains laufend analysiert, gegen Wettbewerber benchmarkt und den Weg zu
„Position 1" messbar macht — über fünf Säulen:

| Säule | Gewicht | Was gemessen wird |
|---|---|---|
| **SEO** | 30 % | OnPage-Checks (Title, Meta, H1, Alt-Texte, Sitemap …) + Google-Rankings der Keywords |
| **AEO** | 20 % | Antwortmaschinen-Optimierung: FAQPage/HowTo-Schema, Fragen-Überschriften, Preistransparenz |
| **GEO** | 20 % | KI-Sichtbarkeit: llms.txt, KI-Crawler-Freigaben, E-E-A-T-Signale, strukturierte Daten |
| **Performance** | 15 % | HTML-Gewicht, Skript-Anzahl, Antwortzeit, Komprimierung, Lazy Loading |
| **Social** | 15 % | Kanal-Setup je Marke, KPI-Pflege, Follower-Wachstum |

Alle Scores (0–100) werden historisiert — der Fortschritt Richtung Benchmark ist als Verlauf sichtbar.

## Features

- **Dashboard** — Overall-Score je Domain mit Verlauf, Wettbewerber-Ranking (cabinet.de, deinSchrank.de, schrankwerk.de vorkonfiguriert), Keyword-Lage, nächste Maßnahmen. Ein Klick („Komplett-Analyse") scannt alles.
- **Websites** — ~30 OnPage-Checks je Domain über vier Säulen, mit Ist-Wert und konkreter Empfehlung. Live-Scanner holt Startseite, robots.txt, llms.txt und sitemap.xml direkt (keine API-Kosten). Backlink-Snapshots via DataForSEO.
- **Keywords** — Ranking-Tracking (Google DE, Top 100) je Keyword und Domain, Suchvolumen/CPC/SERP-Features via DataForSEO, Positions-Verlauf als Chart. Vorbefüllt mit der Keyword-Landschaft aus dem Schreinerhelden-Audit.
- **Marken** — DPMA-Markenstatus (Schreinerhelden ®, Finverk ®), Positionierung pflegen, Brand-Suchvolumen, Brand-Position und **SERP-Ownership** (wie viele Top-10-Treffer für den Markennamen du kontrollierst), Social-Reifegrad.
- **Social Media** — die effektivsten Kanäle je Marke mit Begründung und Priorität (Kernkanal/Ausbau/Optional), monatliche KPI-Erfassung (Follower, Posts, Reichweite, Engagement) mit Trend-Charts.
- **Roadmap** — priorisierte Maßnahmen (P0/P1/P2) aus den Audits vorbefüllt, mit Status-Workflow und Filtern.

## Modi

- **Demo-Modus** (Standard, ohne Credentials): deterministische Beispieldaten, überall mit „◌ Demo" gekennzeichnet. Für schreinerhelden.de bildet der Demo-Scan die realen Befunde des letzten manuellen Audits ab. So ist das Cockpit sofort bedienbar.
- **Live-Modus**: `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD` in `.env` setzen → SERP-Rankings, Suchvolumen und Backlinks kommen live von DataForSEO (Kosten-Zähler in der Sidebar; ~0,002 $ pro SERP-Abfrage). Der Website-Scanner läuft immer live und kostenlos, sofern die Domains erreichbar sind.

## Setup (lokal)

Voraussetzung: Node.js ≥ 20.

```bash
cd pos1-cockpit

# Backend
cd backend && npm install && cd ..

# Frontend bauen (wird vom Backend mit ausgeliefert)
cd frontend && npm install && npm run build && cd ..

# Konfiguration (optional für Live-Modus)
cp .env.example .env   # DataForSEO-Zugangsdaten eintragen

# Starten
cd backend && npm start
# → http://localhost:5317
```

Entwicklung mit Hot-Reload: `npm run dev` im `backend/` **und** im `frontend/` (Vite-Devserver auf
Port 5173 proxyt `/api` zum Backend).

## Deployment auf dem Hostinger-VPS (empfohlen)

Ziel: **https://pos1.meosapp.de** — hinter Traefik mit automatischem SSL und Basic-Auth.

**Einmalig:** Im Hostinger-DNS-Panel für meosapp.de einen A-Record anlegen:
`pos1` → `31.97.122.6` (Propagation ~5–15 Min).

**Dann ein Befehl** von deinem Rechner (Git Bash/WSL, SSH-Zugang zum VPS vorausgesetzt),
ausgeführt im Repo-Verzeichnis:

```bash
bash pos1-cockpit/deploy/deploy.sh
```

Das Skript lädt den Quellcode auf den VPS, baut das Image dort, startet den Container
mit Traefik-Labels (`root_default`-Netz, certresolver `myresolver`, Port 5317) und prüft
den Healthcheck. Beim Erst-Deploy wird ein **Basic-Auth-Passwort generiert und einmalig
angezeigt** — notieren! (Ändern: `bash pos1-cockpit/deploy/set-password.sh`.)

DataForSEO-Live-Modus aktivieren:

```bash
ssh root@31.97.122.6
nano /opt/pos1-cockpit/.env        # DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD eintragen
cd /opt/pos1-cockpit && docker compose -f docker-compose.prod.yml up -d
```

Re-Deploy nach Code-Änderungen: einfach `deploy.sh` erneut ausführen — die `.env` und die
SQLite-Daten (Volume `pos1-data`) bleiben erhalten.

### Alternativ: generisches Docker-Setup (ohne Traefik)

```bash
cd pos1-cockpit
cp .env.example .env
docker compose up -d --build       # → http://<server>:5317, ungeschützt!
```

**Wichtig:** Die App hat keine eingebaute Authentifizierung — nur die Traefik-Variante
oben bringt Basic-Auth mit. Die generische Variante nie ungeschützt öffentlich machen.

## Bedienung — empfohlener Rhythmus

1. **Wöchentlich:** „Komplett-Analyse" im Dashboard (Scans + Rankings). Bewegungen und neue Befunde prüfen.
2. **Monatlich:** Social-KPIs je Kanal eintragen (Reiter Social Media), SERP-Ownership je Marke prüfen (Reiter Marken), Backlink-Snapshot je Domain ziehen.
3. **Laufend:** Roadmap abarbeiten — P0 zuerst. Erledigte Maßnahmen abhaken, neue Befunde aus den Website-Checks als Maßnahmen anlegen.

## Architektur

```
pos1-cockpit/
├── backend/               Node 22 + Express + better-sqlite3
│   └── src/
│       ├── index.js       App-Einstieg, statisches Frontend, Error-Handler
│       ├── config.js      Konfiguration (Env-Variablen)
│       ├── db.js          SQLite-Schema + Zugriff
│       ├── seed.js        Startdaten (Marken, Domains, Keywords, Maßnahmen aus den Audits)
│       ├── routes/        REST-API (domains, keywords, brands, social, actions, overview)
│       └── services/
│           ├── siteScanner.js   Live-OnPage-Scanner (SEO/AEO/GEO/Performance, ~30 Checks)
│           ├── dataforseo.js    DataForSEO-Client (SERP, Volumen, Backlinks) + Demo-Fallback
│           ├── demoData.js      Deterministische Demo-Daten
│           └── scoring.js       Säulen-Scores + Overall-Benchmark + Historie
└── frontend/              React 18 + Vite, eigene SVG-Charts, Dark-Cockpit-Design
    └── src/pages/         Dashboard, Websites, Keywords, Marken, Social, Roadmap
```

## Bekannte Grenzen

- Social-KPIs werden manuell gepflegt (die Plattform-APIs — Meta/TikTok/LinkedIn — brauchen eigene App-Reviews; bewusst ausgeklammert).
- Der Scanner prüft die Startseite als Repräsentant der Domain, keine Voll-Crawls (dafür ist DataForSEO OnPage oder ein Audit-Tool die Ergänzung).
- Ranking-Refresh verarbeitet max. 50 Keywords pro Aufruf (Kosten-/Rate-Limit-Schutz).
- Keine Nutzerverwaltung/Login — für den internen Einsatz hinter Reverse-Proxy gedacht.
