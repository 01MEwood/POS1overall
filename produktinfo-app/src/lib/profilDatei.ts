import type { Betrieb } from '../types';
import { LEERER_BETRIEB } from './storage';

/**
 * Betriebsprofil als Datei sichern/laden — ohne jeden Server.
 * Die Datei enthält Firmendaten + Logo (DataURL) als JSON und kann auf
 * beliebig vielen Geräten wieder eingelesen werden (USB-Stick, Mail an
 * sich selbst, Betriebs-Ablage …).
 */

const DATEI_TYP = 'produktpass-betriebsprofil';
const DATEI_VERSION = 1;

export function profilAlsDatei(betrieb: Betrieb): { dateiname: string; inhalt: string } {
  const kurz = (betrieb.firmenname || 'Betrieb')
    .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-zA-Z0-9-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);
  return {
    dateiname: `ProduktPass_Profil_${kurz || 'Betrieb'}.json`,
    inhalt: JSON.stringify({ typ: DATEI_TYP, version: DATEI_VERSION, betrieb }, null, 2),
  };
}

export function profilAusDatei(inhalt: string): Betrieb {
  let roh: unknown;
  try {
    roh = JSON.parse(inhalt);
  } catch {
    throw new Error('Das ist keine gültige Profil-Datei (kein JSON).');
  }
  const obj = roh as { typ?: string; betrieb?: Partial<Betrieb> };
  if (obj.typ !== DATEI_TYP || !obj.betrieb || typeof obj.betrieb !== 'object') {
    throw new Error('Das ist keine ProduktPass-Profil-Datei.');
  }
  // Nur bekannte Felder übernehmen, fehlende mit Leerwerten auffüllen.
  const b = obj.betrieb;
  const profil: Betrieb = { ...LEERER_BETRIEB };
  for (const key of Object.keys(LEERER_BETRIEB) as (keyof Betrieb)[]) {
    const wert = b[key];
    if (key === 'logoDataUrl') {
      profil.logoDataUrl = typeof wert === 'string' && wert.startsWith('data:image/') ? wert : null;
    } else if (typeof wert === 'string') {
      (profil[key] as string) = wert;
    }
  }
  if (!profil.firmenname.trim()) throw new Error('Profil-Datei ohne Firmennamen — bitte die richtige Datei wählen.');
  return profil;
}
