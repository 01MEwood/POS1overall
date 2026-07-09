// Produktkatalog & Preisparameter für den finverk PAX-Konfigurator.
//
// Alle Preise sind Netto-Richtwerte (€) für den Prototyp und an einer Stelle
// gebündelt, damit sie sich leicht anpassen lassen. Fronten werden pro m²
// Frontfläche kalkuliert – so wie es bei maßgefertigten Fronten üblich ist.

import type {
  BodyColorId,
  CarcassDepth,
  CarcassHeight,
  ElementWidth,
  HandleId,
  MaterialId,
  PlzZone,
} from '../types'

export interface ColorOption {
  id: string
  name: string
  hex: string
  /** Oberflächenrauheit für das 3D-Material (0 = spiegelnd, 1 = matt). */
  roughness: number
  metalness: number
  /** Klarlack-Anteil für Hochglanz-Optik. */
  clearcoat: number
  /** Kennzeichnet Holz-Dekore für die Maserungs-Darstellung. */
  wood?: boolean
}

export interface MaterialOption {
  id: MaterialId
  name: string
  short: string
  description: string
  /** Netto-Preis pro m² Frontfläche. */
  pricePerM2: number
  colors: ColorOption[]
}

export interface HandleOption {
  id: HandleId
  name: string
  description: string
  /** Netto-Aufpreis pro Tür. */
  pricePerDoor: number
}

export interface BodyColorOption {
  id: BodyColorId
  name: string
  hex: string
}

// ---------------------------------------------------------------------------
// Korpusfarben (vorhandener PAX-Korpus)
// ---------------------------------------------------------------------------

export const BODY_COLORS: BodyColorOption[] = [
  { id: 'weiss', name: 'Weiß', hex: '#eeeee8' },
  { id: 'eiche', name: 'Eicheffekt', hex: '#d3bd97' },
  { id: 'anthrazit', name: 'Anthrazit', hex: '#41454b' },
  { id: 'schwarzbraun', name: 'Schwarzbraun', hex: '#2a231e' },
]

// ---------------------------------------------------------------------------
// Frontmaterialien & Farben
// ---------------------------------------------------------------------------

export const MATERIALS: MaterialOption[] = [
  {
    id: 'melamin',
    name: 'Melamin / foliert',
    short: 'Melamin',
    description: 'Robuste, pflegeleichte Oberfläche – bestes Preis-Leistungs-Verhältnis.',
    pricePerM2: 190,
    colors: [
      { id: 'weiss', name: 'Reinweiß', hex: '#f4f4ef', roughness: 0.72, metalness: 0, clearcoat: 0 },
      { id: 'kaschmir', name: 'Kaschmirgrau', hex: '#cfd0cb', roughness: 0.72, metalness: 0, clearcoat: 0 },
      { id: 'sand', name: 'Sandbeige', hex: '#d9c9ab', roughness: 0.74, metalness: 0, clearcoat: 0 },
      { id: 'salbei', name: 'Salbeigrün', hex: '#9fae9c', roughness: 0.74, metalness: 0, clearcoat: 0 },
      { id: 'nachtblau', name: 'Nachtblau', hex: '#37425a', roughness: 0.7, metalness: 0, clearcoat: 0 },
      { id: 'anthrazit', name: 'Anthrazit', hex: '#3b3f45', roughness: 0.7, metalness: 0, clearcoat: 0 },
    ],
  },
  {
    id: 'lack_matt',
    name: 'Lack matt',
    short: 'Lack matt',
    description: 'Samtige, fingerabdruck­arme Lackoberfläche in RAL-Farben.',
    pricePerM2: 340,
    colors: [
      { id: 'reinweiss', name: 'Reinweiß', hex: '#f7f7f3', roughness: 0.5, metalness: 0, clearcoat: 0.25 },
      { id: 'nebelgrau', name: 'Nebelgrau', hex: '#b7bbbb', roughness: 0.5, metalness: 0, clearcoat: 0.25 },
      { id: 'taupe', name: 'Taupe', hex: '#9b8f7f', roughness: 0.5, metalness: 0, clearcoat: 0.25 },
      { id: 'olive', name: 'Olivgrün', hex: '#5b6647', roughness: 0.5, metalness: 0, clearcoat: 0.25 },
      { id: 'bordeaux', name: 'Bordeaux', hex: '#6f2530', roughness: 0.5, metalness: 0, clearcoat: 0.25 },
      { id: 'tiefschwarz', name: 'Tiefschwarz', hex: '#1b1d20', roughness: 0.48, metalness: 0, clearcoat: 0.3 },
    ],
  },
  {
    id: 'lack_hochglanz',
    name: 'Lack Hochglanz',
    short: 'Hochglanz',
    description: 'Spiegelnde Premium-Oberfläche mit hoher Tiefenwirkung.',
    pricePerM2: 420,
    colors: [
      { id: 'kristallweiss', name: 'Kristallweiß', hex: '#f8f8f5', roughness: 0.1, metalness: 0, clearcoat: 1 },
      { id: 'perlgrau', name: 'Perlgrau', hex: '#cfd2d1', roughness: 0.1, metalness: 0, clearcoat: 1 },
      { id: 'rubinrot', name: 'Rubinrot', hex: '#7c1f2a', roughness: 0.1, metalness: 0, clearcoat: 1 },
      { id: 'schwarz', name: 'Schwarz', hex: '#17181b', roughness: 0.08, metalness: 0, clearcoat: 1 },
    ],
  },
  {
    id: 'furnier',
    name: 'Echtholz-Furnier',
    short: 'Furnier',
    description: 'Echtes Holzfurnier mit natürlicher Maserung – jede Front ein Unikat.',
    pricePerM2: 520,
    colors: [
      { id: 'eiche', name: 'Eiche natur', hex: '#c6a877', roughness: 0.55, metalness: 0, clearcoat: 0.15, wood: true },
      { id: 'nussbaum', name: 'Nussbaum', hex: '#5c3f29', roughness: 0.55, metalness: 0, clearcoat: 0.15, wood: true },
      { id: 'esche', name: 'Esche weiß', hex: '#d7c6a6', roughness: 0.58, metalness: 0, clearcoat: 0.12, wood: true },
      { id: 'raeuchereiche', name: 'Räuchereiche', hex: '#7a5a3a', roughness: 0.55, metalness: 0, clearcoat: 0.15, wood: true },
    ],
  },
]

