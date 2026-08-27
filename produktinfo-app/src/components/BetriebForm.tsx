import { useRef, useState } from 'react';
import type { Betrieb } from '../types';
import { dateiZuDataUrl } from '../lib/bild';

interface Props {
  betrieb: Betrieb;
  onChange: (b: Betrieb) => void;
  onFertig: () => void;
}

/**
 * Betriebsprofil: einmal ausfüllen, gilt für jedes PDF.
 * Name, Postanschrift und E-Mail sind GPSR-Pflichtangaben.
 */
export function BetriebForm({ betrieb, onChange, onFertig }: Props) {
  const dateiRef = useRef<HTMLInputElement>(null);
  const [fehler, setFehler] = useState('');

  const feld = (key: keyof Betrieb) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...betrieb, [key]: e.target.value });

  async function logoWaehlen(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    if (!datei) return;
    setFehler('');
    try {
      const dataUrl = await dateiZuDataUrl(datei, 600);
      onChange({ ...betrieb, logoDataUrl: dataUrl });
    } catch (err) {
      setFehler(err instanceof Error ? err.message : 'Logo konnte nicht geladen werden.');
    } finally {
      e.target.value = '';
    }
  }

  const pflichtOk = betrieb.firmenname.trim() && betrieb.strasse.trim() && betrieb.plzOrt.trim() && betrieb.email.trim();

  return (
    <section className="karte">
      <h2>Ihr Betrieb</h2>
      <p className="hinweis">
        Einmal ausfüllen — erscheint auf jedem PDF. Name, Postanschrift und E-Mail sind Pflichtangaben nach der
        EU-Produktsicherheitsverordnung (GPSR). Alle Daten bleiben lokal auf diesem Gerät.
      </p>

      <div className="logo-zeile">
        <div className="logo-vorschau" onClick={() => dateiRef.current?.click()} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && dateiRef.current?.click()}>
          {betrieb.logoDataUrl ? <img src={betrieb.logoDataUrl} alt="Logo" /> : <span>Logo<br />hochladen</span>}
        </div>
        <div className="logo-aktionen">
          <button type="button" className="sekundaer" onClick={() => dateiRef.current?.click()}>
            {betrieb.logoDataUrl ? 'Logo ändern' : 'Logo hochladen (PNG/JPG)'}
          </button>
          {betrieb.logoDataUrl && (
            <button type="button" className="sekundaer" onClick={() => onChange({ ...betrieb, logoDataUrl: null })}>
              Logo entfernen
            </button>
          )}
          <input ref={dateiRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={logoWaehlen} />
        </div>
      </div>
      {fehler && <p className="fehler-text">{fehler}</p>}

      <div className="formular-raster">
        <label>Firmenname *<input value={betrieb.firmenname} onChange={feld('firmenname')} placeholder="Schreinerei Muster GmbH" /></label>
        <label>Inhaber/in<input value={betrieb.inhaber} onChange={feld('inhaber')} placeholder="Max Muster" /></label>
        <label>Straße und Hausnummer *<input value={betrieb.strasse} onChange={feld('strasse')} placeholder="Werkstattweg 1" /></label>
        <label>PLZ und Ort *<input value={betrieb.plzOrt} onChange={feld('plzOrt')} placeholder="88453 Erolzheim" /></label>
        <label>Telefon<input value={betrieb.telefon} onChange={feld('telefon')} placeholder="07354 000000" /></label>
        <label>E-Mail * <span className="klein">(GPSR: elektronische Adresse)</span><input type="email" value={betrieb.email} onChange={feld('email')} placeholder="info@schreinerei-muster.de" /></label>
        <label>Website<input value={betrieb.website} onChange={feld('website')} placeholder="www.schreinerei-muster.de" /></label>
        <label>Zusatz (z. B. HRB, USt-IdNr.)<input value={betrieb.zusatz} onChange={feld('zusatz')} placeholder="optional" /></label>
      </div>

      <div className="aktionen">
        <button type="button" onClick={onFertig} disabled={!pflichtOk}>
          {pflichtOk ? 'Speichern und weiter' : 'Bitte Pflichtfelder (*) ausfüllen'}
        </button>
      </div>
    </section>
  );
}
