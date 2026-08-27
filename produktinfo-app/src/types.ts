/**
 * Zentrale Typdefinitionen der Produktinfo-App.
 *
 * Kernidee: Eine versionierte Bibliothek aus Textbausteinen (Content-Library),
 * aus der pro Auftrag ein individuelles Kunden-PDF zusammengestellt wird.
 */

/** Produkttypen, die ein Schreiner typischerweise übergibt. */
export type ProduktTypId =
  | 'moebel_frei'
  | 'einbaumoebel'
  | 'kueche'
  | 'tisch_stuhl'
  | 'bett'
  | 'kindermoebel'
  | 'arbeitsplatte'
  | 'innentuer'
  | 'haustuer'
  | 'fenster'
  | 'holzboden'
  | 'treppe'
  | 'wintergarten'
  | 'terrasse'
  | 'individuell';

export interface ProduktTyp {
  id: ProduktTypId;
  label: string;
  icon: string; // Emoji für die Auswahl-Kachel
  beschreibung: string;
}

/** Inhalts-Kategorien — bestimmen Reihenfolge und Gliederung im PDF. */
export type KategorieId =
  | 'basis' // Vorbemerkungen, Gewährleistung, Raumklima …
  | 'sicherheit' // Sicherheits- und Warnhinweise (GPSR-relevant)
  | 'produkt' // Produktspezifische Gebrauchshinweise
  | 'material' // Materialbeschreibungen (Holzarten, Platten, Glas …)
  | 'oberflaeche' // Oberflächenbehandlung (Lack, Öl, Lasur …)
  | 'pflege' // Pflege- und Wartungshinweise
  | 'abschluss'; // Entsorgung, Herstellerunterlagen, Service

export interface Kategorie {
  id: KategorieId;
  titel: string;
  reihenfolge: number;
}

/** Ein Absatz innerhalb eines Bausteins. */
export type Absatz =
  | { art: 'text'; text: string }
  | { art: 'liste'; punkte: string[] }
  | { art: 'warnung'; text: string }; // wird im PDF als Warnhinweis-Box gesetzt

/** Ein einzelner Textbaustein der Bibliothek. */
export interface Baustein {
  id: string;
  kategorie: KategorieId;
  titel: string;
  absaetze: Absatz[];
  /** Bei diesen Produkttypen ist der Baustein Pflicht (Sicherheits-/Rechtsrelevanz) und nicht abwählbar. */
  pflichtFuer?: ProduktTypId[];
  /** Bei diesen Produkttypen ist der Baustein vorausgewählt, aber abwählbar. */
  standardFuer?: ProduktTypId[];
  /** Bei diesen Produkttypen wird der Baustein als optionale Ergänzung angeboten. */
  relevantFuer?: ProduktTypId[];
  /** Inhaltsstand des Bausteins, z. B. "2026-08". */
  stand: string;
  /** Interner Hinweis auf Rechtsgrundlage/Quelle — wird NICHT ins PDF gedruckt. */
  rechtsbezug?: string;
}

/** Betriebsprofil — einmal gepflegt, in jedem PDF verwendet. */
export interface Betrieb {
  firmenname: string;
  inhaber: string;
  strasse: string;
  plzOrt: string;
  telefon: string;
  email: string;
  website: string;
  /** Optional: Handelsregister/USt-IdNr. o. Ä. */
  zusatz: string;
  /** Logo als DataURL (PNG/JPG), lokal gespeichert. */
  logoDataUrl: string | null;
}

/** Auftrags-/Projektdaten für ein konkretes PDF. */
export interface Projekt {
  produktTyp: ProduktTypId;
  kundeName: string;
  kundeAdresse: string;
  bauvorhaben: string;
  produktBezeichnung: string;
  /** Auftrags-/Kommissionsnummer — dient als Produktidentifikation (GPSR). */
  auftragsnummer: string;
  /** Nur Fenster/Außentüren: Nummer der Leistungserklärung (DoP) nach Bauproduktenverordnung. */
  dopNummer: string;
  /** Übergabebestätigung mit Unterschriftenfeldern ans Ende des PDFs anhängen. */
  mitUebergabebestaetigung: boolean;
  uebergabeDatum: string; // ISO yyyy-mm-dd
  /** Optionales Produktfoto als DataURL. */
  fotoDataUrl: string | null;
  /** Freier Zusatztext des Betriebs (z. B. Besonderheiten des Auftrags). */
  freitext: string;
}

/** Auswahl + individuelle Textanpassungen für ein PDF. */
export interface Auswahl {
  /** IDs der gewählten Bausteine. */
  bausteinIds: string[];
  /** Vom Nutzer überschriebene Texte (bausteinId → geänderte Absätze). */
  angepassteTexte: Record<string, Absatz[]>;
}

/** Ergebnis der Pflichtangaben-Prüfung vor PDF-Erzeugung. */
export interface PruefErgebnis {
  stufe: 'fehler' | 'warnung';
  text: string;
}
