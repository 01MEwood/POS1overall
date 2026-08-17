import { Router } from 'express';
import { getDb } from '../db.js';
import { asyncHandler, HttpError, normalizeHost, log } from '../util.js';
import { scanDomain } from '../services/siteScanner.js';
import { demoScan } from '../services/demoData.js';
import { computeAndStoreScores, latestScores } from '../services/scoring.js';
import { backlinksSummary, isLiveMode } from '../services/dataforseo.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const db = getDb();
  const domains = db
    .prepare(
      `SELECT d.*, b.name AS brand_name, b.slug AS brand_slug,
        (SELECT MAX(finished_at) FROM scans s WHERE s.domain_id = d.id AND s.status = 'ok') AS last_scan_at,
        (SELECT source FROM scans s WHERE s.domain_id = d.id AND s.status = 'ok' ORDER BY s.id DESC LIMIT 1) AS last_scan_source
       FROM domains d LEFT JOIN brands b ON b.id = d.brand_id
       ORDER BY d.is_own DESC, d.id`
    )
    .all();
  res.json(domains.map((d) => ({ ...d, scores: latestScores(d.id) })));
}));

router.post('/', asyncHandler(async (req, res) => {
  const host = normalizeHost(req.body?.host);
  if (!host) throw new HttpError(400, 'Ungültige Domain — erwartet z. B. „example.de".');
  const label = (req.body?.label || host).trim().slice(0, 120);
  const brandId = req.body?.brandId ? Number(req.body.brandId) : null;
  const isOwn = req.body?.isOwn === false ? 0 : 1;
  const db = getDb();
  if (brandId && !db.prepare('SELECT id FROM brands WHERE id = ?').get(brandId)) {
    throw new HttpError(400, 'Unbekannte Marke.');
  }
  try {
    const info = db
      .prepare('INSERT INTO domains (host, label, brand_id, is_own) VALUES (?, ?, ?, ?)')
      .run(host, label, brandId, isOwn);
    res.status(201).json(db.prepare('SELECT * FROM domains WHERE id = ?').get(info.lastInsertRowid));
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) throw new HttpError(409, `Domain ${host} existiert bereits.`);
    throw e;
  }
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const info = db.prepare('DELETE FROM domains WHERE id = ?').run(Number(req.params.id));
  if (!info.changes) throw new HttpError(404, 'Domain nicht gefunden.');
  res.json({ ok: true });
}));

/** Scan ausführen: live; scheitert der Live-Zugriff im Demo-Modus, gibt es einen markierten Demo-Scan. */
router.post('/:id/scan', asyncHandler(async (req, res) => {
  const db = getDb();
  const domain = db.prepare('SELECT * FROM domains WHERE id = ?').get(Number(req.params.id));
  if (!domain) throw new HttpError(404, 'Domain nicht gefunden.');

  let result;
  let source = 'live';
  let scanError = null;
  try {
    result = await scanDomain(domain.host);
  } catch (err) {
    scanError = err.message;
    if (!isLiveMode()) {
      log('info', `Live-Scan für ${domain.host} fehlgeschlagen (${err.message}) — Demo-Scan wird verwendet.`);
      result = demoScan(domain.host);
      source = 'demo';
    }
  }

  if (!result) {
    db.prepare(
      "INSERT INTO scans (domain_id, url, status, source, error, finished_at) VALUES (?, ?, 'error', 'live', ?, datetime('now'))"
    ).run(domain.id, `https://${domain.host}/`, scanError);
    throw new HttpError(502, `Scan fehlgeschlagen: ${scanError}`);
  }

  const insertScan = db.prepare(
    "INSERT INTO scans (domain_id, url, status, source, finished_at) VALUES (?, ?, 'ok', ?, datetime('now'))"
  );
  const insertCheck = db.prepare(
    `INSERT INTO scan_checks (scan_id, pillar, check_key, label, status, value, recommendation, weight)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  let scanId;
  db.transaction(() => {
    scanId = insertScan.run(domain.id, result.url, source).lastInsertRowid;
    for (const c of result.checks) {
      insertCheck.run(scanId, c.pillar, c.check_key, c.label, c.status, c.value, c.recommendation, c.weight);
    }
  })();

  const scores = computeAndStoreScores(domain.id);
  res.json({ scanId, source, scores, checks: result.checks });
}));

router.get('/:id/scan', asyncHandler(async (req, res) => {
  const db = getDb();
  const scan = db
    .prepare("SELECT * FROM scans WHERE domain_id = ? AND status = 'ok' ORDER BY id DESC LIMIT 1")
    .get(Number(req.params.id));
  if (!scan) return res.json({ scan: null, checks: [] });
  const checks = db.prepare('SELECT * FROM scan_checks WHERE scan_id = ? ORDER BY pillar, weight DESC').all(scan.id);
  res.json({ scan, checks });
}));

router.get('/:id/history', asyncHandler(async (req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT pillar, score, computed_at FROM scores
       WHERE domain_id = ? ORDER BY computed_at ASC, id ASC`
    )
    .all(Number(req.params.id));
  res.json(rows);
}));

/** Backlink-Snapshot holen (DataForSEO oder Demo) und speichern. */
router.post('/:id/backlinks', asyncHandler(async (req, res) => {
  const db = getDb();
  const domain = db.prepare('SELECT * FROM domains WHERE id = ?').get(Number(req.params.id));
  if (!domain) throw new HttpError(404, 'Domain nicht gefunden.');
  const summary = await backlinksSummary(domain.host);
  db.prepare(
    `INSERT INTO backlink_snapshots (domain_id, backlinks, referring_domains, domain_rank, source)
     VALUES (?, ?, ?, ?, ?)`
  ).run(domain.id, summary.backlinks, summary.referring_domains, summary.domain_rank, summary.source);
  res.json(summary);
}));

router.get('/:id/backlinks', asyncHandler(async (req, res) => {
  const db = getDb();
  const rows = db
    .prepare('SELECT * FROM backlink_snapshots WHERE domain_id = ? ORDER BY fetched_at ASC')
    .all(Number(req.params.id));
  res.json(rows);
}));

export default router;
