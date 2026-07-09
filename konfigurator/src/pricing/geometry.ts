// Abgeleitete Maße einer Konfiguration. Wird sowohl von der Preis­berechnung
// als auch von der 3D-Darstellung genutzt, damit beide konsistent bleiben.

import type { WardrobeConfig } from '../types'

export interface Measures {
  /** Summe der Elementbreiten (cm), ohne Passstücke. */
  elementWidth: number
  /** Gesamtbreite inkl. seitlicher Passstücke (cm). */
  totalWidth: number
  /** Spalt zwischen Schrankoberkante und Decke (cm, >= 0). */
  topGap: number
  /** Höhe der Aufsatzschränke (cm), 0 wenn nicht aktiv. */
  aufsatzHeight: number
  /** Höhe der Deckenblende (cm), 0 wenn nicht aktiv. */
  blendeHeight: number
  /** Sichtbare Gesamthöhe inkl. Aufsatz/Blende (cm). */
  totalHeight: number
  /** Anzahl Aufsatzschränke (= Elemente, wenn Aufsatz aktiv). */
  aufsatzCount: number
}

export function deriveMeasures(config: WardrobeConfig): Measures {
  const elementWidth = config.elements.reduce((sum, el) => sum + el.width, 0)
  const totalWidth = elementWidth + config.fillerLeft + config.fillerRight
  const topGap = Math.max(0, config.roomHeight - config.height)

  const aufsatzHeight = config.topMode === 'aufsatz' ? topGap : 0
  const blendeHeight = config.topMode === 'blende' ? topGap : 0
  const totalHeight = config.height + (config.topMode !== 'none' ? topGap : 0)
  const aufsatzCount = aufsatzHeight > 0 ? config.elements.length : 0

  return {
    elementWidth,
    totalWidth,
    topGap,
    aufsatzHeight,
    blendeHeight,
    totalHeight,
    aufsatzCount,
  }
}
