// Transparente Preisberechnung für den finverk PAX-Konfigurator.
// Liefert eine nachvollziehbare Positionsliste (netto) plus MwSt und Brutto.

import { getColor, getHandle, getMaterial, PRICING } from '../data/catalog'
import type { WardrobeConfig } from '../types'
import { deriveMeasures } from './geometry'

export interface PriceLine {
  key: string
  label: string
  detail?: string
  amount: number // Netto €
}

export interface PriceResult {
  lines: PriceLine[]
  netto: number
  mwst: number
  brutto: number
  totalDoors: number
  frontAreaM2: number
}

const cm2m = (cm: number) => cm / 100

export function calculatePrice(config: WardrobeConfig): PriceResult {
  const material = getMaterial(config.materialId)
  const color = getColor(config.materialId, config.colorId)
  const handle = getHandle(config.handleId)
  const m = deriveMeasures(config)

  const heightM = cm2m(config.height)

  // --- Fronten der Hauptelemente -----------------------------------------
  let frontArea = 0
  let doors = 0
  for (const el of config.elements) {
    frontArea += cm2m(el.width) * heightM
    doors += el.doors
  }
  const frontCost = frontArea * material.pricePerM2

  const lines: PriceLine[] = []
  lines.push({
    key: 'fronten',
    label: 'Fronten (Türen)',
    detail: `${material.name} · ${color.name} · ${frontArea.toFixed(2)} m²`,
    amount: frontCost,
  })

  // --- Aufsatzschränke ----------------------------------------------------
  let aufsatzFrontArea = 0
  if (m.aufsatzHeight > 0) {
    const aufsatzHeightM = cm2m(m.aufsatzHeight)
    let aufsatzCost = 0
    for (const el of config.elements) {
      const area = cm2m(el.width) * aufsatzHeightM
      aufsatzFrontArea += area
      // Front + Korpusaufschlag + je 1 Tür Beschlag + Griff
      aufsatzCost += area * material.pricePerM2
      aufsatzCost += area * PRICING.aufsatzKorpusProM2
      aufsatzCost += PRICING.beschlagProTuer
      aufsatzCost += handle.pricePerDoor
      doors += 1
    }
    lines.push({
      key: 'aufsatz',
      label: `Aufsatzschränke (${config.elements.length}×)`,
      detail: `Höhe ${Math.round(m.aufsatzHeight)} cm · inkl. Front, Korpus & Beschlag`,
      amount: aufsatzCost,
    })
  }

  // --- Passstücke (Seiten + Deckenblende) --------------------------------
  const sideArea = cm2m(config.fillerLeft + config.fillerRight) * heightM
  const blendeArea = m.blendeHeight > 0 ? cm2m(m.totalWidth) * cm2m(m.blendeHeight) : 0
  const passArea = sideArea + blendeArea
  if (passArea > 0) {
    const parts: string[] = []
    if (sideArea > 0) {
      parts.push(`Seiten ${config.fillerLeft > 0 ? `L ${config.fillerLeft}` : ''}${config.fillerLeft > 0 && config.fillerRight > 0 ? ' / ' : ''}${config.fillerRight > 0 ? `R ${config.fillerRight}` : ''} cm`)
    }
    if (blendeArea > 0) parts.push(`Deckenblende ${Math.round(m.blendeHeight)} cm`)
    lines.push({
      key: 'passstuecke',
      label: 'Passstücke',
      detail: `${parts.join(' · ')} · ${passArea.toFixed(2)} m²`,
      amount: passArea * PRICING.passstueckProM2,
    })
  }

  // --- Beschläge (Softclose) der Hauptelemente ---------------------------
  const mainDoors = config.elements.reduce((s, el) => s + el.doors, 0)
  lines.push({
    key: 'beschlaege',
    label: 'Beschläge (Softclose)',
    detail: `${mainDoors} Tür${mainDoors === 1 ? '' : 'en'} × ${PRICING.beschlagProTuer} €`,
    amount: mainDoors * PRICING.beschlagProTuer,
  })

  // --- Griffe der Hauptelemente ------------------------------------------
  lines.push({
    key: 'griffe',
    label: `Griffe · ${handle.name}`,
    detail: `${mainDoors} × ${handle.pricePerDoor} €`,
    amount: mainDoors * handle.pricePerDoor,
  })

  // --- Lieferung ----------------------------------------------------------
  if (config.delivery === 'lieferung') {
    const fee = PRICING.lieferung[config.plzZone]
    lines.push({
      key: 'lieferung',
      label: 'Lieferung',
      detail: 'durch das finverk-Team',
      amount: fee,
    })
  }

  // --- Montage (optional) -------------------------------------------------
  if (config.montage) {
    const montage =
      PRICING.montageBasis +
      PRICING.montageProElement * config.elements.length +
      PRICING.montageProAufsatz * m.aufsatzCount
    lines.push({
      key: 'montage',
      label: 'Montage',
      detail: `Basis + ${config.elements.length} Elemente${m.aufsatzCount ? ` + ${m.aufsatzCount} Aufsätze` : ''}`,
      amount: montage,
    })
  }

  const netto = lines.reduce((s, l) => s + l.amount, 0)
  const mwst = netto * PRICING.mwstSatz
  const brutto = netto + mwst

  return {
    lines,
    netto,
    mwst,
    brutto,
    totalDoors: doors,
    frontAreaM2: frontArea + aufsatzFrontArea,
  }
}
