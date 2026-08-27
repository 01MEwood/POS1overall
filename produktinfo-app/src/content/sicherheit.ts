import type { Baustein } from '../types';
import { MOEBEL } from './gruppen';

const STAND = '2026-08';

/**
 * Sicherheits- und Warnhinweise.
 * Diese Bausteine erfüllen die Instruktionspflicht (ProdHaftG) und die
 * Anforderungen der EU-Produktsicherheitsverordnung (GPSR, EU 2023/988):
 * klare Warnhinweise in deutscher Sprache, die für die sichere Verwendung
 * erforderlich sind. Bei den zugeordneten Produkttypen sind sie Pflicht.
 */
export const SICHERHEIT_BAUSTEINE: Baustein[] = [
  {
    id: 'sich-moebel-allgemein',
    kategorie: 'sicherheit',
    titel: 'Sicherheitshinweise Möbel',
    stand: STAND,
    rechtsbezug: 'GPSR Art. 9 (Warnhinweise); ProdHaftG Instruktionspflicht',
    pflichtFuer: [...MOEBEL, 'arbeitsplatte'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Brandgefahr: Möbel bestehen aus Holz bzw. Holzwerkstoffen. Kerzen und andere offene Flammen niemals unbeaufsichtigt auf oder im Möbel stehen lassen; nicht brennbare Untersetzer verwenden.',
          'Quetschgefahr: Türen und Schubkästen an den Griffen bedienen — nicht zwischen Front und Korpus greifen.',
          'Fehlgebrauch: Möbel nicht als Aufstiegshilfe verwenden. Nicht auf Schubkästen, Einlegeböden oder andere nicht dafür vorgesehene Teile steigen, setzen oder legen. Schubkästen und Böden nicht überladen — die Tragkraft ist auf den vorgesehenen Gebrauch ausgelegt.',
          'Erstickungsgefahr: Schränke schließen weitgehend luftdicht. Achten Sie — besonders bei Kindern und abschließbaren Türen — darauf, dass sich niemand im Möbel aufhält.',
          'Heiße und feuchte Gegenstände nur mit schützender Unterlage auf Tischplatten und Möbelflächen abstellen; verschüttete Flüssigkeiten sofort aufwischen.',
          'Offen stehende Türen und ausgezogene Schubkästen sind Stolper- und Stoßstellen — nach Gebrauch schließen.',
        ],
      },
      {
        art: 'text',
        text:
          'Bei der Übergabe haben wir Sie in Funktion und Bedienung eingewiesen. Bei Fehlgebrauch können Unfälle oder Schäden entstehen und Gewährleistungs- bzw. Haftungsansprüche entfallen.',
      },
    ],
  },
  {
    id: 'sich-kippsicherung',
    kategorie: 'sicherheit',
    titel: 'Kippsicherheit und Wandbefestigung',
    stand: STAND,
    rechtsbezug: 'DIN EN 14749 (Standsicherheit Behältnismöbel); GPSR',
    pflichtFuer: ['moebel_frei', 'kindermoebel'],
    standardFuer: ['einbaumoebel', 'bett'],
    absaetze: [
      {
        art: 'warnung',
        text:
          'Kippende Möbel können schwere Verletzungen verursachen — insbesondere bei Kindern. Wir haben Ihr Möbel bei der Montage gegen Kippen gesichert bzw. befestigt. Entfernen Sie diese Sicherung nicht.',
      },
      {
        art: 'liste',
        punkte: [
          'Wird das Möbel umgestellt, muss es am neuen Standort erneut gegen Kippen gesichert werden — wir übernehmen das gerne fachgerecht.',
          'Hohe oder wandhängende Möbel nur mit für die Wand geeigneten Befestigungsmitteln montieren; bei Unsicherheit fragen Sie uns.',
          'Schwere Gegenstände in Schränken und Regalen möglichst unten lagern; nicht mehrere Schubkästen gleichzeitig öffnen.',
          'Kinder nicht an Türen, Schubkästen oder Einlegeböden klettern lassen.',
        ],
      },
    ],
  },
  {
    id: 'sich-wickeltisch',
    kategorie: 'sicherheit',
    titel: 'Wickeltisch / Wickelauflage',
    stand: STAND,
    rechtsbezug: 'DIN EN 12221; GPSR',
    standardFuer: ['kindermoebel'],
    absaetze: [
      {
        art: 'warnung',
        text: 'Lassen Sie Ihr Kind niemals unbeaufsichtigt auf dem Wickeltisch liegen — auch nicht für einen kurzen Moment. Sturzgefahr!',
      },
      {
        art: 'liste',
        punkte: [
          'Empfohlen für Kinder bis 15 kg.',
          'Starke Wärmequellen und spitze Gegenstände aus der unmittelbaren Umgebung fernhalten.',
          'Wickelauflagen nur bis ca. 20 mm Dicke verwenden, damit die schützende Umrandung wirksam bleibt.',
          'Auflage feucht abwischen, bei Bedarf mit handelsüblichem Desinfektionsmittel behandeln.',
        ],
      },
    ],
  },
  {
    id: 'sich-hochbett',
    kategorie: 'sicherheit',
    titel: 'Hochbett / Etagenbett',
    stand: STAND,
    rechtsbezug: 'DIN EN 747; GPSR',
    standardFuer: ['kindermoebel'],
    relevantFuer: ['bett'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Achten Sie darauf, dass Kinder nicht im Sitzen über die Brüstung kippen können — Matratzenhöhe beachten (Oberkante Matratze deutlich unter der Brüstung).',
          'Das obere Bett ist für Kinder unter 6 Jahren nicht geeignet.',
          'Die Leiter muss stets fest am Bett befestigt sein.',
          'Hochbett mit ausreichendem Abstand zu Fenstern, Türen, Heizkörpern und Leuchten aufstellen.',
          'Keine Kordeln, Schnüre oder Lasten an Brüstung oder Bettpfosten anbringen (Strangulationsgefahr).',
        ],
      },
    ],
  },
  {
    id: 'sich-hubtisch',
    kategorie: 'sicherheit',
    titel: 'Elektrisch höhenverstellbare Tische',
    stand: STAND,
    rechtsbezug: 'GPSR; Herstelleranleitung des Antriebs maßgeblich',
    relevantFuer: ['tisch_stuhl', 'moebel_frei', 'einbaumoebel', 'kueche'],
    absaetze: [
      {
        art: 'warnung',
        text: 'Beim Verfahren des Tisches besteht Quetschgefahr. Während der Bewegung stets Sichtkontakt halten und den Bewegungsraum freihalten.',
      },
      {
        art: 'liste',
        punkte: [
          'Hände, Füße, lange Haare und lose Kleidung aus dem Bewegungsraum fernhalten; Kinder nicht unbeaufsichtigt bedienen lassen.',
          'Keine Gegenstände (z. B. Rollcontainer) in den Verfahrweg stellen — vor allem beim Absenken.',
          'Kabel so führen, dass sie beim Verfahren nicht gespannt, gequetscht oder abgeschert werden.',
          'Die Bedienungsanleitung des Antriebsherstellers wurde übergeben; die Einweisung erfolgte bei der Übergabe.',
        ],
      },
    ],
  },
  {
    id: 'sich-moebelbeleuchtung',
    kategorie: 'sicherheit',
    titel: 'Beleuchtung und Elektrokomponenten in Möbeln',
    stand: STAND,
    rechtsbezug: 'GPSR; Merkblatt Elektrokomponenten in Einbaumöbeln (TZH Lemgo)',
    relevantFuer: [...MOEBEL],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Nur die vorgesehenen Leuchtmittel/Netzteile verwenden; Lüftungsöffnungen von Trafos und Netzteilen freihalten (Überhitzungs- und Brandgefahr).',
          'Beschädigte Kabel, flackernde Leuchten oder ungewöhnliche Erwärmung: Anlage ausschalten und uns bzw. eine Elektrofachkraft kontaktieren.',
          'Keine Flüssigkeiten an Steckverbindungen und Steuergeräte gelangen lassen (Stromschlaggefahr).',
          'LED-Bänder und Leuchten nicht abdecken; Mindestabstände zu brennbaren Materialien einhalten.',
          'Reparaturen und Änderungen an Elektrokomponenten nur durch Fachkräfte.',
        ],
      },
    ],
  },
  {
    id: 'sich-tuer',
    kategorie: 'sicherheit',
    titel: 'Sicherheitshinweise Türen',
    stand: STAND,
    rechtsbezug: 'GPSR Art. 9; Verbands-Gebrauchsinformationen Bauelemente',
    pflichtFuer: ['innentuer', 'haustuer'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Ein zuschlagender Türflügel kann schwere Verletzungen verursachen. Beim Schließen nicht zwischen Flügel und Rahmen (Falz) greifen — Quetschgefahr, besonders für Kinderhände.',
          'Den Flügel über den gesamten Weg von Hand führen und mit geringer Geschwindigkeit an den Rahmen heranführen; Türen nicht zuschlagen (lassen), z. B. bei Durchzug.',
          'Türgriffe nur in der vorgesehenen Drehrichtung und nicht über den Anschlag hinaus betätigen; den Schlüssel nicht zum Ziehen/Bewegen des Flügels verwenden.',
          'Türflügel und Griffe nicht zusätzlich belasten (nicht daran hängen oder abstützen); keine Gegenstände zwischen Flügel und Rahmen klemmen.',
          'Zur Öffnungsbegrenzung einen Türstopper einsetzen, damit die Tür nicht gegen Wand oder Möbel schlägt.',
        ],
      },
    ],
  },
  {
    id: 'sich-glas',
    kategorie: 'sicherheit',
    titel: 'Sicherheitshinweise Glas',
    stand: STAND,
    rechtsbezug: 'DIN 18008; DGUV Information 208-014; ASR A1.7',
    standardFuer: ['innentuer', 'wintergarten'],
    relevantFuer: ['fenster', 'haustuer', ...MOEBEL],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Beschädigte Glaselemente (Kratzer, Kantenausbrüche, Sprünge) nicht weiter benutzen — Bereich absichern und Austausch veranlassen.',
          'Glastüren nicht zuwerfen und nicht verkeilen; Schiebeelemente führen statt stoßen.',
          'Bei Ganzglastüren und -wänden auf gut sichtbare Kennzeichnung achten (Aufkleber/Motive), damit niemand dagegen läuft.',
          'Glasflächen nicht mit harten oder scharfen Gegenständen reinigen (keine Klingen/Schaber auf beschichteten Gläsern und ESG).',
          'Wo erhöhte Anforderungen gelten (z. B. bodentiefe Verglasung, Nassbereiche, Arbeitsstätten), ist Sicherheitsglas (ESG/VSG) eingesetzt — Details siehe Kapitel Materialien.',
        ],
      },
    ],
  },
  {
    id: 'sich-fenster',
    kategorie: 'sicherheit',
    titel: 'Sicherheitshinweise Fenster und Fenstertüren',
    stand: STAND,
    rechtsbezug: 'GPSR Art. 9; Verbands-Informationsdienst Fenster',
    pflichtFuer: ['fenster', 'wintergarten'],
    absaetze: [
      {
        art: 'warnung',
        text:
          'Geöffnete Fenster sind eine Absturzgefahr für Kinder. Kinder nicht unbeaufsichtigt in Räumen mit geöffneten Fenstern lassen; abschließbare Griffe oder Kindersicherungen verwenden, wo nötig.',
      },
      {
        art: 'liste',
        punkte: [
          'Beim Schließen nicht zwischen Flügel und Blendrahmen greifen — Quetschgefahr.',
          'Fensterflügel nicht zusätzlich belasten und nicht gegen die Laibung drücken; bei Wind offene Flügel sichern (Feststeller), sonst Beschädigungsgefahr.',
          'Fenster nicht als Ausstieg benutzen, sofern nicht dafür vorgesehen; Außenfensterbänke nicht betreten.',
          'Sicherheitseinrichtungen (z. B. Bremsscheren, Sicherungen) nicht entfernen oder unwirksam machen.',
          'Keine Gegenstände zwischen Flügel und Rahmen klemmen.',
        ],
      },
    ],
  },
  {
    id: 'sich-brandschutztuer',
    kategorie: 'sicherheit',
    titel: 'Brand- und Rauchschutztüren: Betreiberpflichten',
    stand: STAND,
    rechtsbezug: 'Bauordnungsrecht; Zulassung/Verwendbarkeitsnachweis; DIN 14677 (Feststellanlagen)',
    relevantFuer: ['innentuer', 'haustuer'],
    absaetze: [
      {
        art: 'warnung',
        text:
          'Brand- und Rauchschutztüren sind sicherheitstechnische Anlagen. Ihre Selbstschließung darf niemals blockiert werden (kein Festbinden, keine Keile). Nur zugelassene Feststellanlagen sind erlaubt.',
      },
      {
        art: 'liste',
        punkte: [
          'Der Betreiber ist für die dauerhafte Funktionsfähigkeit verantwortlich: regelmäßige Sichtkontrolle und mindestens jährliche Wartung durch sachkundige Personen.',
          'Feststellanlagen monatlich auf Funktion prüfen und mindestens jährlich durch eine Fachkraft warten lassen; Prüfungen dokumentieren und Aufzeichnungen aufbewahren.',
          'Ersatzteile nur in identischer, zugelassener Ausführung verwenden — im Zweifel Rücksprache mit uns oder dem Systemgeber.',
        ],
      },
    ],
  },
  {
    id: 'sich-treppe',
    kategorie: 'sicherheit',
    titel: 'Sicherheitshinweise Treppe',
    stand: STAND,
    pflichtFuer: ['treppe'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Die Rutschhemmung der Stufen hängt vom Zustand der Oberfläche ab: Stufen trocken und sauber halten; die Oberfläche je nach Nutzung regelmäßig mit dem empfohlenen Pflegemittel nachbehandeln.',
          'Keine losen Läufer oder Matten ohne rutschhemmende Unterlage auf Stufen legen.',
          'Handlauf benutzen; keine Gegenstände auf Stufen abstellen.',
          'Beschädigte Stufen, lockere Geländerteile oder knarrende Verbindungen zeitnah prüfen lassen — wir helfen gerne.',
        ],
      },
    ],
  },
  {
    id: 'sich-terrasse',
    kategorie: 'sicherheit',
    titel: 'Sicherheits- und Gesundheitshinweise Terrasse',
    stand: STAND,
    pflichtFuer: ['terrasse'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Bei Nässe, Frost, Laub oder Algenbelag besteht Rutschgefahr — wie bei allen Belägen im Außenbereich.',
          'Beim Barfußgehen können sich Holzsplitter lösen; eingezogene Splitter wegen Entzündungsgefahr (v. a. bei Tropenhölzern) zügig entfernen.',
          'Holz arbeitet im Außenbereich: Kleine Risse, raue Stellen und aufstehende Fasern sind materialtypisch — regelmäßig kontrollieren und bei Bedarf nachschleifen.',
          'Glut (Grill, Feuerschale) und Zigaretten nicht auf den Belag gelangen lassen; Brandgefahr.',
        ],
      },
    ],
  },
  {
    id: 'sich-schiebetuer-antrieb',
    kategorie: 'sicherheit',
    titel: 'Elektrisch angetriebene Schiebetüren',
    stand: STAND,
    rechtsbezug: 'Maschinenrichtlinie/-verordnung; DIN 18650/EN 16005; Herstelleranleitung',
    relevantFuer: ['innentuer', 'haustuer', 'einbaumoebel'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Sicherheitseinrichtungen (Sensoren) niemals demontieren oder außer Betrieb setzen.',
          'Der Öffnungs- und Schließbereich muss frei von Personen und Gegenständen bleiben — Quetsch- und Scherstellen.',
          'Vor der ersten Inbetriebnahme und danach regelmäßig: Prüfung und Wartung durch vom Hersteller autorisierte, ausgebildete Personen nach dessen Vorgaben.',
          'Die Anlage nachts nicht vom Netz trennen; für ausreichende Beleuchtung im Türbereich sorgen.',
        ],
      },
    ],
  },
];
