# Teil 4: MEOS:APP Pipeline-Optimierung & Aktionsplan

## 4.1 MEOS:APP Architektur-Überblick

MEOS:HELDEN (helden.meosapp.de) ist die KI-gestützte Content-Pipeline der Schreinerhelden mit folgenden Komponenten:

| Komponente | URL | Funktion |
|---|---|---|
| Content-Pipeline | helden.meosapp.de | Keyword + Ort → Fertige Seite |
| SEO Command Center | seo.meosapp.de | Intelligence-Daten, SERP-Analyse |
| Knowledge Base | RAG-System | Firmen-spezifisches Wissen mit Embeddings |
| Export | WordPress API | GenerateBlocks-Format als Draft |

### Pipeline-Stufen:

1. **INTELLIGENCE** → SEO-Datensammlung
2. **STRATEGY** → Briefing-Erstellung
3. **RETRIEVAL** → RAG aus Knowledge Base
4. **GENERATING** → Content via GPT-4o
5. **BOARD_REVIEW** → Qualitätsprüfung
6. **APPROVED/REJECTED** → Freigabe
7. **EXPORTED** → HTML/WordPress-Draft
8. **PUBLISHED** → Live

### Seitentypen:

- **ORTS_LP** (min. 1.500 Wörter) — Für Stadt-Landingpages
- **PRODUCT_PAGE** (min. 1.500 Wörter)
- **BLOG** (min. 1.200 Wörter)
- **PILLAR** (min. 2.500 Wörter)

---

## 4.2 Bekanntes Problem: HTML-Output

Das ausgespielte HTML ist nicht sauber. Mögliche Ursachen und Lösungsansätze:

### Problem-Analyse:

1. **GenerateBlocks-Kompatibilität**: Der Export in GenerateBlocks-Format kann zu Markup-Problemen führen, wenn Blöcke nicht korrekt verschachtelt sind
2. **Schema-Markup-Integration**: Strukturierte Daten (LocalBusiness, FAQPage) müssen separat zum Content generiert werden
3. **Elementor vs. GenerateBlocks**: Die bestehende Stuttgart-Seite nutzt Elementor, der Export aus MEOS geht an GenerateBlocks — ein Format-Mismatch

### Lösungsvorschlag: Stuttgart-Template in MEOS als Referenz

Die bestehende Stuttgart-Seite (`/dachschraegenschrank-stuttgart`) hat bereits die perfekte Struktur. Der MEOS-Output sollte diese Struktur exakt replizieren:

```
 1. Hero-Bereich mit H1 + Einleitungstext + CTA
 2. "Warum ein Dachschrägenschrank?" — Problem/Lösung
 3. Vorteile (5 Bullet Points)
 4. Kundenbewertungen (5 Stück mit Name/Datum)
 5. Referenzen-Galerie
 6. Vergleichstabelle (Schreinerhelden vs. Konfigurator)
 7. Preistabelle (Standard/Premium)
 8. FAQ-Bereich (6+ Fragen)
 9. Lokaler Schlusstext + Autorenbox
10. CTA-Banner mit Terminbuchung
```

### Empfehlung für sauberen HTML-Output:

1. **HTML-Template im MEOS definieren**: Ein festes HTML-Gerüst mit Platzhaltern, das die Pipeline befüllt
2. **Schema-Markup als separater Output**: outputSchema sollte valides JSON-LD generieren
3. **Validierung als Pipeline-Schritt**: Nach GENERATING einen HTML-Validierungs-Check einbauen
4. **WordPress-Export testen**: Jeder Export sollte im Preview geprüft werden

---

## 4.3 Knowledge Base (RAG) — Empfohlene Wissens-Chunks

Folgende Chunks sollten in der MEOS Knowledge Base hinterlegt sein, damit die Pipeline qualitativ hochwertige Texte generiert:

### Firmendaten:

- **Firma:** Schreinerhelden GmbH & Co. KG
- **Adresse:** Lindenstraße 9-15, 71540 Murrhardt
- **Telefon:** 07192/9357200
- **Geschäftsführer:** Mario Esch, Schreinermeister seit 1996
- **Sonstiges:** Dozent an der Meisterschule Schwäbisch Hall
- **Bewertungen:** 4.95/5 Sterne bei 200+ Bewertungen

### Produkt-Wissen Dachschrägenschränke:

- **Preise:** Standard ab 3.500 EUR (2m), Premium ab 4.200 EUR (2m), etc.
- **Materialien:** Dekor, Echtholz, Furnier, Lack
- **Prozess:** Online-Termin → Aufmaß → Planung → Fertigung (4-6 Wochen) → Montage
- **USPs:** Meisterqualität, Festpreisgarantie, eigene Werkstatt, Montage inklusive

### Regionaldaten je Stadt:

Für jede Zielstadt ein Chunk mit:

- Entfernung von Murrhardt
- Typische Wohnsituation (Altbau/Neubau, Dachgeschosse)
- Lokale Besonderheiten
- Relevante Stadtteile
- Bisherige Projekte/Referenzen in der Stadt

---

## 4.4 Konkreter Aktionsplan

### Phase 1: Sofort (Woche 1-2) — Quick Wins

