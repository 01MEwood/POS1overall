import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { Absatz, Auswahl, Baustein, Betrieb, Projekt } from '../types';
import { CONTENT_STAND, PRODUKT_TYPEN, gruppiertNachKategorie } from '../content';

/**
 * Das erzeugte Kunden-PDF.
 *
 * Aufbau: Deckblatt mit Logo, Kunden-/Produktdaten und GPSR-Produktangaben-
 * Block → Kapitel mit den gewählten Bausteinen → optionale Übergabe-
 * bestätigung mit Unterschriftenfeldern (Instruktionsnachweis).
 */

const FARBE_TEXT = '#1f2a1f';
const FARBE_AKZENT = '#2f5d3a'; // gedecktes Schreinergrün
const FARBE_LINIE = '#c9d4c9';
const FARBE_WARN_BG = '#fdf3e4';
const FARBE_WARN_RAND = '#c77b28';
const FARBE_GRAU = '#5a655a';

const s = StyleSheet.create({
  seite: {
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 56,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: FARBE_TEXT,
    // WICHTIG: kein lineHeight auf Seitenebene — vererbtes lineHeight verschiebt in
    // react-pdf v4 fixe render-Prop-Texte (Seitenzahlen) pro Seite exponentiell.
  },
  // ——— Deckblatt ———
  kopfzeile: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  logo: { maxHeight: 64, maxWidth: 180, objectFit: 'contain' },
  betriebBlock: { fontSize: 9, textAlign: 'right', color: FARBE_GRAU, lineHeight: 1.4 },
  titelKicker: { fontSize: 11, color: FARBE_AKZENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.2 },
  titel: { fontSize: 26, fontFamily: 'Helvetica-Bold', marginBottom: 6, lineHeight: 1.2 },
  untertitel: { fontSize: 13, color: FARBE_GRAU, marginBottom: 22, lineHeight: 1.35 },
  foto: { maxHeight: 220, maxWidth: 483, objectFit: 'contain', marginBottom: 22, borderRadius: 4 },
  infoZeile: { flexDirection: 'row', gap: 16, marginBottom: 22 },
  infoBox: { flex: 1, borderTop: `2 solid ${FARBE_AKZENT}`, paddingTop: 8 },
  infoLabel: { fontSize: 8, color: FARBE_GRAU, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  infoText: { fontSize: 10.5, lineHeight: 1.5 },
  gpsrBox: { border: `1 solid ${FARBE_LINIE}`, borderRadius: 4, padding: 12, marginTop: 'auto' },
  gpsrTitel: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: FARBE_AKZENT, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  gpsrZeile: { flexDirection: 'row', marginBottom: 2 },
  gpsrLabel: { width: 150, fontSize: 9, color: FARBE_GRAU, lineHeight: 1.4 },
  gpsrWert: { flex: 1, fontSize: 9, lineHeight: 1.4 },
  // ——— Inhalt ———
  kapitel: { lineHeight: 1.3, fontSize: 15, fontFamily: 'Helvetica-Bold', color: FARBE_AKZENT, marginTop: 18, marginBottom: 8, paddingBottom: 4, borderBottom: `1 solid ${FARBE_LINIE}` },
  bausteinTitel: { lineHeight: 1.3, fontSize: 11.5, fontFamily: 'Helvetica-Bold', marginTop: 10, marginBottom: 4 },
  absatz: { marginBottom: 6, textAlign: 'justify', lineHeight: 1.45 },
  listePunkt: { flexDirection: 'row', marginBottom: 3, paddingRight: 6 },
  listeMarker: { width: 12, color: FARBE_AKZENT, lineHeight: 1.45 },
  listeText: { flex: 1, textAlign: 'justify', lineHeight: 1.45 },
  warnBox: { backgroundColor: FARBE_WARN_BG, borderLeft: `3 solid ${FARBE_WARN_RAND}`, padding: 8, marginBottom: 6, borderRadius: 2 },
  warnText: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#7a4a12', lineHeight: 1.4 },
  // ——— Übergabebestätigung ———
  bestaetigungBox: { marginTop: 24, border: `1 solid ${FARBE_LINIE}`, borderRadius: 4, padding: 14 },
  unterschriften: { flexDirection: 'row', gap: 24, marginTop: 36 },
  unterschriftFeld: { flex: 1, borderTop: `1 solid ${FARBE_TEXT}`, paddingTop: 4, fontSize: 8.5, color: FARBE_GRAU, lineHeight: 1.3 },
  // ——— Fuß-/Kopfzeilen ———
  fussLinie: { position: 'absolute', left: 56, right: 56, bottom: 40, borderTop: `0.5 solid ${FARBE_LINIE}` },
  fussLinks: { position: 'absolute', left: 56, bottom: 26, fontSize: 8, color: FARBE_GRAU },
  fussMitte: { position: 'absolute', left: 0, right: 0, bottom: 26, fontSize: 8, color: FARBE_GRAU, textAlign: 'center' },
  fussRechts: { position: 'absolute', right: 56, bottom: 26, fontSize: 8, color: FARBE_GRAU },
  laufkopf: { position: 'absolute', top: 24, left: 56, right: 56, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: FARBE_GRAU },
});

interface Props {
  betrieb: Betrieb;
  projekt: Projekt;
  auswahl: Auswahl;
}

function textAbsaetze(b: Baustein, auswahl: Auswahl): Absatz[] {
  return auswahl.angepassteTexte[b.id] ?? b.absaetze;
}

function AbsatzView({ absatz }: { absatz: Absatz }) {
  if (absatz.art === 'liste') {
    return (
      <View style={s.absatz}>
        {absatz.punkte.map((p, i) => (
          <View key={i} style={s.listePunkt}>
            <Text style={s.listeMarker}>•</Text>
            <Text style={s.listeText}>{p}</Text>
          </View>
        ))}
      </View>
    );
  }
  if (absatz.art === 'warnung') {
    return (
      <View style={s.warnBox}>
        <Text style={s.warnText}>Achtung: {absatz.text}</Text>
      </View>
    );
  }
  return <Text style={s.absatz}>{absatz.text}</Text>;
}

function datumDe(iso: string): string {
  const [j, m, t] = iso.split('-');
  if (!j || !m || !t) return iso;
  return `${t}.${m}.${j}`;
}

export function ProduktinfoPdf({ betrieb, projekt, auswahl }: Props) {
  const gruppen = gruppiertNachKategorie(auswahl.bausteinIds);
  const typLabel = PRODUKT_TYPEN.find((t) => t.id === projekt.produktTyp)?.label ?? '';
  const fusszeileText = `${betrieb.firmenname || 'Produktinformation'} · ${betrieb.plzOrt}`.trim();

  return (
    <Document
      title={`Produktinformation ${projekt.produktBezeichnung}`.trim()}
      author={betrieb.firmenname}
      subject="Produktinformation, Gebrauchs-, Pflege- und Sicherheitshinweise"
      language="de"
    >
      {/* ——— Deckblatt ——— */}
      <Page size="A4" style={s.seite}>
        <View style={s.kopfzeile}>
          <View>
            {betrieb.logoDataUrl ? <Image src={betrieb.logoDataUrl} style={s.logo} /> : (
              <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: FARBE_AKZENT }}>{betrieb.firmenname}</Text>
            )}
          </View>
          <View style={s.betriebBlock}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: FARBE_TEXT }}>{betrieb.firmenname}</Text>
            {betrieb.inhaber ? <Text>{betrieb.inhaber}</Text> : null}
            <Text>{betrieb.strasse}</Text>
            <Text>{betrieb.plzOrt}</Text>
            {betrieb.telefon ? <Text>Tel. {betrieb.telefon}</Text> : null}
            <Text>{betrieb.email}</Text>
            {betrieb.website ? <Text>{betrieb.website}</Text> : null}
          </View>
        </View>

        <Text style={s.titelKicker}>Produktinformation</Text>
        <Text style={s.titel}>{projekt.produktBezeichnung || typLabel}</Text>
        <Text style={s.untertitel}>
          Gebrauchs-, Pflege- und Sicherheitshinweise{projekt.bauvorhaben ? ` · ${projekt.bauvorhaben}` : ''}
        </Text>

        {projekt.fotoDataUrl ? <Image src={projekt.fotoDataUrl} style={s.foto} /> : null}

        <View style={s.infoZeile}>
          <View style={s.infoBox}>
            <Text style={s.infoLabel}>Für</Text>
            <Text style={s.infoText}>
              {projekt.kundeName || '—'}
              {projekt.kundeAdresse ? `\n${projekt.kundeAdresse}` : ''}
            </Text>
          </View>
          <View style={s.infoBox}>
            <Text style={s.infoLabel}>Übergabe</Text>
            <Text style={s.infoText}>{datumDe(projekt.uebergabeDatum)}</Text>
          </View>
          <View style={s.infoBox}>
            <Text style={s.infoLabel}>Auftrags-Nr.</Text>
            <Text style={s.infoText}>{projekt.auftragsnummer || '—'}</Text>
          </View>
        </View>

        {projekt.freitext ? <Text style={[s.absatz, { marginBottom: 22 }]}>{projekt.freitext}</Text> : null}

        {/* GPSR-Produktangaben (EU 2023/988, Art. 9): Hersteller, Anschrift,
            elektronische Adresse, Produktidentifikation — als Begleitunterlage. */}
        <View style={s.gpsrBox}>
          <Text style={s.gpsrTitel}>Produktangaben nach EU-Produktsicherheitsverordnung (EU) 2023/988</Text>
          <View style={s.gpsrZeile}>
            <Text style={s.gpsrLabel}>Hersteller</Text>
            <Text style={s.gpsrWert}>{[betrieb.firmenname, betrieb.inhaber].filter(Boolean).join(', ')}</Text>
          </View>
          <View style={s.gpsrZeile}>
            <Text style={s.gpsrLabel}>Postanschrift</Text>
            <Text style={s.gpsrWert}>{`${betrieb.strasse}, ${betrieb.plzOrt}`}</Text>
          </View>
          <View style={s.gpsrZeile}>
            <Text style={s.gpsrLabel}>Elektronische Adresse</Text>
            <Text style={s.gpsrWert}>{[betrieb.email, betrieb.website].filter(Boolean).join(' · ')}</Text>
          </View>
          <View style={s.gpsrZeile}>
            <Text style={s.gpsrLabel}>Produktidentifikation</Text>
            <Text style={s.gpsrWert}>
              {projekt.auftragsnummer
                ? `Auftrags-/Kommissionsnummer ${projekt.auftragsnummer}`
                : projekt.produktBezeichnung}
            </Text>
          </View>
          {projekt.dopNummer ? (
            <View style={s.gpsrZeile}>
              <Text style={s.gpsrLabel}>Leistungserklärung (DoP)</Text>
              <Text style={s.gpsrWert}>{`Nr. ${projekt.dopNummer} — wird mit diesem Dokument übergeben`}</Text>
            </View>
          ) : null}
          {betrieb.zusatz ? (
            <View style={s.gpsrZeile}>
              <Text style={s.gpsrLabel}>Weitere Angaben</Text>
              <Text style={s.gpsrWert}>{betrieb.zusatz}</Text>
            </View>
          ) : null}
        </View>

        <View style={s.fussLinie} fixed />
        <Text style={s.fussLinks} fixed>{fusszeileText}</Text>
        <Text style={s.fussMitte} fixed render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} />
        <Text style={s.fussRechts} fixed>{`Inhalte: Stand ${CONTENT_STAND}`}</Text>
      </Page>

      {/* ——— Inhaltsseiten ——— */}
      <Page size="A4" style={s.seite}>
        <View style={s.laufkopf} fixed>
          <Text>{`Produktinformation · ${projekt.produktBezeichnung || typLabel}`}</Text>
          <Text>{projekt.auftragsnummer ? `Auftrag ${projekt.auftragsnummer}` : ''}</Text>
        </View>

        {gruppen.map((gruppe) => (
          <View key={gruppe.kategorie.id}>
            <Text style={s.kapitel} minPresenceAhead={60}>
              {gruppe.kategorie.titel}
            </Text>
            {gruppe.bausteine.map((b) => (
              <View key={b.id}>
                <Text style={s.bausteinTitel} minPresenceAhead={40}>
                  {b.titel}
                </Text>
                {textAbsaetze(b, auswahl).map((a, i) => (
                  <AbsatzView key={i} absatz={a} />
                ))}
              </View>
            ))}
          </View>
        ))}

        {/* ——— Übergabebestätigung (Instruktionsnachweis) ——— */}
        {projekt.mitUebergabebestaetigung ? (
          <View style={s.bestaetigungBox} wrap={false}>
            <Text style={[s.gpsrTitel, { marginBottom: 8 }]}>Übergabebestätigung</Text>
            <Text style={s.absatz}>
              {`Der Auftraggeber bestätigt, diese Produktinformation (${gruppen.reduce((n, g) => n + g.bausteine.length, 0)} Abschnitte) erhalten zu haben und über Gebrauch, Pflege, Wartung sowie die Sicherheitshinweise informiert worden zu sein. Funktion und Bedienung wurden bei der Übergabe erklärt.`}
            </Text>
            <View style={s.unterschriften}>
              <Text style={s.unterschriftFeld}>Ort, Datum</Text>
              <Text style={s.unterschriftFeld}>{`Unterschrift Auftraggeber (${projekt.kundeName || 'Kunde'})`}</Text>
              <Text style={s.unterschriftFeld}>{`Unterschrift ${betrieb.firmenname || 'Betrieb'}`}</Text>
            </View>
          </View>
        ) : null}

        <View style={s.fussLinie} fixed />
        <Text style={s.fussLinks} fixed>{fusszeileText}</Text>
        <Text style={s.fussMitte} fixed render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} />
        <Text style={s.fussRechts} fixed>{`Inhalte: Stand ${CONTENT_STAND}`}</Text>
      </Page>
    </Document>
  );
}
