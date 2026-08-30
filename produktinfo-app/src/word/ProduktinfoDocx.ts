import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  PageBreak,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import type { Absatz, Auswahl, Betrieb, Projekt } from '../types';
import { CONTENT_STAND, PRODUKT_TYPEN, gruppiertNachKategorie } from '../content';

/**
 * Word-Export (.docx) der Produktinformation — spiegelt das PDF-Layout.
 * Hinweis: Für die rechtssichere Übergabe/Archivierung bleibt das PDF das
 * Leitformat (nicht nachträglich editierbar); Word dient der Weiterbearbeitung.
 */

const GRUEN = '2F5D3A';
const TINTE = '1F2A1F';
const GRAU = '5A655A';
const LINIE = 'C9D4C9';
const WARN_BG = 'FDF3E4';
const WARN_TEXT = '7A4A12';

const KEIN_RAHMEN = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
} as const;

function dataUrlZuBytes(dataUrl: string): { bytes: Uint8Array; typ: 'png' | 'jpg' } {
  const [kopf, b64] = dataUrl.split(',');
  const typ = kopf.includes('png') ? 'png' : 'jpg';
  if (typeof atob === 'function') {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { bytes, typ };
  }
  // Node (Beispiel-/Testskripte)
  return { bytes: new Uint8Array(Buffer.from(b64, 'base64')), typ };
}

/** Natürliche Bildmaße ermitteln (Browser); Fallback-Seitenverhältnis in Node. */
function bildMasse(dataUrl: string): Promise<{ b: number; h: number }> {
  if (typeof Image === 'undefined') return Promise.resolve({ b: 3, h: 1 });
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ b: img.naturalWidth || 3, h: img.naturalHeight || 1 });
    img.onerror = () => resolve({ b: 3, h: 1 });
    img.src = dataUrl;
  });
}

async function bildRun(dataUrl: string, maxBreite: number, maxHoehe: number): Promise<ImageRun> {
  const { bytes, typ } = dataUrlZuBytes(dataUrl);
  const { b, h } = await bildMasse(dataUrl);
  const skala = Math.min(maxBreite / b, maxHoehe / h, 1);
  return new ImageRun({
    data: bytes,
    type: typ,
    transformation: { width: Math.round(b * skala), height: Math.round(h * skala) },
  });
}

function text(t: string, extra: object = {}): TextRun {
  return new TextRun({ text: t, ...extra });
}

function absatzZuParagraphs(a: Absatz): Paragraph[] {
  if (a.art === 'liste') {
    return a.punkte.map(
      (p) =>
        new Paragraph({
          numbering: { reference: 'aufzaehlung', level: 0 },
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 60 },
          children: [text(p)],
        })
    );
  }
  if (a.art === 'warnung') {
    return [
      new Paragraph({
        shading: { type: ShadingType.CLEAR, fill: WARN_BG },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: 'C77B28' } },
        spacing: { before: 80, after: 120 },
        indent: { left: 120 },
        children: [text(`Achtung: ${a.text}`, { bold: true, color: WARN_TEXT })],
      }),
    ];
  }
  return [
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 120 },
      children: [text(a.text)],
    }),
  ];
}

function infoZelle(label: string, wert: string): TableCell {
  return new TableCell({
    borders: {
      ...KEIN_RAHMEN,
      top: { style: BorderStyle.SINGLE, size: 12, color: GRUEN },
    },
    margins: { top: 100, bottom: 60, left: 0, right: 160 },
    children: [
      new Paragraph({ children: [text(label.toUpperCase(), { size: 14, color: GRAU })], spacing: { after: 40 } }),
      new Paragraph({ children: [text(wert || '—', { size: 21 })] }),
    ],
  });
}

function gpsrZeile(label: string, wert: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        borders: KEIN_RAHMEN,
        width: { size: 32, type: WidthType.PERCENTAGE },
        margins: { top: 20, bottom: 20, left: 120, right: 80 },
        children: [new Paragraph({ children: [text(label, { size: 18, color: GRAU })] })],
      }),
      new TableCell({
        borders: KEIN_RAHMEN,
        width: { size: 68, type: WidthType.PERCENTAGE },
        margins: { top: 20, bottom: 20, left: 0, right: 120 },
        children: [new Paragraph({ children: [text(wert, { size: 18 })] })],
      }),
    ],
  });
}

function datumDe(iso: string): string {
  const [j, m, t] = iso.split('-');
  return j && m && t ? `${t}.${m}.${j}` : iso;
}

