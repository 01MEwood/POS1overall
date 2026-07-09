// Zentrale Typdefinitionen für den finverk PAX-Konfigurator.

export type BodyColorId = 'weiss' | 'eiche' | 'anthrazit' | 'schwarzbraun'
export type MaterialId = 'melamin' | 'lack_matt' | 'lack_hochglanz' | 'furnier'
export type HandleId = 'grifflos' | 'griffleiste' | 'stangengriff' | 'knopf'

/** Wie der Spalt zwischen Schrankoberkante und Decke geschlossen wird. */
export type TopMode = 'none' | 'blende' | 'aufsatz'

export type DeliveryMode = 'abholung' | 'lieferung'
export type PlzZone = 'stuttgart' | 'region' | 'sued'

/** IKEA-PAX-kompatible Rastermaße (cm). */
export type ElementWidth = 50 | 75 | 100
export type CarcassHeight = 201 | 236
export type CarcassDepth = 35 | 58

export interface WardrobeElement {
  id: string
  width: ElementWidth
  /** Anzahl der Türen auf diesem Element (1 = durchgehende Tür, 2 = Doppeltür). */
  doors: 1 | 2
}

export interface WardrobeConfig {
  /** Korpusfarbe (die vorhandene PAX-Korpusfarbe des Kunden). */
  bodyColorId: BodyColorId
  height: CarcassHeight
  depth: CarcassDepth
  /** Raumhöhe in cm – Basis für Passstück/Aufsatz-Berechnung. */
  roomHeight: number

  elements: WardrobeElement[]

  /** Frontmaterial + Farbe gelten für alle Fronten (inkl. Aufsätze). */
  materialId: MaterialId
  colorId: string
  handleId: HandleId

  /** Seitliche Passstücke (cm) – füllen den Spalt zur Wand. */
  fillerLeft: number
  fillerRight: number

  topMode: TopMode

  delivery: DeliveryMode
  montage: boolean
  plzZone: PlzZone
}
