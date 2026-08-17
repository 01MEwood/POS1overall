import { Router } from 'express';
import { getDb } from '../db.js';
import { asyncHandler } from '../util.js';
import { latestScores } from '../services/scoring.js';
import { mode, costTotal } from '../services/dataforseo.js';

const router = Router();

router.get('/status', asyncHandler(async (_req, res) => {
  res.json({
    app: 'POS1 Cockpit',
    version: '1.0.0',
    mode: mode(),
    dataforseoCostTotal: costTotal(),
  });
}));

/** Aggregierte Sicht für das Dashboard: Domains + Scores, Keyword-Highlights, Roadmap-Zähler. */
router.get('/overview', asyncHandler(async (_req, res) => {
  const db = getDb();

  const domains = db
    .prepare(
      `SELECT d.id, d.host, d.label, d.is_own, d.brand_id, b.name AS brand_name,
        (SELECT MAX(finished_at) FROM scans s WHERE s.domain_id = d.id AND s.status = 'ok') AS last_scan_at,
        (SELECT source FROM scans s WHERE s.domain_id = d.id AND s.status = 'ok' ORDER BY s.id DESC LIMIT 1) AS last_scan_source
       FROM domains d LEFT JOIN brands b ON b.id = d.brand_id ORDER BY d.is_own DESC, d.id`
    )
    .all()
    .map((d) => ({ ...d, scores: latestScores(d.id) }));

  const keywords = db
    .prepare(
      `SELECT k.id, k.keyword, k.priority, k.is_brand, d.host, d.is_own,
        (SELECT r.position FROM rankings r WHERE r.keyword_id = k.id ORDER BY r.checked_at DESC, r.id DESC LIMIT 1) AS position,
        (SELECT r.position FROM rankings r WHERE r.keyword_id = k.id ORDER BY r.checked_at DESC, r.id DESC LIMIT 1 OFFSET 1) AS prev_position,
        (SELECT m.search_volume FROM keyword_metrics m WHERE m.keyword_id = k.id ORDER BY m.fetched_at DESC, m.id DESC LIMIT 1) AS search_volume
       FROM keywords k JOIN domains d ON d.id = k.domain_id WHERE d.is_own = 1`
    )
    .all();

  const ranked = keywords.filter((k) => k.position != null);
  const top10 = ranked.filter((k) => k.position <= 10).length;
  const movers = ranked
    .filter((k) => k.prev_position != null && k.position !== k.prev_position)
    .map((k) => ({ ...k, delta: k.prev_position - k.position }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 6);

  const actionCounts = db
    .prepare(
      `SELECT priority, status, COUNT(*) AS c FROM actions GROUP BY priority, status`
    )
    .all();

  const nextActions = db
    .prepare(
      `SELECT a.id, a.title, a.priority, a.pillar, a.status, b.name AS brand_name FROM actions a
       LEFT JOIN brands b ON b.id = a.brand_id
       WHERE a.status != 'done'
       ORDER BY CASE a.priority WHEN 'P0' THEN 0 WHEN 'P1' THEN 1 ELSE 2 END, a.id LIMIT 8`
    )
    .all();

  const scoreHistory = db
    .prepare(
      `SELECT s.domain_id, d.host, s.score, s.computed_at FROM scores s
       JOIN domains d ON d.id = s.domain_id
       WHERE s.pillar = 'overall' AND d.is_own = 1
       ORDER BY s.computed_at ASC, s.id ASC`
    )
    .all();

  res.json({
    domains,
    keywordSummary: { total: keywords.length, ranked: ranked.length, top10, movers },
    actionCounts,
    nextActions,
    scoreHistory,
  });
}));

export default router;
