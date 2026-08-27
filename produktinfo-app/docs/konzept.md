# Konzept: Von der 60-Seiten-Vorlage zur 3-Schritte-App

## Analyse der Ausgangslage (Verbandsvorlage „Produktinformationen“, Stand 2019-10)

Die Vorlage ist fachlich stark: 60 Seiten geprüfte Textbausteine zu Möbeln, Böden, Treppen,
Türen, Haustüren, Fenstern, Wintergärten, Terrassen, 13 Holzarten, Holzwerkstoffen, Oberflächen,
Pflege sowie Heiz-/Lüftungshinweisen — inklusive Quellenverzeichnis. Ihre Schwächen sind
Werkzeug-Schwächen, keine Inhalts-Schwächen:

1. **Bedienung:** „Hier Ihren Betrieb eintragen (und diese Zeile löschen)“ ×  dutzende Kapitel
   manuell löschen — pro Auftrag 30–60 Minuten Word-Arbeit. Ergebnis oft: Es wird gar nicht gemacht.
2. **Relevanz:** Der Kunde eines Esstischs erhält (wenn überhaupt) Wintergarten- und Fensterkapitel.
3. **Rechtsstand 2019:** vor GPSR (Pflicht seit 13.12.2024!), vor BGB-Reform 2022, vor EUDR,
   neuer BauPVO und Formaldehyd-Grenzwerten. Der wichtigste fehlende Teil: der GPSR-Kennzeichnungsblock.
4. **Kein Nachweis:** Keine Übergabebestätigung — dabei ist das Dokument juristisch vor allem
   ein Instruktionsnachweis.
5. **Keine Versionierung:** Niemand sieht, wie alt die Inhalte sind.

## Herangehensweise nach Musk: Der 5-Schritte-Algorithmus

1. **Anforderungen hinterfragen** („Requirements sind Empfehlungen, außer sie sind Gesetz“):
   Was MUSS rechtlich rein (GPSR-Angaben, Warnhinweise, Anleitungen — siehe
   docs/rechtsgrundlagen.md), was ist optional (LED-Physik, Spanplatten-Energieverbrauch)?
   Ergebnis: harte Pflichtbausteine je Produkttyp, alles andere abwählbar.
2. **Teile löschen** („The best part is no part“): Kein Server, kein Login, keine Datenbank,
   kein Cloud-Abo, kein Fax-Feld, keine „diese Zeile löschen“-Anleitungen, kein CE auf Möbeln.
   Der GPSR-Block wird nicht als Baustein gepflegt, sondern automatisch aus dem Profil erzeugt.
3. **Vereinfachen:** 60 Seiten → Produkttyp-Kachel → kuratierte ~15–20 Bausteine → typ. 8–10 Seiten
   PDF. Drei Schritte, ein Klick pro Entscheidung.
4. **Beschleunigen:** Betriebsprofil einmal, dann < 2 Minuten pro Auftrag statt 30–60 Minuten.
   PDF-Erzeugung im Browser, Dateiname automatisch.
5. **Automatisieren:** Vorauswahl je Produkttyp, Pflichtangaben-Check (verhindert rechtlich
   unvollständige PDFs), Aktualitätswarnung nach 12 Monaten, Beispiel-PDF-Rendering als Test.

## Herangehensweise nach Bezos

- **Working backwards / Press Release zuerst:** „Schreiner übergibt in 2 Minuten eine persönliche,
  rechtssichere Produktmappe mit Logo — der Kunde bekommt nur, was sein Produkt betrifft.“
  Alles, was diesem Satz nicht dient, flog raus.
- **Customer obsession — zwei Kunden:** Der Schreiner (will Tempo + Rechtssicherheit) und der
  Endkunde (will Lesbarkeit + Relevanz). Deshalb: kuratierte Texte in Sie-Form, Warnboxen,
  persönliche Anmerkung auf dem Deckblatt, Reparatur-/Service-Kapitel als Kundenbindung.
- **1-Click:** Die Produkttyp-Kachel ist der eine Klick, der 90 % der Arbeit erledigt.
- **Two-pizza scope:** Eine SPA, ein Ordner `content/` als einzige Quelle der Wahrheit — von einer
  Person wartbar.
- **Day 1:** Versionierte Inhalte + dokumentierter Update-Prozess + Termine bis 2030
  (docs/inhalte-aktuell-halten.md) statt „einmal gebaut, nie gepflegt“.
- **Disagree & commit bei Regulierung:** DPP/ESPR kommt erst ~2029 — wir bauen ihn nicht,
  aber die Datenstruktur ist so angelegt, dass er ein Export-Feature wird (Name: „ProduktPass“).

## Architektur-Entscheidungen (und warum)

| Entscheidung | Warum |
|---|---|
| 100 % clientseitig (React + Vite, localStorage) | DSGVO trivial (Daten verlassen das Gerät nicht), keine Betriebskosten, offlinefähig, überall hostbar |
| Inhalte als typisierte TS-Datendateien | Eine Quelle der Wahrheit, diffbar in Git, ohne Programmierkenntnisse pflegbar |
| PDF im Browser (@react-pdf/renderer, lazy geladen) | Echtes PDF mit Logo/Seitenzahlen; App-Start bleibt schnell (284 kB) |
| Pflichtbausteine nicht abwählbar | GPSR-/Instruktionspflicht kann nicht versehentlich verletzt werden |
| Übergabebestätigung mit Unterschrift | Das Dokument ist juristisch primär ein Beweisstück |
| `CONTENT_STAND` + 12-Monats-Warnung | „Aktuell halten“ ist ein Prozess, kein Zufall |
