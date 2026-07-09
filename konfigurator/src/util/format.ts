const euro = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const euroRound = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Währungsbetrag im deutschen Format, z. B. 1.234,56 €. */
export function formatEuro(value: number, round = false): string {
  return (round ? euroRound : euro).format(value)
}

const number = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatNumber(value: number): string {
  return number.format(value)
}
