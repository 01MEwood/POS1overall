/**
 * Smoke-Test: startet das Backend mit einer frischen Temp-Datenbank auf einem
 * Testport und prüft alle zentralen API-Endpunkte (Demo-Modus).
 * Aufruf: npm run smoke  (Exit-Code 0 = alles OK)
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5399;
const BASE = `http://localhost:${PORT}`;
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pos1-smoke-'));

let failures = 0;
function check(name, cond, extra = '') {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.error(`  ✗ ${name} ${extra}`);
  }
}

async function json(method, urlPath, body) {
  const res = await fetch(`${BASE}${urlPath}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch { /* leer */ }
  return { status: res.status, data };
}

async function waitForServer(timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/api/status`);
      if (res.ok) return;
    } catch { /* noch nicht bereit */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Server nicht erreichbar');
}

const child = spawn(process.execPath, [path.join(__dirname, '..', 'src', 'index.js')], {
  env: {
    ...process.env,
    PORT: String(PORT),
    DATA_DIR: dataDir,
    DATAFORSEO_LOGIN: '',
    DATAFORSEO_PASSWORD: '',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
child.stdout.on('data', (d) => (serverLog += d));
child.stderr.on('data', (d) => (serverLog += d));

try {
  await waitForServer();
  console.log('Server läuft — Endpunkte werden geprüft:');

  const status = await json('GET', '/api/status');
  check('GET /api/status → demo-Modus', status.status === 200 && status.data.mode === 'demo');

  const overview = await json('GET', '/api/overview');
  check('GET /api/overview → 6 Seed-Domains', overview.status === 200 && overview.data.domains.length === 6);

  const scan = await json('POST', '/api/domains/1/scan');
  check('POST /api/domains/1/scan → Scores', scan.status === 200 && scan.data.scores?.overall > 0);
  check('Scan liefert Checks', Array.isArray(scan.data.checks) && scan.data.checks.length >= 15);

  const scanGet = await json('GET', '/api/domains/1/scan');
  check('GET /api/domains/1/scan → persistiert', scanGet.data.scan != null && scanGet.data.checks.length > 0);

  const refresh = await json('POST', '/api/keywords/refresh', {});
  check('POST /api/keywords/refresh → alle Seeds', refresh.status === 200 && refresh.data.refreshed === refresh.data.total && refresh.data.total >= 19);

  const keywords = await json('GET', '/api/keywords');
  const withPosition = keywords.data.filter((k) => k.checked_at != null);
  check('GET /api/keywords → Rankings gespeichert', withPosition.length >= 19);

  const kwAdd = await json('POST', '/api/keywords', { keyword: 'smoke-test keyword', domainId: 1 });
  check('POST /api/keywords → 201', kwAdd.status === 201);
  const kwDup = await json('POST', '/api/keywords', { keyword: 'smoke-test keyword', domainId: 1 });
  check('Duplikat-Keyword → 409', kwDup.status === 409);
  const kwDel = await json('DELETE', `/api/keywords/${kwAdd.data.id}`);
  check('DELETE /api/keywords/:id', kwDel.status === 200);

  const brands = await json('GET', '/api/brands');
  check('GET /api/brands → 3 Marken', brands.status === 200 && brands.data.length === 3);

  const brandPatch = await json('PATCH', '/api/brands/2', { positioning: 'Smoke-Test-Positionierung' });
  check('PATCH /api/brands/2', brandPatch.status === 200 && brandPatch.data.positioning === 'Smoke-Test-Positionierung');

  const kpis = await json('GET', '/api/brands/1/kpis');
  check('GET /api/brands/1/kpis', kpis.status === 200 && Array.isArray(kpis.data.positions));

  const ownership = await json('POST', '/api/brands/1/ownership');
  check('POST /api/brands/1/ownership', ownership.status === 200 && ownership.data.top10Owned >= 0);

  const social = await json('GET', '/api/social');
  check('GET /api/social → 13 Seed-Kanäle', social.status === 200 && social.data.length === 13);

  const kpiAdd = await json('POST', '/api/social/kpis', {
    channelId: social.data[0].id, date: '2026-08-01', followers: 100, posts: 4, reach: 900, engagement: 3.1,
  });
  check('POST /api/social/kpis', kpiAdd.status === 201);
  const kpiUpsert = await json('POST', '/api/social/kpis', {
    channelId: social.data[0].id, date: '2026-08-01', followers: 120,
  });
  check('KPI-Upsert (gleiches Datum)', kpiUpsert.status === 201);

  const actions = await json('GET', '/api/actions');
  check('GET /api/actions → Seed-Maßnahmen', actions.status === 200 && actions.data.length >= 21);
  const actionPatch = await json('PATCH', `/api/actions/${actions.data[0].id}`, { status: 'done' });
  check('PATCH /api/actions → done_at gesetzt', actionPatch.status === 200 && actionPatch.data.done_at != null);

  const badDomain = await json('POST', '/api/domains', { host: 'kein host' });
  check('Ungültige Domain → 400', badDomain.status === 400);
  const notFound = await json('GET', '/api/gibtsnicht');
  check('Unbekannter API-Pfad → 404', notFound.status === 404);
} catch (err) {
  failures++;
  console.error('Smoke-Test abgebrochen:', err.message);
  console.error('Server-Log:', serverLog.slice(-2000));
} finally {
  child.kill('SIGTERM');
  fs.rmSync(dataDir, { recursive: true, force: true });
}

if (failures > 0) {
  console.error(`\n${failures} Prüfung(en) fehlgeschlagen.`);
  process.exit(1);
}
console.log('\nAlle Smoke-Checks bestanden. ✓');
