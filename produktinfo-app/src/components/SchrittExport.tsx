import { useState } from 'react';
import type { Auswahl, Betrieb, Projekt } from '../types';
import { CONTENT_STAND, gruppiertNachKategorie } from '../content';
import { hatFehler, pruefeVorExport } from '../lib/pruefung';
import { pdfDateiname } from '../pdf/dateiname';

interface Props {
  betrieb: Betrieb;
  projekt: Projekt;
  auswahl: Auswahl;
  onProjektChange: (p: Projekt) => void;
  onZurueck: () => void;
  onZumProfil: () => void;
  onNeuesProjekt: () => void;
}

/** Schritt 3: Pflichtangaben-Check, Zusammenfassung, PDF-Download. */
export function SchrittExport({ betrieb, projekt, auswahl, onProjektChange, onZurueck, onZumProfil, onNeuesProjekt }: Props) {
  const [laeuft, setLaeuft] = useState(false);
  const [fertigDatei, setFertigDatei] = useState<string | null>(null);
  const [exportFehler, setExportFehler] = useState('');

  const ergebnisse = pruefeVorExport(betrieb, projekt, auswahl);
  const blockiert = hatFehler(ergebnisse);
  const gruppen = gruppiertNachKategorie(auswahl.bausteinIds);

  async function erzeugePdf() {
    setLaeuft(true);
    setExportFehler('');
    setFertigDatei(null);
    try {
      // PDF-Renderer erst bei Bedarf laden — hält den App-Start schnell.
      const [{ pdf }, { ProduktinfoPdf }] = await Promise.all([import('@react-pdf/renderer'), import('../pdf/ProduktinfoPdf')]);
      const blob = await pdf(<ProduktinfoPdf betrieb={betrieb} projekt={projekt} auswahl={auswahl} />).toBlob();
      const name = pdfDateiname(projekt);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setFertigDatei(name);
    } catch (err) {
      setExportFehler(err instanceof Error ? err.message : 'PDF konnte nicht erzeugt werden.');
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <section>
      <div className="karte">
        <h2>Prüfen und PDF erzeugen</h2>

        {ergebnisse.length > 0 && (
          <ul className="pruef-liste">
            {ergebnisse.map((e, i) => (
              <li key={i} className={e.stufe === 'fehler' ? 'pruef-fehler' : 'pruef-warnung'}>
                {e.stufe === 'fehler' ? '⛔' : '⚠️'} {e.text}
                {e.text.includes('Betriebsprofil') || e.text.includes('elektronische') || e.text.includes('Postanschrift') ? (
                  <button type="button" className="link-knopf" onClick={onZumProfil}>Betriebsprofil öffnen</button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {ergebnisse.length === 0 && <p className="pruef-ok">✅ Alle Pflichtangaben vollständig — das PDF ist übergabefertig.</p>}

        <div className="zusammenfassung">
          <div>
            <span className="klein">Produkt</span>
            <strong>{projekt.produktBezeichnung || '—'}</strong>
          </div>
          <div>
            <span className="klein">Kunde</span>
            <strong>{projekt.kundeName || '—'}</strong>
          </div>
          <div>
            <span className="klein">Inhalt</span>
            <strong>{gruppen.reduce((n, g) => n + g.bausteine.length, 0)} Bausteine in {gruppen.length} Kapiteln</strong>
          </div>
          <div>
            <span className="klein">Inhaltsstand</span>
            <strong>{CONTENT_STAND}</strong>
          </div>
        </div>

        <label className="schalter">
          <input
            type="checkbox"
            checked={projekt.mitUebergabebestaetigung}
            onChange={(e) => onProjektChange({ ...projekt, mitUebergabebestaetigung: e.target.checked })}
          />
          Übergabebestätigung mit Unterschriftenfeldern anhängen (empfohlen — Nachweis der Instruktion)
        </label>

        {exportFehler && <p className="fehler-text">{exportFehler}</p>}
        {fertigDatei && (
          <p className="pruef-ok">
            ✅ <strong>{fertigDatei}</strong> wurde heruntergeladen. Ausdrucken oder dem Kunden digital übergeben — und eine
            Kopie zum Auftrag archivieren (Nachweis, Aufbewahrung 10 Jahre empfohlen).
          </p>
        )}

        <div className="aktionen zeile-zwischen">
          <button type="button" className="sekundaer" onClick={onZurueck}>← Zurück</button>
          <div className="aktionen-rechts">
            {fertigDatei && (
              <button type="button" className="sekundaer" onClick={onNeuesProjekt}>Nächster Auftrag</button>
            )}
            <button type="button" onClick={erzeugePdf} disabled={laeuft || blockiert} title={blockiert ? 'Bitte zuerst die rot markierten Punkte beheben' : undefined}>
              {laeuft ? 'Erzeuge PDF …' : blockiert ? 'PDF (Pflichtangaben fehlen)' : '📄 Individuelles PDF erzeugen'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
