import { useEffect, useState } from 'react';
import type { Betrieb, Projekt } from '../types';

/**
 * Alle Daten bleiben lokal im Browser (localStorage) — keine Cloud, kein Konto.
 * Das hält die App DSGVO-freundlich: Kundendaten verlassen den Rechner nicht.
 */

const PREFIX = 'produktinfo.';

export function ladeJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as T) };
  } catch {
    return fallback;
  }
}

export function speichereJson<T>(key: string, wert: T): boolean {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(wert));
    return true;
  } catch {
    // z. B. QuotaExceeded bei sehr großen Logos/Fotos
    return false;
  }
}

/** useState mit automatischer localStorage-Persistenz. */
export function usePersistent<T>(key: string, fallback: T): [T, (wert: T | ((alt: T) => T)) => void] {
  const [wert, setWert] = useState<T>(() => ladeJson(key, fallback));
  useEffect(() => {
    speichereJson(key, wert);
  }, [key, wert]);
  return [wert, setWert];
}

export const LEERER_BETRIEB: Betrieb = {
  firmenname: '',
  inhaber: '',
  strasse: '',
  plzOrt: '',
  telefon: '',
  email: '',
  website: '',
  zusatz: '',
  logoDataUrl: null,
};

export function leeresProjekt(): Projekt {
  return {
    produktTyp: 'moebel_frei',
    kundeName: '',
    kundeAdresse: '',
    bauvorhaben: '',
    produktBezeichnung: '',
    auftragsnummer: '',
    dopNummer: '',
    mitUebergabebestaetigung: true,
    uebergabeDatum: new Date().toISOString().slice(0, 10),
    fotoDataUrl: null,
    freitext: '',
  };
}
