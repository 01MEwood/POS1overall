/**
 * End-to-End-Test im echten Browser (Chromium):
 * Betriebsprofil ausfüllen → Produkt & Kunde → Bausteine → PDF erzeugen.
 * Prüft den kompletten Fluss inkl. PDF-Download und macht Screenshots.
 *
 * Voraussetzung: laufender Dev- oder Preview-Server (URL als Argument).
 *   node scripts/e2e.mjs http://localhost:5173 ./screenshots
 */
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const basisUrl = process.argv[2] ?? 'http://localhost:5173';
const shotDir = process.argv[3] ?? './screenshots';
mkdirSync(shotDir, { recursive: true });

const executablePath = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

let fehler = 0;
const pruefe = (bedingung, text) => {
  if (bedingung) console.log(`✓ ${text}`);
  else { console.error(`✗ ${text}`); fehler++; }
};

try {
  await page.goto(basisUrl, { waitUntil: 'networkidle' });

  // — Schritt 0: Betriebsprofil (Erststart) —
  pruefe(await page.getByText('Ihr Betrieb').first().isVisible(), 'Erststart zeigt Betriebsprofil');
  await page.getByLabel(/Firmenname/).fill('Schreinerei Muster GmbH');
  await page.getByLabel(/Straße und Hausnummer/).fill('Werkstattweg 1');
  await page.getByLabel(/PLZ und Ort/).fill('88453 Erolzheim');
  await page.getByLabel(/E-Mail/).fill('info@schreinerei-muster.de');
  await page.screenshot({ path: join(shotDir, '0-betrieb.png') });
  await page.getByRole('button', { name: 'Speichern und weiter' }).click();

  // — Schritt 1: Produkt & Kunde —
  pruefe(await page.getByText('Was übergeben Sie?').isVisible(), 'Schritt 1 sichtbar');
  await page.getByRole('button', { name: /Einbaumöbel/ }).click();
  await page.getByLabel(/Produktbezeichnung/).fill('Einbauschrank Flur, Eiche furniert, geölt');
  await page.getByLabel(/Auftrags-\/Kommissions/).fill('2026-0815');
  await page.getByLabel(/Kunde \(Name\)/).fill('Familie Beispiel');
  await page.screenshot({ path: join(shotDir, '1-produkt.png') });
  await page.getByRole('button', { name: /Weiter: Bausteine/ }).click();

  // — Schritt 2: Bausteine —
  await page.getByText('Bausteine für dieses PDF').waitFor();
  const anzahlText = await page.locator('.hinweis strong').first().textContent();
  pruefe(/\d+ Bausteine/.test(anzahlText ?? ''), `Vorauswahl aktiv (${anzahlText?.trim()})`);
  // Pflichtbaustein muss deaktiviert (nicht abwählbar) sein
  const pflichtCheckbox = page.locator('#bs-sich-moebel-allgemein');
  pruefe(await pflichtCheckbox.isDisabled(), 'Pflichtbaustein „Sicherheitshinweise Möbel“ nicht abwählbar');
  // Einen Baustein öffnen und Text ansehen
  await page.getByRole('button', { name: /Raumklima und Holz/ }).click();
  pruefe(await page.locator('textarea').first().isVisible(), 'Baustein-Text editierbar');
  // Holzart Eiche zuwählen (unter „Weitere“)
  await page.getByRole('button', { name: /Weitere passende Bausteine anzeigen/ }).click();
  await page.locator('#bs-mat-holz-eiche').check();
  await page.screenshot({ path: join(shotDir, '2-bausteine.png') });
  await page.getByRole('button', { name: /Weiter: PDF erzeugen/ }).click();

  // — Schritt 3: Prüfung + Export —
  await page.getByText('Prüfen und Dokument erzeugen').waitFor();
  pruefe(await page.getByText(/übergabefertig|Warnung|⚠️|✅/).first().isVisible(), 'Prüfergebnis sichtbar');
  await page.screenshot({ path: join(shotDir, '3-export.png') });
  const { readFileSync } = await import('node:fs');

  const pdfPromise = page.waitForEvent('download', { timeout: 60_000 });
  await page.getByRole('button', { name: /Individuelles PDF erzeugen/ }).click();
  const pdfDownload = await pdfPromise;
  const pdfPfad = join(shotDir, pdfDownload.suggestedFilename());
  await pdfDownload.saveAs(pdfPfad);
  const pdfBytes = readFileSync(pdfPfad);
  pruefe(pdfBytes.subarray(0, 5).toString() === '%PDF-' && pdfBytes.length > 10_000,
    `PDF heruntergeladen: ${pdfDownload.suggestedFilename()} (${Math.round(pdfBytes.length / 1024)} kB)`);

  const docxPromise = page.waitForEvent('download', { timeout: 60_000 });
  await page.getByRole('button', { name: /Word \(.docx\)/ }).click();
  const docxDownload = await docxPromise;
  const docxPfad = join(shotDir, docxDownload.suggestedFilename());
  await docxDownload.saveAs(docxPfad);
  const docxBytes = readFileSync(docxPfad);
  pruefe(docxBytes[0] === 0x50 && docxBytes[1] === 0x4b && docxBytes.length > 10_000,
    `Word heruntergeladen: ${docxDownload.suggestedFilename()} (${Math.round(docxBytes.length / 1024)} kB)`);
  await page.screenshot({ path: join(shotDir, '4-fertig.png') });

  // — Persistenz: Reload behält Betrieb (localStorage) —
  await page.reload({ waitUntil: 'networkidle' });
  pruefe(await page.getByText('Was übergeben Sie?').isVisible(), 'Nach Reload: Profil gespeichert, direkt in Schritt 1');
} catch (err) {
  fehler++;
  console.error('✗ E2E-Fehler:', err instanceof Error ? err.message : err);
  writeFileSync(join(shotDir, 'fehler.txt'), String(err));
  await page.screenshot({ path: join(shotDir, 'fehler.png') }).catch(() => {});
} finally {
  await browser.close();
}

if (fehler > 0) { console.error(`${fehler} Prüfung(en) fehlgeschlagen`); process.exit(1); }
console.log('E2E erfolgreich.');
