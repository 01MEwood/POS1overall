// Kleine, wiederverwendbare UI-Bausteine für das Konfigurator-Panel.

import type { ReactNode } from 'react'

export function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section className="section">
      <div className="section__head">
        <h3 className="section__title">{title}</h3>
        {hint && <span className="section__hint">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

export function Chip({
  active,
  onClick,
  children,
  title,
  disabled,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  title?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      className={`chip${active ? ' chip--on' : ''}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

export function Swatch({
  active,
  color,
  onClick,
  label,
}: {
  active: boolean
  color: string
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      className={`swatch${active ? ' swatch--on' : ''}`}
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
    >
      <span className="swatch__dot" style={{ background: color }} />
      <span className="swatch__label">{label}</span>
    </button>
  )
}

export function Stepper({
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v))
  return (
    <div className="stepper">
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(clamp(value - step))}
        disabled={value <= min}
        aria-label="verringern"
      >
        −
      </button>
      <span className="stepper__value">
        {value}
        {unit && <span className="stepper__unit">{unit}</span>}
      </span>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(clamp(value + step))}
        disabled={value >= max}
        aria-label="erhöhen"
      >
        +
      </button>
    </div>
  )
}
