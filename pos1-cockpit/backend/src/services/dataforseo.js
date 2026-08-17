import { fetch as undiciFetch, EnvHttpProxyAgent } from 'undici';
import config, { isLiveMode } from '../config.js';
import { getSetting, setSetting } from '../db.js';
import { log } from '../util.js';
import { demoPosition, demoSearchVolume, demoBacklinks, demoSerpFeatures } from './demoData.js';

const dispatcher = new EnvHttpProxyAgent();

/**
 * Schlanker DataForSEO-Client (v3, Live-Endpoints).
 * Ohne Credentials (DATAFORSEO_LOGIN/PASSWORD) liefern alle Funktionen
 * deterministische Demo-Daten mit source='demo'.
 * API-Kosten werden kumuliert in settings.dfs_cost_total protokolliert.
 */

async function dfsPost(path, payload) {
  const { login, password, baseUrl, timeoutMs } = config.dataforseo;
  const auth = Buffer.from(`${login}:${password}`).toString('base64');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await undiciFetch(`${baseUrl}${path}`, {
      method: 'POST',
      dispatcher,
      signal: controller.signal,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`DataForSEO HTTP ${res.status} für ${path}`);
    }
    const data = await res.json();
    if (data.status_code !== 20000) {
      throw new Error(`DataForSEO-Fehler ${data.status_code}: ${data.status_message}`);
    }
    if (typeof data.cost === 'number' && data.cost > 0) {
      const total = parseFloat(getSetting('dfs_cost_total', '0')) + data.cost;
      setSetting('dfs_cost_total', total.toFixed(6));
    }
    const task = data.tasks?.[0];
    if (!task || (task.status_code && task.status_code >= 40000)) {
      throw new Error(`DataForSEO-Task-Fehler: ${task?.status_message || 'leere Antwort'}`);
    }
    return task.result || [];
  } finally {
    clearTimeout(timer);
  }
}

function hostMatches(itemDomain, host) {
  if (!itemDomain) return false;
  const d = itemDomain.toLowerCase().replace(/^www\./, '');
  return d === host || d.endsWith(`.${host}`);
}

/**
 * SERP-Check für ein Keyword: Position der Ziel-Domain in den Google-Top-100 (DE)
 * plus vorhandene SERP-Features.
 * → { position, url, serpFeatures, source }
 */
export async function serpCheck(keyword, host, isOwn = true) {
  if (!isLiveMode()) {
    return {
      position: demoPosition(keyword, host, isOwn),
      url: null,
      serpFeatures: demoSerpFeatures(keyword),
      source: 'demo',
    };
  }
  const result = await dfsPost('/v3/serp/google/organic/live/regular', [
    {
      keyword,
      location_code: config.dataforseo.locationCode,
      language_code: config.dataforseo.languageCode,
      depth: 100,
    },
  ]);
  const items = result?.[0]?.items || [];
  const organic = items.filter((i) => i.type === 'organic');
  const hit = organic.find((i) => hostMatches(i.domain, host));
  const featureTypes = new Set(items.map((i) => i.type).filter((t) => t !== 'organic'));
  return {
    position: hit ? hit.rank_absolute ?? hit.rank_group ?? null : null,
    url: hit?.url || null,
    serpFeatures: [...featureTypes].slice(0, 6).join(','),
    source: 'dataforseo',
  };
}

/**
 * Suchvolumen/CPC/Wettbewerb für bis zu 1000 Keywords (Google Ads Daten, DE).
 * → Map keyword(lowercase) → { search_volume, cpc, competition, source }
 */
export async function searchVolume(keywords) {
  const map = new Map();
  if (!keywords.length) return map;
  if (!isLiveMode()) {
    for (const kw of keywords) map.set(kw.toLowerCase(), { ...demoSearchVolume(kw), source: 'demo' });
    return map;
  }
  const result = await dfsPost('/v3/keywords_data/google_ads/search_volume/live', [
    {
      keywords: keywords.slice(0, 1000),
      location_code: config.dataforseo.locationCode,
      language_code: config.dataforseo.languageCode,
    },
  ]);
  for (const row of result || []) {
    map.set((row.keyword || '').toLowerCase(), {
      search_volume: row.search_volume ?? null,
      cpc: row.cpc ?? null,
      competition: row.competition_index != null ? row.competition_index / 100 : row.competition ?? null,
      source: 'dataforseo',
    });
  }
  return map;
}

/** Backlink-Übersicht einer Domain. → { backlinks, referring_domains, domain_rank, source } */
export async function backlinksSummary(host) {
  if (!isLiveMode()) {
    return { ...demoBacklinks(host), source: 'demo' };
  }
  const result = await dfsPost('/v3/backlinks/summary/live', [
    { target: host, include_subdomains: true },
  ]);
  const row = result?.[0];
  return {
    backlinks: row?.backlinks ?? null,
    referring_domains: row?.referring_domains ?? null,
    domain_rank: row?.rank ?? null,
    source: 'dataforseo',
  };
}

/**
 * Brand-SERP-Ownership: Wie viele der Top-10-Treffer für den Markennamen
 * kontrolliert die eigene Domain (inkl. eigener Social-Profile)?
 */
export async function brandSerpOwnership(brandKeyword, ownHost, socialUrls = []) {
  if (!isLiveMode()) {
    const owned = 3 + (brandKeyword.length % 4);
    return { top10Owned: Math.min(owned, 7), top10Total: 10, source: 'demo' };
  }
  const result = await dfsPost('/v3/serp/google/organic/live/regular', [
    {
      keyword: brandKeyword,
      location_code: config.dataforseo.locationCode,
      language_code: config.dataforseo.languageCode,
      depth: 10,
    },
  ]);
  const items = (result?.[0]?.items || []).filter((i) => i.type === 'organic').slice(0, 10);
  const ownedHosts = [ownHost, ...socialUrls.map((u) => {
    try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; }
  })].filter(Boolean);
  const owned = items.filter((i) => ownedHosts.some((h) => hostMatches(i.domain, h))).length;
  return { top10Owned: owned, top10Total: items.length, source: 'dataforseo' };
}

export function mode() {
  return isLiveMode() ? 'live' : 'demo';
}

export function costTotal() {
  return parseFloat(getSetting('dfs_cost_total', '0'));
}

export { isLiveMode };

export function logMode() {
  log('info', isLiveMode()
    ? 'DataForSEO: LIVE-Modus (Credentials gefunden)'
    : 'DataForSEO: DEMO-Modus (keine Credentials — deterministische Beispieldaten)');
}
