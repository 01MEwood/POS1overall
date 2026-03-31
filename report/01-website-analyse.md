# Schreinerhelden.de - Website-Analyse Report

## Teil 1: Technische Analyse & Seitenstruktur

---

### 1.1 Technische Grunddaten

| Eigenschaft | Details |
|---|---|
| **CMS** | WordPress mit Elementor Page Builder |
| **SEO-Plugin** | Yoast SEO |
| **Performance** | WP Rocket |
| **Cookie-Lösung** | Real Cookie Banner Pro |
| **Tracking** | Google Tag Manager (GTM-PJV2R4FP), GA4 (G-6V4NRL6WZ2) |
| **Theme** | Astra |
| **HTML-Größe Startseite** | ca. 803 KB (extrem groß, Zielwert: 50–150 KB) |
| **JavaScript-Dateien** | 44 (zu viele) |
| **Inline-Styles** | 13 Style-Blöcke |

---

### 1.2 Vollständige Seitenstruktur (66 indexierbare URLs)

#### Hauptseiten (23)

| Nr. | URL | Letzte Änderung |
|-----|-----|-----------------|
| 1 | `/` (Startseite) | 06.02.2026 |
| 2 | `/schraenke` | 15.01.2025 |
| 3 | `/begehbarer-kleiderschrank` | 15.01.2025 |
| 4 | `/dachschraegenschrank` | 15.01.2025 |
| 5 | `/garderobe` | 15.01.2025 |
| 6 | `/kleiderschrank` | 15.01.2025 |
| 7 | `/stauraumschrank` | 15.01.2025 |
| 8 | `/treppenschrank-massgefertigter-schrank-unter-der-treppe` | 15.01.2025 |
| 9 | `/waschmaschinenschrank` | 15.01.2025 |
| 10 | `/dein-weg-zum-schrank` | 15.01.2025 |
| 11 | `/referenzen` | 15.01.2025 |
| 12 | `/ueber-uns` | 10.02.2026 |
| 13 | `/blog` | 25.01.2026 |
| 14 | `/faq` | 25.01.2026 |
| 15 | `/kontakt` | 08.01.2025 |
| 16 | `/termin` | 20.03.2026 |
| 17 | `/terminbuchung` | 29.10.2025 |
| 18 | `/stellenanzeigen` | 26.03.2026 |
| 19 | `/presse` | 21.10.2025 |
| 20 | `/impressum` | 19.12.2024 |
| 21 | `/datenschutz` | 19.12.2024 |
| 22 | `/agb` | 04.03.2026 |
| 23 | `/dachschraegenschrank-stuttgart` | 27.03.2026 |

> **Hinweis:** `/dachschraegenschrank-stuttgart` ist die **einzige** Stadt-Landingpage!

#### Blog-Artikel (16)

| Nr. | URL |
|-----|-----|
| 1 | `/holzmoebel-richtig-pfleg` |
| 2 | `/begehbarer-kleiderschrank-planen` |
| 3 | `/kleiderschrank-organisieren` |
| 4 | `/kleiderschrank-selber-bauen` |
| 5 | `/dachschraegenschrank-selber-bauen` |
| 6 | `/schrank-nach-mass` |
| 7 | `/garderobenschrank` |
| 8 | `/kleiderschrank-tuere-einstellen` |
| 9 | `/schrank-konfigurieren` |
| 10 | `/schiebetuerenschrank` |
| 11 | `/einbauschrank-nach-mass` |
| 12 | `/schrank-dekor-echtholz-furnier` |
| 13 | `/schranktueren-ratgeber` |
| 14 | `/kleiderbuegel-guide` |
| 15 | `/kleiderlift-ratgeber` |
| 16 | `/ordnungsexpertin-interview` |

#### Landing Pages (5 — nur Recruiting)

- `/schreiner-jobs/`
- `/schreiner-av/`
- `/moebel-monteur/`
- `/schreiner-profi/`
- `/kundenmanager/`

