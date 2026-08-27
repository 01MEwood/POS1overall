import type { Projekt } from '../types';

/** Dateiname für den Download, z. B. Produktinformation_Einbauschrank_Mueller_2026-08-27.pdf */
export function pdfDateiname(projekt: Projekt): string {
  const teil = (t: string) =>
    t
      .trim()
      .replace(/[äÄ]/g, 'ae')
      .replace(/[öÖ]/g, 'oe')
      .replace(/[üÜ]/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-zA-Z0-9-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40);
  const teile = ['Produktinformation', teil(projekt.produktBezeichnung), teil(projekt.kundeName), projekt.uebergabeDatum].filter(
    Boolean
  );
  return `${teile.join('_')}.pdf`;
}
