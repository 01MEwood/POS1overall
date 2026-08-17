import { Router } from 'express';
import { getDb } from '../db.js';
import { asyncHandler, HttpError } from '../util.js';

const router = Router();

const PRIORITIES = ['P0', 'P1', 'P2'];
const STATUSES = ['open', 'in_progress', 'done'];
const PILLARS = ['seo', 'aeo', 'geo', 'performance', 'social', 'brand', 'content'];

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const where = [];
  const params = {};
  if (STATUSES.includes(req.query.status)) { where.push('a.status = @status'); params.status = req.query.status; }
  if (PRIORITIES.includes(req.query.priority)) { where.push('a.priority = @priority'); params.priority = req.query.priority; }
  if (PILLARS.includes(req.query.pillar)) { where.push('a.pillar = @pillar'); params.pillar = req.query.pillar; }
  if (req.query.brandId) { where.push('a.brand_id = @brandId'); params.brandId = Number(req.query.brandId); }
  const rows = db
    .prepare(
      `SELECT a.*, b.name AS brand_name, d.host AS domain_host FROM actions a
       LEFT JOIN brands b ON b.id = a.brand_id
       LEFT JOIN domains d ON d.id = a.domain_id
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY CASE a.priority WHEN 'P0' THEN 0 WHEN 'P1' THEN 1 ELSE 2 END,
                CASE a.status WHEN 'in_progress' THEN 0 WHEN 'open' THEN 1 ELSE 2 END, a.id`
    )
    .all(params);
  res.json(rows);
}));

router.post('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const title = (req.body?.title || '').trim().slice(0, 200);
  if (!title) throw new HttpError(400, 'Titel fehlt.');
  const priority = PRIORITIES.includes(req.body?.priority) ? req.body.priority : 'P1';
  const pillar = PILLARS.includes(req.body?.pillar) ? req.body.pillar : 'seo';
  const brandId = req.body?.brandId ? Number(req.body.brandId) : null;
  const domainId = req.body?.domainId ? Number(req.body.domainId) : null;
  const info = db
    .prepare(
      `INSERT INTO actions (title, description, pillar, priority, impact, effort, brand_id, domain_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(title, (req.body?.description || '').slice(0, 2000), pillar, priority,
      (req.body?.impact || 'mittel').slice(0, 20), (req.body?.effort || 'mittel').slice(0, 20),
      brandId, domainId);
  res.status(201).json(db.prepare('SELECT * FROM actions WHERE id = ?').get(info.lastInsertRowid));
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const id = Number(req.params.id);
  const action = db.prepare('SELECT * FROM actions WHERE id = ?').get(id);
  if (!action) throw new HttpError(404, 'Maßnahme nicht gefunden.');
  const updates = [];
  const values = [];
  if (STATUSES.includes(req.body?.status)) {
    updates.push('status = ?');
    values.push(req.body.status);
    updates.push("done_at = CASE WHEN ? = 'done' THEN datetime('now') ELSE NULL END");
    values.push(req.body.status);
  }
  if (PRIORITIES.includes(req.body?.priority)) { updates.push('priority = ?'); values.push(req.body.priority); }
  if (PILLARS.includes(req.body?.pillar)) { updates.push('pillar = ?'); values.push(req.body.pillar); }
  for (const f of ['title', 'description', 'impact', 'effort']) {
    if (typeof req.body?.[f] === 'string' && req.body[f].trim()) {
      updates.push(`${f} = ?`);
      values.push(req.body[f].slice(0, f === 'description' ? 2000 : 200));
    }
  }
  if (!updates.length) throw new HttpError(400, 'Keine änderbaren Felder übergeben.');
  db.prepare(`UPDATE actions SET ${updates.join(', ')} WHERE id = ?`).run(...values, id);
  res.json(db.prepare('SELECT * FROM actions WHERE id = ?').get(id));
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const info = getDb().prepare('DELETE FROM actions WHERE id = ?').run(Number(req.params.id));
  if (!info.changes) throw new HttpError(404, 'Maßnahme nicht gefunden.');
  res.json({ ok: true });
}));

export default router;
