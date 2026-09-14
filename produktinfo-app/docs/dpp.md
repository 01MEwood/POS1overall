# Digitaler Produktpass (DPP) in ProduktPass — Stand 09/2026

ProduktPass erzeugt seit v3 zu jedem Auftrag neben PDF und Word einen **DPP-ready-Datensatz**:

| Ausgabe | Inhalt |
|---|---|
| **QR-Code auf dem PDF-/Word-Deckblatt** | Produktidentifikation maschinenlesbar (JSON): DPP-Kennung, Hersteller, Ort, E-Mail, Produkt, Typ, Auftrags-Nr., DoP-Nr., Übergabedatum, Materialien, Inhaltsstand |
| **DPP-Kennung** (UUID) | Global eindeutig je Auftrag, steht im PDF (GPSR-Block), im QR-Code und im Datensatz |
| **`DPP-Datensatz_….json`** | Vollständiger Datensatz nach den DPP-Inhaltskategorien (siehe unten), inkl. aller gewählten Texte |

Es gibt **keinen Server**: Der Datensatz wird im Browser erzeugt und zum Auftrag archiviert.
Das entspricht der DPP-Architektur — die Produktdaten liegen **dezentral beim Hersteller**
(oder seinem DPP-Dienstleister), die EU-Registry speichert nur die Kennungen.

## Struktur des Datensatzes (`src/dpp/datensatz.ts`)

Orientiert an ESPR (EU) 2024/1781 Art. 7–13 / Anhang III und CPR (EU) 2024/3110 Art. 75 ff.
(Inhaltslisten wie im TSD-Vortrag „TOP 4 – DPP“, GF-Tagung 24.02.2026, Folien 8 + 9):

```
schema, schemaVersion, hinweis, erstellt, inhaltsstand
produktidentifikation   dppId, produktbezeichnung, produkttyp, auftragsnummer, herstellungsart, uebergabedatum, bauvorhaben
hersteller              name, inhaber, anschrift{strasse, plzOrt, land}, telefon, email, website, registerangaben
materialzusammensetzung [ {titel, inhalt} ]   ← Bausteine „Verwendete Materialien“ + „Oberflächenbehandlung“
gebrauchsanweisungUndPflege [ … ]            ← Bausteine „Allgemein“, „Gebrauch“, „Pflege“
sicherheitsinformationen [ … ]               ← Bausteine „Sicherheit“ (GPSR-Pflicht)
reparaturKreislaufEntsorgung [ … ]           ← Bausteine „Service, Rücknahme, Unterlagen“
konformitaet            produktsicherheit (GPSR), leistungserklaerungDoP (CPR), hinweis
nachhaltigkeit          langlebigkeit, reparierbarkeit, umweltkennzahlen (null), hinweisUmweltkennzahlen
dokument                formate, erzeugtMit
```

Bewusst **ohne Kundendaten** — ein DPP ist produktbezogen, und der Datensatz soll später
weitergegeben werden können (DSGVO).

## Was der DPP heute (noch) nicht ist

- **Kein offizieller DPP.** Die produktspezifischen delegierten Rechtsakte fehlen noch
  (Möbel: ESPR-Arbeitsplan 2028, +18 Monate Übergang → Pflicht ~2029/2030; Fenster/Türen
  über CPR + revidierte EN 14351-1 ~2029/2030). Erst diese Rechtsakte legen Datenfelder,
  Granularität (Artikel/Charge/Modell) und Datenträger verbindlich fest.
- **Keine Umweltkennzahlen** (CO₂, EPD, 19 Kennzahlen CPR Anhang II): für handwerkliche
  Einzelanfertigungen gibt es noch keine praktikable Methodik; laut TSD-Umfrage (942 Betriebe,
  01/2026) erfassen das 0,8 % der Betriebe. Das Feld ist im Schema vorgesehen (`null`).
- **Keine strukturierte Stückliste**: Material wird über Bausteine (Holzart, Platte, Oberfläche)
  erfasst, nicht als Mengen/Anteile je Bauteil. Erweiterbar, sobald der Rechtsakt das verlangt.
- **Keine Registry-Anbindung** (siehe unten) — der Datensatz ist die vorbereitete Nutzlast dafür.

## EU-DPP-Registry — Stand September 2026

