# Teil 2: Analyse der Dachschrägenschrank-Landingpages

## 2.1 URL-Status Übersicht

| URL | Status | Kommentar |
|-----|--------|-----------|
| `/dachschraegenschrank` | 200 ✅ | Hauptseite, dünn |
| `/dachschraegenschrank-stuttgart` | 200 ✅ | Gute Stadt-LP |
| `/dachschraegenschraenke` (Plural) | 404 ❌ | Redirect fehlt! |
| `/dachschraegenschrank-ludwigsburg` | 404 ❌ | Seite fehlt |
| `/dachschraegenschrank-backnang` | 404 ❌ | Seite fehlt |
| `/dachschraegenschrank-waiblingen` | 404 ❌ | Seite fehlt |
| `/dachschraegenschrank-esslingen` | 404 ❌ | Seite fehlt |
| `/dachschraegenschrank-boeblingen` | 404 ❌ | Seite fehlt |
| `/dachschraegenschrank-fellbach` | 404 ❌ | Seite fehlt |
| `/dachschraegenschrank-rems-murr` | 404 ❌ | Seite fehlt |

**Funktionierende 301-Redirects:**

| Von | Nach |
|-----|------|
| `/leistungen/dachschraegenschrank` | `/dachschraegenschrank` |
| `/schreiner/dachschraegenschrank` | `/dachschraegenschrank` |
| `/dachschraege` | `/dachschraegenschrank` |
| `/dachschraegen` | `/dachschraegenschrank` |

Die Redirects sind korrekt eingerichtet und verhindern doppelte Inhalte. Allerdings fehlt ein kritischer Redirect: Die Plural-Variante `/dachschraegenschraenke` liefert einen 404-Fehler. Da Nutzer häufig nach dem Plural suchen, muss hier dringend ein 301-Redirect auf `/dachschraegenschrank` eingerichtet werden.

---

## 2.2 Analyse: /dachschraegenschrank (Hauptseite)

**Gesamtbewertung: SCHWACH** — deutlich schlechter als die Stuttgart-Seite.

### Befunde im Detail

| Kriterium | Befund | Bewertung |
|-----------|--------|-----------|
| **Title** | "Dachschrägenschrank - Schreinerhelden - ..." — 190 Zeichen | ❌ VIEL ZU LANG — Google schneidet bei ca. 60 Zeichen ab |
| **Meta-Description** | Vorhanden, aber kein lokaler Bezug, kein Alleinstellungsmerkmal | ⚠️ Verbesserungsbedarf |
| **H1** | "Schrank für Dachschräge" | ❌ Haupt-Keyword "Dachschrägenschrank" fehlt in der H1! |
| **Content-Umfang** | ca. 800–1.000 Wörter | ⚠️ Dünn — Minimum 1.500 Wörter empfohlen |
| **FAQ-Bereich** | Nicht vorhanden | ❌ Fehlt |
| **Preisbereich** | Nicht vorhanden | ❌ Fehlt |
| **Vergleichstabelle** | Nicht vorhanden | ❌ Fehlt |
| **LocalBusiness-Schema** | Nicht vorhanden | ❌ Fehlt |
| **FAQPage-Schema** | Nicht vorhanden | ❌ Fehlt |
| **Interne Verlinkung** | Kein Link zur Stuttgart-Seite | ❌ Fehlt |
| **Bilder** | 1 Bild mit leerem Alt-Text | ❌ Alt-Text fehlt |

### Empfehlung

Die Hauptseite `/dachschraegenschrank` sollte als übergeordnete Hub-Seite dienen, die auf alle Stadt-Landingpages verlinkt. Aktuell fehlen sämtliche Elemente, die die Stuttgart-Seite erfolgreich machen: FAQ, Preise, Vergleichstabelle, Schema-Markup und interne Verlinkung.

---

## 2.3 Analyse: /dachschraegenschrank-stuttgart (BEST PRACTICE)

**Gesamtbewertung: GUT** — diese Seite dient als Vorlage für alle weiteren Stadt-Landingpages.

### Title-Tag

- **Ist-Zustand:** "Dachschrägenschrank Stuttgart — Maßgefertigt vom Schreinermeister - ..." — 240 Zeichen (zu lang, weil der Plattform-Suffix angehängt wird)
- **Erster Teil ist perfekt:** "Dachschrägenschrank Stuttgart — Maßgefertigt vom Schreinermeister"
- **Idealer Title:** `Dachschrägenschrank Stuttgart — Maßgefertigt vom Schreinermeister` (65 Zeichen)
- **Handlungsbedarf:** Plattform-Suffix entfernen oder Title kürzen, damit Google den vollständigen Title anzeigt.

