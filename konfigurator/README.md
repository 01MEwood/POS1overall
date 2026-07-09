# finverk · PAX-Konfigurator

Ein 3D-Konfigurator-Prototyp, mit dem Kund:innen ihren IKEA-PAX-Schrank mit
maßgefertigten **Fronten**, **Passstücken** und **Aufsatzschränken** zu einem
einbauschrank-ähnlichen Möbel aufwerten – live in 3D und mit transparenter
Preisberechnung.

Positionierung: **regional im Großraum Stuttgart & Süddeutschland**, inkl.
Lieferung durch das eigene Team und optionaler Montage. Fachliches Vorbild ist
der Korpusgenerator von select-living – finverk bringt dieses Konzept regional
mit Lieferung & Montage aus einer Hand.

> Prototyp-Hinweis: Alle Preise sind **Netto-Richtwerte** und zentral in
> `src/data/catalog.ts` hinterlegt, damit sie leicht an echte Kalkulationen
> angepasst werden können.

---

## Funktionsumfang

- **Live-3D-Ansicht** (Three.js / React Three Fiber): Korpus, Fronten mit
  realistischen Fugen, Griffe, Passstücke und Aufsatzschränke – frei drehbar
  und zoombar.
- **Elemente** frei zusammenstellen: 1–6 PAX-Elemente à 50 / 75 / 100 cm,
  wahlweise 1 oder 2 Türen.
- **Korpus**: Farbe (Weiß, Eiche, Anthrazit, Schwarzbraun), Höhe (201 / 236 cm),
  Tiefe (35 / 58 cm).
- **Fronten**: 4 Materialien (Melamin, Lack matt, Lack Hochglanz,
  Echtholz-Furnier mit prozeduraler Maserung) mit je eigener Farbpalette,
  4 Griffvarianten (grifflos / Griffleiste / Stangengriff / Knopf).
- **Deckenabschluss**: offen, Deckenblende oder deckenhohe Aufsatzschränke –
  automatisch aus Raumhöhe abgeleitet.
- **Passstücke** links/rechts (0–40 cm) für wandbündigen Einbau.
- **Lieferung & Montage**: Liefergebiete (Stuttgart / Region / Süddeutschland)
  und optionale Montage, preislich abgebildet.
- **Transparente Preisliste** mit Positionen, Netto, MwSt und Brutto – live.
- **Angebot anfordern**: Dialog erzeugt eine fertige E-Mail-Anfrage (mailto)
  inkl. kompletter Spezifikation; alternativ Zusammenfassung kopieren.
- **Vorlagen** für den Schnellstart und vollständig **responsive** (Desktop &
  Mobile).

---

## Schnellstart

```bash
cd konfigurator
npm install
npm run dev        # Entwicklungsserver → http://localhost:5173
```

Weitere Skripte:

```bash
npm run build      # Typecheck (tsc) + Produktions-Build nach dist/
npm run preview    # gebaute Version lokal servieren
```

Voraussetzung: Node ≥ 18.

---

## Technik

| Bereich        | Wahl |
|----------------|------|
| Build / Dev    | Vite 5 |
| UI             | React 18 + TypeScript |
| 3D             | three.js, @react-three/fiber, @react-three/drei |
| State          | zustand |
| Styling        | eine CSS-Datei mit Design-Tokens (`src/styles.css`) |

Bewusst **ohne externe Laufzeit-Assets**: Umgebungs-Reflexionen entstehen
prozedural aus Lightformern, die Holzmaserung wird per Canvas erzeugt. Der
Konfigurator läuft damit vollständig offline und ist als statische Seite
deploybar (z. B. Vercel).

---

## Projektstruktur

```
konfigurator/
├── index.html
├── src/
│   ├── main.tsx                # Einstiegspunkt
│   ├── types.ts                # zentrale Typen
│   ├── data/catalog.ts         # Produktkatalog + Preisparameter (hier anpassen)
│   ├── state/store.ts          # zustand-Store, Defaults, Vorlagen
│   ├── pricing/
│   │   ├── geometry.ts         # abgeleitete Maße (Breite, Spalt, Höhen …)
│   │   └── pricing.ts          # Preis-Engine → Positionsliste + Summen
│   ├── three/
│   │   ├── Scene.tsx           # Canvas, Licht, Schatten, Kamera, Steuerung
│   │   ├── Wardrobe.tsx        # Aufbau des Schranks aus der Konfiguration
│   │   └── materials.ts        # Front-Materialien + Holztextur
│   ├── ui/
│   │   ├── App.tsx             # Layout (Header, Viewer, Sidebar)
│   │   ├── ConfiguratorPanel.tsx
│   │   ├── PriceSummary.tsx
│   │   ├── QuoteDialog.tsx
│   │   └── controls.tsx        # kleine UI-Bausteine
│   └── util/                   # Formatierung, Text-Zusammenfassung
└── ...
```

## Preislogik (Kurzfassung)

- **Fronten** werden pro m² Frontfläche nach Material berechnet.
- **Aufsatzschränke** = Frontfläche × Materialpreis + Korpusaufschlag + Beschlag
  + Griff je Element.
- **Passstücke** (Seiten + Deckenblende) pro m² sichtbarer Fläche.
- **Beschläge** (Softclose) und **Griffe** je Tür.
- **Lieferung** pauschal je Zone, **Montage** = Basis + je Element/Aufsatz.
- Alle Positionen netto, zzgl. 19 % MwSt.

Sämtliche Sätze stehen in `PRICING` und den Katalog-Arrays in
`src/data/catalog.ts`.

---

## Mögliche nächste Schritte

- Anbindung an ein echtes Backend/CRM für Anfragen (statt mailto) inkl. PLZ-
  basierter Zonen- und Terminlogik.
- Feinere IKEA-PAX-Logik (exakte Tür-/Scharnier-Raster, Schubladen, Inneneinteilung).
- Bild-Export / PDF-Angebot und Speichern/Teilen einer Konfiguration per Link.
- Detailliertere 3D-Assets (Griffprofile, Furnier-Normal-Maps, Sockel/Beleuchtung).
- Integration in eine finverk-Marketing-Landingpage mit Terminbuchung.
