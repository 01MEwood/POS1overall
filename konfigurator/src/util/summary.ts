// Erzeugt eine lesbare Text-Zusammenfassung der Konfiguration (für Angebots-
// anfrage per E-Mail und zum Kopieren).

import {
  getBodyColor,
  getColor,
  getHandle,
  getMaterial,
  getPlzZone,
} from '../data/catalog'
import { deriveMeasures } from '../pricing/geometry'
import type { PriceResult } from '../pricing/pricing'
import type { WardrobeConfig } from '../types'
import { formatEuro } from './format'

function topModeLabel(config: WardrobeConfig): string {
  const m = deriveMeasures(config)
  switch (config.topMode) {
    case 'blende':
      return m.blendeHeight > 0 ? `Deckenblende (${Math.round(m.blendeHeight)} cm)` : 'Deckenblende'
    case 'aufsatz':
      return m.aufsatzHeight > 0
        ? `Aufsatzschränke (${Math.round(m.aufsatzHeight)} cm)`
        : 'Aufsatzschränke'
    default:
      return 'offen (kein Deckenabschluss)'
  }
}

export function buildSpecSummary(config: WardrobeConfig, price: PriceResult): string {
  const material = getMaterial(config.materialId)
  const color = getColor(config.materialId, config.colorId)
  const handle = getHandle(config.handleId)
  const body = getBodyColor(config.bodyColorId)
  const zone = getPlzZone(config.plzZone)
  const m = deriveMeasures(config)

  const lines: string[] = []
  lines.push('finverk PAX-Konfiguration')
  lines.push('========================')
  lines.push('')
  lines.push('Maße')
  lines.push(`  Gesamtbreite: ${m.totalWidth} cm (inkl. Passstücke)`)
  lines.push(`  Korpushöhe:   ${config.height} cm`)
  lines.push(`  Sichthöhe:    ${m.totalHeight} cm`)
  lines.push(`  Tiefe:        ${config.depth} cm`)
  lines.push(`  Raumhöhe:     ${config.roomHeight} cm`)
  lines.push(`  Korpusfarbe:  ${body.name}`)
  lines.push('')
  lines.push('Elemente')
  config.elements.forEach((el, i) => {
    lines.push(`  ${i + 1}. ${el.width} cm · ${el.doors} Tür${el.doors === 1 ? '' : 'en'}`)
  })
  lines.push('')
  lines.push('Fronten')
  lines.push(`  Material: ${material.name}`)
  lines.push(`  Farbe:    ${color.name}`)
  lines.push(`  Griff:    ${handle.name}`)
  lines.push('')
  lines.push('Anbau')
  lines.push(`  Deckenabschluss: ${topModeLabel(config)}`)
  lines.push(
    `  Passstücke:      links ${config.fillerLeft} cm / rechts ${config.fillerRight} cm`,
  )
  lines.push('')
  lines.push('Service')
  lines.push(
    `  ${config.delivery === 'lieferung' ? `Lieferung (${zone.name})` : 'Abholung'}${
      config.montage ? ' + Montage' : ''
    }`,
  )
  lines.push('')
  lines.push('Preis (Richtwert)')
  price.lines.forEach((l) => {
    lines.push(`  ${l.label}: ${formatEuro(l.amount)}`)
  })
  lines.push(`  ---`)
  lines.push(`  Netto:  ${formatEuro(price.netto)}`)
  lines.push(`  MwSt.:  ${formatEuro(price.mwst)}`)
  lines.push(`  Gesamt: ${formatEuro(price.brutto)}`)
  lines.push('')
  lines.push('Hinweis: Unverbindlicher Richtpreis aus dem Online-Konfigurator.')

  return lines.join('\n')
}
