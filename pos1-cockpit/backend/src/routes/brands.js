import { Router } from 'express';
import { getDb, getSetting, setSetting } from '../db.js';
import { asyncHandler, HttpError } from '../util.js';
import { brandSerpOwnership } from '../services/dataforseo.js';
import { socialScoreForBrand } from '../services/scoring.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const db = getDb();
  const brands = db.prepare('SELECT * FROM brands ORDER BY id').all();
  const result = brands.map((b) => {
    const domains = db.prepare('SELECT id, host, label, is_own FROM domains WHERE brand_id = ? ORDER BY is_own DESC, id').all(b.id);
    const channels = db.prepare('SELECT * FROM social_channels WHERE brand_id = ? ORDER BY priority, platform').all(b.id);
    const openActions = db.prepare("SELECT COUNT(*) AS c FROM actions WHERE brand_id = ? AND status != 'done'").get(b.id).c;
    return { ...b, domains, channels, openActions, socialScore: socialScoreForBrand(b.id) };
  });
  res.json(result);
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const id = Number(req.params.id);
  const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(id);
  if (!brand) throw new HttpError(404, 'Marke nicht gefunden.');
  const fields = ['name', 'dpma_status', 'dpma_note', 'positioning', 'target_audience', 'notes'];
  const updates = [];
  const values = [];
  for (const f of fields) {
    if (typeof req.body?.[f] === 'string') {
      updates.push(`${f} = ?`);
      values.push(req.body[f].slice(0, 2000));
    }
  }
  if (!updates.length) throw new HttpError(400, 'Keine änderbaren Felder übergeben.');
  db.prepare(`UPDATE brands SET ${updates.join(', ')} WHERE id = ?`).run(...values, id);
  res.json(db.prepare('SELECT * FROM brands WHERE id = ?').get(id));
}));

/**
 * Marken-KPIs aus vorhandenen Daten (keine API-Kosten):
 * Brand-Suchvolumen-Verlauf, Brand-Position, Social-Follower-Verlauf, SERP-Ownership (letzter Stand).
 */
router.get('/:id/kpis', asyncHandler(async (req, res) => {
  const db = getDb();
  const id = Number(req.params.id);
  const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(id);
  if (!brand) throw new HttpError(404, 'Marke nicht gefunden.');

  const brandKeywords = db
    .prepare(
      `SELECT k.id, k.keyword, d.host FROM keywords k
       JOIN domains d ON d.id = k.domain_id
       WHERE k.is_brand = 1 AND d.brand_id = ? AND d.is_own = 1`
    )
    .all(id);

  const volumeHistory = [];
  const positions = [];
  for (const kw of brandKeywords) {
    const metrics = db
      .prepare('SELECT search_volume, fetched_at, source FROM keyword_metrics WHERE keyword_id = ? ORDER BY fetched_at ASC')
      .all(kw.id);
    volumeHistory.push({ keyword: kw.keyword, points: metrics });
    const latest = db
      .prepare('SELECT position, checked_at, source FROM rankings WHERE keyword_id = ? ORDER BY checked_at DESC, id DESC LIMIT 1')
      .get(kw.id);
    positions.push({ keyword: kw.keyword, ...latest });
  }

  const followerTrend = db
    .prepare(
      `SELECT k.metric_date AS date, SUM(k.followers) AS followers
       FROM social_kpis k JOIN social_channels c ON c.id = k.channel_id
       WHERE c.brand_id = ? AND k.followers IS NOT NULL
       GROUP BY k.metric_date ORDER BY k.metric_date ASC`
    )
    .all(id);

  let ownership = null;
  const stored = getSetting(`brand_ownership_${id}`);
  if (stored) {
    try { ownership = JSON.parse(stored); } catch { ownership = null; }
  }

  res.json({
    brand,
    brandKeywords: brandKeywords.map((k) => k.keyword),
    volumeHistory,
    positions,
    followerTrend,
    ownership,
    socialScore: socialScoreForBrand(id),
  });
}));

/** SERP-Ownership neu ermitteln (Live-Modus: 1 SERP-Abfrage pro Marke). */
router.post('/:id/ownership', asyncHandler(async (req, res) => {
  const db = getDb();
  const id = Number(req.params.id);
  const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(id);
  if (!brand) throw new HttpError(404, 'Marke nicht gefunden.');

  const domain = db.prepare('SELECT host FROM domains WHERE brand_id = ? AND is_own = 1 ORDER BY id LIMIT 1').get(id);
  if (!domain) throw new HttpError(400, 'Marke hat keine eigene Domain.');
  const socialUrls = db
    .prepare("SELECT url FROM social_channels WHERE brand_id = ? AND url != ''")
    .all(id)
    .map((r) => r.url);

  const result = await brandSerpOwnership(brand.name.toLowerCase(), domain.host, socialUrls);
  const payload = { ...result, checkedAt: new Date().toISOString() };
  setSetting(`brand_ownership_${id}`, JSON.stringify(payload));
  res.json(payload);
}));

export default router;
