import { Router } from 'express';
import { getDb } from '../db.js';
import { asyncHandler, HttpError, log } from '../util.js';
import { serpCheck, searchVolume } from '../services/dataforseo.js';
import { computeAndStoreScores } from '../services/scoring.js';

const router = Router();

const MAX_REFRESH_BATCH = 50;

router.get('/', asyncHandler(async (_req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT k.*, d.host, d.label AS domain_label, d.is_own,
        (SELECT r.position FROM rankings r WHERE r.keyword_id = k.id ORDER BY r.checked_at DESC, r.id DESC LIMIT 1) AS position,
        (SELECT r.position FROM rankings r WHERE r.keyword_id = k.id ORDER BY r.checked_at DESC, r.id DESC LIMIT 1 OFFSET 1) AS prev_position,
        (SELECT r.url FROM rankings r WHERE r.keyword_id = k.id ORDER BY r.checked_at DESC, r.id DESC LIMIT 1) AS ranking_url,
        (SELECT r.serp_features FROM rankings r WHERE r.keyword_id = k.id ORDER BY r.checked_at DESC, r.id DESC LIMIT 1) AS serp_features,
        (SELECT r.checked_at FROM rankings r WHERE r.keyword_id = k.id ORDER BY r.checked_at DESC, r.id DESC LIMIT 1) AS checked_at,
        (SELECT r.source FROM rankings r WHERE r.keyword_id = k.id ORDER BY r.checked_at DESC, r.id DESC LIMIT 1) AS ranking_source,
        (SELECT m.search_volume FROM keyword_metrics m WHERE m.keyword_id = k.id ORDER BY m.fetched_at DESC, m.id DESC LIMIT 1) AS search_volume,
        (SELECT m.cpc FROM keyword_metrics m WHERE m.keyword_id = k.id ORDER BY m.fetched_at DESC, m.id DESC LIMIT 1) AS cpc,
        (SELECT m.competition FROM keyword_metrics m WHERE m.keyword_id = k.id ORDER BY m.fetched_at DESC, m.id DESC LIMIT 1) AS competition
       FROM keywords k JOIN domains d ON d.id = k.domain_id
       ORDER BY d.is_own DESC, d.host, k.priority = 'HOCH' DESC, k.keyword`
    )
    .all();
  res.json(rows);
}));

router.post('/', asyncHandler(async (req, res) => {
  const keyword = (req.body?.keyword || '').trim().toLowerCase();
  const domainId = Number(req.body?.domainId);
  if (!keyword || keyword.length < 2 || keyword.length > 120) {
    throw new HttpError(400, 'Keyword muss 2–120 Zeichen lang sein.');
  }
  const db = getDb();
  if (!db.prepare('SELECT id FROM domains WHERE id = ?').get(domainId)) {
    throw new HttpError(400, 'Unbekannte Domain.');
  }
  const intent = (req.body?.intent || 'transaktional').slice(0, 40);
  const priority = ['HOCH', 'MITTEL', 'NIEDRIG'].includes(req.body?.priority) ? req.body.priority : 'MITTEL';
  const isBrand = req.body?.isBrand ? 1 : 0;
  try {
    const info = db
      .prepare('INSERT INTO keywords (keyword, domain_id, intent, priority, is_brand) VALUES (?, ?, ?, ?, ?)')
      .run(keyword, domainId, intent, priority, isBrand);
    res.status(201).json(db.prepare('SELECT * FROM keywords WHERE id = ?').get(info.lastInsertRowid));
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) throw new HttpError(409, 'Keyword existiert für diese Domain bereits.');
    throw e;
  }
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const info = getDb().prepare('DELETE FROM keywords WHERE id = ?').run(Number(req.params.id));
  if (!info.changes) throw new HttpError(404, 'Keyword nicht gefunden.');
  res.json({ ok: true });
}));

/**
 * Rankings + Suchvolumen aktualisieren.
 * Body: { domainId?: number } — ohne domainId werden alle Keywords geprüft (max. 50 pro Aufruf).
 * Achtung Live-Modus: jede SERP-Abfrage kostet DataForSEO-Guthaben (~0,002 $/Keyword).
 */
router.post('/refresh', asyncHandler(async (req, res) => {
  const db = getDb();
  const domainId = req.body?.domainId ? Number(req.body.domainId) : null;
  // Rotation nach Aktualität: zuletzt geprüfte Keywords kommen zuletzt dran —
  // bei >50 Keywords arbeiten wiederholte Aufrufe alle reihum ab.
  const keywords = db
    .prepare(
      `SELECT k.*, d.host, d.is_own FROM keywords k JOIN domains d ON d.id = k.domain_id
       ${domainId ? 'WHERE k.domain_id = @domainId' : ''}
       ORDER BY COALESCE((SELECT MAX(r.checked_at) FROM rankings r WHERE r.keyword_id = k.id), '') ASC, k.id
       LIMIT ${MAX_REFRESH_BATCH}`
    )
    .all(domainId ? { domainId } : {});
  if (!keywords.length) return res.json({ refreshed: 0, total: 0, errors: [] });

  const errors = [];
  const insertRanking = db.prepare(
    'INSERT INTO rankings (keyword_id, position, url, serp_features, source) VALUES (?, ?, ?, ?, ?)'
  );

  // SERP-Checks sequenziell — schont Rate-Limits und macht Kosten kalkulierbar.
  let refreshed = 0;
  for (const kw of keywords) {
    try {
      const r = await serpCheck(kw.keyword, kw.host, Boolean(kw.is_own));
      insertRanking.run(kw.id, r.position, r.url, r.serpFeatures, r.source);
      refreshed++;
    } catch (err) {
      errors.push({ keyword: kw.keyword, error: err.message });
      log('error', `SERP-Check „${kw.keyword}" fehlgeschlagen`, err.message);
    }
  }

  // Suchvolumen als ein Batch-Call
  try {
    const volumes = await searchVolume(keywords.map((k) => k.keyword));
    const insertMetric = db.prepare(
      'INSERT INTO keyword_metrics (keyword_id, search_volume, cpc, competition, source) VALUES (?, ?, ?, ?, ?)'
    );
    db.transaction(() => {
      for (const kw of keywords) {
        const v = volumes.get(kw.keyword.toLowerCase());
        if (v) insertMetric.run(kw.id, v.search_volume, v.cpc, v.competition, v.source);
      }
    })();
  } catch (err) {
    errors.push({ keyword: '(Suchvolumen-Batch)', error: err.message });
    log('error', 'Suchvolumen-Abfrage fehlgeschlagen', err.message);
  }

  // Scores der betroffenen Domains neu berechnen (Rankings fließen in SEO-Score ein)
  const affectedDomains = [...new Set(keywords.map((k) => k.domain_id))];
  for (const dId of affectedDomains) computeAndStoreScores(dId);

  res.json({ refreshed, total: keywords.length, errors });
}));

router.get('/:id/history', asyncHandler(async (req, res) => {
  const db = getDb();
  const id = Number(req.params.id);
  const rankings = db
    .prepare('SELECT position, url, source, checked_at FROM rankings WHERE keyword_id = ? ORDER BY checked_at ASC, id ASC')
    .all(id);
  const metrics = db
    .prepare('SELECT search_volume, cpc, competition, source, fetched_at FROM keyword_metrics WHERE keyword_id = ? ORDER BY fetched_at ASC, id ASC')
    .all(id);
  res.json({ rankings, metrics });
}));

export default router;
