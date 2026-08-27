import type { Absatz } from '../types';

/**
 * Umwandlung Absatz-Struktur ⇄ einfacher Text für die Bearbeitung im Textfeld.
 *
 * Regeln:
 *  - Zeilen mit "- " am Anfang werden zu Aufzählungspunkten.
 *  - Zeilen mit "! " am Anfang werden zu Warnhinweisen (Box im PDF).
 *  - Leerzeilen trennen Absätze.
 */
export function absaetzeZuText(absaetze: Absatz[]): string {
  return absaetze
    .map((a) => {
      if (a.art === 'liste') return a.punkte.map((p) => `- ${p}`).join('\n');
      if (a.art === 'warnung') return `! ${a.text}`;
      return a.text;
    })
    .join('\n\n');
}

export function textZuAbsaetze(text: string): Absatz[] {
  const bloecke = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const absaetze: Absatz[] = [];
  for (const block of bloecke) {
    const zeilen = block.split('\n').map((z) => z.trim()).filter(Boolean);
    const istListe = zeilen.every((z) => z.startsWith('- '));
    if (istListe && zeilen.length > 0) {
      absaetze.push({ art: 'liste', punkte: zeilen.map((z) => z.slice(2).trim()) });
      continue;
    }
    for (const zeile of zeilen.length > 1 ? [zeilen.join(' ')] : zeilen) {
      if (zeile.startsWith('! ')) {
        absaetze.push({ art: 'warnung', text: zeile.slice(2).trim() });
      } else {
        absaetze.push({ art: 'text', text: zeile });
      }
    }
  }
  return absaetze.length > 0 ? absaetze : [{ art: 'text', text: '' }];
}