- **Live seit 20.07.2026** auf Basis der Durchführungsverordnung (EU) 2026/1778 vom 16.07.2026
  (ABl. 17.07.2026, in Kraft 06.08.2026). Sie ist ein **Index**: eindeutige Kennungen, Fundort
  des Passes, Warencode/Zollanbindung, Verifizierung der Wirtschaftsakteure (eIDAS, max. 3 Jahre),
  Registrierung per Web-UI oder API (Art. 8). **Passinhalte werden nicht zentral gespeichert.**
- Es gibt **keinen EU-Server, auf den Produktdaten „hochgeladen“ werden**. Der Hersteller (oder sein
  Dienstleister) hostet die Daten; der Datenträger (QR/GS1 Digital Link) verweist dorthin.
- Harmonisierte Normen: EN 18216, EN 18219–18223 (Beschluss (EU) 2026/1736, 15.07.2026);
  weitere aus CEN/CENELEC JTC 24 in Arbeit.
- Zeitplan: Batterien 18.02.2027 (eigene VO), Stahl/Eisen 2026, Textilien/Reifen 2027,
  **Möbel 2028**, Matratzen 2029 (je delegierter Rechtsakt, dann +18 Monate).

Quellen: [DVO (EU) 2026/1778, EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ%3AL_202601778) ·
[Kommission: Registry live (20.07.2026)](https://single-market-economy.ec.europa.eu/news/digital-product-passport-registry-now-live-2026-07-20_en) ·
[ESPR-Arbeitsplan 2025–2030](https://green-forum.ec.europa.eu/news/2025-2030-working-plan-2025-07-11_en) ·
[ESPR (EU) 2024/1781](https://eur-lex.europa.eu/eli/reg/2024/1781/oj?locale=de)

## Rolle „DPP-Dienstleister“ (für Schreiner-Betriebe)

Die ESPR sieht ausdrücklich vor, dass ein Hersteller Erstellung, Speicherung und Bereitstellung
des DPP an einen **unabhängigen, autorisierten Dritten** delegiert (Art. 2 Nr. 32 „Dienstleister
für den digitalen Produktpass“; Art. 10 Abs. 4 Backup-Kopie über einen Dienstleister). Die
Kommission ist ermächtigt, Anforderungen **inkl. Zertifizierungssystem** per delegiertem Rechtsakt
festzulegen (Art. 10 i. V. m. Art. 72) — Konsultation 04/2025, Rechtsakt angekündigt, Stand
09/2026 **noch nicht erlassen**. Die DVO 2026/1778 regelt die Verifizierung bislang nur für
Wirtschaftsakteure.

Daraus folgt für ProduktPass:

1. **Heute** kann sich niemand offiziell als DPP-Dienstleister registrieren oder zertifizieren
   lassen — es gibt das Verfahren noch nicht. Erwartbar ab ~2027 mit dem delegierten Rechtsakt.
2. Die **Rolle selbst ist gesetzlich vorgesehen** und passt exakt zu ProduktPass: strukturierte
   Daten je Auftrag, Hosting der Passdaten, Registrierung der Kennungen per API im Auftrag der
   Betriebe. Der Verband sucht genau das (TSD-Folie 19: „DPP-Lösung für Lizenzsysteme“ ist offen).
3. Die **rechtliche Verantwortung** für Richtigkeit und Verfügbarkeit bleibt beim Hersteller,
   der das Produkt in Verkehr bringt (Art. 9 Abs. 2 ESPR) — der Dienstleister handelt in dessen
   Auftrag (Vertrag, Vollmacht).
4. Vorbereitung bis dahin: Datensatz-Schema stabil halten, eIDAS-Verifizierung des eigenen
   Unternehmens vorbereiten, Registry-Testumgebung beobachten, Normen EN 18216 ff. einplanen.

## Ausbaustufen

1. **Hosting-Dienst** (Stufe 2): Datensatz auf einer eigenen Domain je DPP-Kennung bereitstellen
   (`https://…/dpp/<dppId>`), QR-Code auf diese URL zeigen lassen — dann ist ProduktPass ein
   DPP-Dienstleister im Sinne der ESPR (nach Zertifizierung).
2. **Registry-API** (Stufe 3): Kennungen im Auftrag der Betriebe registrieren, sobald der
   delegierte Rechtsakt Möbel/Bauprodukte gilt und das Dienstleister-Zertifikat vorliegt.
3. **Strukturierte Materialliste** und Umweltkennzahlen, wenn die Rechtsakte das verlangen.
