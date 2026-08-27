import { useMemo, useState } from 'react';
import type { Auswahl, Baustein, ProduktTypId } from '../types';
import { ALLE_BAUSTEINE, KATEGORIEN, istPflicht, istRelevant, istStandard, vorauswahlFuer } from '../content';
import { absaetzeZuText, textZuAbsaetze } from '../lib/absatzText';

interface Props {
  produktTyp: ProduktTypId;
  auswahl: Auswahl;
  onChange: (a: Auswahl) => void;
  onZurueck: () => void;
  onWeiter: () => void;
}

/**
 * Schritt 2: Vorausgewählte Bausteine prüfen, zu- oder abwählen und
 * bei Bedarf einzelne Texte für diesen Auftrag anpassen.
 */
export function SchrittBausteine({ produktTyp, auswahl, onChange, onZurueck, onWeiter }: Props) {
  const [offenId, setOffenId] = useState<string | null>(null);
  const [zeigeWeitere, setZeigeWeitere] = useState(false);

  const gewaehlt = useMemo(() => new Set(auswahl.bausteinIds), [auswahl.bausteinIds]);

  function toggle(b: Baustein) {
    if (istPflicht(b, produktTyp)) return;
    const neu = new Set(gewaehlt);
    if (neu.has(b.id)) neu.delete(b.id);
    else neu.add(b.id);
    onChange({ ...auswahl, bausteinIds: ALLE_BAUSTEINE.filter((x) => neu.has(x.id)).map((x) => x.id) });
  }

  function textAendern(b: Baustein, text: string) {
    onChange({ ...auswahl, angepassteTexte: { ...auswahl.angepassteTexte, [b.id]: textZuAbsaetze(text) } });
  }

  function textZuruecksetzen(b: Baustein) {
    const kopie = { ...auswahl.angepassteTexte };
    delete kopie[b.id];
    onChange({ ...auswahl, angepassteTexte: kopie });
  }

  function aufStandard() {
    onChange({ bausteinIds: vorauswahlFuer(produktTyp), angepassteTexte: {} });
  }

  const anzahl = auswahl.bausteinIds.length;

  return (
    <section>
      <div className="karte">
        <div className="zeile-zwischen">
          <h2>Bausteine für dieses PDF</h2>
          <button type="button" className="sekundaer" onClick={aufStandard}>Auf Empfehlung zurücksetzen</button>
        </div>
        <p className="hinweis">
          <strong>{anzahl} Bausteine</strong> ausgewählt. Pflichtbausteine (🔒 Sicherheit/Recht) sind fest enthalten.
          Klicken Sie auf einen Titel, um den Text zu lesen oder für diesen Auftrag anzupassen.
        </p>

        {KATEGORIEN.map((kat) => {
          const inKategorie = ALLE_BAUSTEINE.filter((b) => b.kategorie === kat.id && istRelevant(b, produktTyp));
          const sichtbar = inKategorie.filter((b) => zeigeWeitere || istStandard(b, produktTyp) || gewaehlt.has(b.id));
          if (sichtbar.length === 0) return null;
          return (
            <div key={kat.id} className="kategorie-block">
              <h3>{kat.titel}</h3>
              {sichtbar.map((b) => {
                const pflicht = istPflicht(b, produktTyp);
                const aktiv = gewaehlt.has(b.id);
                const offen = offenId === b.id;
                const angepasst = b.id in auswahl.angepassteTexte;
                return (
                  <div key={b.id} className={`baustein ${aktiv ? 'aktiv' : ''}`}>
                    <div className="baustein-kopf">
                      <input
                        type="checkbox"
                        id={`bs-${b.id}`}
                        checked={aktiv}
                        disabled={pflicht}
                        onChange={() => toggle(b)}
                        title={pflicht ? 'Pflichtbaustein für diesen Produkttyp' : undefined}
                      />
                      <button type="button" className="baustein-titel" onClick={() => setOffenId(offen ? null : b.id)}>
                        {b.titel} {pflicht && <span title="Pflichtbaustein (Sicherheit/Recht)">🔒</span>}
                        {angepasst && <span className="marke-angepasst">angepasst</span>}
                      </button>
                      <span className="baustein-pfeil">{offen ? '▴' : '▾'}</span>
                    </div>
                    {offen && (
                      <div className="baustein-detail">
                        {b.rechtsbezug && <p className="rechtsbezug">Hintergrund (wird nicht gedruckt): {b.rechtsbezug}</p>}
                        <textarea
                          rows={Math.min(14, Math.max(5, absaetzeZuText(auswahl.angepassteTexte[b.id] ?? b.absaetze).split('\n').length + 1))}
                          value={absaetzeZuText(auswahl.angepassteTexte[b.id] ?? b.absaetze)}
                          onChange={(e) => textAendern(b, e.target.value)}
                        />
                        <div className="baustein-detail-fuss">
                          <span className="klein">Aufzählungen mit „- “ beginnen, Warnhinweise mit „! “. Leerzeile = neuer Absatz.</span>
                          {angepasst && (
                            <button type="button" className="sekundaer" onClick={() => textZuruecksetzen(b)}>Original wiederherstellen</button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        <button type="button" className="sekundaer volle-breite" onClick={() => setZeigeWeitere(!zeigeWeitere)}>
          {zeigeWeitere ? 'Weitere Bausteine ausblenden' : 'Weitere passende Bausteine anzeigen (Materialien, Holzarten, Oberflächen …)'}
        </button>

        <div className="aktionen zeile-zwischen">
          <button type="button" className="sekundaer" onClick={onZurueck}>← Zurück</button>
          <button type="button" onClick={onWeiter}>Weiter: PDF erzeugen →</button>
        </div>
      </div>
    </section>
  );
}