### Meta-Description

- **Problem:** Kein Stuttgart-Bezug in der Meta-Description, Keyword "Dachschrägenschrank" fehlt ebenfalls.
- **Empfehlung:** Meta-Description mit Stadtname und Haupt-Keyword neu formulieren, z. B.: *"Dachschrägenschrank in Stuttgart vom Schreinermeister — Maßanfertigung, faire Preise, 200+ Bewertungen. Jetzt kostenlos beraten lassen!"*

### H1-Tag

- **Ist-Zustand:** "Dachschrägenschrank in Stuttgart: Perfekt angepasst" — **GUT**
- Keyword + Stadtname in der H1 vorhanden.

### Content-Analyse

| Kriterium | Befund | Bewertung |
|-----------|--------|-----------|
| **Wortanzahl** | ca. 1.800–2.000 Wörter | ✅ Gut |
| **H2-Struktur** | 12 Überschriften, gut organisiert | ✅ Sehr gut |
| **Lokaler Bezug** | "Stuttgart" 20+ Mal im Text | ✅ Sehr gut |
| **Content-Overlap mit Hauptseite** | Nur 8% Überschneidung | ✅ Sehr gut |

### H2-Struktur (12 Abschnitte)

1. Warum ein Dachschrägenschrank?
2. Die Herausforderung bei Dachschrägen
3. Unsere Lösung
4. Kundenerfahrungen
5. Referenzen Stuttgart
6. Stauraum nach Maß in Stuttgart
7. Schreinerhelden vs. Online-Konfigurator
8. Was kostet ein Dachschrägenschrank?
9. FAQ — Häufig gestellte Fragen
10. Dein Schreiner für Stuttgart
11. *(weitere Abschnitte)*
12. *(weitere Abschnitte)*

### Preistabelle

| Breite | Standard | Premium |
|--------|----------|---------|
| 2 m | ab 3.500 € | ab 4.200 € |
| 3 m | ab 4.100 € | ab 4.900 € |
| 4 m+ | ab 5.400 € | ab 6.200 € |

Preistransparenz ist ein starker Vertrauensfaktor und hebt die Seite von Wettbewerbern ab.

### Vergleichstabelle

Schreinerhelden vs. Online-Konfigurator — 8 Vergleichskriterien. Diese Tabelle hilft Nutzern bei der Kaufentscheidung und positioniert Schreinerhelden klar als die bessere Wahl.

### FAQ-Bereich

6 Fragen mit ausführlichen Antworten. Dieser Bereich ist sowohl für Nutzer als auch für Google (Featured Snippets) wertvoll.

### Kundenbewertungen

5 Kundenbewertungen mit Namen und Datum — stärkt Vertrauen und liefert einzigartigen Content.

### Strukturierte Daten (Schema-Markup)

| Schema-Typ | Vorhanden | Kommentar |
|-------------|-----------|-----------|
| LocalBusiness | ✅ | Korrekt implementiert |
| FAQPage | ✅ | 6 Fragen markiert |
| Person (Mario Esch) | ✅ | Autor-Markup vorhanden |

### NAP-Daten (Name, Adresse, Telefon)

- **Firma:** Schreinerhelden GmbH & Co. KG
- **Adresse:** Lindenstraße 9-15, 71540 Murrhardt
- **Bewertung:** 4,95/5 bei 200 Bewertungen

### Autor & Aktualität

- **Autor:** Mario Esch, Schreinermeister seit 1996
- **Zuletzt aktualisiert:** 24.03.2026

---

## 2.4 Content-Overlap

Die Überschneidung zwischen der Hauptseite `/dachschraegenschrank` und der Stuttgart-Seite `/dachschraegenschrank-stuttgart` liegt bei nur **8%** — das ist **sehr gut** und zeigt, dass kein Duplicate-Content-Problem besteht.

**Gemeinsame Elemente (die 8%):**
- Referenztext (Kurzbeschreibung des Unternehmens)
- CTA-Texte (Call-to-Action-Formulierungen)
- Footer-Inhalte
- Planungstermin-Absatz

Dieser niedrige Overlap-Wert bestätigt, dass die Stuttgart-Seite eigenständigen, einzigartigen Content bietet und nicht einfach eine Kopie der Hauptseite ist. Das ist entscheidend, damit Google beide Seiten als eigenständige, wertvolle Ergebnisse betrachtet.

---

## 2.5 Stuttgart-Seite als Blueprint für neue Stadt-Landingpages

