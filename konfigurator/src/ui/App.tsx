import { useState } from 'react'
import { Scene } from '../three/Scene'
import { ConfiguratorPanel } from './ConfiguratorPanel'
import { PriceSummary } from './PriceSummary'
import { QuoteDialog } from './QuoteDialog'

function Logo() {
  return (
    <svg className="brand__mark" viewBox="0 0 32 32" aria-hidden>
      <rect x="5" y="3.5" width="22" height="25" rx="3.2" className="brand__mark-body" />
      <line x1="16" y1="4.5" x2="16" y2="27.5" className="brand__mark-line" />
      <circle cx="13.4" cy="16" r="1.15" className="brand__mark-dot" />
      <circle cx="18.6" cy="16" r="1.15" className="brand__mark-dot" />
    </svg>
  )
}

export function App() {
  const [quoteOpen, setQuoteOpen] = useState(false)

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Logo />
          <div className="brand__text">
            <span className="brand__name">finverk</span>
            <span className="brand__sub">PAX-Konfigurator</span>
          </div>
        </div>
        <div className="topbar__badge">
          <span className="dot" />
          Großraum Stuttgart · Lieferung &amp; optionale Montage
        </div>
      </header>

      <main className="workspace">
        <section className="viewer">
          <Scene />
          <div className="viewer__hint">Ziehen zum Drehen · Scrollen zum Zoomen</div>
          <div className="viewer__wm">finverk · maßgefertigt für IKEA PAX</div>
        </section>

        <aside className="sidebar">
          <div className="sidebar__scroll">
            <ConfiguratorPanel />
          </div>
          <div className="sidebar__footer">
            <PriceSummary onRequestQuote={() => setQuoteOpen(true)} />
          </div>
        </aside>
      </main>

      {quoteOpen && <QuoteDialog onClose={() => setQuoteOpen(false)} />}
    </div>
  )
}
