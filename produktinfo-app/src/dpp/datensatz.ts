import type { Auswahl, Baustein, Betrieb, Projekt } from '../types';
import { CONTENT_STAND, PRODUKT_TYPEN, gruppiertNachKategorie } from '../content';
import { absaetzeZuText } from '../lib/absatzText';

/**
 * DPP-ready-Datensatz — maschinenlesbare Fassung der Produktinformation.
 *
 * Struktur orientiert an den Inhaltskategorien des Digitalen Produktpasses
 * nach ESPR (EU) 2024/1781 (Möbel/Innenausstattung) und CPR (EU) 2024/3110
 * (Bauelemente): Produktidentifikation, Hersteller, Materialzusammensetzung,
 * Gebrauchs-/Pflegeinformationen, Sicherheitsinformationen, Reparatur und
 * Kreislauffähigkeit, Konformität.
 *
 * Die produktspezifischen delegierten Rechtsakte stehen noch aus (Möbel:
 * ESPR-Arbeitsplan 2028, verbindlich nach Übergangsfrist ~2029/2030). Die
 * EU-DPP-Registry (live seit 07/2026, DVO (EU) 2026/1778) speichert nur die
 * eindeutigen Kennungen — die Produktdaten selbst liegen dezentral beim
 * Hersteller bzw. seinem DPP-Dienstleister. Deshalb ist dies bewusst ein
 * „DPP-ready“-Format: vollständig maschinenlesbar, eindeutig identifiziert
 * (dppId) und so geschnitten, dass es auf das finale EU-Schema abgebildet
 * werden kann. Bewusst OHNE Kundendaten (ein DPP ist produktbezogen).
 */

export const DPP_SCHEMA = 'produktpass.meosapp.de/dpp';
export const DPP_SCHEMA_VERSION = '1.0';

interface DppAbschnitt {
  titel: string;
  inhalt: string;
}

export interface DppDatensatz {
  schema: string;
  schemaVersion: string;
  hinweis: string;
  erstellt: string; // ISO-Zeitstempel
  inhaltsstand: string;
  produktidentifikation: {
    dppId: string;
    produktbezeichnung: string;
    produkttyp: string;
    auftragsnummer: string;
    herstellungsart: string;
    uebergabedatum: string;
    bauvorhaben?: string;
  };
  hersteller: {
    name: string;
    inhaber?: string;
    anschrift: { strasse: string; plzOrt: string; land: string };
    telefon?: string;
    email: string;
    website?: string;
    registerangaben?: string;
  };
  materialzusammensetzung: DppAbschnitt[];
  gebrauchsanweisungUndPflege: DppAbschnitt[];
  sicherheitsinformationen: DppAbschnitt[];
  reparaturKreislaufEntsorgung: DppAbschnitt[];
  konformitaet: {
    produktsicherheit: string;
    leistungserklaerungDoP?: string;
    hinweis: string;
  };
  nachhaltigkeit: {
    langlebigkeit: string;
    reparierbarkeit: string;
    umweltkennzahlen: null;
    hinweisUmweltkennzahlen: string;
  };
  dokument: {
    formate: string[];
    erzeugtMit: string;
  };
}

function typLabel(projekt: Projekt): string {
  return PRODUKT_TYPEN.find((t) => t.id === projekt.produktTyp)?.label ?? projekt.produktTyp;
}

function abschnitt(b: Baustein, auswahl: Auswahl): DppAbschnitt {
  return { titel: b.titel, inhalt: absaetzeZuText(auswahl.angepassteTexte[b.id] ?? b.absaetze) };
}

