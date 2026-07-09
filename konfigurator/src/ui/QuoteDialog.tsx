// Modaler Dialog: Angebot anfordern. Erzeugt eine E-Mail-Anfrage mit der
// kompletten Konfiguration (ohne Backend – per mailto und Kopier-Funktion).

import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { calculatePrice } from '../pricing/pricing'
import { useConfig } from '../state/store'
import { formatEuro } from '../util/format'
import { buildSpecSummary } from '../util/summary'

const CONTACT_EMAIL = 'anfrage@finverk.de'

export function QuoteDialog({ onClose }: { onClose: () => void }) {
  const config = useConfig((s) => s.config)
  const price = useMemo(() => calculatePrice(config), [config])
  const spec = useMemo(() => buildSpecSummary(config, price), [config, price])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [ort, setOrt] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  function buildBody() {
    return [
      'Guten Tag,',
      '',
      'ich interessiere mich für folgende finverk-Konfiguration und bitte um ein Angebot:',
      '',
      spec,
      '',
      '— Kontaktdaten —',
      `Name:      ${name || '-'}`,
      `E-Mail:    ${email || '-'}`,
      `Telefon:   ${phone || '-'}`,
      `PLZ/Ort:   ${ort || '-'}`,
      '',
      'Nachricht:',
      message || '-',
    ].join('\n')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const subject = `finverk Anfrage – ${formatEuro(price.brutto, true)}`
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      buildBody(),
    )}`
    window.location.href = href
    setSent(true)
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(buildBody())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog__head">
          <h2>Angebot anfordern</h2>
          <button type="button" className="dialog__close" onClick={onClose} aria-label="Schließen">
            ✕
          </button>
        </div>

        {!sent ? (
          <form className="dialog__body" onSubmit={handleSubmit}>
            <p className="dialog__intro">
              Wir melden uns mit einem verbindlichen Festpreis inkl. Liefertermin – im Großraum
              Stuttgart und Süddeutschland.
            </p>

            <div className="form-grid">
              <label className="input">
                <span>Name*</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="input">
                <span>E-Mail*</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label className="input">
                <span>Telefon</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label className="input">
                <span>PLZ / Ort</span>
                <input value={ort} onChange={(e) => setOrt(e.target.value)} placeholder="z. B. 70173 Stuttgart" />
              </label>
            </div>
            <label className="input">
              <span>Nachricht</span>
              <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
            </label>

            <details className="spec">
              <summary>Ihre Konfiguration · {formatEuro(price.brutto, true)}</summary>
              <pre className="spec__pre">{spec}</pre>
            </details>

            <div className="dialog__actions">
              <button type="button" className="btn-ghost" onClick={copySummary}>
                {copied ? '✓ Kopiert' : 'Zusammenfassung kopieren'}
              </button>
              <button type="submit" className="cta">
                Anfrage per E-Mail senden
              </button>
            </div>
          </form>
        ) : (
          <div className="dialog__body dialog__body--center">
            <div className="success-check">✓</div>
            <h3>E-Mail vorbereitet</h3>
            <p className="dialog__intro">
              Ihr E-Mail-Programm sollte sich mit der fertigen Anfrage an{' '}
              <strong>{CONTACT_EMAIL}</strong> geöffnet haben. Falls nicht, kopieren Sie die
              Zusammenfassung und senden sie uns direkt.
            </p>
            <div className="dialog__actions">
              <button type="button" className="btn-ghost" onClick={copySummary}>
                {copied ? '✓ Kopiert' : 'Zusammenfassung kopieren'}
              </button>
              <button type="button" className="cta" onClick={onClose}>
                Schließen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