#### Kategorien (7)

`blogartikel` · `begehbarer-kleiderschrank` · `dachschraegenschrank` · `garderobe` · `kleiderschrank` · `schreinerhelden-allgemein` · `stauraumschraenke`

#### Tags (15)

`dekor` · `echtholz` · `furnier` · `kleiderbuegel` · `kleiderlift` · `kleiderschrank` · `massgefertigte-schraenke` · `ordnung` · `ordnungsexpertin` · `qualitaet` · `sauberkeit` · `schrank-konfigurieren` · `schrank-nach-mass` · `schranktuere-einstellen` · `tipps`

---

### 1.3 SEO-Analyse Startseite

| Kriterium | Ist-Zustand | Bewertung | Empfehlung |
|---|---|---|---|
| **Title-Tag** | „Home - Schreinerhelden - wir bauen deinen individuellen Schrank nach Maß..." — 175 Zeichen, beginnt mit „Home" | ❌ SCHLECHT | Kürzen auf max. 60 Zeichen, Hauptkeyword an den Anfang stellen, „Home" entfernen |
| **Meta-Description** | „Wir bauen deinen Schrank nach Maß..." — 145 Zeichen | ⚠️ OK | Stärkerer CTA einbauen, USPs hervorheben |
| **H1** | „Wir bauen deinen Schrank nach Maß" — nur eine H1 vorhanden | ✅ GUT | — |
| **H2-Struktur** | 12 H2-Tags, teilweise ohne relevante Keywords | ⚠️ MITTELMÄSSIG | Keywords gezielt in H2-Überschriften integrieren |
| **Schema Markup** | Nur WebPage und Organization vorhanden, kein LocalBusiness, kein FAQPage | ❌ MANGELHAFT | LocalBusiness-Schema hinzufügen, FAQPage-Schema auf FAQ-Seite implementieren |
| **Canonical** | Korrekt gesetzt | ✅ GUT | — |
| **Bilder** | 7 von 21 Bildern ohne Alt-Text | ❌ SCHLECHT | Alle Bilder mit beschreibenden, keyword-relevanten Alt-Texten versehen |
| **OG-Image** | Kleines Sternebewertungs-PNG statt ansprechendes Bild | ❌ SCHLECHT | Professionelles, markenkonformes OG-Image (1200×630 px) erstellen |
| **Seitengröße** | 803 KB reines HTML | ❌ SCHLECHT | Elementor-Bloat reduzieren, ungenutztes CSS/JS entfernen, Critical CSS einsetzen |

---

### 1.4 Bekannte Fehler

| Fehler | Beschreibung | Priorität |
|---|---|---|
| **Blog-URL abgeschnitten** | `/holzmoebel-richtig-pfleg` — es fehlt das „en" am Ende. Korrekt wäre `/holzmoebel-richtig-pflegen`. | Hoch |
| **Fehlender Redirect (404)** | `/dachschraegenschraenke` (Plural) führt zu einem 404-Fehler. Es fehlt ein 301-Redirect auf `/dachschraegenschrank`. | Hoch |
| **Breadcrumb-Bug im Schema** | Die Stuttgart-Landingpage hat im strukturierten Breadcrumb-Schema eine fehlerhafte URL, die auf `/dachschraegenschrank-stuttgart2` endet. | Mittel |
| **Footer ohne Verlinkung** | Der Footer listet 13+ Städte auf, jedoch ohne jegliche Verlinkung. Diese Städte-Nennungen erzeugen keinen SEO-Wert. | Mittel |
| **og:site_name zu lang** | Der Wert des `og:site_name`-Tags ist unverhältnismäßig lang und sollte auf den Markennamen gekürzt werden. | Niedrig |

---

> **Nächster Teil:** Teil 2 wird die Keyword-Analyse, Wettbewerbervergleich und die detaillierte Content-Strategie behandeln.
