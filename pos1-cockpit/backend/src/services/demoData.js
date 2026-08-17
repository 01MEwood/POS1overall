import { seededRandom, todayISO } from '../util.js';

/**
 * Demo-Daten für den Betrieb ohne DataForSEO-Zugang bzw. ohne freien Netzzugriff
 * (z. B. Sandbox). Alle Werte sind deterministisch (stabil über Reloads) und
 * werden in DB und UI ausdrücklich als „demo" gekennzeichnet.
 *
 * Für schreinerhelden.de bildet der Demo-Scan die REALEN Befunde aus
 * report/01-website-analyse.md ab (Stand des letzten Audits) — so ist das
 * Cockpit auch offline mit echten Erkenntnissen nutzbar.
 */

const SH_AUDIT_CHECKS = [
  ['seo', 'title', 'Title-Tag (15–65 Zeichen)', 'fail', '175 Zeichen, beginnt mit „Home"', 'Kürzen auf ≤60 Zeichen, Hauptkeyword nach vorn, „Home" entfernen.', 3],
  ['seo', 'meta_description', 'Meta-Description (50–160 Zeichen)', 'warn', '145 Zeichen, CTA schwach', 'Stärkerer CTA, USPs hervorheben.', 2],
  ['seo', 'h1', 'Genau eine H1', 'pass', '1 H1: „Wir bauen deinen Schrank nach Maß"', '', 2],
  ['seo', 'canonical', 'Canonical-Tag', 'pass', 'korrekt gesetzt', '', 2],
  ['seo', 'img_alt', 'Alt-Texte für Bilder (≥90 %)', 'fail', '14/21 Bildern (67 %)', 'Alle Bilder mit keyword-relevanten Alt-Texten versehen.', 2],
  ['seo', 'sitemap', 'sitemap.xml erreichbar', 'pass', 'vorhanden (66 URLs)', '', 2],
  ['seo', 'robots', 'robots.txt vorhanden', 'pass', 'vorhanden', '', 1],
  ['seo', 'lang', 'HTML-lang-Attribut', 'pass', 'lang="de-DE"', '', 1],
  ['seo', 'og', 'Open-Graph-Tags (og:title + og:image)', 'fail', 'og:image ist kleines Sterne-PNG', 'Markenkonformes OG-Image 1200×630 erstellen.', 1],
  ['seo', 'internal_links', 'Interne Verlinkung (≥20 Links)', 'warn', 'Footer-Städte unverlinkt, Stadt-LPs fehlen', 'Footer-Städte verlinken, Städte-LPs untereinander verlinken.', 1],
  ['seo', 'viewport', 'Mobile Viewport', 'pass', 'vorhanden', '', 1],
  ['aeo', 'faq_schema', 'FAQPage-Schema', 'fail', 'fehlt (nur WebPage + Organization)', 'FAQPage-Markup auf allen Seiten — Ziel: Featured Snippets & PAA.', 3],
  ['aeo', 'howto_schema', 'HowTo-Schema', 'warn', 'fehlt', '„Dein Weg zum Schrank" als HowTo auszeichnen.', 1],
  ['aeo', 'question_headings', 'Fragen-Überschriften (H2/H3 mit „?")', 'warn', '1 Fragen-Überschrift', 'Nutzerfragen als H2/H3 mit direkter Antwort im ersten Satz.', 2],
  ['aeo', 'structured_content', 'Listen & Tabellen', 'pass', 'Preistabelle + Listen vorhanden', '', 1],
  ['aeo', 'price_transparency', 'Preistransparenz (konkrete €-Angaben)', 'pass', '„ab 3.500 €" vorhanden', 'Zusätzlich Product/Offer-Schema für die Preistabelle.', 2],
  ['geo', 'llms_txt', 'llms.txt vorhanden', 'fail', 'fehlt', 'llms.txt mit Fakten zu Marke, Leistungen, Region, Preisen anlegen.', 3],
  ['geo', 'ai_bots', 'KI-Crawler erlaubt (GPTBot, ClaudeBot, Perplexity …)', 'pass', 'alle erlaubt', '', 2],
  ['geo', 'org_schema', 'Organization-Schema', 'pass', 'vorhanden', 'sameAs auf Social-Profile ergänzen.', 2],
  ['geo', 'local_schema', 'LocalBusiness-Schema', 'fail', 'nur auf Stuttgart-LP', 'LocalBusiness mit NAP auf ALLEN Seiten.', 2],
  ['geo', 'author_eeat', 'Autor/E-E-A-T-Signale', 'warn', 'Meister-Story vorhanden, keine Autorenbox', 'Autorenbox „Mario Esch, Schreinermeister seit 1996" + Person-Schema.', 1],
  ['geo', 'rating_schema', 'Bewertungs-Schema (AggregateRating/Review)', 'warn', '4,95/5 sichtbar, aber ohne Markup', 'AggregateRating-Schema ergänzen.', 2],
  ['geo', 'trust_pages', 'Trust-Seiten (Impressum + Über uns)', 'pass', 'verlinkt', '', 1],
  ['geo', 'jsonld_valid', 'JSON-LD fehlerfrei', 'warn', 'Breadcrumb verweist auf „…-stuttgart2"', 'Breadcrumb-URL im Schema der Stuttgart-LP korrigieren.', 2],
  ['performance', 'html_size', 'HTML-Größe (<150 KB)', 'fail', '803 KB', 'Elementor-Bloat reduzieren, Critical CSS, ungenutztes CSS/JS entfernen.', 3],
  ['performance', 'script_count', 'Anzahl JS-Dateien (<20)', 'fail', '44 Skripte', 'Skripte konsolidieren, Third-Party minimieren.', 2],
  ['performance', 'css_count', 'Anzahl CSS-Dateien (<10)', 'warn', '13 Stylesheets', 'CSS konsolidieren.', 1],
  ['performance', 'ttfb', 'Antwortzeit Startseite (<800 ms)', 'warn', '≈1.100 ms', 'WP-Rocket-Konfiguration & Hosting prüfen.', 2],
  ['performance', 'compression', 'Komprimierung (gzip/brotli)', 'pass', 'gzip aktiv', '', 2],
  ['performance', 'lazy_loading', 'Lazy Loading für Bilder', 'pass', 'aktiv', '', 1],
  ['performance', 'inline_styles', 'Inline-Style-Blöcke (<10)', 'warn', '13 Blöcke', 'Inline-Styles auslagern.', 1],
];