/** Vollständiger DPP-ready-Datensatz zu einem Auftrag (für den .json-Export). */
export function baueDppDatensatz(betrieb: Betrieb, projekt: Projekt, auswahl: Auswahl): DppDatensatz {
  const gruppen = gruppiertNachKategorie(auswahl.bausteinIds);
  const nachKategorie = (ids: string[]): DppAbschnitt[] =>
    gruppen.filter((g) => ids.includes(g.kategorie.id)).flatMap((g) => g.bausteine.map((b) => abschnitt(b, auswahl)));

  const istBauelement = ['fenster', 'haustuer'].includes(projekt.produktTyp);

  return {
    schema: DPP_SCHEMA,
    schemaVersion: DPP_SCHEMA_VERSION,
    hinweis:
      'DPP-ready-Datensatz einer handwerklichen Einzelanfertigung. Struktur nach den Inhaltskategorien ' +
      'des Digitalen Produktpasses (ESPR (EU) 2024/1781 bzw. CPR (EU) 2024/3110). Die produktspezifischen ' +
      'delegierten Rechtsakte (Möbel: erwartet 2028, verbindlich ~2029/2030) stehen noch aus; die EU-DPP-Registry ' +
      'speichert nur Kennungen, die Produktdaten bleiben beim Hersteller bzw. seinem DPP-Dienstleister. Dieser ' +
      'Datensatz ist die maschinenlesbare Grundlage für die Überführung in das finale EU-Schema. Enthält bewusst keine Kundendaten.',
    erstellt: new Date().toISOString(),
    inhaltsstand: CONTENT_STAND,
    produktidentifikation: {
      dppId: projekt.dppId,
      produktbezeichnung: projekt.produktBezeichnung,
      produkttyp: typLabel(projekt),
      auftragsnummer: projekt.auftragsnummer,
      herstellungsart: 'Handwerkliche Einzelanfertigung (Losgröße 1)',
      uebergabedatum: projekt.uebergabeDatum,
      ...(projekt.bauvorhaben ? { bauvorhaben: projekt.bauvorhaben } : {}),
    },
    hersteller: {
      name: betrieb.firmenname,
      ...(betrieb.inhaber ? { inhaber: betrieb.inhaber } : {}),
      anschrift: { strasse: betrieb.strasse, plzOrt: betrieb.plzOrt, land: 'DE' },
      ...(betrieb.telefon ? { telefon: betrieb.telefon } : {}),
      email: betrieb.email,
      ...(betrieb.website ? { website: betrieb.website } : {}),
      ...(betrieb.zusatz ? { registerangaben: betrieb.zusatz } : {}),
    },
    materialzusammensetzung: nachKategorie(['material', 'oberflaeche']),
    gebrauchsanweisungUndPflege: nachKategorie(['basis', 'produkt', 'pflege']),
    sicherheitsinformationen: nachKategorie(['sicherheit']),
    reparaturKreislaufEntsorgung: nachKategorie(['abschluss']),
    konformitaet: {
      produktsicherheit:
        'Herstellerangaben, Produktidentifikation und Sicherheitsinformationen nach EU-Produktsicherheitsverordnung (EU) 2023/988 enthalten.',
      ...(projekt.dopNummer ? { leistungserklaerungDoP: `Leistungserklärung Nr. ${projekt.dopNummer} (Bauproduktenverordnung)` } : {}),
      hinweis: istBauelement
        ? 'Bauelement im Anwendungsbereich der Bauproduktenverordnung — Leistungserklärung/CE-Kennzeichnung werden gesondert übergeben.'
        : 'Möbel/Innenausbau: keine CE-Kennzeichnungspflicht; Produktsicherheit nach GPSR.',
    },
    nachhaltigkeit: {
      langlebigkeit:
        'Handwerkliche Einzelanfertigung, auf lange Nutzungsdauer ausgelegt; Pflege- und Wartungshinweise sind Bestandteil dieses Datensatzes.',
      reparierbarkeit:
        'Reparatur, Nacharbeit und Ersatzteile über den Herstellerbetrieb möglich (Kontakt siehe Hersteller).',
      umweltkennzahlen: null,
      hinweisUmweltkennzahlen:
        'Standardisierte Umweltkennzahlen (z. B. EPD/CO₂-Fußabdruck) liegen für handwerkliche Einzelanfertigungen ' +
        'noch nicht vor; die Anforderungen des delegierten Rechtsakts Möbel (erwartet 2028) stehen aus.',
    },
    dokument: {
      formate: ['pdf', 'docx', 'json'],
      erzeugtMit: 'ProduktPass — produktpass.meosapp.de',
    },
  };
}

/**
 * Kompakter Payload für den QR-Code auf dem Dokument: Produktidentifikation
 * und Hersteller, maschinenlesbar als JSON — bewusst klein gehalten, damit
 * der Code gedruckt (≈28 mm) zuverlässig scannbar bleibt.
 */
export function dppQrPayload(betrieb: Betrieb, projekt: Projekt, auswahl: Auswahl): string {
  const material = gruppiertNachKategorie(auswahl.bausteinIds)
    .filter((g) => g.kategorie.id === 'material' || g.kategorie.id === 'oberflaeche')
    .flatMap((g) => g.bausteine.map((b) => b.titel))
    .slice(0, 6);
  return JSON.stringify({
    dpp: DPP_SCHEMA_VERSION,
    id: projekt.dppId,
    hersteller: betrieb.firmenname,
    ort: betrieb.plzOrt,
    email: betrieb.email,
    produkt: projekt.produktBezeichnung || typLabel(projekt),
    typ: typLabel(projekt),
    ...(projekt.auftragsnummer ? { auftrag: projekt.auftragsnummer } : {}),
    ...(projekt.dopNummer ? { dop: projekt.dopNummer } : {}),
    uebergabe: projekt.uebergabeDatum,
    ...(material.length > 0 ? { material } : {}),
    stand: CONTENT_STAND,
    app: 'produktpass.meosapp.de',
  });
}

/** QR-Code als PNG-DataURL — läuft im Browser (Canvas) und in Node (Tests). */
export async function erzeugeQrDataUrl(payload: string): Promise<string> {
  const { toDataURL } = await import('qrcode');
  return toDataURL(payload, { errorCorrectionLevel: 'M', margin: 1, scale: 6, color: { dark: '#1f2a1f', light: '#ffffff' } });
}
