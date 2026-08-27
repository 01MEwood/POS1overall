import type { Kategorie, ProduktTyp } from '../types';

/**
 * Versionsstand der Inhaltsbibliothek.
 * Bei jeder inhaltlichen Überarbeitung hochziehen — der Stand wird im PDF
 * gedruckt und die App warnt, wenn die Inhalte älter als 12 Monate sind.
 */
export const CONTENT_STAND = '2026-08';

export const CONTENT_HINWEIS =
  'Inhaltsbibliothek auf Basis der Verbandsvorlage „Produktinformationen“ (Tischler Schreiner Deutschland, 2019-10), ' +
  'überarbeitet und rechtlich aktualisiert (u. a. EU-Produktsicherheitsverordnung 2023/988, Kaufrechtsreform 2022).';

export const KATEGORIEN: Kategorie[] = [
  { id: 'basis', titel: 'Allgemeine Hinweise', reihenfolge: 1 },
  { id: 'sicherheit', titel: 'Sicherheits- und Warnhinweise', reihenfolge: 2 },
  { id: 'produkt', titel: 'Gebrauchshinweise zu Ihrem Produkt', reihenfolge: 3 },
  { id: 'material', titel: 'Verwendete Materialien', reihenfolge: 4 },
  { id: 'oberflaeche', titel: 'Oberflächenbehandlung', reihenfolge: 5 },
  { id: 'pflege', titel: 'Pflege und Wartung', reihenfolge: 6 },
  { id: 'abschluss', titel: 'Service, Rücknahme und Unterlagen', reihenfolge: 7 },
];

export const PRODUKT_TYPEN: ProduktTyp[] = [
  { id: 'moebel_frei', label: 'Freistehendes Möbel', icon: '🪑', beschreibung: 'Kommode, Sideboard, Schrank, Regal' },
  { id: 'einbaumoebel', label: 'Einbaumöbel', icon: '📐', beschreibung: 'Einbauschrank, Raumteiler, Wandverbau' },
  { id: 'kueche', label: 'Küche', icon: '🍳', beschreibung: 'Küchenmöbel, Fronten, Arbeitsplatte' },
  { id: 'tisch_stuhl', label: 'Tisch & Stuhl', icon: '🛋️', beschreibung: 'Esstisch, Schreibtisch, Sitzmöbel' },
  { id: 'bett', label: 'Bett & Schlafzimmer', icon: '🛏️', beschreibung: 'Bett, Schlafzimmermöbel' },
  { id: 'kindermoebel', label: 'Kindermöbel', icon: '🧸', beschreibung: 'Wickeltisch, Hochbett, Kinderzimmer' },
  { id: 'arbeitsplatte', label: 'Arbeitsplatte', icon: '🔲', beschreibung: 'Küchen-/Waschtischplatte, Theke' },
  { id: 'innentuer', label: 'Innentür', icon: '🚪', beschreibung: 'Zimmertür, Schiebetür, Glastür' },
  { id: 'haustuer', label: 'Haustür', icon: '🏠', beschreibung: 'Hauseingangstür aus Holz' },
  { id: 'fenster', label: 'Fenster', icon: '🪟', beschreibung: 'Fenster und Fenstertüren' },
  { id: 'holzboden', label: 'Holzboden', icon: '🟫', beschreibung: 'Parkett, Dielen, Laminat' },
  { id: 'treppe', label: 'Treppe', icon: '🪜', beschreibung: 'Treppen, Stufen, Podeste' },
  { id: 'wintergarten', label: 'Wintergarten', icon: '🌿', beschreibung: 'Wintergarten, Glasanbau' },
  { id: 'terrasse', label: 'Terrasse', icon: '🌞', beschreibung: 'Terrassendielen und -beläge' },
  { id: 'individuell', label: 'Individuell', icon: '✏️', beschreibung: 'Freie Auswahl aller Bausteine' },
];
