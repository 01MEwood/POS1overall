# ProduktPass — Produktinformationen für Schreiner-Kunden

**In 3 Schritten zum individuellen, rechtssicheren Übergabe-PDF** — die Neuauflage der
60-seitigen Verbandsvorlage „Produktinformationen“ (Tischler Schreiner Deutschland, Stand 2019)
als App.

Ein Schreinerbetrieb stellt pro Auftrag aus einer gepflegten Textbaustein-Bibliothek eine
individuelle Produktinformation zusammen (Gebrauchs-, Pflege- und Sicherheitshinweise) und
übergibt sie dem Kunden als PDF — mit eigenem Logo, Firmendaten und den seit 13.12.2024
verpflichtenden Angaben der EU-Produktsicherheitsverordnung (GPSR).

## Warum

| Alt (Word-Vorlage 2019) | Neu (ProduktPass) |
|---|---|
| 60 Seiten, alles manuell löschen/anpassen | Produkttyp wählen → passende Bausteine automatisch |
| „Hier Ihren Betrieb eintragen (und diese Zeile löschen)“ | Betriebsprofil + Logo einmal hinterlegen |
| Rechtsstand Okt. 2019 (vor GPSR, BGB-Reform, EUDR …) | Inhalte Stand 2026-08, GPSR-Pflichtblock automatisch |
| Kein Nachweis der Übergabe | Übergabebestätigung mit Unterschriftenfeldern |
| Aktualisierung: unklar | Versionierte Bibliothek + Aktualitätswarnung + Update-Prozess |

## Schnellstart

```bash
npm install
npm run dev        # Entwicklung: http://localhost:5173
npm run build      # Produktion → dist/ (statische Dateien, überall hostbar)
npm run beispiel   # Beispiel-PDFs nach beispiele/ rendern (dient auch als Smoke-Test)
npm test           # = npm run beispiel
node scripts/e2e.mjs http://localhost:5173  # Browser-E2E (benötigt laufenden Dev-Server + Chromium)
```

Keine Datenbank, kein Server, kein Konto: Alle Daten (Betriebsprofil, Logo, letzter Auftrag)
bleiben im `localStorage` des Browsers — DSGVO-freundlich und offlinefähig nach dem ersten Laden.

## Bedienung (3 Schritte)

1. **Produkt & Kunde** — Produkttyp-Kachel wählen (Möbel, Küche, Tür, Fenster, Boden …),
   Produktbezeichnung, Auftragsnummer (= GPSR-Produktidentifikation), Kundendaten, optional Foto.
2. **Bausteine** — die empfohlene Auswahl prüfen: Pflichtbausteine (🔒 Sicherheit/Recht) sind fest,
   alles andere zu-/abwählbar; jeder Text ist pro Auftrag editierbar
   (`- ` = Aufzählung, `! ` = Warnbox, Leerzeile = Absatz).
3. **PDF** — Pflichtangaben-Check (GPSR), dann „Individuelles PDF erzeugen“.
   Optional mit Übergabebestätigung (Unterschriftenfelder) als Instruktionsnachweis.

Das Betriebsprofil (⚙️ Betrieb) wird beim ersten Start abgefragt: Firmenname, Postanschrift und
E-Mail sind GPSR-Pflicht; Logo als PNG/JPG (wird clientseitig verkleinert).

## Aufbau

