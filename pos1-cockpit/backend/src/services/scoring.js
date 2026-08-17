import { getDb } from '../db.js';

/**
 * Scoring-Engine: verdichtet Scan-Checks, Rankings und Social-Daten zu
 * Säulen-Scores (0–100) und einem Overall-Benchmark-Score pro Domain.
 *
 * Gewichtung Overall: SEO 30 % · AEO 20 % · GEO 20 % · Performance 15 % · Social 15 %.
 * Fehlt eine Säule (z. B. Social bei Wettbewerbern), wird über die vorhandenen
 * Säulen renormalisiert.
 */

const OVERALL_WEIGHTS = { seo: 0.3, aeo: 0.2, geo: 0.2, performance: 0.15, social: 0.15 };

/** Checks einer Säule → 0–100. pass = volle, warn = halbe Punkte; info zählt nicht. */
export function checksToScore(checks) {
  let earned = 0;
  let possible = 0;
  for (const c of checks) {
    if (c.status === 'info' || !c.weight) continue;
    possible += c.weight;
    if (c.status === 'pass') earned += c.weight;
    else if (c.status === 'warn') earned += c.weight * 0.5;
  }
  if (!possible) return null;
  return Math.round((earned / possible) * 100);
}

/** Google-Position → 0–100 (Position 1 = 100, nicht in Top 100 = 5). */
export function positionToScore(position) {
  if (position == null) return 5;
  if (position <= 1) return 100;
  if (position <= 3) return 92;
  if (position <= 5) return 85;
  if (position <= 10) return 72;
  if (position <= 20) return 55;
  if (position <= 30) return 40;
  if (position <= 50) return 25;
  return 12;
}

/** Durchschnitt der letzten Ranking-Positionen aller Nicht-Brand-Keywords einer Domain. */
export function rankingScoreForDomain(domainId) {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT k.id, (
         SELECT r.position FROM rankings r
         WHERE r.keyword_id = k.id ORDER BY r.checked_at DESC, r.id DESC LIMIT 1
       ) AS position,
       (SELECT COUNT(*) FROM rankings r WHERE r.keyword_id = k.id) AS checked
       FROM keywords k WHERE k.domain_id = ? AND k.is_brand = 0`
    )
    .all(domainId);
  const checkedRows = rows.filter((r) => r.checked > 0);
  if (!checkedRows.length) return null;
  const avg = checkedRows.reduce((s, r) => s + positionToScore(r.position), 0) / checkedRows.length;
  return Math.round(avg);
}

/** Social-Score einer Marke: Kanal-Setup + Datenpflege + Wachstum. */
export function socialScoreForBrand(brandId) {
  const db = getDb();
  const channels = db
    .prepare('SELECT * FROM social_channels WHERE brand_id = ?')
    .all(brandId);
  if (!channels.length) return null;

  const primaries = channels.filter((c) => c.priority === 'primary');
  const primariesActive = primaries.filter((c) => c.active).length;
  // 40 P.: primäre Kanäle aktiv
  const setupScore = primaries.length ? (primariesActive / primaries.length) * 40 : 20;

  // 20 P.: Handles/URLs gepflegt (aktive Kanäle)
  const active = channels.filter((c) => c.active);
  const withHandle = active.filter((c) => c.handle || c.url).length;
  const handleScore = active.length ? (withHandle / active.length) * 20 : 0;

  // 20 P.: aktuelle KPI-Daten (Eintrag der letzten 45 Tage auf aktiven Kanälen)
  const cutoff = new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const recentIds = new Set(
    db
      .prepare(
        `SELECT DISTINCT k.channel_id FROM social_kpis k
         JOIN social_channels c ON c.id = k.channel_id
         WHERE c.brand_id = ? AND c.active = 1 AND k.metric_date >= ?`
      )
      .all(brandId, cutoff)
      .map((r) => r.channel_id)
  );
  const freshScore = active.length ? (recentIds.size / active.length) * 20 : 0;

  // 20 P.: Follower-Wachstum (letzter vs. vorletzter Eintrag je Kanal)
  let growthPairs = 0;
  let growthPositive = 0;
  for (const c of active) {
    const last2 = db
      .prepare(
        'SELECT followers FROM social_kpis WHERE channel_id = ? AND followers IS NOT NULL ORDER BY metric_date DESC LIMIT 2'
      )
      .all(c.id);
    if (last2.length === 2) {
      growthPairs++;
      if (last2[0].followers > last2[1].followers) growthPositive++;
    }
  }
  const growthScore = growthPairs ? (growthPositive / growthPairs) * 20 : 10;

  return Math.round(setupScore + handleScore + freshScore + growthScore);
}

/**
 * Berechnet alle Säulen-Scores einer Domain aus dem letzten Scan + Rankings + Social
 * und persistiert sie (eine Zeile je Säule + 'overall') für die Verlaufsansicht.
 */
export function computeAndStoreScores(domainId) {
  const db = getDb();
  const domain = db.prepare('SELECT * FROM domains WHERE id = ?').get(domainId);
  if (!domain) return null;

  const scan = db
    .prepare("SELECT * FROM scans WHERE domain_id = ? AND status = 'ok' ORDER BY id DESC LIMIT 1")
    .get(domainId);

  const pillars = {};
  if (scan) {
    const checks = db.prepare('SELECT * FROM scan_checks WHERE scan_id = ?').all(scan.id);
    for (const pillar of ['seo', 'aeo', 'geo', 'performance']) {
      pillars[pillar] = checksToScore(checks.filter((c) => c.pillar === pillar));
    }
  }

  // SEO = 60 % OnPage + 40 % Rankings (falls Rankings vorhanden)
  const rankScore = rankingScoreForDomain(domainId);
  if (rankScore != null) {
    pillars.seo = pillars.seo != null ? Math.round(pillars.seo * 0.6 + rankScore * 0.4) : rankScore;
  }

  if (domain.is_own && domain.brand_id) {
    const social = socialScoreForBrand(domain.brand_id);
    if (social != null) pillars.social = social;
  }

  let weightSum = 0;
  let scoreSum = 0;
  for (const [pillar, weight] of Object.entries(OVERALL_WEIGHTS)) {
    if (pillars[pillar] != null) {
      weightSum += weight;
      scoreSum += pillars[pillar] * weight;
    }
  }
  const overall = weightSum > 0 ? Math.round(scoreSum / weightSum) : null;

  const insert = db.prepare('INSERT INTO scores (domain_id, pillar, score) VALUES (?, ?, ?)');
  const tx = db.transaction(() => {
    for (const [pillar, score] of Object.entries(pillars)) {
      if (score != null) insert.run(domainId, pillar, score);
    }
    if (overall != null) insert.run(domainId, 'overall', overall);
  });
  tx();

  return { ...pillars, overall };
}

/** Letzter Score je Säule + Delta zum vorherigen Messpunkt. */
export function latestScores(domainId) {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT pillar, score, computed_at FROM scores
       WHERE domain_id = ? ORDER BY computed_at DESC, id DESC`
    )
    .all(domainId);
  const latest = {};
  const previous = {};
  for (const row of rows) {
    if (!(row.pillar in latest)) latest[row.pillar] = row;
    else if (!(row.pillar in previous) && row.computed_at !== latest[row.pillar].computed_at) {
      previous[row.pillar] = row;
    }
  }
  const result = {};
  for (const [pillar, row] of Object.entries(latest)) {
    result[pillar] = {
      score: row.score,
      computedAt: row.computed_at,
      delta: previous[pillar] ? Math.round(row.score - previous[pillar].score) : null,
    };
  }
  return result;
}
