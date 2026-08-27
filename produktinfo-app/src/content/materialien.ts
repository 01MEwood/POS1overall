import type { Baustein } from '../types';
import { ALLE, HOLZ_SICHTBAR, MOEBEL } from './gruppen';

const STAND = '2026-08';

/** Hilfsfunktion für kompakte Holzarten-Bausteine. */
function holzart(id: string, titel: string, text: string): Baustein {
  return {
    id: `mat-holz-${id}`,
    kategorie: 'material',
    titel: `Holzart: ${titel}`,
    stand: STAND,
    relevantFuer: HOLZ_SICHTBAR,
    absaetze: [{ art: 'text', text }],
  };
}

export const MATERIAL_BAUSTEINE: Baustein[] = [
  {
    id: 'mat-nachhaltigkeit',
    kategorie: 'material',
    titel: 'Holzherkunft und Nachhaltigkeit',
    stand: STAND,
    rechtsbezug: 'EU-Entwaldungsverordnung (EUDR, EU 2023/1115); FSC/PEFC',
    standardFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Wir setzen Holz aus nachweislich legaler und nachhaltiger Bewirtschaftung ein — bevorzugt aus regionaler und europäischer Herkunft sowie zertifizierte Partien (z. B. FSC oder PEFC). Die EU-Entwaldungsverordnung (EUDR) verpflichtet die Lieferkette zusätzlich, die Entwaldungsfreiheit von Holzprodukten zu dokumentieren; wir beziehen unsere Hölzer über Lieferanten, die diese Nachweise führen. Auf Wunsch nennen wir Ihnen gerne Herkunft und Zertifizierung der in Ihrem Produkt eingesetzten Hölzer.',
      },
    ],
  },
  {
    id: 'mat-farbveraenderung',
    kategorie: 'material',
    titel: 'Natürliche Farb- und Strukturmerkmale',
    stand: STAND,
    rechtsbezug: 'VOB/C ATV DIN 18355; Abgrenzung Sachmangel',
    standardFuer: HOLZ_SICHTBAR,
    absaetze: [
      {
        art: 'text',
        text:
          'Jede Holzart, jeder Stamm und jedes Furnier hat eigene Farbe, Struktur und Wuchsmerkmale. Unter Lichteinfluss (UV) verändern sich Holz und Beschichtungen: Helle Hölzer dunkeln nach oder vergilben (typisch bei Ahorn), dunkle können aufhellen. Massivholz wirkt optisch oft anders als furnierte Flächen; auch das fertigungsübliche „Stürzen“ von Furnieren erzeugt wechselnde Lichtreflexe.',
      },
      {
        art: 'text',
        text:
          'Diese Abweichungen sind natur- und fertigungsbedingt und stellen — sofern nichts anderes vereinbart ist — keinen Mangel dar. Tipp: Dekorationsobjekte auf jungen Oberflächen gelegentlich umstellen, damit die Fläche gleichmäßig nachdunkelt.',
      },
    ],
  },

  // ————— Holzarten (kompakt, kundengerecht) —————
  holzart(
    'eiche',
    'Eiche',
    'Eiche ist ein hartes, dekoratives Laubholz mit markanter Maserung und ausgezeichneten Festigkeitseigenschaften bei hohem Abnutzungswiderstand. Das gelbbraune Kernholz dunkelt nach. Besonderheit: Die enthaltenen Gerbstoffe reagieren mit Eisen und Feuchtigkeit zu blauschwarzen Flecken — deshalb keine Eisengegenstände dauerhaft feucht auf Eichenflächen liegen lassen.'
  ),
  holzart(
    'buche',
    'Buche',
    'Buche ist ein mittelschweres bis schweres, sehr hartes und abriebfestes Laubholz mit feiner, gleichmäßiger Struktur — von heller, blassgelblicher bis rötlicher Färbung (gedämpft rötlichbraun). Buche arbeitet vergleichsweise stark bei Klimaschwankungen; ein stabiles Raumklima ist bei diesem Holz besonders wichtig.'
  ),
  holzart(
    'ahorn',
    'Ahorn',
    'Ahorn liefert ein helles, feinporiges Holz mit feiner, gleichmäßiger Textur — eines der hellsten heimischen Hölzer. Es ist hart, abriebfest und zäh bei nur mäßigem Schwinden. Unter Lichteinfluss neigt Ahorn zum leichten Vergilben; das ist eine natürliche Eigenschaft.'
  ),
  holzart(
    'esche',
    'Esche',
    'Esche ist ein mittelschweres, außergewöhnlich zähes und elastisches Laubholz mit markanter, gefladerter Textur — hell weißlich bis gelblich, teils mit braunem Farbkern (Olivesche). Sie ist hart, abriebfest und formstabil und eignet sich besonders für beanspruchte Flächen und gebogene Teile.'
  ),
  holzart(
    'kirschbaum',
    'Kirschbaum',
    'Kirschbaum gehört zu den elegantesten heimischen Hölzern: feinporig, mit zarter Zeichnung. Das anfangs hellrötliche Kernholz dunkelt unter Licht zu einem warmen, goldbraunen Alterston nach — diese Reifung ist gewollt und macht den Charakter des Holzes aus.'
  ),
  holzart(
    'nussbaum',
    'Nussbaum',
    'Nussbaum ist ein mittelschweres bis schweres, sehr biegefestes Edelholz. Europäischer Nussbaum zeigt lebhafte hell- bis graubraune Färbungen mit dunkler Streifung, amerikanischer Nussbaum ein gleichmäßiges Dunkelbraun mit violettem Schimmer. Unter starker Belichtung kann das Holz verbräunen und an Streifigkeit verlieren; Kontakt von feuchtem Eisen mit dem Holz vermeiden (Verfärbung).'
  ),
  holzart(
    'birke',
    'Birke',
    'Birke ist ein mittelschweres, elastisches und zähes Holz von gelblich- bis rötlichweißer Farbe mit seidigem Glanz, teils dekorativ geflammt. Es arbeitet etwas stärker als andere Hölzer — ein gleichmäßiges Raumklima kommt ihm zugute.'
  ),
  holzart(
    'erle',
    'Erle',
    'Erle ist ein mittelschweres, eher weiches Holz mit feiner, gleichmäßiger Struktur und rötlichweißer bis hellrötlichbrauner Färbung. Sie lässt sich hervorragend beizen und polieren und wird gern als Möbelholz und als Ersatz für Kirschbaumtöne eingesetzt. Für stark beanspruchte Flächen ist sie nur bedingt geeignet.'
  ),
  holzart(
    'fichte',
    'Fichte',
    'Fichte ist das klassische helle Nadelholz: gelblichweiß, unter Licht honigfarben nachdunkelnd, mit markanter Maserung. Sie ist leicht, dabei im Verhältnis zum Gewicht fest und elastisch, arbeitet wenig und lässt sich problemlos verarbeiten. Kleine Harzgallen und Äste gehören zum Charakter.'
  ),
  holzart(
    'tanne',
    'Tanne',
    'Tanne ähnelt der Fichte, ist jedoch harzfrei und von gelblichweißer bis fast weißer Farbe, oft mit leicht grauviolettem Schimmer. Sie ist leicht bis mittelschwer, gut formstabil und wird gern für Innenausbau und großflächige Verkleidungen eingesetzt.'
  ),
  holzart(
    'kiefer',
    'Kiefer',
    'Kiefer zeigt einen deutlichen Kontrast zwischen hellem Splint und rötlichgelbem Kernholz, das kräftig rotbraun nachdunkelt — ein lebhaftes, dekoratives Nadelholz. Es ist mittelschwer, mäßig hart und harzhaltig; das Kernholz ist im Außenbereich gut dauerhaft.'
  ),
  holzart(
    'laerche',
    'Lärche',
    'Lärche ist das schwerste und härteste heimische Nadelholz (nach der Eibe) mit leuchtend rotbraunem, intensiv nachdunkelndem Kernholz und markanter Maserung. Das harzhaltige Kernholz ist witterungsbeständig und deshalb erste Wahl für Fenster, Haustüren und Terrassen. Astbereiche und Harzaustritt sind holztypisch.'
  ),
  holzart(
    'douglasie',
    'Douglasie',
    'Douglasie ähnelt optisch der Lärche: rötlichgelbes, stark nachdunkelndes Kernholz mit markanter Zeichnung. Sie ist mittelschwer, ziemlich hart und im Kern von guter natürlicher Dauerhaftigkeit — bewährt im Außenbereich. In sehr trockenem Zustand kann das Holz zu spitzen Splittern neigen (Terrassen: Schuhwerk!).'
  ),

  {
    id: 'mat-terrassenholz',
    kategorie: 'material',
    titel: 'Holzarten für Terrassendielen',
    stand: STAND,
    relevantFuer: ['terrasse'],
    absaetze: [
      {
        art: 'text',
        text:
          'Für Terrassendielen entscheiden Rohdichte/Härte und die natürliche Dauerhaftigkeit (Widerstand des Kernholzes gegen holzzerstörende Pilze, Klassen nach EN 350). Splintholz aller Arten ist nicht dauerhaft. Bewährte Arten: die heimischen Nadelhölzer Lärche und Douglasie sowie Eiche; bei Importhölzern u. a. Bangkirai (Gerbstoffe können auswaschen und mit Eisen schwarz reagieren) sowie Substitutionshölzer wie Cumaru, Garapa oder Maçaranduba (sehr hart, vorbohren, langsame Trocknung).',
      },
      {
        art: 'text',
        text:
          'Alternativen: Thermoholz (hitzebehandeltes heimisches Holz — formstabiler und dauerhafter, aber spröder und dunkler) und WPC (Holz-Kunststoff-Verbund — riss- und splitterarm, jedoch geringere Biegefestigkeit und stärkere Erwärmung in der Sonne).',
      },
    ],
  },
  {
    id: 'mat-holzwerkstoffe',
    kategorie: 'material',
    titel: 'Holzwerkstoffe (Span, MDF, Multiplex & Co.)',
    stand: STAND,
    rechtsbezug: 'Formaldehyd: VO (EU) 2023/1464 (Grenzwert 0,062 mg/m³ Innenraumprodukte, gilt seit 06.08.2026)',
    standardFuer: [...MOEBEL, 'arbeitsplatte', 'innentuer'],
    relevantFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Holzwerkstoffe entstehen durch Verpressen von Furnieren, Stäben, Spänen oder Fasern und bieten gegenüber Massivholz gleichmäßigere Eigenschaften, große Formate und deutlich geringeres Quellen und Schwinden. In Ihrem Produkt kommen je nach Bauteil zum Einsatz: Spanplatten (roh, furniert oder melaminharzbeschichtet), MDF-Platten (homogen, ideal für lackierte und profilierte Fronten), Multiplex-/Sperrholzplatten (kreuzweise verleimte Furnierlagen, charakteristisches Kantenbild), Tischlerplatten sowie harte Faserplatten (z. B. Rückwände) und HDF (Laminat-Trägerplatten).',
      },
      {
        art: 'text',
        text:
          'Wir verarbeiten ausschließlich geprüfte Platten namhafter Hersteller, die die aktuellen EU-Formaldehyd-Grenzwerte einhalten; bevorzugt setzen wir besonders emissionsarme Qualitäten ein. Furniere und Beschichtungen sperren die Oberfläche zusätzlich ab.',
      },
    ],
  },
  {
    id: 'mat-voc',
    kategorie: 'material',
    titel: 'Wohngesundheit: VOC und Gefahrstoffvermeidung',
    stand: STAND,
    standardFuer: [...MOEBEL, 'holzboden', 'innentuer'],
    relevantFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Holz und Holzwerkstoffe geben natürliche flüchtige Verbindungen (VOC) wie Terpene ab — sie sind Ursache des typischen Holzgeruchs. Nach wissenschaftlichen Untersuchungen (u. a. Uniklinik Freiburg / Fraunhofer WKI) ist bei sachgerechter Verbauung keine Gesundheitsgefährdung durch holztypische VOC zu erkennen. Wo immer möglich, vermeiden wir zudem Gefahrstoffe wie Weichmacher (PVC), Holzschutzmittel im Innenraum und lösemittelreiche Beschichtungen; zu allen eingesetzten Materialien liegen uns technische Merkblätter und Sicherheitsdatenblätter vor.',
      },
    ],
  },
  {
    id: 'mat-schichtstoff',
    kategorie: 'material',
    titel: 'Schichtstoff (HPL)',
    stand: STAND,
    relevantFuer: ['kueche', 'arbeitsplatte', ...MOEBEL],
    absaetze: [
      {
        art: 'text',
        text:
          'Schichtstoff (HPL, High Pressure Laminate) besteht aus mehreren harzgetränkten Papierlagen, die unter hohem Druck und Temperatur verpresst werden; ein transparentes Overlay schützt das Dekor. HPL ist stoß-, kratz- und abriebfest sowie lichtbeständig und damit erste Wahl für stark beanspruchte Flächen wie Arbeitsplatten und Fronten. Schnitte direkt auf der Fläche und heiße Töpfe ohne Untersetzer vermeiden — siehe Pflegehinweise.',
      },
    ],
  },
  {
    id: 'mat-mineralwerkstoff',
    kategorie: 'material',
    titel: 'Mineralwerkstoff',
    stand: STAND,
    relevantFuer: ['kueche', 'arbeitsplatte'],
    absaetze: [
      {
        art: 'text',
        text:
          'Mineralwerkstoffe (z. B. Corian, HI-MACS) bestehen aus Acrylharz und mineralischen Füllstoffen. Sie sind porenlos und damit sehr hygienisch, fugenlos verarbeitbar (unsichtbare Stöße, integrierte Becken) und fühlen sich warm an. Kleine Kratzer lassen sich ausschleifen — ein großer Vorteil dieses Materials. Heiße Töpfe nur mit Untersetzer abstellen.',
      },
    ],
  },
  {
    id: 'mat-quarz',
    kategorie: 'material',
    titel: 'Quarzwerkstoff',
    stand: STAND,
    relevantFuer: ['kueche', 'arbeitsplatte'],
    absaetze: [
      {
        art: 'text',
        text:
          'Quarzwerkstoffe (z. B. Silestone) bestehen zu über 90 % aus Quarz in einer Harzmatrix. Sie sind sehr kratz-, stoß- und fleckenbeständig sowie unempfindlich gegen haushaltsübliche Säuren. Zu beachten: nicht für den Außenbereich (UV-Vergilbung), keine punktuelle starke Hitze (Untersetzer verwenden — Thermoschockgefahr), keine stark alkalischen Reiniger (pH > 10), Backofen-/Abflussreiniger oder Flusssäure verwenden; die Oberfläche nicht nachpolieren oder versiegeln.',
      },
    ],
  },
  {
    id: 'mat-keramik',
    kategorie: 'material',
    titel: 'Keramik',
    stand: STAND,
    relevantFuer: ['kueche', 'arbeitsplatte'],
    absaetze: [
      {
        art: 'text',
        text:
          'Keramik-Arbeitsplatten (Feinsteinzeug) werden bei hohen Temperaturen gebrannt und erhalten dadurch eine extrem harte, porenlose Oberfläche: hitzebeständig, schnitt- und abriebfest, UV-beständig, nimmt weder Flüssigkeiten noch Gerüche an und muss nicht imprägniert werden. Kanten und Ecken sind materialbedingt stoßempfindlicher als die Fläche — harte Schläge auf Kanten vermeiden.',
      },
    ],
  },
  {
    id: 'mat-naturstein',
    kategorie: 'material',
    titel: 'Naturstein',
    stand: STAND,
    relevantFuer: ['kueche', 'arbeitsplatte'],
    absaetze: [
      {
        art: 'text',
        text:
          'Naturstein (z. B. Granit) ist ein sehr hartes Naturprodukt — jede Platte ein Unikat mit eigener Farbe und Struktur. Die Oberfläche besitzt feinste Poren und nimmt Flüssigkeiten auf; eine Imprägnierung verzögert das, verhindert es aber nicht. Fett, Öl, Wein und Säuren deshalb sofort aufnehmen; heiße Töpfe auf Untersetzer stellen (Rissgefahr durch Thermoschock).',
      },
    ],
  },
  {
    id: 'mat-linoleum',
    kategorie: 'material',
    titel: 'Linoleum',
    stand: STAND,
    relevantFuer: [...MOEBEL, 'arbeitsplatte', 'holzboden'],
    absaetze: [
      {
        art: 'text',
        text:
          'Linoleum wird überwiegend aus nachwachsenden Rohstoffen (Leinöl, Kolophonium, Holz- und Korkmehl) gefertigt. Als Möbeloberfläche (z. B. Schreibtischplatten) ist es angenehm warm, permanent antistatisch und unempfindlich gegen Reibungswärme. Der anfängliche Eigengeruch verfliegt bei guter Lüftung nach wenigen Wochen. Nur neutrale Reiniger verwenden — Säuren, Laugen und Verdünnung greifen die Oberfläche an.',
      },
    ],
  },
  {
    id: 'mat-glas',
    kategorie: 'material',
    titel: 'Glasarten (Float, ESG, VSG, TVG)',
    stand: STAND,
    relevantFuer: ALLE,
    standardFuer: ['fenster', 'wintergarten', 'innentuer'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Floatglas: planes Basisglas für Fenster und Spiegel — kein Sicherheitsglas.',
          'Einscheiben-Sicherheitsglas (ESG): thermisch vorgespannt, deutlich stoß- und temperaturwechselbeständiger; zerfällt im Bruchfall in kleine, stumpfkantige Krümel. Fertigungsbedingt sind leichte optische Verzerrungen/Anisotropien möglich. Sehr seltene Spontanbrüche durch Nickelsulfid-Einschlüsse werden durch heißgelagertes ESG-H weitgehend ausgeschlossen.',
          'Verbund-Sicherheitsglas (VSG): zwei oder mehr Scheiben mit reißfester Folie — Bruchstücke bleiben haften; eingesetzt u. a. für absturzsichernde und Überkopfverglasung.',
          'Teilvorgespanntes Glas (TVG): Vorstufe zu ESG, meist als VSG-Komponente mit hoher Resttragfähigkeit.',
        ],
      },
      {
        art: 'text',
        text:
          'Welche Gläser in Ihrem Produkt verbaut sind, entnehmen Sie dem Angebot/Werkvertrag bzw. der Kennzeichnung — fragen Sie uns gerne.',
      },
    ],
  },
  {
    id: 'mat-spiegel',
    kategorie: 'material',
    titel: 'Spiegel',
    stand: STAND,
    relevantFuer: [...MOEBEL, 'innentuer'],
    absaetze: [
      {
        art: 'text',
        text:
          'Spiegel bestehen aus Flachglas mit rückseitiger Silberschicht und Schutzlack. Der Randbereich ist am empfindlichsten: Anhaltende Feuchtigkeit oder aggressive (saure/alkalische) Reiniger führen zu „Spiegelfraß“ — dunklen Randverfärbungen. Deshalb: Ränder nach Feuchtreinigung sofort trocknen, Wasser nie direkt aufsprühen, beschlagene Spiegel trockenreiben und lüften. Für die Montage sind Wandabstand (Hinterlüftung) und neutrale (nicht essigvernetzende) Kleber/Silikone wichtig — das haben wir bei der Ausführung berücksichtigt.',
      },
    ],
  },
  {
    id: 'mat-metalle',
    kategorie: 'material',
    titel: 'Metalle (Aluminium, Edelstahl)',
    stand: STAND,
    relevantFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Aluminium bildet an der Luft eine schützende Oxidschicht und ist dadurch sehr korrosionsbeständig — eingesetzt z. B. für Profile, Griffe und Verkleidungen. Edelstahl (nichtrostende Qualitäten) wird für Griffe, Arbeitsflächen und Beschläge verwendet; er ist hygienisch und robust, zeigt aber Fingerabdrücke und Kalkflecken, die sich mit der richtigen Pflege leicht entfernen lassen (siehe Pflegehinweise).',
      },
    ],
  },
  {
    id: 'mat-klebstoffe',
    kategorie: 'material',
    titel: 'Klebstoffe und Verleimung',
    stand: STAND,
    relevantFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Für Ihr Produkt kommen bewährte, emissionsarme Klebstoffsysteme zum Einsatz: Weißleim (PVAc) für Massivholz- und Furnierverleimungen (lösemittelfrei, unbedenklich im Gebrauch), formaldehydarme Heißleime für flächige Beschichtungen, PUR-Kleb- und Montageschäume für Bauelemente (feuchtigkeitsbeständig bis D4) sowie Schmelzklebstoffe (EVA/PUR) für Kantenverklebungen. Im ausgehärteten Zustand gehen von diesen Verklebungen keine relevanten Emissionen aus.',
      },
    ],
  },
  {
    id: 'mat-dichtstoffe',
    kategorie: 'material',
    titel: 'Dicht- und Fugenmaterialien',
    stand: STAND,
    relevantFuer: ALLE,
    standardFuer: ['kueche', 'fenster', 'haustuer', 'wintergarten'],
    absaetze: [
      {
        art: 'text',
        text:
          'Dichtstoffe verschließen Fugen, nehmen Bauteilbewegungen auf und sperren Feuchtigkeit, Staub und Zugluft ab. In Nassbereichen kommen fungizid ausgerüstete Silikone zum Einsatz, im Bau- und Anschlussbereich Acryl-Dichtstoffe. Wichtig: Elastische Fugen sind Wartungsfugen mit begrenzter Lebensdauer — sie müssen regelmäßig kontrolliert und bei Rissen oder Ablösung erneuert werden (siehe Pflegekapitel).',
      },
    ],
  },
  {
    id: 'mat-led',
    kategorie: 'material',
    titel: 'LED-Beleuchtung',
    stand: STAND,
    relevantFuer: [...MOEBEL],
    absaetze: [
      {
        art: 'text',
        text:
          'Die eingesetzte LED-Beleuchtung ist energieeffizient, langlebig und flimmerarm. Für Möbel- und Innenbeleuchtung verwenden wir Leuchtmittel mit guter Farbwiedergabe (Ra ≥ 80, hochwertige Serien Ra ≥ 90), damit Holztöne und Oberflächen natürlich wirken. Die Lichtfarbe (warmweiß ca. 2700–3300 K bis neutralweiß) ist auf den Einsatzzweck abgestimmt. Defekte Netzteile oder Leuchtmittel nur durch typgleiche ersetzen — wir helfen gerne.',
      },
    ],
  },
];