Die Stuttgart-Seite ist der klare Gewinner in dieser Analyse. Sie vereint alle Elemente, die eine erfolgreiche lokale Landingpage ausmachen: relevanter, umfangreicher Content, strukturierte Daten, Preistransparenz, Social Proof und starken lokalen Bezug.

Diese Seite sollte als **verbindliche Vorlage (Blueprint)** für alle weiteren Stadt-Landingpages dienen — insbesondere für die fehlenden Seiten in Ludwigsburg, Backnang, Waiblingen, Esslingen, Böblingen, Fellbach und Rems-Murr.

### Pflicht-Elemente für jede neue Stadt-Landingpage

Jede neue Stadt-Landingpage **muss** die folgenden 12 Elemente enthalten:

| Nr. | Element | Beschreibung |
|-----|---------|--------------|
| 1 | **H1 mit Keyword + Stadtname** | z. B. "Dachschrägenschrank in Ludwigsburg: Perfekt angepasst" |
| 2 | **~2.000 Wörter einzigartiger Content** | Kein Copy-Paste von anderen Stadt-Seiten — jede Seite braucht eigenen Text |
| 3 | **Lokaler Bezug** | Typische Wohnsituation der jeweiligen Stadt beschreiben (z. B. Altbauten in Esslingen, Reihenhäuser in Fellbach) |
| 4 | **Preistabelle** | Standard/Premium-Preise nach Breite — schafft Vertrauen und Transparenz |
| 5 | **Vergleich: Schreinerhelden vs. Konfigurator** | 8-Kriterien-Tabelle wie auf der Stuttgart-Seite |
| 6 | **5+ Kundenbewertungen** | Idealerweise von Kunden aus der jeweiligen Region, mit Namen und Datum |
| 7 | **FAQ mit 6+ stadt-spezifischen Fragen** | Fragen auf die jeweilige Stadt anpassen (Anfahrt, lokale Gegebenheiten, Liefergebiet) |
| 8 | **Schema-Markup: LocalBusiness + FAQPage + Person** | Vollständige strukturierte Daten für Rich Snippets in den Suchergebnissen |
| 9 | **Breadcrumb-Navigation** | Home > Schränke > Dachschrägenschrank > [Stadt] — verbessert UX und interne Verlinkung |
| 10 | **Interne Links zu benachbarten Stadt-LPs** | z. B. Ludwigsburg verlinkt auf Stuttgart und Backnang — stärkt das interne Linknetzwerk |
| 11 | **Google Maps Embed** | Karte mit Standort und Einzugsgebiet — stärkt den lokalen Bezug |
| 12 | **Autorenbox Mario Esch** | Schreinermeister seit 1996 — E-E-A-T-Signal (Experience, Expertise, Authoritativeness, Trustworthiness) |

### Warum dieser Blueprint funktioniert

- **Für Google:** Strukturierte Daten, einzigartiger Content pro Stadt und starker lokaler Bezug signalisieren Relevanz für lokale Suchanfragen.
- **Für Nutzer:** Preistransparenz, echte Bewertungen und ein klarer Vergleich erleichtern die Kaufentscheidung.
- **Für das interne Linknetzwerk:** Gegenseitige Verlinkung der Stadt-Seiten stärkt die thematische Autorität der gesamten Domain für "Dachschrägenschrank"-Suchanfragen.
- **Für E-E-A-T:** Autorenbox, Kundenbewertungen und nachprüfbare NAP-Daten belegen Erfahrung, Expertise und Vertrauenswürdigkeit.

### Priorisierte Umsetzungsreihenfolge

Die fehlenden Stadt-Seiten sollten in folgender Reihenfolge erstellt werden (nach geschätztem Suchvolumen und strategischer Bedeutung):

1. `/dachschraegenschrank-esslingen` — hohes Suchvolumen, große Stadt
2. `/dachschraegenschrank-ludwigsburg` — hohes Suchvolumen, große Stadt
3. `/dachschraegenschrank-boeblingen` — mittleres Suchvolumen
4. `/dachschraegenschrank-waiblingen` — mittleres Suchvolumen
5. `/dachschraegenschrank-fellbach` — niedrigeres Suchvolumen, aber nah an Stuttgart
6. `/dachschraegenschrank-backnang` — nah am Firmenstandort Murrhardt
7. `/dachschraegenschrank-rems-murr` — Landkreis-Seite, breiteres Einzugsgebiet

**Zusätzlich sofort umsetzen:**
- 301-Redirect von `/dachschraegenschraenke` (Plural) auf `/dachschraegenschrank`
- Hauptseite `/dachschraegenschrank` als Hub-Seite ausbauen mit Links zu allen Stadt-LPs