/** Generischer Demo-Scan für Domains ohne Audit-Daten — deterministisch pro Host. */
function genericChecks(host) {
  const r = (key) => seededRandom(host, key);
  const pick = (key, good, mid) => (r(key) < good ? 'pass' : r(key) < good + mid ? 'warn' : 'fail');
  const rows = [
    ['seo', 'title', 'Title-Tag (15–65 Zeichen)', pick('title', 0.5, 0.3), 'Demo-Wert', 'Title prüfen und auf Keyword fokussieren.', 3],
    ['seo', 'meta_description', 'Meta-Description (50–160 Zeichen)', pick('desc', 0.45, 0.3), 'Demo-Wert', 'Description mit CTA formulieren.', 2],
    ['seo', 'h1', 'Genau eine H1', pick('h1', 0.6, 0.25), 'Demo-Wert', 'H1-Struktur prüfen.', 2],
    ['seo', 'canonical', 'Canonical-Tag', pick('canonical', 0.7, 0.2), 'Demo-Wert', '', 2],
    ['seo', 'img_alt', 'Alt-Texte für Bilder (≥90 %)', pick('alt', 0.35, 0.35), 'Demo-Wert', 'Alt-Texte ergänzen.', 2],
    ['seo', 'sitemap', 'sitemap.xml erreichbar', pick('sitemap', 0.75, 0.15), 'Demo-Wert', '', 2],
    ['seo', 'og', 'Open-Graph-Tags', pick('og', 0.5, 0.3), 'Demo-Wert', 'OG-Tags vervollständigen.', 1],
    ['aeo', 'faq_schema', 'FAQPage-Schema', pick('faq', 0.25, 0.25), 'Demo-Wert', 'FAQ-Sektion mit Markup aufbauen.', 3],
    ['aeo', 'question_headings', 'Fragen-Überschriften', pick('qh', 0.35, 0.35), 'Demo-Wert', 'Nutzerfragen als Überschriften.', 2],
    ['aeo', 'price_transparency', 'Preistransparenz', pick('price', 0.4, 0.3), 'Demo-Wert', 'Konkrete Preise nennen.', 2],
    ['geo', 'llms_txt', 'llms.txt vorhanden', pick('llms', 0.1, 0.15), 'Demo-Wert', 'llms.txt anlegen.', 3],
    ['geo', 'org_schema', 'Organization-Schema', pick('org', 0.55, 0.25), 'Demo-Wert', '', 2],
    ['geo', 'local_schema', 'LocalBusiness-Schema', pick('local', 0.35, 0.3), 'Demo-Wert', 'LocalBusiness-Schema ausrollen.', 2],
    ['geo', 'rating_schema', 'Bewertungs-Schema', pick('rating', 0.3, 0.3), 'Demo-Wert', 'AggregateRating ergänzen.', 2],
    ['performance', 'html_size', 'HTML-Größe (<150 KB)', pick('size', 0.4, 0.35), 'Demo-Wert', 'Seitengewicht reduzieren.', 3],
    ['performance', 'script_count', 'Anzahl JS-Dateien (<20)', pick('js', 0.45, 0.3), 'Demo-Wert', 'Skripte bündeln.', 2],
    ['performance', 'ttfb', 'Antwortzeit (<800 ms)', pick('ttfb', 0.55, 0.3), 'Demo-Wert', 'Caching/CDN prüfen.', 2],
    ['performance', 'compression', 'Komprimierung', pick('gzip', 0.7, 0.2), 'Demo-Wert', '', 2],
  ];
  return rows;
}

