import { useState } from 'react';
import type { Auswahl, Betrieb, Projekt, ProduktTypId } from './types';
import { CONTENT_STAND, contentAlterMonate, vorauswahlFuer } from './content';
import { LEERER_BETRIEB, leeresProjekt, usePersistent } from './lib/storage';
import { BetriebForm } from './components/BetriebForm';
import { SchrittProdukt } from './components/SchrittProdukt';
import { SchrittBausteine } from './components/SchrittBausteine';
import { SchrittExport } from './components/SchrittExport';

type Ansicht = 'profil' | 1 | 2 | 3;

const SCHRITTE: { nr: 1 | 2 | 3; label: string }[] = [
  { nr: 1, label: 'Produkt & Kunde' },
  { nr: 2, label: 'Bausteine' },
  { nr: 3, label: 'PDF' },
];

export default function App() {
  const [betrieb, setBetrieb] = usePersistent<Betrieb>('betrieb', LEERER_BETRIEB);
  const [projekt, setProjekt] = usePersistent<Projekt>('projekt', leeresProjekt());
  const [auswahl, setAuswahl] = usePersistent<Auswahl>('auswahl', {
    bausteinIds: vorauswahlFuer(leeresProjekt().produktTyp),
    angepassteTexte: {},
  });

  const profilVollstaendig = Boolean(
    betrieb.firmenname.trim() && betrieb.strasse.trim() && betrieb.plzOrt.trim() && betrieb.email.trim()
  );
  const [ansicht, setAnsicht] = useState<Ansicht>(profilVollstaendig ? 1 : 'profil');

  function typWechseln(typ: ProduktTypId) {
    if (typ === projekt.produktTyp) return;
    setProjekt({ ...projekt, produktTyp: typ, dopNummer: '' });
    setAuswahl({ bausteinIds: vorauswahlFuer(typ), angepassteTexte: {} });
  }

  function neuesProjekt() {
    const frisch = leeresProjekt();
    frisch.produktTyp = projekt.produktTyp;
    setProjekt(frisch);
    setAuswahl({ bausteinIds: vorauswahlFuer(frisch.produktTyp), angepassteTexte: {} });
    setAnsicht(1);
  }

  const contentAlter = contentAlterMonate(CONTENT_STAND);

  return (
    <div className="app">
      <header className="app-kopf">
        <div className="app-marke">
          <span className="app-logo">🪵</span>
          <div>
            <h1>ProduktPass</h1>
            <p>Produktinformationen für Ihre Kunden — in 3 Schritten zum PDF</p>
          </div>
        </div>
        <nav className="schritte" aria-label="Schritte">
          {SCHRITTE.map((s) => (
            <button
              key={s.nr}
              type="button"
              className={`schritt ${ansicht === s.nr ? 'aktiv' : ''}`}
              onClick={() => setAnsicht(s.nr)}
              disabled={!profilVollstaendig}
            >
              <span className="schritt-nr">{s.nr}</span> {s.label}
            </button>
          ))}
          <button
            type="button"
            className={`schritt profil-knopf ${ansicht === 'profil' ? 'aktiv' : ''}`}
            onClick={() => setAnsicht('profil')}
            title="Betriebsprofil (Logo und Firmendaten)"
          >
            ⚙️ Betrieb
          </button>
        </nav>
      </header>

      {contentAlter >= 12 && (
        <div className="content-warnung">
          ⚠️ Die Inhaltsbibliothek ist {contentAlter} Monate alt (Stand {CONTENT_STAND}). Bitte auf Rechtsänderungen prüfen —
          Anleitung: docs/inhalte-aktuell-halten.md
        </div>
      )}

      <main>
        {ansicht === 'profil' && (
          <BetriebForm betrieb={betrieb} onChange={setBetrieb} onFertig={() => setAnsicht(1)} />
        )}
        {ansicht === 1 && (
          <SchrittProdukt projekt={projekt} onChange={setProjekt} onTypChange={typWechseln} onWeiter={() => setAnsicht(2)} />
        )}
        {ansicht === 2 && (
          <SchrittBausteine
            produktTyp={projekt.produktTyp}
            auswahl={auswahl}
            onChange={setAuswahl}
            onZurueck={() => setAnsicht(1)}
            onWeiter={() => setAnsicht(3)}
          />
        )}
        {ansicht === 3 && (
          <SchrittExport
            betrieb={betrieb}
            projekt={projekt}
            auswahl={auswahl}
            onProjektChange={setProjekt}
            onZurueck={() => setAnsicht(2)}
            onZumProfil={() => setAnsicht('profil')}
            onNeuesProjekt={neuesProjekt}
          />
        )}
      </main>

      <footer className="app-fuss">
        <span>Inhalte: Stand {CONTENT_STAND} · basierend auf der Verbandsvorlage „Produktinformationen“ (TSD 2019-10), rechtlich aktualisiert</span>
        <span>Alle Daten bleiben lokal auf diesem Gerät (kein Server, DSGVO-freundlich)</span>
      </footer>
    </div>
  );
}
