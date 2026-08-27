import type { Baustein } from '../types';
import { ALLE, BAUELEMENTE, HOLZ_SICHTBAR, MOEBEL } from './gruppen';

const STAND = '2026-08';

/** Pflege- und Wartungshinweise. */
export const PFLEGE_BAUSTEINE: Baustein[] = [
  {
    id: 'pfl-holz-allgemein',
    kategorie: 'pflege',
    titel: 'Pflege von Holzoberflächen',
    stand: STAND,
    standardFuer: HOLZ_SICHTBAR,
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'In der Regel genügt Staubwischen oder nebelfeuchtes Abwischen mit einem weichen Tuch — nie zu nass wischen, keine Feuchtigkeit stehen lassen.',
          'Unterlagen verwenden (Schreibunterlage, Untersetzer), Gegenstände nicht über die Fläche schieben.',
          'Direkten Dauerkontakt mit Kunststoff und Gummi vermeiden — enthaltene Weichmacher können Oberflächen anlösen.',
          'Hohe Temperaturen und direkte Feuchtigkeit auf der Fläche vermeiden; für gleichmäßigen Lichteinfall sorgen (Deko gelegentlich umstellen).',
          'Flecken mit mildem Seifenwasser entfernen; keine silikonhaltigen Polituren und keine Mikrofasertücher auf empfindlichen Lackflächen verwenden.',
        ],
      },
    ],
  },
  {
    id: 'pfl-lack',
    kategorie: 'pflege',
    titel: 'Pflege lackierter Flächen',
    stand: STAND,
    relevantFuer: HOLZ_SICHTBAR,
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Nur nebelfeucht reinigen, bei Bedarf mit stark verdünntem Spülmittel; anschließend trocken nachwischen.',
          'Keine Scheuermittel, keine lösemittelhaltigen Reiniger, keine Möbelpolitur (Schlierenbildung, Anlösen des Lacks).',
          'Keine selbstklebenden Folien oder Klebestreifen auf Lackflächen — Weichmacher und Kleberreste können die Schicht angreifen.',
          'Frisch lackierte Flächen erreichen die Endhärte erst nach einigen Tagen — anfangs besonders schonen.',
        ],
      },
    ],
  },
  {
    id: 'pfl-schichtstoff',
    kategorie: 'pflege',
    titel: 'Pflege von Schichtstoff-Flächen',
    stand: STAND,
    relevantFuer: ['kueche', 'arbeitsplatte', ...MOEBEL],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Mit feuchtem Tuch und mildem Reiniger säubern; hartnäckige Flecken mit weichem Schwamm — keine Scheuermittel oder Stahlwolle (Glanzgradveränderung).',
          'Nicht als Schnittfläche benutzen; heißes Kochgeschirr nie direkt abstellen.',
          'Flüssigkeiten zügig aufnehmen — besonders an Stößen, Ausschnitten und Kanten.',
        ],
      },
    ],
  },
  {
    id: 'pfl-mineralwerkstoff',
    kategorie: 'pflege',
    titel: 'Pflege von Mineralwerkstoff',
    stand: STAND,
    relevantFuer: ['kueche', 'arbeitsplatte'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Alltagsreinigung: feuchtes Tuch/Schwamm mit mildem Reiniger — das porenlose Material nimmt keinen Schmutz auf.',
          'Stärkere Verfärbungen (Tee, Saft): mit geeignetem, kurz einwirkendem Reiniger behandeln, danach klar nachspülen.',
          'Keine säurehaltigen oder aggressiven Mittel (z. B. Aceton, Abflussreiniger); bei Kontakt sofort mit viel Seifenwasser spülen.',
          'Matte Stellen und feine Kratzer kann der Fachbetrieb ausschleifen — sprechen Sie uns an.',
        ],
      },
    ],
  },
  {
    id: 'pfl-quarz',
    kategorie: 'pflege',
    titel: 'Pflege von Quarzwerkstoff',
    stand: STAND,
    relevantFuer: ['kueche', 'arbeitsplatte'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Täglich: feuchtes Tuch mit neutralem Reiniger (Spülmittel, Glasreiniger); mit klarem Wasser nachspülen.',
          'Kalkflecken mit mildem Kalkentferner kurz behandeln; Fettflecken mit Spezialpflegemittel und weichem Schwamm.',
          'Niemals verwenden: Backofen- und Abflussreiniger, Ätznatron/Laugen (pH > 10), Flusssäure, chlorhaltige Beizmittel; Lösemittel nach Gebrauch sofort abspülen.',
          'Nicht nachpolieren, wachsen oder versiegeln — das erzeugt fleckigen Kunstglanz.',
        ],
      },
    ],
  },
  {
    id: 'pfl-keramik',
    kategorie: 'pflege',
    titel: 'Pflege von Keramik',
    stand: STAND,
    relevantFuer: ['kueche', 'arbeitsplatte'],
    absaetze: [
      {
        art: 'text',
        text:
          'Keramikflächen sind sehr pflegeleicht: Essensreste und Kochspuren mit feuchtem Tuch entfernen, bei Bedarf milder Reiniger. Keine stark fluorhaltigen Substanzen (z. B. mancher Rostentferner) einwirken lassen — Rückstände sofort entfernen. Eine Imprägnierung ist nicht erforderlich; das Material ist säure- und UV-beständig.',
      },
    ],
  },
  {
    id: 'pfl-naturstein',
    kategorie: 'pflege',
    titel: 'Pflege von Naturstein',
    stand: STAND,
    relevantFuer: ['kueche', 'arbeitsplatte'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Mit feuchtem Tuch und pH-neutralem Steinreiniger (keine Essig-/Zitrusreiniger — Säure ätzt polierte Flächen an) reinigen.',
          'Öl, Fett, Wein und Fruchtsäfte sofort aufnehmen — die feinporige Oberfläche kann Flecken aufnehmen.',
          'Imprägnierung je nach Nutzung alle 1–2 Jahre auffrischen (lassen).',
        ],
      },
    ],
  },
  {
    id: 'pfl-linoleum',
    kategorie: 'pflege',
    titel: 'Pflege von Linoleum',
    stand: STAND,
    relevantFuer: [...MOEBEL, 'arbeitsplatte', 'holzboden'],
    absaetze: [
      {
        art: 'text',
        text:
          'Linoleum feucht abwischen und nur neutrale Reinigungsmittel verwenden. Saure oder alkalische Mittel verstärken den Eigengeruch und bauen die Oberfläche ab; Verdünnung löst sie an. Kratzer und matte Stellen kann der Fachbetrieb auffrischen.',
      },
    ],
  },
  {
    id: 'pfl-glas',
    kategorie: 'pflege',
    titel: 'Pflege von Glasflächen',
    stand: STAND,
    relevantFuer: ALLE,
    standardFuer: BAUELEMENTE,
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Mit viel sauberem Wasser, weichem Schwamm/Leder und haushaltsüblichem Glasreiniger arbeiten; anschließend abziehen.',
          'Keine scheuernden Mittel, keine Klingen/Glashobel — besonders nicht auf ESG und beschichteten Gläsern; „Abklingen“ ganzer Flächen ist unzulässig.',
          'Kleber-, Zement- oder Silikonreste umgehend schonend entfernen (Spiritus/Isopropanol punktuell; nicht auf Dichtungen und Lackflächen).',
          'Satinierte Gläser: keine silikon- oder säurehaltigen Reiniger; Fettflecken mit Glasreiniger entfernen.',
          'Beschichtete Spezialgläser (z. B. selbstreinigend): nur die vom Hersteller zugelassenen Mittel verwenden.',
        ],
      },
    ],
  },
  {
    id: 'pfl-spiegel',
    kategorie: 'pflege',
    titel: 'Pflege von Spiegeln',
    stand: STAND,
    relevantFuer: [...MOEBEL, 'innentuer'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Nur mit nebelfeuchtem, sauberem Mikrofasertuch oder Fensterleder reinigen — Wasser nie direkt aufsprühen, sondern das Tuch befeuchten.',
          'Ränder und Fugen nach der Reinigung sofort trockenreiben; beschlagene Spiegel trockenreiben und lüften (Schutz vor Spiegelfraß).',
          'Keine sauren oder alkalischen Reiniger, keine Glasklingen oder Schaber verwenden.',
        ],
      },
    ],
  },
  {
    id: 'pfl-alu',
    kategorie: 'pflege',
    titel: 'Pflege von Aluminium',
    stand: STAND,
    relevantFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Aluminiumflächen mit feuchtem, weichem Tuch reinigen und trockenreiben (Wasserflecken). Bei stärkerer Verschmutzung Spülmittel, Glasreiniger oder spezielles Alu-Pflegemittel verwenden — keine alkalischen oder scheuernden Reiniger. Kleine Lackschäden an Profilen kann der Fachbetrieb ausbessern.',
      },
    ],
  },
  {
    id: 'pfl-edelstahl',
    kategorie: 'pflege',
    titel: 'Pflege von Edelstahl',
    stand: STAND,
    relevantFuer: ['kueche', 'arbeitsplatte', ...MOEBEL],
    absaetze: [
      {
        art: 'text',
        text:
          'Edelstahl am besten direkt nach Gebrauch entlang der Schliffrichtung reinigen, mit klarem Wasser nachspülen und mit Mikrofasertuch trockenreiben — das beugt Kalkflecken vor. Kreisende Bewegungen und punktuelles Polieren vermeiden (sichtbare Glanzstellen). Gegen Kalk helfen reine Essig- oder Zitronenreiniger; keine chlorhaltigen Mittel und keine Stahlwolle verwenden.',
      },
    ],
  },
  {
    id: 'pfl-beschlaege',
    kategorie: 'pflege',
    titel: 'Wartung der Beschläge',
    stand: STAND,
    standardFuer: BAUELEMENTE,
    relevantFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Ihre Produkte sind mit hochwertigen Beschlägen ausgestattet. Damit sie dauerhaft leicht laufen: alle zugänglichen beweglichen Beschlagteile einmal jährlich mit säure- und harzfreiem Öl oder Fett leicht schmieren, Befestigungsschrauben auf festen Sitz prüfen und sicherheitsrelevante Teile (z. B. Eck- und Scherenlager bei Fenstern) kontrollieren. Das gebrauchsbedingte Nachstellen von Beschlägen gehört zum normalen Unterhalt und ist kein Mangel. Einstell- und Reparaturarbeiten sowie den Tausch von Beschlagteilen bitte dem Fachbetrieb überlassen; beim Verriegeln spürbarer Widerstand von Dichtungen ist normal.',
      },
    ],
  },
  {
    id: 'pfl-dichtungen',
    kategorie: 'pflege',
    titel: 'Wartung der Dichtungen',
    stand: STAND,
    standardFuer: BAUELEMENTE,
    absaetze: [
      {
        art: 'text',
        text:
          'Ihre Bauelemente enthalten elastische Dichtprofile. Reinigen Sie diese mit Wasser und mildem Reinigungsmittel und behandeln Sie sie ein- bis zweimal jährlich mit einem geeigneten Pflegemittel (z. B. Silikon-Pflegestift), damit sie geschmeidig bleiben. Beim Streichen/Lackieren Dichtungen und Beschläge nicht überstreichen. Je nach Beanspruchung kann nach Jahren ein Austausch erforderlich werden — das ist normaler Verschleiß.',
      },
    ],
  },
  {
    id: 'pfl-wartungsfugen',
    kategorie: 'pflege',
    titel: 'Wartungsfugen (Silikonfugen)',
    stand: STAND,
    standardFuer: ['kueche', 'arbeitsplatte'],
    relevantFuer: ALLE,
    absaetze: [
      {
        art: 'text',
        text:
          'Elastische Fugen (z. B. an Arbeitsplatten, Spülen, in Bädern und Duschen) sind Wartungsfugen: Sie unterliegen starker Beanspruchung und müssen regelmäßig kontrolliert und bei Bedarf erneuert werden — das ist keine Mängelbeseitigung, sondern Unterhalt. Handlungsbedarf besteht, sobald eine Fuge reißt oder sich von der Flanke löst: Dann kann Feuchtigkeit eindringen und Holzwerkstoffe aufquellen lassen. Feuchtraumfugen regelmäßig reinigen und nach dem Duschen trocknen; erhöhte Luftfeuchte direkt ablüften. Die Erneuerung übernehmen wir gerne.',
      },
    ],
  },
  {
    id: 'pfl-haustuer',
    kategorie: 'pflege',
    titel: 'Wartung und Pflege der Haustür',
    stand: STAND,
    standardFuer: ['haustuer'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Oberfläche zweimal jährlich (ideal: Frühjahr und Herbst) auf Beschädigungen prüfen. Kleine Druckstellen, Risse oder Fugenöffnungen sofort mit Original-Beschichtungsmaterial schließen — erhältlich bei uns im passenden Farbton.',
          'Verwitterte Flächen: fein anschleifen (Korn 180–220), gründlich und fettfrei reinigen, mit Originalmaterial gleichmäßig nachstreichen. Eine Pflegemilch verschließt Mikrorisse (z. B. nach Hagel) und lässt Wasser abperlen.',
          'Beschläge ein- bis zweimal jährlich mit einem Tropfen säurefreiem Öl schmieren, überschüssiges Öl abwischen; Schließzylinder nur mit Graphitpuder, Riegel und Falle leicht fetten.',
          'Dichtungen feucht reinigen und dünn mit Pflegemittel behandeln; Reinigung der Tür mit mildem, scheuerfreiem Reiniger.',
          'Alle 2 Jahre die gesamte Oberflächenbeschichtung prüfen und Fehlstellen überarbeiten (lassen) — so bleibt der Witterungsschutz erhalten.',
        ],
      },
    ],
  },
  {
    id: 'pfl-fenster',
    kategorie: 'pflege',
    titel: 'Wartung und Pflege der Fenster',
    stand: STAND,
    standardFuer: ['fenster', 'wintergarten'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Einmal jährlich alle beweglichen Beschlagteile (Verschlusszapfen, Ecklager, Scheren) mit säurefreiem Fett oder Öl schmieren; bei Funktionsstörungen keine Gewalt anwenden, sondern den Fachbetrieb rufen.',
          'Zum Reinigen keine scharfen Putz- oder Scheuermittel einsetzen; Entwässerungsöffnungen im Blendrahmen regelmäßig auf freien Durchgang prüfen.',
          'Holzfenster mit Endbeschichtung nach 2–3 Jahren auf Lackschäden untersuchen (besonders die unteren, bewitterten Partien) und bei Bedarf mit wasserbasierten Produkten nachbehandeln.',
          'Nur grundiert gelieferte Elemente müssen spätestens 3 Monate nach Einbau den Schlussanstrich erhalten.',
          'Beschläge und Falzdichtungen beim Streichen nicht überstreichen.',
        ],
      },
    ],
  },
  {
    id: 'pfl-holzboden-intervall',
    kategorie: 'pflege',
    titel: 'Reinigung und Pflege des Holzbodens',
    stand: STAND,
    standardFuer: ['holzboden', 'treppe'],
    absaetze: [
      {
        art: 'liste',
        punkte: [
          'Unterhaltsreinigung: Grobschmutz kehren oder saugen; nebelfeucht wischen mit geeignetem Parkettreiniger — Wasser sparsam einsetzen.',
          'Geölte Böden: regelmäßig (je nach Beanspruchung) mit Pflegeöl auffrischen; stark genutzte Zonen früher nachölen.',
          'Versiegelte Böden: mit Parkett-Pflegemittel gemäß Herstellerangabe pflegen; bei stumpfen Stellen Zwischenpflege durchführen.',
          'Keine Dampfreiniger und keine scharfen Reiniger verwenden.',
          'Die konkreten Pflegeprodukte und Intervalle entnehmen Sie dem beiliegenden Herstellermerkblatt — oder fragen Sie uns.',
        ],
      },
    ],
  },
];
