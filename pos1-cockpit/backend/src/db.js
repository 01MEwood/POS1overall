import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import config from './config.js';
import { log } from './util.js';
import { seedIfEmpty } from './seed.js';

let db;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  dpma_status TEXT NOT NULL DEFAULT 'nicht eingetragen',
  dpma_note TEXT DEFAULT '',
  positioning TEXT DEFAULT '',
  target_audience TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS domains (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  host TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
  is_own INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS keywords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT NOT NULL,
  domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
  intent TEXT DEFAULT 'transaktional',
  priority TEXT DEFAULT 'MITTEL',
  is_brand INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(keyword, domain_id)
);

CREATE TABLE IF NOT EXISTS rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword_id INTEGER NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  position INTEGER,
  url TEXT,
  serp_features TEXT DEFAULT '',
  source TEXT NOT NULL DEFAULT 'demo',
  checked_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS keyword_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword_id INTEGER NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  search_volume INTEGER,
  cpc REAL,
  competition REAL,
  source TEXT NOT NULL DEFAULT 'demo',
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain_id INTEGER NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  url TEXT,
  status TEXT NOT NULL DEFAULT 'ok',
  source TEXT NOT NULL DEFAULT 'live',
  error TEXT,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT
);

CREATE TABLE IF NOT EXISTS scan_checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scan_id INTEGER NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  pillar TEXT NOT NULL,
  check_key TEXT NOT NULL,
  label TEXT NOT NULL,
  status TEXT NOT NULL,
  value TEXT,
  recommendation TEXT DEFAULT '',
  weight INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain_id INTEGER NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  pillar TEXT NOT NULL,
  score REAL,
  computed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS backlink_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain_id INTEGER NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  backlinks INTEGER,
  referring_domains INTEGER,
  domain_rank INTEGER,
  source TEXT NOT NULL DEFAULT 'demo',
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS social_channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  handle TEXT DEFAULT '',
  url TEXT DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'secondary',
  rationale TEXT DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(brand_id, platform)
);

CREATE TABLE IF NOT EXISTS social_kpis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel_id INTEGER NOT NULL REFERENCES social_channels(id) ON DELETE CASCADE,
  metric_date TEXT NOT NULL,
  followers INTEGER,
  posts INTEGER,
  reach INTEGER,
  engagement REAL,
  notes TEXT DEFAULT '',
  UNIQUE(channel_id, metric_date)
);

CREATE TABLE IF NOT EXISTS actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  pillar TEXT NOT NULL DEFAULT 'seo',
  priority TEXT NOT NULL DEFAULT 'P1',
  status TEXT NOT NULL DEFAULT 'open',
  impact TEXT DEFAULT 'mittel',
  effort TEXT DEFAULT 'mittel',
  brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
  domain_id INTEGER REFERENCES domains(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  done_at TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE INDEX IF NOT EXISTS idx_rankings_keyword ON rankings(keyword_id, checked_at);
CREATE INDEX IF NOT EXISTS idx_scores_domain ON scores(domain_id, pillar, computed_at);
CREATE INDEX IF NOT EXISTS idx_checks_scan ON scan_checks(scan_id);
CREATE INDEX IF NOT EXISTS idx_kpis_channel ON social_kpis(channel_id, metric_date);
`;

export function getDb() {
  if (db) return db;
  fs.mkdirSync(config.dataDir, { recursive: true });
  const file = path.join(config.dataDir, 'pos1.db');
  db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  seedIfEmpty(db);
  log('info', `SQLite bereit: ${file}`);
  return db;
}

export function getSetting(key, fallback = null) {
  const row = getDb().prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : fallback;
}

export function setSetting(key, value) {
  getDb()
    .prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .run(key, String(value));
}
