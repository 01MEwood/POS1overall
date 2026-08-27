import type { Baustein, KategorieId, ProduktTypId } from '../types';
import { BASIS_BAUSTEINE } from './basis';
import { SICHERHEIT_BAUSTEINE } from './sicherheit';
import { PRODUKT_BAUSTEINE } from './produkte';
import { MATERIAL_BAUSTEINE } from './materialien';
import { OBERFLAECHEN_BAUSTEINE } from './oberflaechen';
import { PFLEGE_BAUSTEINE } from './pflege';
import { KATEGORIEN } from './meta';

export { CONTENT_STAND, CONTENT_HINWEIS, KATEGORIEN, PRODUKT_TYPEN } from './meta';

/** Vollständige, geordnete Bibliothek aller Textbausteine. */
export const ALLE_BAUSTEINE: Baustein[] = [
  ...BASIS_BAUSTEINE,
  ...SICHERHEIT_BAUSTEINE,
  ...PRODUKT_BAUSTEINE,
  ...MATERIAL_BAUSTEINE,
  ...OBERFLAECHEN_BAUSTEINE,
  ...PFLEGE_BAUSTEINE,
];

const BAUSTEIN_MAP = new Map(ALLE_BAUSTEINE.map((b) => [b.id, b]));

export function bausteinById(id: string): Baustein | undefined {
  return BAUSTEIN_MAP.get(id);
}

/** Ist der Baustein für den Produkttyp Pflicht (nicht abwählbar)? */
export function istPflicht(b: Baustein, typ: ProduktTypId): boolean {
  return typ !== 'individuell' && (b.pflichtFuer?.includes(typ) ?? false);
}

/** Ist der Baustein für den Produkttyp vorausgewählt? */
export function istStandard(b: Baustein, typ: ProduktTypId): boolean {
  return istPflicht(b, typ) || (b.standardFuer?.includes(typ) ?? false);
}

/** Wird der Baustein für den Produkttyp überhaupt angeboten (sichtbar)? */
export function istRelevant(b: Baustein, typ: ProduktTypId): boolean {
  if (typ === 'individuell') return true;
  return istStandard(b, typ) || (b.relevantFuer?.includes(typ) ?? false);
}

/** Voreinstellung der Auswahl beim Wechsel des Produkttyps. */
export function vorauswahlFuer(typ: ProduktTypId): string[] {
  return ALLE_BAUSTEINE.filter((b) => istStandard(b, typ)).map((b) => b.id);
}

/** Bausteine einer Kategorie in Bibliotheks-Reihenfolge. */
export function bausteineNachKategorie(kategorie: KategorieId): Baustein[] {
  return ALLE_BAUSTEINE.filter((b) => b.kategorie === kategorie);
}

/** Gewählte Bausteine, gruppiert nach Kategorien (für Vorschau und PDF). */
export function gruppiertNachKategorie(bausteinIds: string[]): { kategorie: (typeof KATEGORIEN)[number]; bausteine: Baustein[] }[] {
  const idSet = new Set(bausteinIds);
  return KATEGORIEN.map((kategorie) => ({
    kategorie,
    bausteine: ALLE_BAUSTEINE.filter((b) => b.kategorie === kategorie.id && idSet.has(b.id)),
  })).filter((g) => g.bausteine.length > 0);
}

/** Anzahl Monate zwischen Content-Stand (yyyy-mm) und heute — für die Aktualitätswarnung. */
export function contentAlterMonate(stand: string, heute: Date = new Date()): number {
  const [jahr, monat] = stand.split('-').map((n) => Number.parseInt(n, 10));
  if (!jahr || !monat) return 0;
  return (heute.getFullYear() - jahr) * 12 + (heute.getMonth() + 1 - monat);
}
