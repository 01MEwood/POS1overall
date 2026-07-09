// Live-Preisübersicht mit Positionsliste und CTA.

import { useMemo } from 'react'
import { deriveMeasures } from '../pricing/geometry'
import { calculatePrice } from '../pricing/pricing'
import { useConfig } from '../state/store'
import { formatEuro } from '../util/format'

export function PriceSummary({ onRequestQuote }: { onRequestQuote: () => void }) {
  const config = useConfig((s) => s.config)
  const price = useMemo(() => calculatePrice(config), [config])
  const m = useMemo(() => deriveMeasures(config), [config])

  return (
    <div className="summary">
      <div className="summary__stats">
        <Stat label="Breite" value={`${m.totalWidth} cm`} />
        <Stat label="Höhe" value={`${m.totalHeight} cm`} />
        <Stat label="Türen" value={`${price.totalDoors}`} />
        <Stat label="Frontfläche" value={`${price.frontAreaM2.toFixed(2)} m²`} />
      </div>

      <ul className="summary__lines">
        {price.lines.map((l) => (
          <li key={l.key} className="summary__line">
            <span className="summary__line-label">
              {l.label}
              {l.detail && <span className="summary__line-detail">{l.detail}</span>}
            </span>
            <span className="summary__line-amount">{formatEuro(l.amount)}</span>
          </li>
        ))}
      </ul>

      <div className="summary__totals">
        <div className="summary__row">
          <span>Netto</span>
          <span>{formatEuro(price.netto)}</span>
        </div>
        <div className="summary__row summary__row--muted">
          <span>zzgl. 19 % MwSt.</span>
          <span>{formatEuro(price.mwst)}</span>
        </div>
        <div className="summary__row summary__row--total">
          <span>Gesamt</span>
          <span>{formatEuro(price.brutto)}</span>
        </div>
      </div>

      <button type="button" className="cta" onClick={onRequestQuote}>
        Angebot anfordern
      </button>
      <p className="summary__note">
        Unverbindlicher Richtpreis aus dem Konfigurator · inkl. MwSt.
      </p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  )
}
