import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  port: Number(process.env.PORT) || 5317,
  dataDir: process.env.DATA_DIR || path.join(__dirname, '..', 'data'),
  frontendDist: process.env.FRONTEND_DIST || path.join(__dirname, '..', '..', 'frontend', 'dist'),

  dataforseo: {
    login: process.env.DATAFORSEO_LOGIN || '',
    password: process.env.DATAFORSEO_PASSWORD || '',
    baseUrl: process.env.DATAFORSEO_BASE_URL || 'https://api.dataforseo.com',
    // 2276 = Germany, "de" — alle SERP-/Volumen-Abfragen laufen auf den deutschen Markt
    locationCode: Number(process.env.DFS_LOCATION_CODE) || 2276,
    languageCode: process.env.DFS_LANGUAGE_CODE || 'de',
    timeoutMs: Number(process.env.DFS_TIMEOUT_MS) || 40000,
  },

  scanner: {
    userAgent:
      process.env.SCANNER_USER_AGENT ||
      'Mozilla/5.0 (compatible; POS1-Cockpit/1.0; +https://schreinerhelden.de)',
    timeoutMs: Number(process.env.SCANNER_TIMEOUT_MS) || 25000,
  },
};

export function isLiveMode() {
  return Boolean(config.dataforseo.login && config.dataforseo.password);
}

export default config;
