/**
 * Erzeugt Beispiel-PDFs (Smoke-Test + Anschauungsmaterial):
 *   npm run beispiel
 *
 * Rendert zwei typische Aufträge mit Musterdaten nach ./beispiele/ und
 * prüft dabei, dass Inhaltsbibliothek, Auswahllogik und PDF-Layout
 * fehlerfrei zusammenspielen.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { ProduktinfoPdf } from '../src/pdf/ProduktinfoPdf';
import { dokumentDateiname, pdfDateiname } from '../src/pdf/dateiname';
import { erzeugeDocxBuffer } from '../src/word/ProduktinfoDocx';
import { vorauswahlFuer } from '../src/content';
import { pruefeVorExport, hatFehler } from '../src/lib/pruefung';
import type { Auswahl, Betrieb, Projekt } from '../src/types';

const betrieb: Betrieb = {
  firmenname: 'Schreinerei Muster GmbH',
  inhaber: 'Max Muster, Schreinermeister',
  strasse: 'Werkstattweg 1',
  plzOrt: '88453 Erolzheim',
  telefon: '07354 000000',
  email: 'info@schreinerei-muster.de',
  website: 'www.schreinerei-muster.de',
  zusatz: 'HRB 000000, Amtsgericht Ulm',
  logoDataUrl: null,
};

const beispiele: { name: string; projekt: Projekt; extraBausteine?: string[] }[] = [
  {
    name: 'Einbaumöbel',
    projekt: {
      produktTyp: 'einbaumoebel',
      kundeName: 'Familie Beispiel',
      kundeAdresse: 'Musterstraße 2, 88453 Erolzheim',
      bauvorhaben: 'Neubau Einfamilienhaus',
      produktBezeichnung: 'Einbauschrank Flur, Eiche furniert, geölt',
      auftragsnummer: '2026-0815',
      dopNummer: '',
      mitUebergabebestaetigung: true,
      uebergabeDatum: '2026-08-27',
      fotoDataUrl: null,
      freitext: 'Vielen Dank für Ihren Auftrag! Bei Fragen sind wir jederzeit für Sie da.',
    },
    extraBausteine: ['mat-holz-eiche', 'ob-oel-wachs'],
  },
  {
    name: 'Haustür',
    projekt: {
      produktTyp: 'haustuer',
      kundeName: 'Erika Beispiel',
      kundeAdresse: 'Beispielweg 9, 88400 Biberach',
      bauvorhaben: 'Sanierung Altbau',
      produktBezeichnung: 'Haustür Lärche, lasiert, 3-fach Verglasung',
      auftragsnummer: '2026-0901',
      dopNummer: 'DoP-2026-014',
      mitUebergabebestaetigung: true,
      uebergabeDatum: '2026-08-27',
      fotoDataUrl: null,
      freitext: '',
    },
    extraBausteine: ['mat-holz-laerche', 'ob-lasur'],
  },
];

const zielordner = join(import.meta.dirname, '..', 'beispiele');
mkdirSync(zielordner, { recursive: true });

let fehler = 0;
for (const beispiel of beispiele) {
  const auswahl: Auswahl = {
    bausteinIds: [...vorauswahlFuer(beispiel.projekt.produktTyp), ...(beispiel.extraBausteine ?? [])],
    angepassteTexte: {},
  };

  const pruefung = pruefeVorExport(betrieb, beispiel.projekt, auswahl);
  if (hatFehler(pruefung)) {
    console.error(`✗ ${beispiel.name}: Pflichtangaben-Prüfung schlägt fehl:`, pruefung);
    fehler++;
    continue;
  }

  const buffer = await renderToBuffer(
    createElement(ProduktinfoPdf, { betrieb, projekt: beispiel.projekt, auswahl })
  );
  if (buffer.length < 10_000 || buffer.subarray(0, 5).toString() !== '%PDF-') {
    console.error(`✗ ${beispiel.name}: PDF unplausibel (${buffer.length} Bytes)`);
    fehler++;
    continue;
  }

  const datei = join(zielordner, pdfDateiname(beispiel.projekt));
  writeFileSync(datei, buffer);
  console.log(`✓ ${beispiel.name}: ${auswahl.bausteinIds.length} Bausteine → ${datei} (${Math.round(buffer.length / 1024)} kB)`);

  // Zusätzlich die Word-Fassung erzeugen (Smoke-Test für den Docx-Export).
  const docx = await erzeugeDocxBuffer(betrieb, beispiel.projekt, auswahl);
  // DOCX = ZIP-Container, beginnt mit "PK"
  if (docx.length < 10_000 || docx[0] !== 0x50 || docx[1] !== 0x4b) {
    console.error(`✗ ${beispiel.name}: DOCX unplausibel (${docx.length} Bytes)`);
    fehler++;
    continue;
  }
  const docxDatei = join(zielordner, dokumentDateiname(beispiel.projekt, 'docx'));
  writeFileSync(docxDatei, docx);
  console.log(`✓ ${beispiel.name} (Word): → ${docxDatei} (${Math.round(docx.length / 1024)} kB)`);
}

if (fehler > 0) {
  console.error(`${fehler} Beispiel(e) fehlgeschlagen.`);
  process.exit(1);
}
console.log('Alle Beispiel-PDFs erfolgreich erzeugt.');
