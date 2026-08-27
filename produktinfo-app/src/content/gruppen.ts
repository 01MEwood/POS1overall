import type { ProduktTypId } from '../types';

/** Wiederverwendbare Produkttyp-Gruppen für die Baustein-Zuordnung. */

export const ALLE: ProduktTypId[] = [
  'moebel_frei',
  'einbaumoebel',
  'kueche',
  'tisch_stuhl',
  'bett',
  'kindermoebel',
  'arbeitsplatte',
  'innentuer',
  'haustuer',
  'fenster',
  'holzboden',
  'treppe',
  'wintergarten',
  'terrasse',
];

export const MOEBEL: ProduktTypId[] = [
  'moebel_frei',
  'einbaumoebel',
  'kueche',
  'tisch_stuhl',
  'bett',
  'kindermoebel',
];

export const INNENAUSBAU: ProduktTypId[] = [...MOEBEL, 'arbeitsplatte', 'innentuer', 'holzboden', 'treppe'];

export const BAUELEMENTE: ProduktTypId[] = ['innentuer', 'haustuer', 'fenster', 'wintergarten'];

export const AUSSEN: ProduktTypId[] = ['haustuer', 'fenster', 'wintergarten', 'terrasse'];

export const HOLZ_SICHTBAR: ProduktTypId[] = [...INNENAUSBAU, ...AUSSEN];