| # | Maßnahme | Verantwortlich | Tool |
|---|----------|---------------|------|
| 1 | Yoast Title-Suffix kürzen auf "\| Schreinerhelden" | WordPress Admin | Yoast SEO |
| 2 | Redirect /dachschraegenschraenke → /dachschraegenschrank einrichten | WordPress Admin | Yoast/Redirection |
| 3 | Breadcrumb-Bug fixen (stuttgart2 → stuttgart) | WordPress Admin | Yoast |
| 4 | Meta-Description Stuttgart-Seite: Keyword + Stadt einfügen | WordPress Admin | Yoast |
| 5 | H1 Hauptseite ändern: "Schrank für Dachschräge" → "Dachschrägenschrank nach Maß" | Elementor | Editor |
| 6 | Alle leeren Alt-Texte befüllen | Elementor | Editor |
| 7 | LocalBusiness-Schema auf Hauptseite hinzufügen | WordPress | Yoast/Custom |
| 8 | Google Search Console einrichten (falls noch nicht vorhanden) | Admin | GSC |

### Phase 2: Stadt-Landingpages (Woche 2-4)

| # | Stadt | Keyword | MEOS Typ | Priorität |
|---|-------|---------|----------|-----------|
| 1 | Ludwigsburg | Dachschrägenschrank Ludwigsburg | ORTS_LP | P1 |
| 2 | Esslingen | Dachschrägenschrank Esslingen | ORTS_LP | P1 |
| 3 | Böblingen | Dachschrägenschrank Böblingen | ORTS_LP | P1 |
| 4 | Waiblingen | Dachschrägenschrank Waiblingen | ORTS_LP | P2 |
| 5 | Fellbach | Dachschrägenschrank Fellbach | ORTS_LP | P2 |
| 6 | Leonberg | Dachschrägenschrank Leonberg | ORTS_LP | P2 |
| 7 | Backnang | Dachschrägenschrank Backnang | ORTS_LP | P3 |
| 8 | Winnenden | Dachschrägenschrank Winnenden | ORTS_LP | P3 |
| 9 | Schorndorf | Dachschrägenschrank Schorndorf | ORTS_LP | P3 |
| 10 | Sindelfingen | Dachschrägenschrank Sindelfingen | ORTS_LP | P3 |
| 11 | Rems-Murr-Kreis | Dachschrägenschrank Rems-Murr | ORTS_LP | P3 |
| 12 | Murrhardt | Dachschrägenschrank Murrhardt | ORTS_LP | P3 |

**Für jede Stadt-LP im MEOS:**

1. **Intelligence-Phase:** SERP-Daten von seo.meosapp.de laden
2. **Strategy:** Briefing basierend auf Stuttgart-Template
3. **Retrieval:** Stadt-spezifische RAG-Chunks + Produkt-Wissen
4. **Generating:** 1.800-2.000 Wörter, min. 30% unique vs. andere Stadt-LPs
5. **Board Review:** Prüfen auf Duplicate Content, Schema-Korrektheit, lokale Relevanz
6. **Export:** WordPress-Draft im GenerateBlocks-Format
7. **Manueller Check:** HTML-Qualität, Layout, Schema im Preview
8. **Publish**

### Phase 3: Content-Hub ausbauen (Woche 4-8)

| # | Maßnahme | MEOS Typ |
|---|----------|----------|
| 1 | Pillar-Page /dachschraegenschrank auf 2.500+ Wörter ausbauen | PILLAR |
| 2 | Blog: "Was kostet ein Dachschrägenschrank? (Preisguide 2026)" | BLOG |
| 3 | Blog: "Dachschrägenschrank selber bauen vs. vom Schreiner" | BLOG |
| 4 | Blog: "10 Ideen für Dachschrägenschränke — Inspiration & Tipps" | BLOG |
| 5 | Blog: "Materialvergleich: Dekor vs. Echtholz vs. Lack" | BLOG |
| 6 | Footer-Städteliste mit Links zu den neuen LPs versehen | WordPress |
| 7 | Interne Verlinkung zwischen allen Stadt-LPs einrichten | WordPress |

### Phase 4: Monitoring & Iteration (laufend)

| # | Maßnahme | Tool | Frequenz |
|---|----------|------|----------|
| 1 | Ranking-Tracking aller Keywords einrichten | SE Ranking / Sistrix | Wöchentlich |
| 2 | Wettbewerber-Monitoring | SE Ranking / Sistrix | Wöchentlich |
| 3 | Core Web Vitals prüfen | Google Search Console | Monatlich |
| 4 | Content-Freshness: Seiten aktualisieren | MEOS + WordPress | Quartalsweise |
| 5 | Neue PAA-Fragen identifizieren und beantworten | SERP-Analyse | Monatlich |
| 6 | MEOS Health Checks: CTA-Checks, SERP-Rescans | helden.meosapp.de | Wöchentlich |
| 7 | Backlink-Aufbau: Lokale Verzeichnisse, HWK, IHK | Manuell | Laufend |

---

## 4.5 Erfolgsmessung (KPIs)

| KPI | Ist-Zustand | Ziel (3 Monate) | Ziel (6 Monate) |
|-----|------------|-----------------|-----------------|
| Stadt-LPs live | 1 (Stuttgart) | 7 (+ P1 + P2) | 13 (alle) |
| Ranking "Dachschrägenschrank Stuttgart" | Unbekannt | Top 5 | Top 3 |
| Ranking "Dachschrägenschrank [Kleinstädte]" | Nicht vorhanden | Top 10 | Top 3 |
| Featured Snippets | 0 | 2-3 | 5+ |
| Blog-Artikel Dachschräge | 0 spezifisch | 3 | 5 |
| Organischer Traffic (Dachschräge) | Unbekannt | +50% | +150% |
| Google Maps / Local Pack | Unbekannt | In 3+ Städten sichtbar | In 8+ Städten |
| KI-Zitation (GEO) | Unbekannt | Bei 2+ Queries | Bei 5+ Queries |