// ---------------------------------------------------------------------------
// Griffe
// ---------------------------------------------------------------------------

export const HANDLES: HandleOption[] = [
  {
    id: 'grifflos',
    name: 'Grifflos (Tip-On)',
    description: 'Push-to-open-Mechanik, komplett griffloses Erscheinungsbild.',
    pricePerDoor: 19,
  },
  {
    id: 'griffleiste',
    name: 'Griffleiste',
    description: 'Durchgehende Aluminium-Griffleiste an der Türkante.',
    pricePerDoor: 24,
  },
  {
    id: 'stangengriff',
    name: 'Stangengriff',
    description: 'Schlanker Bügelgriff in Edelstahl-Optik.',
    pricePerDoor: 14,
  },
  {
    id: 'knopf',
    name: 'Knopfgriff',
    description: 'Runder Möbelknopf – klassisch und dezent.',
    pricePerDoor: 8,
  },
]

// ---------------------------------------------------------------------------
// Liefergebiete (Großraum Stuttgart / Süddeutschland)
// ---------------------------------------------------------------------------

export interface PlzZoneOption {
  id: PlzZone
  name: string
  description: string
}

export const PLZ_ZONES: PlzZoneOption[] = [
  {
    id: 'stuttgart',
    name: 'Stuttgart & direktes Umland',
    description: 'z. B. Fellbach, Esslingen, Leinfelden – ca. 0–20 km',
  },
  {
    id: 'region',
    name: 'Region Stuttgart',
    description: 'z. B. Ludwigsburg, Böblingen, Waiblingen, Backnang – ca. 20–50 km',
  },
  {
    id: 'sued',
    name: 'Süddeutschland',
    description: 'übriges Baden-Württemberg & angrenzendes Bayern – ca. 50–150 km',
  },
]

// ---------------------------------------------------------------------------
// Rastermaße
// ---------------------------------------------------------------------------

export const WIDTHS: ElementWidth[] = [50, 75, 100]
export const HEIGHTS: CarcassHeight[] = [201, 236]
export const DEPTHS: CarcassDepth[] = [35, 58]

/** Mindesthöhe (cm), ab der ein Aufsatzschrank statt einer Blende sinnvoll ist. */
export const MIN_AUFSATZ_HEIGHT = 20
/** Maximale seitliche Passstückbreite pro Seite (cm). */
export const MAX_FILLER = 40

// ---------------------------------------------------------------------------
// Preisparameter
// ---------------------------------------------------------------------------

export const PRICING = {
  /** Softclose-Scharnierset pro Tür. */
  beschlagProTuer: 24,
  /** Passstück (Seite/Decke), Netto pro m² sichtbarer Fläche. */
  passstueckProM2: 130,
  /** Korpus-Aufschlag Aufsatzschrank, Netto pro m² Frontfläche. */
  aufsatzKorpusProM2: 110,
  /** Montage-Basispauschale (Anfahrt, Einrichtung). */
  montageBasis: 90,
  montageProElement: 40,
  montageProAufsatz: 30,
  /** Lieferpauschale je Zone. */
  lieferung: { stuttgart: 49, region: 89, sued: 149 } as Record<PlzZone, number>,
  mwstSatz: 0.19,
} as const

// ---------------------------------------------------------------------------
// Lookup-Helfer
// ---------------------------------------------------------------------------

export function getMaterial(id: MaterialId): MaterialOption {
  return MATERIALS.find((m) => m.id === id) ?? MATERIALS[0]
}

export function getColor(materialId: MaterialId, colorId: string): ColorOption {
  const material = getMaterial(materialId)
  return material.colors.find((c) => c.id === colorId) ?? material.colors[0]
}

export function getHandle(id: HandleId): HandleOption {
  return HANDLES.find((h) => h.id === id) ?? HANDLES[0]
}

export function getBodyColor(id: BodyColorId): BodyColorOption {
  return BODY_COLORS.find((c) => c.id === id) ?? BODY_COLORS[0]
}

export function getPlzZone(id: PlzZone): PlzZoneOption {
  return PLZ_ZONES.find((z) => z.id === id) ?? PLZ_ZONES[0]
}
