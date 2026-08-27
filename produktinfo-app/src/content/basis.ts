import type { Baustein } from '../types';
import { ALLE, INNENAUSBAU, MOEBEL } from './gruppen';

const STAND = '2026-08';

/**
 * Kapitel „Allgemeine Hinweise“ + „Service/Abschluss“ —
 * der rechtliche und fachliche Rahmen jeder Produktinformation.
 */
export const BASIS_BAUSTEINE: Baustein[] = [
  {
    id: 'basis-vorbemerkungen',
    kategorie: 'basis',
    titel: 'Vorbemerkungen',
    stand: STAND,
    rechtsbezug: 'Instruktionspflicht (ProdHaftG § 3); Abgrenzung Wartung/vertragliche Leistung',
    pflichtFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Sie haben ein individuelles Produkt erworben, gefertigt in hoher handwerklicher Qualität. Damit Sie viele Jahre Freude daran haben, finden Sie in dieser Produktinformation Hinweise zum richtigen Gebrauch, zur Pflege und Wartung sowie zu Besonderheiten Ihres Produkts.',
      },
      {
        art: 'text',
        text:
          'Um Nutzungssicherheit und Gebrauchstauglichkeit dauerhaft zu erhalten, sind regelmäßige Kontrolle, Pflege, Wartung und Instandhaltung erforderlich — zum Beispiel das Nachstellen von Beschlägen. Diese Aufgaben sind nicht Bestandteil unserer vertraglichen Leistung, sondern obliegen Ihnen als Auftraggeber. Gerne bieten wir Ihnen dafür einen Wartungsvertrag an.',
      },
      {
        art: 'text',
        text:
          'Die bestimmungsgemäße Verwendung des Produkts ist Voraussetzung für eine lange Lebensdauer und den Erhalt aller zugesicherten Eigenschaften. Ergänzend zu dieser Produktinformation gelten die Gebrauchs- und Wartungsanleitungen der Hersteller verbauter Komponenten (z. B. Beschläge, Elektrogeräte, Antriebe) — diese erhalten Sie von uns bzw. finden sie im Anhang.',
      },
    ],
  },
  {
    id: 'basis-gewaehrleistung',
    kategorie: 'basis',
    titel: 'Gewährleistung (Mängelhaftung)',
    stand: STAND,
    rechtsbezug: 'BGB §§ 434 ff., 438, 634a (Fassung seit 01.01.2022); § 477 Beweislastumkehr 12 Monate',
    standardFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Für Ihr Produkt gelten die gesetzlichen Mängelrechte. Die Verjährungsfrist beträgt in der Regel zwei Jahre ab Abnahme bzw. Übergabe; bei fest mit dem Gebäude verbundenen Leistungen (z. B. Einbaumöbel als Bauwerksbestandteil, Fenster, Haustüren, Treppen) fünf Jahre. Abweichende vertragliche Vereinbarungen (z. B. nach VOB/B) gehen vor.',
      },
      {
        art: 'text',
        text:
          'Kein Mangel sind naturbedingte Eigenschaften des Werkstoffs Holz (z. B. Farb- und Strukturunterschiede, Nachdunkeln unter Lichteinfluss, geringes Quellen und Schwinden bei Raumklimaschwankungen) sowie Verschleiß durch Gebrauch oder Schäden durch unterlassene Pflege und Wartung. Bitte beachten Sie hierzu die Hinweise in dieser Produktinformation.',
      },
      {
        art: 'text',
        text:
          'Sollte dennoch einmal etwas nicht in Ordnung sein: Melden Sie sich bitte direkt bei uns — wir kümmern uns schnell und unkompliziert um eine Lösung.',
      },
    ],
  },
  {
    id: 'basis-raumklima',
    kategorie: 'basis',
    titel: 'Raumklima und Holz',
    stand: STAND,
    standardFuer: INNENAUSBAU,
    relevantFuer: ['fenster', 'haustuer', 'wintergarten'],
    absaetze: [
      {
        art: 'text',
        text:
          'Holz ist ein natürlicher Werkstoff, der auch in verarbeitetem Zustand „lebt“ und auf das Raumklima reagiert: Bei dauerhaft feuchter Luft nimmt es Feuchtigkeit auf und quillt, bei trockener Luft — vor allem in der Heizperiode — gibt es Feuchtigkeit ab und schwindet. Das kann zu Fugenbildung und in Extremfällen zu Rissen führen.',
      },
      {
        art: 'text',
        text:
          'Das richtige Raumklima liegt bei etwa 20–22 °C Lufttemperatur und 45–55 % relativer Luftfeuchte. Dieses Klima ist auch für Ihr Wohlbefinden ideal und sollte im Jahresdurchschnitt erreicht werden. Kontrollieren Sie das Raumklima am besten mit einem handelsüblichen Thermo-/Hygrometer und steuern Sie bei Bedarf mit Luftbefeuchtung oder Lüften gegen.',
      },
    ],
  },
  {
    id: 'basis-heizen-lueften',
    kategorie: 'basis',
    titel: 'Richtig heizen und lüften',
    stand: STAND,
    standardFuer: ['holzboden', 'fenster', 'wintergarten', 'einbaumoebel'],
    relevantFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Falsches Lüften und Heizen gehört zu den häufigsten Ursachen für Feuchte- und Schimmelschäden. Die wichtigsten Regeln:',
      },
      {
        art: 'liste',
        punkte: [
          'Mehrmals täglich kurz stoß- oder querlüften (Fenster ganz öffnen) statt dauerhaft kippen — gekippte Fenster kühlen im Winter die Laibung aus und begünstigen Schimmel.',
          'Feuchtigkeit möglichst dort ablüften, wo sie entsteht (Küche, Bad, Wäschetrocknung).',
          'In Neubauten und nach größeren Umbauten in den ersten 2–3 Jahren verstärkt lüften (erhöhte Baufeuchte).',
          'Räume möglichst gleichmäßig beheizen; starkes Auskühlen einzelner Räume vermeiden und Türen zu unbeheizten Räumen geschlossen halten.',
          'Heizkörper nicht durch Möbel, Verkleidungen oder bodenlange Vorhänge verdecken.',
          'Kellerräume im Sommer nur lüften, wenn die Außenluft kühler ist als der Raum.',
        ],
      },
    ],
  },
  {
    id: 'basis-schimmel-moebel',
    kategorie: 'basis',
    titel: 'Vermeidung von Schimmel hinter Möbeln',
    stand: STAND,
    standardFuer: ['einbaumoebel', 'moebel_frei'],
    relevantFuer: MOEBEL,
    absaetze: [
      {
        art: 'text',
        text:
          'Möbel an schlecht gedämmten Außenwänden verringern die Erwärmung der Wandoberfläche dahinter. Raumluftfeuchte kann dort kondensieren — es droht Schimmelbildung. Das gilt besonders für dicht eingebaute oder mit Passleisten geschlossene Einbaumöbel.',
      },
      {
        art: 'liste',
        punkte: [
          'Möbel an Außenwänden möglichst mit Abstand zur Wand aufstellen (Hinterlüftung).',
          'Bei kritischen Wänden: Wand im Winter leicht temperieren oder Möbel gezielt hinterlüften.',
          'Nach Neubau oder Sanierung auf erhöhte Baufeuchte achten und verstärkt lüften.',
          'Bitte sprechen Sie uns an — wir beraten Sie zu kritischen Wänden und Lösungen.',
        ],
      },
    ],
  },
  {
    id: 'abs-herstellerunterlagen',
    kategorie: 'abschluss',
    titel: 'Ergänzende Herstellerunterlagen',
    stand: STAND,
    rechtsbezug: 'GPSR (EU) 2023/988: Weitergabe von Sicherheitsinformationen/Anleitungen in der Lieferkette',
    standardFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'In Ihrem Produkt sind Komponenten namhafter Hersteller verbaut (z. B. Beschläge, Leuchten, Antriebe, Elektrogeräte, Oberflächenmaterialien). Deren Gebrauchsanleitungen, Sicherheits- und Pflegehinweise gelten ergänzend zu dieser Produktinformation und wurden Ihnen — soweit vorhanden — übergeben. Weitere technische Merkblätter und Sicherheitsdatenblätter zu eingesetzten Materialien stellen wir Ihnen auf Wunsch gerne zur Verfügung.',
      },
    ],
  },
  {
    id: 'abs-ruecknahme',
    kategorie: 'abschluss',
    titel: 'Langlebigkeit, Rücknahme und Entsorgung',
    stand: STAND,
    rechtsbezug: 'Altholzverordnung; Kreislaufwirtschaftsgesetz; ESPR/Ökodesign (perspektivisch)',
    standardFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Ihr Produkt ist auf eine lange Lebensdauer ausgelegt und kann in vielen Fällen repariert, aufgearbeitet oder an geänderte Bedürfnisse angepasst werden — sprechen Sie uns an, bevor Sie ersetzen. Am Ende der Nutzungsdauer nehmen wir das Produkt auf Wunsch zurück und führen es einer fachgerechten, umweltgerechten Verwertung zu (es entstehen lediglich Kosten für Ausbau und Transport). Holz und Holzwerkstoffe werden dabei stofflich oder energetisch verwertet; Elektrokomponenten und Leuchtmittel gehören in die getrennte Sammlung (Elektroaltgeräte), nicht in den Hausmüll.',
      },
    ],
  },
  {
    id: 'abs-reparatur-ersatzteile',
    kategorie: 'abschluss',
    titel: 'Reparatur und Ersatzteile',
    stand: STAND,
    rechtsbezug: 'ESPR (EU) 2024/1781 — Möbel priorisiert (DPP voraussichtlich ab ~2029); Kundennutzen heute',
    standardFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Handwerklich gefertigte Produkte haben einen entscheidenden Vorteil: Sie sind reparierbar. Oberflächen lassen sich aufarbeiten, Beschläge nachjustieren oder tauschen, einzelne Teile nachfertigen — oft über Jahrzehnte. Ersatz- und Verschleißteile (Beschläge, Dichtungen, Leuchtmittel, Pflegemittel im passenden Farbton) erhalten Sie direkt bei uns. Melden Sie sich, bevor Sie ein beschädigtes Teil ersetzen oder entsorgen — meist ist die Reparatur die günstigere und nachhaltigere Lösung.',
      },
    ],
  },
  {
    id: 'abs-elektronik-updates',
    kategorie: 'abschluss',
    titel: 'Elektronische Komponenten und Updates',
    stand: STAND,
    rechtsbezug: '§ 475b BGB (Aktualisierungspflicht bei Waren mit digitalen Elementen)',
    relevantFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Enthält Ihr Produkt elektronische oder digitale Komponenten (z. B. Antriebe, Steuerungen, App-gesteuerte Beleuchtung), gelten ergänzend die Unterlagen der Komponentenhersteller. Für solche Komponenten stellen die Hersteller erforderliche Aktualisierungen (einschließlich Sicherheitsupdates) für den üblichen Nutzungszeitraum bereit; über verfügbare Updates informieren wir Sie bzw. der Komponentenhersteller. Ihr Ansprechpartner bei Funktionsstörungen sind zunächst wir — wir koordinieren dann alles Weitere mit dem Hersteller.',
      },
    ],
  },
  {
    id: 'abs-wartungsvertrag',
    kategorie: 'abschluss',
    titel: 'Unser Service: Wartung und Inspektion',
    stand: STAND,
    standardFuer: ['haustuer', 'fenster', 'wintergarten', 'innentuer', 'kueche'],
    relevantFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Regelmäßige Wartung erhält Funktion, Sicherheit und Wert Ihres Produkts — und ist Voraussetzung dafür, dass kleine Verschleißerscheinungen nicht zu großen Schäden werden. Gerne übernehmen wir das für Sie: mit einem Wartungsvertrag erinnern wir Sie automatisch, prüfen und justieren Beschläge, Dichtungen und Oberflächen und dokumentieren die Arbeiten. Sprechen Sie uns einfach an.',
      },
    ],
  },
];
