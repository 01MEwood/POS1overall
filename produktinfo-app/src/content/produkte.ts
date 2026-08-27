import type { Baustein } from '../types';

const STAND = '2026-08';

/** Produktspezifische Gebrauchshinweise. */
export const PRODUKT_BAUSTEINE: Baustein[] = [
  {
    id: 'prod-moebel-frei',
    kategorie: 'produkt',
    titel: 'Freistehende Möbel',
    stand: STAND,
    standardFuer: ['moebel_frei'],
    absaetze: [
      {
        art: 'text',
        text:
          'Freistehende Möbel werden ohne feste Verbindung zum Gebäude aufgestellt. Abmessungen und Konstruktion sind auf den vorgesehenen Standort und Untergrund abgestimmt. Beim Umstellen können andere Bedingungen herrschen (Bodenunebenheit, Wandaufbau) — prüfen Sie dann Standsicherheit und Kippsicherung neu und beachten Sie die Hinweise zur Aufstellung an Außenwänden (Schimmelvermeidung).',
      },
      {
        art: 'text',
        text:
          'Zum Verschieben das Möbel anheben oder entleeren und zu zweit tragen — nicht über den Boden schieben (Bruchgefahr an Füßen und Zargen, Kratzer im Boden).',
      },
    ],
  },
  {
    id: 'prod-einbaumoebel',
    kategorie: 'produkt',
    titel: 'Einbaumöbel',
    stand: STAND,
    standardFuer: ['einbaumoebel'],
    absaetze: [
      {
        art: 'text',
        text:
          'Einbaumöbel werden passgenau und ortsfest eingebaut und sind für die Nutzung an diesem Ort bestimmt. Durch den festen Einbau werden sie rechtlich dem Gebäude zugeordnet — das kann bei Versicherungsfällen und für Gewährleistungsfristen (Bauwerk: fünf Jahre) von Bedeutung sein.',
      },
      {
        art: 'text',
        text:
          'Da Einbaumöbel Wandflächen abdecken, ist an Außenwänden auf die Hinweise zur Schimmelvermeidung zu achten. Nachträgliche Veränderungen (z. B. Durchbrüche für Leitungen) bitte nur nach Rücksprache mit uns.',
      },
    ],
  },
  {
    id: 'prod-wandmontage',
    kategorie: 'produkt',
    titel: 'Wandbefestigte Möbel',
    stand: STAND,
    standardFuer: ['moebel_frei', 'einbaumoebel'],
    relevantFuer: ['kueche', 'bett', 'kindermoebel'],
    absaetze: [
      {
        art: 'text',
        text:
          'Wandbefestigte Möbel (Regale, Hängeschränke) sind mit Befestigungssystemen montiert, die auf die zu erwartenden Lasten und die vorhandene Wandkonstruktion abgestimmt sind. Die angegebene Traglast nicht überschreiten und Lasten möglichst gleichmäßig verteilen.',
      },
      {
        art: 'text',
        text:
          'Sollen Möbel umgehängt werden, müssen Befestigungsmittel passend zur neuen Wand fachgerecht gewählt und gesetzt werden — wir übernehmen das gerne oder beraten Sie dazu.',
      },
    ],
  },
  {
    id: 'prod-korpusmoebel',
    kategorie: 'produkt',
    titel: 'Korpusmöbel, Beschläge und Schubkästen',
    stand: STAND,
    standardFuer: ['moebel_frei', 'einbaumoebel', 'kueche', 'bett', 'kindermoebel'],
    absaetze: [
      {
        art: 'text',
        text:
          'Die Beschläge von Türen, Klappen und Auszügen sind auf definierte Belastungen ausgelegt. Überlastung lässt Beschläge ausleiern oder ausbrechen. Ein gelegentliches Nachjustieren der Beschläge gehört zum normalen Gebrauch und ist kein Mangel — die wichtigsten Einstellungen zeigen wir Ihnen gerne bei der Übergabe.',
      },
      {
        art: 'text',
        text:
          'Schranktüren nicht dauerhaft offen stehen lassen: Sie sind ein Hindernis (Stoßgefahr) und belasten Bänder und Standsicherheit.',
      },
    ],
  },
  {
    id: 'prod-tisch-stuhl',
    kategorie: 'produkt',
    titel: 'Tische und Stühle',
    stand: STAND,
    standardFuer: ['tisch_stuhl'],
    relevantFuer: ['kueche', 'moebel_frei'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Tische sind auf gleichmäßige Belastung von oben ausgelegt; starke Punktlasten am Plattenrand können den Tisch kippen lassen.',
          'Tisch zum Umstellen anheben, nicht schieben — Scherkräfte können Tischbeine brechen lassen und den Boden zerkratzen. Auszugstische nicht an den Auszugplatten tragen.',
          'Stühle sind zum Sitzen auf allen vier Beinen bestimmt: nicht kippeln/schaukeln und nicht als Steighilfe verwenden.',
          'Filzgleiter regelmäßig kontrollieren und erneuern — sie schützen Boden und Stuhlbeine.',
        ],
      },
    ],
  },
  {
    id: 'prod-bett',
    kategorie: 'produkt',
    titel: 'Betten',
    stand: STAND,
    standardFuer: ['bett', 'kindermoebel'],
    absaetze: [
      {
        art: 'text',
        text:
          'Betten werden in der Regel zerlegbar gefertigt. Mechanische Verbindungen können sich mit der Zeit setzen — sollte das Bett knarren, prüfen Sie die Eckverbindungen und ziehen Sie sie nach, oder melden Sie sich bei uns. Die Lastabtragung erfolgt punktuell über die Füße; Druckstellen in Teppichböden sind deshalb nicht zu vermeiden.',
      },
      {
        art: 'text',
        text:
          'Lattenrost und Matratze regelmäßig lüften und die Hinweise der Hersteller beachten — das beugt Feuchtestau im Bettkasten vor.',
      },
    ],
  },
  {
    id: 'prod-kueche-dampf',
    kategorie: 'produkt',
    titel: 'Küche: Dampf und Feuchtigkeit',
    stand: STAND,
    standardFuer: ['kueche'],
    absaetze: [
      {
        art: 'text',
        text:
          'Beim Kochen entstehen Hitze, Wasserdampf und Feuchtigkeit. Holz und Holzwerkstoffe reagieren empfindlich darauf — mit wenigen Gewohnheiten vermeiden Sie Schäden:',
      },
      {
        art: 'liste',
        punkte: [
          'Dunstabzug grundsätzlich benutzen: vor dem Kochen einschalten, Nachlauf nutzen, Filter regelmäßig reinigen/tauschen.',
          'Dampfbeschlag an Fronten und Schränken nach dem Kochen trocken wischen; verschüttetes Wasser sofort aufnehmen — auch unter Kaffeemaschine und Wasserkocher.',
          'Geschirrspüler erst ca. 20 Minuten nach Programmende öffnen, damit der Dampf im Gerät kondensiert; Klappe nicht dauerhaft anlehnen.',
          'Wasserdampf nicht direkt auf Möbelteile leiten (Wasserkocher, Reiskocher unter Hängeschränken vermeiden).',
          'Kondensat-Ablauf des Kühlschranks regelmäßig kontrollieren, damit kein Wasser ins Möbel läuft.',
          'Küche angemessen beheizen und lüften, damit Dampf nicht an kalten Flächen kondensiert.',
        ],
      },
    ],
  },
  {
    id: 'prod-arbeitsplatte',
    kategorie: 'produkt',
    titel: 'Arbeitsplatten und Fronten im Gebrauch',
    stand: STAND,
    standardFuer: ['kueche', 'arbeitsplatte'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Heiße Töpfe, Pfannen und Backbleche nie direkt abstellen — immer Untersetzer verwenden (gilt für alle Plattenmaterialien).',
          'Nicht direkt auf der Platte schneiden — Schneidbrett verwenden.',
          'Flüssigkeiten sofort aufwischen, besonders an Plattenstößen, Ausschnitten (Spüle, Kochfeld) und an den Fronten herablaufend.',
          'Wasserundurchlässige Untersetzer unter Blumentöpfe, Vasen und Abtropfgestelle stellen.',
          'Materialspezifische Hinweise (z. B. für Massivholz, Schichtstoff, Mineral- oder Quarzwerkstoff, Keramik, Naturstein) finden Sie im Kapitel Materialien und Pflege.',
        ],
      },
    ],
  },
  {
    id: 'prod-innentuer',
    kategorie: 'produkt',
    titel: 'Innentüren: Gebrauch',
    stand: STAND,
    standardFuer: ['innentuer'],
    absaetze: [
      {
        art: 'text',
        text:
          'Mit Ihren Türen erhalten Sie ein hochwertiges, langlebiges Produkt. Wartungsarbeiten an normalen Innentüren können Sie selbst durchführen; Türen mit Sonderfunktion (Schallschutz, Einbruchhemmung, Brand-/Rauchschutz) sollten durch Fachbetriebe nach Herstellervorgabe gewartet werden.',
      },
      {
        art: 'liste',
        punkte: [
          'Einmal jährlich: bewegliche Beschlagteile auf festen Sitz prüfen und mit harz- und säurefreiem Öl leicht schmieren; Dichtungen kontrollieren.',
          'Moderne Zimmertüren enthalten Dämpfungsprofile zur Reduzierung des Schließgeräuschs — sie haben keine Dichtfunktion; geringer Lichteinfall an den Fälzen ist konstruktionsbedingt.',
          'Bei Reinigungsarbeiten mit viel Wasser darauf achten, dass keine Feuchtigkeit über die Unterkante ins Türblatt eindringt.',
        ],
      },
    ],
  },
  {
    id: 'prod-schiebetuer',
    kategorie: 'produkt',
    titel: 'Schiebetüren',
    stand: STAND,
    standardFuer: [],
    relevantFuer: ['innentuer', 'einbaumoebel', 'moebel_frei'],
    absaetze: [
      {
        art: 'text',
        text:
          'Schiebetüren laufen hängend in einer oberen Laufschiene oder stehend auf einer Bodenschiene und werden durch Führungen gegen Pendeln bzw. Kippen gesichert.',
      },
      {
        art: 'liste',
        punkte: [
          'Türen mit mäßiger Geschwindigkeit von Hand führen — nicht anschieben und „laufen lassen“ (soweit kein Einzugsdämpfer verbaut ist).',
          'Lauf- und Führungsschienen frei von Fremdkörpern und Verschmutzung halten; keine Klebebänder oder Aufhängungen in die Laufbahn einbringen.',
          'Schiebetüren regelmäßig bewegen — lange Standzeiten können Laufrollen durch statische Belastung beeinträchtigen.',
          'Keine Zusatzlasten am Türblatt befestigen; Einstellarbeiten und Beschlagtausch dem Fachbetrieb überlassen.',
        ],
      },
    ],
  },
  {
    id: 'prod-ganzglastuer',
    kategorie: 'produkt',
    titel: 'Ganzglastüren',
    stand: STAND,
    relevantFuer: ['innentuer'],
    absaetze: [
      {
        art: 'text',
        text:
          'Ganzglastüren bestehen aus Sicherheitsglas (in der Regel ESG). Sitz und Gängigkeit der Beschläge regelmäßig kontrollieren; notwendige Einstellungen führt der Fachbetrieb durch. Türen nur an den vorgesehenen Griffen bedienen, nicht zuwerfen und nicht verkeilen. Bei Kantenbeschädigungen oder muschelförmigen Ausbrüchen die Tür nicht weiter benutzen und den Austausch veranlassen.',
      },
    ],
  },
  {
    id: 'prod-haustuer-bauphase',
    kategorie: 'produkt',
    titel: 'Haustür: Schutz während der Bauphase',
    stand: STAND,
    standardFuer: ['haustuer'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Oberfläche während Putz- und Malerarbeiten mit geeigneten Abdeckungen schützen; nur UV-beständige, rückstandsfrei entfernbare Klebebänder verwenden und diese spätestens nach zwei Wochen abnehmen.',
          'Putz- und Mörtelreste dürfen nicht in die Beschläge gelangen — eine nachträgliche Reinigung ist kaum möglich.',
          'Feste Verschmutzungen (Gips, Mörtel) schonend mit Holz- oder Kunststoffspachtel entfernen; keine aggressiven Reiniger verwenden.',
          'Bei relativer Luftfeuchte über 60 % im Bau ist von zu hoher Baufeuchte auszugehen — der Bauherr muss für Austrocknung sorgen; feuchtebedingte Schäden an Holzbauteilen sind sonst von Mängelansprüchen ausgeschlossen.',
        ],
      },
    ],
  },
  {
    id: 'prod-haustuer-gebrauch',
    kategorie: 'produkt',
    titel: 'Haustür: Gebrauch und eingeschränkte Nutzung',
    stand: STAND,
    standardFuer: ['haustuer'],
    absaetze: [
      {
        art: 'text',
        text:
          'Ihre Haustür ist mit einer (Mehrfach-)Verriegelung ausgestattet. Erst das vollständige Verriegeln stellt die vereinbarte Wind-, Schlagregen- und Luftdichtheit sowie Schallschutz und Einbruchhemmung her — und entlastet das Türblatt gegen Verzug. Ziehen Sie die Tür deshalb nicht nur in die Falle, sondern verriegeln Sie sie, wann immer möglich.',
      },
      {
        art: 'text',
        text:
          'Ein geringfügiges, jahreszeitlich bedingtes Arbeiten des Türblatts ist bei Holzhaustüren normal und zulässig, solange die Funktion gewährleistet bleibt.',
      },
    ],
  },
  {
    id: 'prod-fenster-bedienung',
    kategorie: 'produkt',
    titel: 'Fenster: Bedienung',
    stand: STAND,
    standardFuer: ['fenster', 'wintergarten'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Dreh-Kipp-Flügel: Griff nach unten = verriegelt, Griff waagerecht = Drehstellung, Griff nach oben = Kippstellung. Griff nur bei angelegtem Flügel umstellen.',
          'Nie mit Gewalt bedienen — auch nicht in einer Zwischenstellung des Griffs. Der spürbare Widerstand neuer Dichtungen ist normal.',
          'Fehlbedienungssperre: Lässt sich der Flügel in Kippstellung drehen, hält die Sicherheitsschere ihn. Flügel andrücken, Griff nach oben, Flügel anlegen, Griff waagerecht, andrücken, dann verriegeln — das Fenster ist wieder normal bedienbar.',
          'Beim Aushängen von Flügeln das hohe Eigengewicht beachten — im Zweifel dem Fachbetrieb überlassen.',
        ],
      },
    ],
  },
  {
    id: 'prod-fenster-kondensat',
    kategorie: 'produkt',
    titel: 'Fenster: Kondensat und Lüftung',
    stand: STAND,
    standardFuer: ['fenster'],
    relevantFuer: ['wintergarten', 'haustuer'],
    absaetze: [
      {
        art: 'text',
        text:
          'Neue Fenster schließen deutlich dichter als alte — der frühere „automatische“ Luftwechsel über Fugen entfällt. Die Feuchtigkeit aus Wohnen, Kochen und Duschen (ein 3-Personen-Haushalt gibt täglich mehrere Liter Wasser an die Raumluft ab) muss deshalb aktiv weggelüftet werden. Bitte beachten Sie die Hinweise „Richtig heizen und lüften“.',
      },
      {
        art: 'text',
        text:
          'Kondensat außen auf der Scheibe (morgens, bei klarem Himmel) ist ein Zeichen sehr guter Wärmedämmung des Glases und kein Mangel. Kurzzeitiges Kondensat innen im Randbereich kann bei hoher Raumluftfeuchte auftreten — dann verstärkt lüften. Werden mehr als ein Drittel der Fenster eines Hauses erneuert, ist nach DIN 1946-6 ein Lüftungskonzept zu erstellen; sprechen Sie uns dazu gerne an.',
      },
    ],
  },
  {
    id: 'prod-glasbruch',
    kategorie: 'produkt',
    titel: 'Hinweise zu Glasbruch',
    stand: STAND,
    standardFuer: ['fenster', 'wintergarten'],
    relevantFuer: ['innentuer', 'haustuer'],
    absaetze: [
      {
        art: 'text',
        text:
          'Glasbruch durch äußere Einflüsse fällt nicht unter die Gewährleistung, sofern er im Nutzungsbereich entsteht; er kann über eine Glasversicherung abgedeckt werden. Die Bruchgefahr steigt u. a. durch: ungleichmäßige Erwärmung (zu nah stehende Heizkörper, aufgeklebte Folien/Bilder, dicht anliegende Möbel oder Rollos ohne Hinterlüftung), vollständiges Voreinanderschieben von Hebe-Schiebe-Flügeln, Verwinden des Flügels und Erschütterungen. Bitte vermeiden Sie diese Situationen.',
      },
    ],
  },
  {
    id: 'prod-holzboden',
    kategorie: 'produkt',
    titel: 'Holzböden: Gebrauch und Werterhalt',
    stand: STAND,
    standardFuer: ['holzboden'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Sand, Steinchen und Nässe sind die größten Feinde der Oberfläche: Schmutzfangmatten an den Eingängen und Filzgleiter unter Stühlen und Tischen verwenden; Stuhlrollen mit weicher Lauffläche (Typ W) einsetzen.',
          'Grobschmutz mit Besen, Mopp oder Staubsauger (Parkettdüse) entfernen; nur nebelfeucht wischen, Wasser nie auf der Fläche stehen lassen.',
          'Starke, dauerhafte Sonneneinstrahlung führt zu Farbveränderungen — Teppiche und Möbel gelegentlich umstellen sorgt für gleichmäßiges Nachdunkeln.',
          'Das Raumklima (45–55 % rel. Feuchte) ist für Holzböden besonders wichtig: zu trockene Winterluft führt zu Fugenbildung — ggf. Luftbefeuchter einsetzen.',
          'Ergänzend gelten die Pflegehinweise des Bodenherstellers (liegen bei bzw. auf dessen Website).',
        ],
      },
    ],
  },
  {
    id: 'prod-parkett-fbh',
    kategorie: 'produkt',
    titel: 'Parkett auf Fußbodenheizung',
    stand: STAND,
    relevantFuer: ['holzboden'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Oberflächentemperatur des Bodens dauerhaft auf max. ca. 27–29 °C begrenzen; Temperatur langsam ändern (keine Sprünge).',
          'Teppiche auf beheizten Flächen erzeugen Hitzestau — dort ist mit verstärkter Fugenbildung zu rechnen.',
          'Vor einer Grundreinigung die Oberflächentemperatur absenken.',
        ],
      },
    ],
  },
  {
    id: 'prod-laminat-schwimmend',
    kategorie: 'produkt',
    titel: 'Schwimmend verlegte Böden',
    stand: STAND,
    relevantFuer: ['holzboden'],
    absaetze: [
      {
        art: 'text',
        text:
          'Ihr Boden wurde schwimmend mit den notwendigen Rand- und Dehnfugen verlegt. Diese Fugen dürfen nicht blockiert werden: Später montierte Türstopper, fest verschraubte oder sehr schwere Einbauten können die schwimmende Verlegung außer Kraft setzen und zu Aufwölbungen führen. Bitte halten Sie vor solchen Montagen Rücksprache mit uns.',
      },
    ],
  },
  {
    id: 'prod-treppe',
    kategorie: 'produkt',
    titel: 'Treppenstufen und Podeste',
    stand: STAND,
    standardFuer: ['treppe'],
    absaetze: [
      {
        art: 'text',
        text:
          'Treppenstufen und Podeste vor starken mechanischen Beschädigungen und stehender Feuchtigkeit schützen. Die Oberfläche ist rutschhemmend ausgeführt; um diese Eigenschaft zu erhalten, sollte sie in regelmäßigen Abständen (je nach Nutzung) mit dem empfohlenen Pflegemittel nachbehandelt werden. Reinigung und Pflege wie im Kapitel „Pflege und Wartung“ beschrieben.',
      },
    ],
  },
  {
    id: 'prod-wintergarten-klima',
    kategorie: 'produkt',
    titel: 'Wintergarten: Lüftung, Beschattung, Heizung',
    stand: STAND,
    standardFuer: ['wintergarten'],
    absaetze: [
      {
        art: 'text',
        text:
          'Ein behagliches Klima im Wintergarten entsteht aus dem Zusammenspiel von Heizung, Lüftung und Beschattung — es reguliert auch den Feuchtehaushalt.',
      },
      {
        art: 'liste',
        punkte: [
          'Im Winter: mehrmals täglich kurz und großflächig lüften; Wintergarten nicht über offene Türen aus dem Wohnraum „mittemperieren“ (feuchtwarme Luft kondensiert an den kalten Scheiben). Auch zeitweise ungenutzte Wintergärten so beheizen, dass die relative Luftfeuchte 65 % nicht überschreitet.',
          'Im Sommer: Dauerlüftung zur Wärmeabfuhr, solange die Außenluft kühler ist als der Innenraum; ohne wirksame Beschattung ist ein sonniger Wintergarten kaum nutzbar.',
          'Beschattung so einrichten, dass keine ungleichmäßige Scheibenerwärmung und kein Hitzestau entsteht (innenliegende Anlagen hinterlüften) — sonst droht thermischer Glasbruch.',
          'Heizkörper an den kältesten Stellen (Glasflächen) anordnen und die Warmluftzirkulation nicht durch Möbel oder Pflanzen behindern — besonders in den Eckbereichen.',
          'Kurzzeitiges Kondensat bei schneller Aufheizung/Abkühlung ist physikalisch bedingt und kein Mangel; anhaltendes Kondensat durch Lüftung/Heizung abstellen.',
        ],
      },
    ],
  },
  {
    id: 'prod-wintergarten-technik',
    kategorie: 'produkt',
    titel: 'Wintergarten: Technik, Markise, Entwässerung',
    stand: STAND,
    standardFuer: ['wintergarten'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Steuerung/Automatisierung: Antriebe haben Thermoschutzschalter — nach mehrmaliger Betätigung einige Minuten abkühlen lassen. Nach Gewitter/Netzausfall ggf. Sicherung aus- und wieder einschalten.',
          'Markisen gleichmäßig und ohne Gewalt betätigen; vor dem Einfahren Laub und Fremdkörper entfernen. Bei Schneefall sofort einfahren; nasse Tücher ausgefahren trocknen lassen (Stockflecken). Automatiksteuerungen bei längerer Abwesenheit nicht allein arbeiten lassen.',
          'Dachrinne und Fallrohr mindestens zweimal jährlich reinigen (Frühjahr/Herbst); im Winter frei von Schnee und Eis halten — innenliegende Rinnen benötigen eine Rinnenheizung.',
          'Entwässerungsöffnungen der Rahmen regelmäßig (z. B. beim Putzen) auf freien Durchgang kontrollieren.',
          'Motorische Lüftungsanlagen jährlich warten: Filter tauschen, Luftkanäle reinigen.',
          'Keine Hochdruckreiniger verwenden — Wasser kann in Bauanschlüsse gedrückt werden und Dichtungen verschieben.',
        ],
      },
    ],
  },
  {
    id: 'prod-terrasse',
    kategorie: 'produkt',
    titel: 'Terrassendielen: Eigenschaften und Gebrauch',
    stand: STAND,
    standardFuer: ['terrasse'],
    absaetze: [
      {
        art: 'text',
        text:
          'Holz im Außenbereich arbeitet und verändert sich — das ist Materialcharakter, kein Mangel. Dazu gehören: die natürliche Vergrauung durch UV-Licht und Bewitterung, farbliche Unterschiede innerhalb einer Holzart, kleine Risse und Schieferbildung an Oberfläche und Brettenden, gelegentliches Schüsseln sowie Harzaustritt und raue Aststellen. Die Vergrauung kann durch pigmentierte Öle/Lasuren verzögert, aber nicht dauerhaft verhindert werden.',
      },
      {
        art: 'liste',
        punkte: [
          'Staunässe vermeiden: Blumentöpfe, Schirmständer u. Ä. auf Leisten (ca. 2 cm) stellen, damit der Belag hinterlüftet bleibt.',
          'Bei einigen Holzarten (z. B. Bangkirai, Eiche) werden Inhaltsstoffe ausgewaschen, die Fassaden oder Beläge darunter verfärben können — auf geregelte Entwässerung achten.',
          'Reinigung mindestens einmal jährlich im Frühjahr (schattige Lagen öfter): Besen, Wasser, ggf. Terrassenreiniger. Hochdruckreiniger nur mit breitem Aufsatz und Abstand — ein direkter harter Strahl schädigt die Oberfläche.',
          'Verschraubungen und Unterkonstruktion jährlich kontrollieren.',
        ],
      },
    ],
  },
];
