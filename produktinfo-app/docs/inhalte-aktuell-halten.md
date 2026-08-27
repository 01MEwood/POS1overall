# Inhalte aktuell halten

Die Inhaltsbibliothek (`src/content/`) ist versioniert über `CONTENT_STAND` in
`src/content/meta.ts` (Format `JJJJ-MM`). Der Stand wird in jeder PDF-Fußzeile gedruckt;
die App warnt sichtbar, sobald er älter als 12 Monate ist.

## Der Update-Prozess (30–60 Minuten pro Jahr)

1. **Prüfen** (jährlich, ideal jeden Januar + bei den Terminen unten):
   - Landesverband/TSD: Gibt es eine neue Auflage der „Produktinformationen“ oder neue Merkblätter?
     (tischler-schreiner.de, schreiner.de, schreiner-bw.de — Mitgliederbereich)
   - EU-/Bundesrecht: Termine-Tabelle unten abarbeiten.
2. **Ändern:** Betroffene Bausteine in `src/content/*.ts` anpassen (`titel`, `absaetze`,
   `rechtsbezug`); beim Baustein `stand` hochziehen.
3. **Versionieren:** `CONTENT_STAND` in `src/content/meta.ts` auf den aktuellen Monat setzen.
4. **Testen & ausliefern:** `npm run beispiel` → PDF kurz ansehen → `npm run build` → hochladen.

Größere Rechtsänderungen zuerst in `docs/rechtsgrundlagen.md` nachführen, dann in die Bausteine.

## Termine / Update-Trigger bis 2030

| Termin | Ereignis | Was tun |
|---|---|---|
| laufend | EUDR-Review der Kommission (Frist 04/2026, Ergebnis offen) | TSD-EUDR-Seite beobachten |
| **09.12.2026** | Neues **ProdHaftG** soll in Kraft treten (Verfahren lief zuletzt) | Baustein Gewährleistung/Instruktion prüfen; Archivierungshinweise |
| **30.12.2026** | EUDR-Start große/mittlere Unternehmen | Lieferanten fordern ggf. Doku; DDS-Referenzen im Wareneingang ablegen |
| **08.01.2027** | Neue BauPVO: Sanktionsvorschriften | CE/DoP-Prozess Fenster/Haustüren prüfen |
| **30.06.2027** | EUDR-Start Klein-/Kleinstunternehmen | Nur bei Eigenimport relevant (vereinfachte DDS) |
| 2027–2028 | Delegierte Rechtsakte **Digitaler Produktpass Bau** (u. a. Fenster) | DoP→DPP-Datenfelder ergänzen |
| **2028** | ESPR: erwarteter delegierter Rechtsakt **Möbel** | Ökodesign-/DPP-Anforderungen einarbeiten |
| 2028/2029 | Revidierte EN 14351-1 harmonisiert | Fenster-Bausteine + Erklärungen aktualisieren |
| 2029/2030 | **DPP-Pflicht Möbel** voraussichtlich anwendbar | DPP-Export aus der App bauen |
| 27.06.2030 | Ende BFSG-Übergangsfrist Bestandsdienste | Nur falls Webshop/Online-Buchung existiert |
| jährlich | GPSR-Leitlinien der EU-Kommission (Stand 19.11.2025) auf Updates prüfen | Sicherheitsbausteine abgleichen |

## Grundsätze bei Textänderungen

- **Kundensprache:** Sie-Form, aktiv, kurze Sätze; Warnhinweise beginnen mit dem Risiko.
- **Nichts versprechen, was nicht vereinbart ist** — Beschaffenheitsvereinbarungen gehören ins
  Angebot, nicht in die Produktinformation (§ 476 BGB).
- **Pflichtbausteine** (`pflichtFuer`) nur erweitern, nie stillschweigend entfernen — sie tragen
  die GPSR-/Instruktionspflicht.
- Quellen im Feld `rechtsbezug` dokumentieren (wird nicht gedruckt, hilft beim nächsten Update).
