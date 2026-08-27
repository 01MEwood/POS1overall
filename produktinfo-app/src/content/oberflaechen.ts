import type { Baustein } from '../types';
import { HOLZ_SICHTBAR, MOEBEL } from './gruppen';

const STAND = '2026-08';

/** Oberflächenbehandlungen — je nach Ausführung des Auftrags auswählen. */
export const OBERFLAECHEN_BAUSTEINE: Baustein[] = [
  {
    id: 'ob-wasserlack',
    kategorie: 'oberflaeche',
    titel: 'Lackierte Oberfläche (Wasserlack)',
    stand: STAND,
    relevantFuer: HOLZ_SICHTBAR,
    absaetze: [
      {
        art: 'text',
        text:
          'Ihre Oberfläche ist mit einem modernen, wasserbasierten Lacksystem beschichtet. Wasserlacke ersetzen den Großteil der organischen Lösemittel durch Wasser (Restlösemittel meist unter 10 %), sind sehr geruchsarm und erreichen mit Härterzusatz die Beständigkeit klassischer 2K-PUR-Lacke. Der Lackfilm schützt vor Schmutz und Feuchtigkeit („Feuchteschutz“, kein „Nässeschutz“) und erleichtert die Reinigung erheblich.',
      },
      {
        art: 'text',
        text:
          'Die volle Endhärte erreicht die Lackierung erst nach einigen Tagen — bitte schonen Sie die Flächen in den ersten ein bis zwei Wochen besonders. Pflegehinweise siehe Kapitel „Pflege und Wartung“.',
      },
    ],
  },
  {
    id: 'ob-purlack',
    kategorie: 'oberflaeche',
    titel: 'Lackierte Oberfläche (2K-PUR-Lack)',
    stand: STAND,
    relevantFuer: HOLZ_SICHTBAR,
    absaetze: [
      {
        art: 'text',
        text:
          'Ihre Oberfläche ist mit einem zweikomponentigen Polyurethanlack (PUR) beschichtet. Durch die chemische Aushärtung von Stammlack und Härter entsteht ein sehr widerstandsfähiger Film — ideal für stark beanspruchte Flächen (Fronten, Arbeitsbereiche, Objektbereich). Vielfältige Farbtöne und Glanzgrade sind möglich. Die vollständige Durchhärtung dauert einige Tage; in dieser Zeit die Flächen bitte besonders schonen.',
      },
    ],
  },
  {
    id: 'ob-oel-wachs',
    kategorie: 'oberflaeche',
    titel: 'Geölte/gewachste Oberfläche',
    stand: STAND,
    relevantFuer: HOLZ_SICHTBAR,
    absaetze: [
      {
        art: 'text',
        text:
          'Öle und Wachse bestehen überwiegend aus nachwachsenden Rohstoffen (u. a. Leinöl, Holzöl, Bienen- und Carnaubawachs). Sie dringen ins Holz ein, erhalten die natürliche Haptik und Ausstrahlung, wirken antistatisch und lassen sich partiell ausbessern — der große Vorteil gegenüber Lack. Der Schutz vor Flüssigkeiten und Schmutz ist geringer als bei Lack; verschüttete Flüssigkeiten deshalb zügig aufnehmen.',
      },
      {
        art: 'text',
        text:
          'Frisch behandelte Flächen: in der ersten Woche nur trocken reinigen, volle Belastbarkeit nach etwa vier Wochen Durchhärtung. Kleine Gebrauchsspuren können Sie mit dem Original-Pflegeöl (bei uns erhältlich) selbst auffrischen; tiefere Stellen fein anschleifen (Korn 240/400) und nachölen.',
      },
      {
        art: 'warnung',
        text:
          'Mit Öl getränkte Lappen können sich selbst entzünden! Gebrauchte Tücher ausgebreitet im Freien trocknen lassen oder in einem luftdichten Metallbehälter mit Wasser entsorgen — niemals zusammengeknüllt liegen lassen.',
      },
    ],
  },
  {
    id: 'ob-lasur',
    kategorie: 'oberflaeche',
    titel: 'Lasierte Oberfläche',
    stand: STAND,
    relevantFuer: ['fenster', 'haustuer', 'wintergarten', 'terrasse', ...MOEBEL],
    standardFuer: [],
    absaetze: [
      {
        art: 'text',
        text:
          'Lasuren sind diffusionsoffener und elastischer als Lacke und werden vor allem für Fenster, Haustüren und andere Außenbauteile eingesetzt. Sie schützen das Holz vor Witterung und UV-Strahlung und geben ihm Farbe: Dünnschichtlasuren lassen die Maserung sichtbar, Dickschichtlasuren wirken deckender. Heutige Lasuren sind überwiegend wasserbasiert und emissionsarm. Außenflächen benötigen regelmäßige Kontrolle und Pflegeanstriche — siehe Wartungshinweise.',
      },
    ],
  },
  {
    id: 'ob-beize',
    kategorie: 'oberflaeche',
    titel: 'Gebeizte Oberfläche',
    stand: STAND,
    relevantFuer: HOLZ_SICHTBAR,
    absaetze: [
      {
        art: 'text',
        text:
          'Beizen färben die oberste Holzschicht und betonen oder vereinheitlichen den Farbton — den eigentlichen Schutz übernimmt die anschließende Lack- oder Ölschicht. Gebeizte Flächen können unter starkem Lichteinfluss nachdunkeln oder ausbleichen; direkte Dauersonne vermeiden hilft, den Farbton lange zu erhalten.',
      },
    ],
  },
];
