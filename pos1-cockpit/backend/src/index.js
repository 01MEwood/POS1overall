import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import config from './config.js';
import { getDb } from './db.js';
import { log, HttpError } from './util.js';
import { logMode } from './services/dataforseo.js';
import overviewRouter from './routes/overview.js';
import domainsRouter from './routes/domains.js';
import keywordsRouter from './routes/keywords.js';
import brandsRouter from './routes/brands.js';
import socialRouter from './routes/social.js';
import actionsRouter from './routes/actions.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

// API-Routen
app.use('/api', overviewRouter);
app.use('/api/domains', domainsRouter);
app.use('/api/keywords', keywordsRouter);
app.use('/api/brands', brandsRouter);
app.use('/api/social', socialRouter);
app.use('/api/actions', actionsRouter);

// Frontend (Production-Build) ausliefern, falls vorhanden
if (fs.existsSync(config.frontendDist)) {
  app.use(express.static(config.frontendDist));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(config.frontendDist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({ app: 'POS1 Cockpit API', hint: 'Frontend-Build fehlt — npm run build im frontend/-Ordner.' });
  });
}

// 404 für unbekannte API-Pfade
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Unbekannter API-Endpunkt.' });
});

// Zentraler Error-Handler — Validierungsfehler als 4xx, Rest als 500 mit Log
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Ungültiges JSON im Request-Body.' });
  }
  log('error', 'Unerwarteter Fehler', err.stack || err.message);
  res.status(500).json({ error: `Interner Fehler: ${err.message}` });
});

getDb(); // DB initialisieren + ggf. seeden, bevor Anfragen kommen
logMode();

app.listen(config.port, () => {
  log('info', `POS1 Cockpit läuft auf http://localhost:${config.port}`);
});
