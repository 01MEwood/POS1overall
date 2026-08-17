export function log(level, msg, extra) {
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${msg}`;
  if (level === 'error') console.error(line, extra ?? '');
  else console.log(line, extra ?? '');
}

/** Express-Wrapper: async-Fehler landen im zentralen Error-Handler statt als unhandled rejection. */
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Deterministischer 32-Bit-Hash (FNV-1a) — Basis für stabile Demo-Daten. */
export function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Deterministischer Pseudozufall in [0,1) aus beliebigen Schlüsselteilen. */
export function seededRandom(...parts) {
  return fnv1a(parts.join('|')) / 0xffffffff;
}

/** Hostname normalisieren: Protokoll, www., Pfad und Großschreibung entfernen. */
export function normalizeHost(input) {
  if (!input || typeof input !== 'string') return null;
  let host = input.trim().toLowerCase();
  host = host.replace(/^https?:\/\//, '').replace(/^www\./, '');
  host = host.split('/')[0].split('?')[0].split('#')[0];
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) return null;
  return host;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
