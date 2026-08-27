import type { Auswahl, Betrieb, Projekt, PruefErgebnis } from '../types';
import { ALLE_BAUSTEINE, CONTENT_STAND, contentAlterMonate, istPflicht } from '../content';

/**
 * Pflichtangaben-Prüfung vor der PDF-Erzeugung.
 *
 * Hintergrund (Stand 08/2026):
 * - GPSR (EU) 2023/988, gilt seit 13.12.2024: Hersteller müssen Name/Firma,
 *   Postanschrift und eine elektronische Adresse (E-Mail/Website) sowie eine
 *   eindeutige Produktidentifikation angeben; Warnhinweise und Sicherheits-
 *   informationen in deutscher Sprache beilegen. Das gilt auch für
 *   handwerkliche Einzelanfertigungen, die Verbrauchern bereitgestellt werden.
 * - ProdHaftG/Instruktionspflicht: fehlende Warnhinweise = Instruktionsfehler.
 */
export function pruefeVorExport(betrieb: Betrieb, projekt: Projekt, auswahl: Auswahl): PruefErgebnis[] {
  const ergebnisse: PruefErgebnis[] = [];

  if (!betrieb.firmenname.trim() || !betrieb.strasse.trim() || !betrieb.plzOrt.trim()) {
    ergebnisse.push({
      stufe: 'fehler',
      text: 'Betriebsname und Postanschrift fehlen — nach der EU-Produktsicherheitsverordnung (GPSR) Pflichtangabe. Bitte im Betriebsprofil ergänzen.',
    });
  }
  if (!betrieb.email.trim()) {
    ergebnisse.push({
      stufe: 'fehler',
      text: 'Elektronische Adresse (E-Mail) fehlt — nach GPSR muss neben der Postanschrift eine elektronische Kontaktmöglichkeit angegeben werden.',
    });
  }
  if (!projekt.produktBezeichnung.trim()) {
    ergebnisse.push({ stufe: 'fehler', text: 'Produktbezeichnung fehlt — ohne sie ist das Dokument nicht zuordenbar.' });
  }
  if (!projekt.auftragsnummer.trim()) {
    ergebnisse.push({
      stufe: 'warnung',
      text: 'Auftrags-/Kommissionsnummer fehlt — sie dient als Produktidentifikation im Sinne der GPSR (Rückverfolgbarkeit). Empfohlen.',
    });
  }
  if (!projekt.kundeName.trim()) {
    ergebnisse.push({ stufe: 'warnung', text: 'Kundenname fehlt — das PDF wirkt ohne Adressat weniger verbindlich.' });
  }

  const gewaehlt = new Set(auswahl.bausteinIds);
  const fehlendePflicht = ALLE_BAUSTEINE.filter((b) => istPflicht(b, projekt.produktTyp) && !gewaehlt.has(b.id));
  for (const b of fehlendePflicht) {
    ergebnisse.push({
      stufe: 'fehler',
      text: `Pflichtbaustein „${b.titel}“ ist nicht enthalten (Sicherheits-/Instruktionspflicht für diesen Produkttyp).`,
    });
  }

  const alter = contentAlterMonate(CONTENT_STAND);
  if (alter >= 12) {
    ergebnisse.push({
      stufe: 'warnung',
      text: `Die Inhaltsbibliothek ist ${alter} Monate alt (Stand ${CONTENT_STAND}). Bitte Inhalte auf Rechtsänderungen prüfen (siehe docs/inhalte-aktuell-halten.md).`,
    });
  }

  return ergebnisse;
}

export function hatFehler(ergebnisse: PruefErgebnis[]): boolean {
  return ergebnisse.some((e) => e.stufe === 'fehler');
}