export function demoScan(host) {
  const rows = host === 'schreinerhelden.de' ? SH_AUDIT_CHECKS : genericChecks(host);
  return {
    url: `https://${host}/`,
    checks: rows.map(([pillar, check_key, label, status, value, recommendation, weight]) => ({
      pillar, check_key, label, status, value, recommendation, weight,
    })),
  };
}

/** Demo-SERP-Position: eigene Domains solide Mittelfeld-Plätze, Wettbewerber oft davor. */
export function demoPosition(keyword, host, isOwn) {
  const r = seededRandom('pos', keyword, host);
  if (/^(schreinerhelden|finverk|ihr möbel schreiner)$/.test(keyword.trim())) {
    // Brand-Suchen: eigene Marke vorn
    return isOwn ? 1 : null;
  }
  if (!isOwn) {
    return r < 0.55 ? 1 + Math.floor(r * 12) : null;
  }
  if (r < 0.15) return null; // nicht in Top 100
  return 3 + Math.floor(r * 35);
}

export function demoSearchVolume(keyword) {
  const r = seededRandom('vol', keyword);
  const words = keyword.split(/\s+/).length;
  const base = words >= 4 ? 40 : words === 3 ? 140 : words === 2 ? 480 : 2400;
  const volume = Math.round((base * (0.4 + r * 1.6)) / 10) * 10;
  return {
    search_volume: Math.max(10, volume),
    cpc: Math.round((0.8 + r * 3.2) * 100) / 100,
    competition: Math.round(r * 100) / 100,
  };
}

export function demoBacklinks(host) {
  const r = seededRandom('bl', host);
  return {
    backlinks: Math.round(200 + r * 4800),
    referring_domains: Math.round(40 + r * 420),
    domain_rank: Math.round(15 + r * 45),
  };
}

export function demoSerpFeatures(keyword) {
  const feats = [];
  if (/was kostet|wie |warum /.test(keyword)) feats.push('featured_snippet', 'people_also_ask');
  if (/(stuttgart|ludwigsburg|backnang|waiblingen|esslingen)/.test(keyword)) feats.push('local_pack');
  return feats.join(',');
}

export function demoToday() {
  return todayISO();
}
