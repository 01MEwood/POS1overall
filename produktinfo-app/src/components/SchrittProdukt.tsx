import { useRef, useState } from 'react';
import type { Projekt, ProduktTypId } from '../types';
import { PRODUKT_TYPEN } from '../content';
import { dateiZuDataUrl } from '../lib/bild';

interface Props {
  projekt: Projekt;
  onChange: (p: Projekt) => void;
  onTypChange: (typ: ProduktTypId) => void;
  onWeiter: () => void;
}

/** Schritt 1: Produkttyp wählen + Kunden-/Auftragsdaten erfassen. */
export function SchrittProdukt({ projekt, onChange, onTypChange, onWeiter }: Props) {
  const fotoRef = useRef<HTMLInputElement>(null);
  const [fehler, setFehler] = useState('');

  const feld = (key: keyof Projekt) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...projekt, [key]: e.target.value });

  async function fotoWaehlen(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    if (!datei) return;
    setFehler('');
    try {
      const dataUrl = await dateiZuDataUrl(datei, 1200);
      onChange({ ...projekt, fotoDataUrl: dataUrl });
    } catch (err) {
      setFehler(err instanceof Error ? err.message : 'Foto konnte nicht geladen werden.');
    } finally {
      e.target.value = '';
    }
  }

  const zeigeDop = projekt.produktTyp === 'fenster' || projekt.produktTyp === 'haustuer';

  return (
    <section>
      <div className="karte">
        <h2>Was übergeben Sie?</h2>
        <p className="hinweis">Die Auswahl stellt automatisch die passenden Textbausteine zusammen — Sie können sie im nächsten Schritt anpassen.</p>
        <div className="typ-raster">
          {PRODUKT_TYPEN.map((typ) => (
            <button
              key={typ.id}
              type="button"
              className={`typ-kachel ${projekt.produktTyp === typ.id ? 'aktiv' : ''}`}
              onClick={() => onTypChange(typ.id)}
            >
              <span className="typ-icon">{typ.icon}</span>
              <span className="typ-label">{typ.label}</span>
              <span className="typ-beschreibung">{typ.beschreibung}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="karte">
        <h2>Auftrag und Kunde</h2>
        <div className="formular-raster">
          <label>Produktbezeichnung *<input value={projekt.produktBezeichnung} onChange={feld('produktBezeichnung')} placeholder="z. B. Einbauschrank Flur, Eiche geölt" /></label>
          <label>Auftrags-/Kommissions-Nr. <span className="klein">(GPSR: Produktidentifikation)</span><input value={projekt.auftragsnummer} onChange={feld('auftragsnummer')} placeholder="z. B. 2026-0815" /></label>
          <label>Kunde (Name) *<input value={projekt.kundeName} onChange={feld('kundeName')} placeholder="Familie Beispiel" /></label>
          <label>Kunde (Adresse)<input value={projekt.kundeAdresse} onChange={feld('kundeAdresse')} placeholder="Musterstraße 2, 88453 Erolzheim" /></label>
          <label>Bauvorhaben / Objekt<input value={projekt.bauvorhaben} onChange={feld('bauvorhaben')} placeholder="z. B. Neubau EFH" /></label>
          <label>Übergabedatum<input type="date" value={projekt.uebergabeDatum} onChange={feld('uebergabeDatum')} /></label>
          {zeigeDop && (
            <label>Leistungserklärung (DoP) Nr. <span className="klein">(Pflicht bei Fenstern/Außentüren, CE)</span>
              <input value={projekt.dopNummer} onChange={feld('dopNummer')} placeholder="z. B. DoP-2026-014" />
            </label>
          )}
        </div>
        <label className="volle-breite">Persönliche Anmerkung (optional, erscheint auf dem Deckblatt)
          <textarea rows={2} value={projekt.freitext} onChange={feld('freitext')} placeholder="z. B. Vielen Dank für Ihren Auftrag! Bei Fragen sind wir jederzeit für Sie da." />
        </label>

        <div className="foto-zeile">
          {projekt.fotoDataUrl ? (
            <>
              <img className="foto-vorschau" src={projekt.fotoDataUrl} alt="Produktfoto" />
              <button type="button" className="sekundaer" onClick={() => onChange({ ...projekt, fotoDataUrl: null })}>Foto entfernen</button>
            </>
          ) : (
            <button type="button" className="sekundaer" onClick={() => fotoRef.current?.click()}>Produktfoto hinzufügen (optional)</button>
          )}
          <input ref={fotoRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={fotoWaehlen} />
        </div>
        {fehler && <p className="fehler-text">{fehler}</p>}

        <div className="aktionen">
          <button type="button" onClick={onWeiter} disabled={!projekt.produktBezeichnung.trim()}>
            Weiter: Bausteine prüfen →
          </button>
        </div>
      </div>
    </section>
  );
}