export async function baueDocx(betrieb: Betrieb, projekt: Projekt, auswahl: Auswahl): Promise<Document> {
  const gruppen = gruppiertNachKategorie(auswahl.bausteinIds);
  const typLabel = PRODUKT_TYPEN.find((t) => t.id === projekt.produktTyp)?.label ?? '';
  const titel = projekt.produktBezeichnung || typLabel;

  // ——— Deckblatt-Kopf: Logo links, Betriebsblock rechts ———
  const logoAbsatz = betrieb.logoDataUrl
    ? new Paragraph({ children: [await bildRun(betrieb.logoDataUrl, 170, 64)] })
    : new Paragraph({ children: [text(betrieb.firmenname, { bold: true, size: 32, color: GRUEN })] });

  const betriebZeilen = [
    { t: betrieb.firmenname, fett: true, farbe: TINTE },
    { t: betrieb.inhaber },
    { t: betrieb.strasse },
    { t: betrieb.plzOrt },
    { t: betrieb.telefon ? `Tel. ${betrieb.telefon}` : '' },
    { t: betrieb.email },
    { t: betrieb.website },
  ].filter((z) => z.t);

  const kopfTabelle = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { ...KEIN_RAHMEN, insideHorizontal: KEIN_RAHMEN.top, insideVertical: KEIN_RAHMEN.top },
    rows: [
      new TableRow({
        children: [
          new TableCell({ borders: KEIN_RAHMEN, width: { size: 55, type: WidthType.PERCENTAGE }, children: [logoAbsatz] }),
          new TableCell({
            borders: KEIN_RAHMEN,
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: betriebZeilen.map(
              (z) =>
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { after: 20 },
                  children: [text(z.t, { size: 17, color: z.farbe ?? GRAU, bold: z.fett ?? false })],
                })
            ),
          }),
        ],
      }),
    ],
  });

  const deckblatt: (Paragraph | Table)[] = [
    kopfTabelle,
    new Paragraph({ spacing: { before: 360, after: 80 }, children: [text('PRODUKTINFORMATION', { size: 20, color: GRUEN, bold: true, characterSpacing: 40 })] }),
    new Paragraph({ spacing: { after: 60 }, children: [text(titel, { size: 48, bold: true })] }),
    new Paragraph({
      spacing: { after: 320 },
      children: [text(`Gebrauchs-, Pflege- und Sicherheitshinweise${projekt.bauvorhaben ? ` · ${projekt.bauvorhaben}` : ''}`, { size: 24, color: GRAU, italics: true })],
    }),
  ];

  if (projekt.fotoDataUrl) {
    deckblatt.push(new Paragraph({ spacing: { after: 280 }, children: [await bildRun(projekt.fotoDataUrl, 460, 300)] }));
  }

  deckblatt.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { ...KEIN_RAHMEN, insideHorizontal: KEIN_RAHMEN.top, insideVertical: KEIN_RAHMEN.top },
      rows: [
        new TableRow({
          children: [
            infoZelle('Für', [projekt.kundeName, projekt.kundeAdresse].filter(Boolean).join(', ')),
            infoZelle('Übergabe', datumDe(projekt.uebergabeDatum)),
            infoZelle('Auftrags-Nr.', projekt.auftragsnummer),
          ],
        }),
      ],
    })
  );

  if (projekt.freitext) {
    deckblatt.push(new Paragraph({ spacing: { before: 280, after: 120 }, children: [text(projekt.freitext)] }));
  }

  // GPSR-Pflichtangaben-Block
  const gpsrZeilen = [
    gpsrZeile('Hersteller', [betrieb.firmenname, betrieb.inhaber].filter(Boolean).join(', ')),
    gpsrZeile('Postanschrift', `${betrieb.strasse}, ${betrieb.plzOrt}`),
    gpsrZeile('Elektronische Adresse', [betrieb.email, betrieb.website].filter(Boolean).join(' · ')),
    gpsrZeile('Produktidentifikation', projekt.auftragsnummer ? `Auftrags-/Kommissionsnummer ${projekt.auftragsnummer}` : projekt.produktBezeichnung),
  ];
  if (projekt.dopNummer) gpsrZeilen.push(gpsrZeile('Leistungserklärung (DoP)', `Nr. ${projekt.dopNummer} — wird mit diesem Dokument übergeben`));
  if (betrieb.zusatz) gpsrZeilen.push(gpsrZeile('Weitere Angaben', betrieb.zusatz));

  const rahmen = { style: BorderStyle.SINGLE, size: 6, color: LINIE } as const;
  deckblatt.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: rahmen, bottom: rahmen, left: rahmen, right: rahmen, insideHorizontal: KEIN_RAHMEN.top, insideVertical: KEIN_RAHMEN.top },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: KEIN_RAHMEN,
              columnSpan: 2,
              margins: { top: 120, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [text('PRODUKTANGABEN NACH EU-PRODUKTSICHERHEITSVERORDNUNG (EU) 2023/988', { size: 16, bold: true, color: GRUEN, characterSpacing: 20 })],
                }),
              ],
            }),
          ],
        }),
        ...gpsrZeilen,
        new TableRow({
          children: [new TableCell({ borders: KEIN_RAHMEN, columnSpan: 2, margins: { top: 0, bottom: 100, left: 0, right: 0 }, children: [new Paragraph({ children: [] })] })],
        }),
      ],
    })
  );

  deckblatt.push(new Paragraph({ children: [new PageBreak()] }));

  // ——— Inhaltskapitel ———
  const inhalt: (Paragraph | Table)[] = [];
  for (const gruppe of gruppen) {
    inhalt.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 280, after: 160 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: LINIE } },
        children: [text(gruppe.kategorie.titel, { size: 30, bold: true, color: GRUEN })],
      })
    );
    for (const b of gruppe.bausteine) {
      inhalt.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 80 },
          keepNext: true,
          children: [text(b.titel, { size: 23, bold: true, color: TINTE })],
        })
      );
      const absaetze = auswahl.angepassteTexte[b.id] ?? b.absaetze;
      for (const a of absaetze) inhalt.push(...absatzZuParagraphs(a));
    }
  }

  // ——— Übergabebestätigung ———
  if (projekt.mitUebergabebestaetigung) {
    const anzahl = gruppen.reduce((n, g) => n + g.bausteine.length, 0);
    const unterschrift = (beschriftung: string) =>
      new TableCell({
        borders: { ...KEIN_RAHMEN, top: { style: BorderStyle.SINGLE, size: 6, color: TINTE } },
        width: { size: 33, type: WidthType.PERCENTAGE },
        margins: { top: 60, bottom: 40, left: 60, right: 160 },
        children: [new Paragraph({ children: [text(beschriftung, { size: 15, color: GRAU })] })],
      });
    inhalt.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: rahmen, bottom: rahmen, left: rahmen, right: rahmen, insideHorizontal: KEIN_RAHMEN.top, insideVertical: KEIN_RAHMEN.top },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: KEIN_RAHMEN,
                margins: { top: 140, bottom: 60, left: 140, right: 140 },
                children: [
                  new Paragraph({ spacing: { after: 100 }, children: [text('ÜBERGABEBESTÄTIGUNG', { size: 16, bold: true, color: GRUEN, characterSpacing: 20 })] }),
                  new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 480 },
                    children: [
                      text(
                        `Der Auftraggeber bestätigt, diese Produktinformation (${anzahl} Abschnitte) erhalten zu haben und über Gebrauch, Pflege, Wartung sowie die Sicherheitshinweise informiert worden zu sein. Funktion und Bedienung wurden bei der Übergabe erklärt.`
                      ),
                    ],
                  }),
                  new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: { ...KEIN_RAHMEN, insideHorizontal: KEIN_RAHMEN.top, insideVertical: KEIN_RAHMEN.top },
                    rows: [
                      new TableRow({
                        children: [
                          unterschrift('Ort, Datum'),
                          unterschrift(`Unterschrift Auftraggeber (${projekt.kundeName || 'Kunde'})`),
                          unterschrift(`Unterschrift ${betrieb.firmenname || 'Betrieb'}`),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  }

  const fusszeile = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: LINIE } },
        children: [
          text(`${betrieb.firmenname} · ${betrieb.plzOrt}   ·   Seite `, { size: 15, color: GRAU }),
          new TextRun({ children: [PageNumber.CURRENT], size: 15, color: GRAU }),
          text(' von ', { size: 15, color: GRAU }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 15, color: GRAU }),
          text(`   ·   Inhalte: Stand ${CONTENT_STAND}`, { size: 15, color: GRAU }),
        ],
      }),
    ],
  });

  const laufkopf = new Header({
    children: [
      new Paragraph({
        children: [text(`Produktinformation · ${titel}${projekt.auftragsnummer ? `   ·   Auftrag ${projekt.auftragsnummer}` : ''}`, { size: 15, color: GRAU })],
      }),
    ],
  });

  return new Document({
    creator: betrieb.firmenname || 'ProduktPass',
    title: `Produktinformation ${titel}`,
    description: 'Produktinformation: Gebrauchs-, Pflege- und Sicherheitshinweise',
    styles: {
      default: { document: { run: { font: 'Arial', size: 20, color: TINTE } } },
    },
    numbering: {
      config: [
        {
          reference: 'aufzaehlung',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 340, hanging: 200 } }, run: { color: GRUEN } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          titlePage: true,
          page: { margin: { top: 1000, bottom: 1100, left: 1100, right: 1100 } },
        },
        headers: { first: new Header({ children: [] }), default: laufkopf },
        footers: { first: fusszeile, default: fusszeile },
        children: [...deckblatt, ...inhalt],
      },
    ],
  });
}

export async function erzeugeDocxBlob(betrieb: Betrieb, projekt: Projekt, auswahl: Auswahl): Promise<Blob> {
  return Packer.toBlob(await baueDocx(betrieb, projekt, auswahl));
}

export async function erzeugeDocxBuffer(betrieb: Betrieb, projekt: Projekt, auswahl: Auswahl): Promise<Uint8Array> {
  return Packer.toBuffer(await baueDocx(betrieb, projekt, auswahl));
}
