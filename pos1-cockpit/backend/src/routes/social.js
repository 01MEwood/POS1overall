import { Router } from 'express';
import { getDb } from '../db.js';
import { asyncHandler, HttpError } from '../util.js';

const router = Router();

const PRIORITIES = ['primary', 'secondary', 'optional'];

router.get('/', asyncHandler(async (_req, res) => {
  const db = getDb();
  const channels = db
    .prepare(
      `SELECT c.*, b.name AS brand_name, b.slug AS brand_slug,
        (SELECT k.followers FROM social_kpis k WHERE k.channel_id = c.id AND k.followers IS NOT NULL ORDER BY k.metric_date DESC LIMIT 1) AS followers,
        (SELECT k.followers FROM social_kpis k WHERE k.channel_id = c.id AND k.followers IS NOT NULL ORDER BY k.metric_date DESC LIMIT 1 OFFSET 1) AS prev_followers,
        (SELECT k.engagement FROM social_kpis k WHERE k.channel_id = c.id AND k.engagement IS NOT NULL ORDER BY k.metric_date DESC LIMIT 1) AS engagement,
        (SELECT MAX(k.metric_date) FROM social_kpis k WHERE k.channel_id = c.id) AS last_entry
       FROM social_channels c JOIN brands b ON b.id = c.brand_id
       ORDER BY b.id, CASE c.priority WHEN 'primary' THEN 0 WHEN 'secondary' THEN 1 ELSE 2 END, c.platform`
    )
    .all();
  res.json(channels);
}));

router.post('/channels', asyncHandler(async (req, res) => {
  const db = getDb();
  const brandId = Number(req.body?.brandId);
  const platform = (req.body?.platform || '').trim().slice(0, 60);
  if (!platform) throw new HttpError(400, 'Plattform-Name fehlt.');
  if (!db.prepare('SELECT id FROM brands WHERE id = ?').get(brandId)) {
    throw new HttpError(400, 'Unbekannte Marke.');
  }
  const priority = PRIORITIES.includes(req.body?.priority) ? req.body.priority : 'secondary';
  try {
    const info = db
      .prepare(
        `INSERT INTO social_channels (brand_id, platform, handle, url, priority, rationale, active)
         VALUES (?, ?, ?, ?, ?, ?, 1)`
      )
      .run(brandId, platform, (req.body?.handle || '').slice(0, 120), (req.body?.url || '').slice(0, 300),
        priority, (req.body?.rationale || '').slice(0, 500));
    res.status(201).json(db.prepare('SELECT * FROM social_channels WHERE id = ?').get(info.lastInsertRowid));
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) throw new HttpError(409, 'Kanal existiert für diese Marke bereits.');
    throw e;
  }
}));

router.patch('/channels/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const id = Number(req.params.id);
  if (!db.prepare('SELECT id FROM social_channels WHERE id = ?').get(id)) {
    throw new HttpError(404, 'Kanal nicht gefunden.');
  }
  const updates = [];
  const values = [];
  for (const f of ['handle', 'url', 'rationale']) {
    if (typeof req.body?.[f] === 'string') {
      updates.push(`${f} = ?`);
      values.push(req.body[f].slice(0, 500));
    }
  }
  if (PRIORITIES.includes(req.body?.priority)) {
    updates.push('priority = ?');
    values.push(req.body.priority);
  }
  if (typeof req.body?.active === 'boolean') {
    updates.push('active = ?');
    values.push(req.body.active ? 1 : 0);
  }
  if (!updates.length) throw new HttpError(400, 'Keine änderbaren Felder übergeben.');
  db.prepare(`UPDATE social_channels SET ${updates.join(', ')} WHERE id = ?`).run(...values, id);
  res.json(db.prepare('SELECT * FROM social_channels WHERE id = ?').get(id));
}));

router.delete('/channels/:id', asyncHandler(async (req, res) => {
  const info = getDb().prepare('DELETE FROM social_channels WHERE id = ?').run(Number(req.params.id));
  if (!info.changes) throw new HttpError(404, 'Kanal nicht gefunden.');
  res.json({ ok: true });
}));

/** KPI-Eintrag anlegen/aktualisieren (ein Eintrag pro Kanal und Datum). */
router.post('/kpis', asyncHandler(async (req, res) => {
  const db = getDb();
  const channelId = Number(req.body?.channelId);
  if (!db.prepare('SELECT id FROM social_channels WHERE id = ?').get(channelId)) {
    throw new HttpError(400, 'Unbekannter Kanal.');
  }
  const date = req.body?.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new HttpError(400, 'Datum im Format JJJJ-MM-TT erwartet.');
  const num = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v));
  db.prepare(
    `INSERT INTO social_kpis (channel_id, metric_date, followers, posts, reach, engagement, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(channel_id, metric_date) DO UPDATE SET
       followers = excluded.followers, posts = excluded.posts,
       reach = excluded.reach, engagement = excluded.engagement, notes = excluded.notes`
  ).run(channelId, date, num(req.body?.followers), num(req.body?.posts), num(req.body?.reach),
    num(req.body?.engagement), (req.body?.notes || '').slice(0, 300));
  res.status(201).json({ ok: true });
}));

router.get('/channels/:id/kpis', asyncHandler(async (req, res) => {
  const rows = getDb()
    .prepare('SELECT * FROM social_kpis WHERE channel_id = ? ORDER BY metric_date ASC')
    .all(Number(req.params.id));
  res.json(rows);
}));

router.delete('/kpis/:id', asyncHandler(async (req, res) => {
  const info = getDb().prepare('DELETE FROM social_kpis WHERE id = ?').run(Number(req.params.id));
  if (!info.changes) throw new HttpError(404, 'KPI-Eintrag nicht gefunden.');
  res.json({ ok: true });
}));

export default router;
