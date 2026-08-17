/** Schlanker API-Client: JSON rein/raus, Fehlermeldungen des Backends durchreichen. */
async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* leere Antwort */
  }
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};

export const PILLARS = [
  { key: 'seo', label: 'SEO', color: 'var(--seo)' },
  { key: 'aeo', label: 'AEO', color: 'var(--aeo)' },
  { key: 'geo', label: 'GEO', color: 'var(--geo)' },
  { key: 'performance', label: 'Performance', color: 'var(--perf)' },
  { key: 'social', label: 'Social', color: 'var(--social)' },
];

/* Serien-Farben für Domain-Vergleiche (fixe Slots 1–3, all-pairs-validiert) */
export const DOMAIN_COLORS = ['#3987e5', '#d95926', '#199e70'];

export function fmtDate(iso) {
  if (!iso) return '—';
  let s = String(iso).replace(' ', 'T');
  // SQLite datetime('now') liefert UTC ohne Zeitzonen-Suffix — nur dann 'Z' ergänzen
  if (s.includes('T') && !/([zZ]|[+-]\d{2}:?\d{2})$/.test(s)) s += 'Z';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function fmtNum(n) {
  if (n == null) return '—';
  return Number(n).toLocaleString('de-DE');
}