```
src/
├── content/            # ⭐ Die Inhaltsbibliothek (hier wird gepflegt!)
│   ├── meta.ts         #    CONTENT_STAND (Versionsdatum), Kategorien, Produkttypen
│   ├── gruppen.ts      #    Produkttyp-Gruppen für die Zuordnung
│   ├── basis.ts        #    Allgemeine Hinweise, Gewährleistung, Service
│   ├── sicherheit.ts   #    Sicherheits-/Warnhinweise (GPSR-Pflichtbausteine)
│   ├── produkte.ts     #    Gebrauchshinweise je Produkttyp
│   ├── materialien.ts  #    Holzarten, Platten, Stein, Glas …
│   ├── oberflaechen.ts #    Lack, Öl/Wachs, Lasur, Beize
│   ├── pflege.ts       #    Pflege- und Wartungshinweise
│   └── index.ts        #    Auswahl-Logik (pflicht/standard/relevant je Produkttyp)
├── pdf/ProduktinfoPdf.tsx  # PDF-Layout (@react-pdf/renderer)
├── components/         # Wizard-Schritte (Betrieb, Produkt, Bausteine, Export)
├── lib/                # Storage, Pflichtangaben-Prüfung, Bild-Handling, Text-Serialisierung
└── types.ts            # Datenmodell
scripts/
├── beispiel-pdf.ts     # Beispiel-PDFs + Smoke-Test (Node)
└── e2e.mjs             # Browser-E2E-Test (playwright-core + Chromium)
docs/
├── rechtsgrundlagen.md       # Rechtsrecherche Stand 08/2026 mit Quellen
├── inhalte-aktuell-halten.md # Update-Prozess + Termine bis 2030
└── konzept.md                # Analyse der Alt-Vorlage + Produktprinzipien
```

### Inhalte ändern / aktuell halten

1. Baustein-Text in `src/content/*.ts` ändern (reine Datenpflege, kein Programmierwissen nötig —
   jeder Baustein ist ein Objekt mit `titel` und `absaetze`).
2. `stand` des Bausteins und `CONTENT_STAND` in `src/content/meta.ts` hochziehen.
3. `npm run beispiel` (prüft, dass alles rendert) → `npm run build` → neu veröffentlichen.

Wann geprüft werden muss (GPSR-Leitlinien, neues ProdHaftG 12/2026, EUDR, neue BauPVO,
ESPR/Digitaler Produktpass für Möbel ~2029): siehe `docs/inhalte-aktuell-halten.md`.
Die App warnt automatisch, wenn `CONTENT_STAND` älter als 12 Monate ist.

## Deployment (produktpass.meosapp.de)

Einmalig: Im Hostinger-DNS-Panel für meosapp.de einen **A-Record `produktpass` → `31.97.122.6`** anlegen.

Dann Bundle bauen und einspielen:

```bash
# Auf dem eigenen Rechner (im Ordner produktinfo-app):
bash scripts/erzeuge-deploy-bundle.sh          # → produktpass-deploy.tar.gz
scp produktpass-deploy.tar.gz root@31.97.122.6:/opt/
ssh root@31.97.122.6 'cd /opt && tar xzf produktpass-deploy.tar.gz && cd produktpass && bash install.sh'
```

`deploy/install.sh` erkennt automatisch den laufenden Reverse-Proxy (**Traefik**,
**nginx-proxy**, **Nginx Proxy Manager** oder Host-/Container-nginx), erzeugt die passende
`docker-compose.yml` (nginx:alpine, statisch, kein Build auf dem Server), startet den
Container, testet und meldet den Live-Status. Erneut ausführen = Update.
Für lokale Vorschau ohne Server: `npm run preview`.

## Bekannte Grenzen (v1)

- Keine Auftrags-Historie in der App: Das erzeugte PDF selbst ist das Archiv —
  bitte je Auftrag ablegen (Aufbewahrung 10 Jahre empfohlen, siehe docs/rechtsgrundlagen.md).
- Ein Betriebsprofil pro Browser(-Profil); Bausteinbibliothek wird mit der App ausgeliefert
  (Änderungen erfordern neues Deployment — bewusst so: eine Quelle der Wahrheit).
- PDF ist nicht PDF/UA-getaggt (Barrierefreiheit ist für dieses Dokument keine Pflicht, s. docs).
- Fotos/Logos werden verkleinert (Logo max. 600 px, Foto max. 1200 px Kante), um PDF und
  localStorage klein zu halten.

## Mögliche Ausbaustufen

- Auftragsliste mit lokaler Historie (IndexedDB) und Duplizieren früherer PDFs
- Digitaler-Produktpass-Export (ESPR, für Möbel ~2029 erwartet) aus den bereits strukturierten Daten
- Mehrere Sprachen (GPSR verlangt die Sprache des Ziellandes)
- Verbands-Contentfeed: Bibliothek als JSON von zentraler Stelle laden
