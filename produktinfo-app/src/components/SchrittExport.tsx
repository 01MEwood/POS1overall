import { useState } from 'react';
import type { Auswahl, Betrieb, Projekt } from '../types';
import { CONTENT_STAND, gruppiertNachKategorie } from '../content';
import { hatFehler, pruefeVorExport } from '../lib/pruefung';
import { dokumentDateiname } from '../pdf/dateiname';

interface Props {
  betrieb: Betrieb;
  projekt: Projekt;
  auswahl: Auswahl;
  onProjektChange: (p: Projekt) => void;
  onZurueck: () => void;
  onZumProfil: () => void;
  onNeuesProjekt: () => void;
}

/** Schritt 3: Pflichtangaben-Check, Zusammenfassung, PDF-/Word-Download. */
export function SchrittExport({ betrieb, projekt, auswahl, onProjektChange, onZurueck, onZumProfil, onNeuesProjekt }: Props) {
  const [laeuft, setLaeuft] = useState<null | 'pdf' | 'docx' | 'json'>(null);
  const [fertigDatei, setFertigDatei] = useState<string | null>(null);
  const [exportFehler, setExportFehler] = useState('');

  const ergebnisse = pruefeVorExport(betrieb, projekt, auswahl);
  const blockiert = hatFehler(ergebnisse);
  const gruppen = gruppiertNachKategorie(auswahl.bausteinIds);

  function ladeHerunter(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  async function erzeuge(format: 'pdf' | 'docx' | 'json') {
    setLaeuft(format);
    setExportFehler('');
    setFertigDatei(null);
    try {
      // DPP-Modul erst bei Bedarf laden — hält den App-Start schnell.
      const dpp = await import('../dpp/datensatz');
      let blob: Blob;
      if (format === 'json') {
        const datensatz = dpp.baueDppDatensatz(betrieb, projekt, auswahl);
        blob = new Blob([JSON.stringify(datensatz, null, 2)], { type: 'application/json' });
      } else {
        const qrDataUrl = await dpp.erzeugeQrDataUrl(dpp.dppQrPayload(betrieb, projekt, auswahl));
        if (format === 'pdf') {
          const [{ pdf }, { ProduktinfoPdf }] = await Promise.all([import('@react-pdf/renderer'), import('../pdf/ProduktinfoPdf')]);
          blob = await pdf(<ProduktinfoPdf betrieb={betrieb} projekt={projekt} auswahl={auswahl} qrDataUrl={qrDataUrl} />).toBlob();
        } else {
          const { erzeugeDocxBlob } = await import('../word/ProduktinfoDocx');
          blob = await erzeugeDocxBlob(betrieb, projekt, auswahl, qrDataUrl);
        }
      }
      const name = dokumentDateiname(projekt, format);
      ladeHerunter(blob, name);
      setFertigDatei(name);
    } catch (err) {
      setExportFehler(err instanceof Error ? err.message : 'Dokument konnte nicht erzeugt werden.');
    } finally {
      setLaeuft(null);
    }
  }

  return (
    <section>
      <div className="karte">
        <h2>Prüfen und Dokument erzeugen</h2>

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
        {ergebnisse.length === 0 && <p className="pruef-ok">✅ Alle Pflichtangaben vollständig — das Dokument ist übergabefertig.</p>}

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
          <div>
            <span className="klein">DPP-Kennung</span>
            <strong title={projekt.dppId}>{projekt.dppId.slice(0, 8)}…</strong>
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
            <button
              type="button"
              className="sekundaer"
              onClick={() => erzeuge('json')}
              disabled={laeuft !== null || blockiert}
              title={blockiert ? 'Bitte zuerst die rot markierten Punkte beheben' : 'Maschinenlesbarer Datensatz nach den DPP-Inhaltskategorien (ESPR/CPR) — zum Auftrag archivieren'}
            >
              {laeuft === 'json' ? 'Erzeuge Datensatz …' : '🧾 DPP-Datensatz (.json)'}
            </button>
            <button
              type="button"
              className="sekundaer"
              onClick={() => erzeuge('docx')}
              disabled={laeuft !== null || blockiert}
              title={blockiert ? 'Bitte zuerst die rot markierten Punkte beheben' : 'Editierbare Word-Fassung — fürs Archiv/die Übergabe besser das PDF verwenden'}
            >
              {laeuft === 'docx' ? 'Erzeuge Word …' : '📝 Word (.docx)'}
            </button>
            <button
              type="button"
              onClick={() => erzeuge('pdf')}
              disabled={laeuft !== null || blockiert}
              title={blockiert ? 'Bitte zuerst die rot markierten Punkte beheben' : undefined}
            >
              {laeuft === 'pdf' ? 'Erzeuge PDF …' : blockiert ? 'PDF (Pflichtangaben fehlen)' : '📄 Individuelles PDF erzeugen'}
            </button>
          </div>
        </div>
        <p className="klein" style={{ marginTop: 8 }}>
          Tipp: Das PDF ist das Leitformat für Übergabe und Archiv (nicht editierbar) — mit QR-Code, der die
          Produktangaben maschinenlesbar enthält (DPP-ready). Die Word-Datei eignet sich zum Weiterbearbeiten, der
          DPP-Datensatz (.json) ist die strukturierte Fassung für den künftigen Digitalen Produktpass (ESPR/CPR).
        </p>
      </div>
    </section>
  );
}
