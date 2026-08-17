import * as cheerio from 'cheerio';
import dns from 'node:dns/promises';
import net from 'node:net';
import { fetch as undiciFetch, EnvHttpProxyAgent } from 'undici';
import config from '../config.js';
import { log } from '../util.js';

// Respektiert HTTPS_PROXY/HTTP_PROXY/NO_PROXY, falls gesetzt (z. B. Sandbox) —
// ohne Proxy-Variablen verhält sich der Agent wie eine Direktverbindung.
const dispatcher = new EnvHttpProxyAgent();

function isPrivateIp(ip) {
  // IPv4-mapped IPv6 (::ffff:10.0.0.1) auf den eingebetteten IPv4-Teil reduzieren
  const mapped = ip.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) ip = mapped[1];
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254) ||
      (a === 100 && b >= 64 && b <= 127)
    );
  }
  const low = ip.toLowerCase();
  return low === '::' || low === '::1' || low.startsWith('fc') || low.startsWith('fd') || low.startsWith('fe80');
}

/**
 * SSRF-Schutz: Scan nur für öffentlich auflösbare Hosts. Blockt interne
 * Hostnamen-Muster und Namen, die auf private/reservierte IPs auflösen
 * (z. B. Wildcard-DNS wie 127.0.0.1.nip.io). Hinweis: Redirects und
 * DNS-Rebinding sind damit nicht vollständig abgedeckt — die App ist für
 * den internen Betrieb hinter Reverse-Proxy/Auth gedacht.
 */
async function assertPublicHost(host) {
  if (/\.(local|localhost|internal|corp|lan|home|intern)$/i.test(host)) {
    throw new Error(`Interner Hostname „${host}" — Scan abgelehnt`);
  }
  let addrs;
  try {
    addrs = await dns.lookup(host, { all: true, verbatim: true });
  } catch {
    throw new Error(`DNS-Auflösung für ${host} fehlgeschlagen`);
  }
  if (!addrs.length) throw new Error(`Keine IP-Adresse für ${host} gefunden`);
  for (const { address } of addrs) {
    if (isPrivateIp(address)) {
      throw new Error(`${host} löst auf eine interne/reservierte IP (${address}) auf — Scan abgelehnt`);
    }
  }
}

async function fetchUrl(url, { asText = true } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.scanner.timeoutMs);
  const startedAt = performance.now();
  try {
    const res = await undiciFetch(url, {
      dispatcher,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': config.scanner.userAgent,
        Accept: 'text/html,application/xhtml+xml,text/plain,*/*',
        'Accept-Language': 'de-DE,de;q=0.9',
      },
    });
    const ttfbMs = Math.round(performance.now() - startedAt);
    const body = asText ? await res.text() : null;
    return {
      ok: res.ok,
      status: res.status,
      finalUrl: res.url || url,
      ttfbMs,
      contentEncoding: res.headers.get('content-encoding') || '',
      cacheControl: res.headers.get('cache-control') || '',
      body,
      bytes: body ? Buffer.byteLength(body, 'utf8') : 0,
    };
  } finally {
    clearTimeout(timer);
  }
}

/** robots.txt in User-Agent-Gruppen zerlegen: { 'gptbot': {disallow: [...], allow: [...]}, '*': {...} } */
function parseRobots(text) {
  const groups = {};
  let currentAgents = [];
  let lastWasAgent = false;
  const ensure = (a) => (groups[a] = groups[a] || { disallow: [], allow: [] });
  for (const rawLine of (text || '').split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const [rawKey, ...rest] = line.split(':');
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(':').trim();
    if (key === 'user-agent') {
      if (!lastWasAgent) currentAgents = [];
      currentAgents.push(value.toLowerCase());
      currentAgents.forEach(ensure);
      lastWasAgent = true;
    } else {
      if (key === 'disallow' || key === 'allow') {
        for (const a of currentAgents) ensure(a)[key].push(value);
      }
      lastWasAgent = false;
    }
  }
  return groups;
}

/** Vollsperre erkennen: Disallow "/" oder "/*" (Wildcard-Semantik), sofern kein Allow sie übersteuert. */
function isBotBlocked(groups, bot) {
  const rules = groups[bot.toLowerCase()] ?? groups['*'] ?? { disallow: [], allow: [] };
  const fullBlock = rules.disallow.some((r) => r === '/' || r === '/*');
  const allowOverride = rules.allow.some((r) => r === '/' || r === '/*');
  return fullBlock && !allowOverride;
}

/** Alle @type-Werte aus JSON-LD-Blöcken einsammeln (inkl. @graph, Arrays, Verschachtelung). */
function collectSchemaTypes(nodes) {
  const types = new Set();
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(walk);
    const t = node['@type'];
    if (typeof t === 'string') types.add(t);
    if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && types.add(x));
    for (const value of Object.values(node)) walk(value);
  };
  walk(nodes);
  return types;
}

const AI_BOTS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];

/**
 * Live-Scan einer Domain: Startseite + robots.txt + llms.txt + sitemap.xml
 * → Liste von Checks {pillar, key, label, status: pass|warn|fail|info, value, recommendation, weight}
 */
export async function scanDomain(host) {
  const checks = [];
  const add = (pillar, key, label, status, value, recommendation, weight = 1) =>
    checks.push({ pillar, check_key: key, label, status, value: value == null ? null : String(value), recommendation, weight });

  await assertPublicHost(host);

  const baseUrl = `https://${host}`;
  const page = await fetchUrl(`${baseUrl}/`);
  if (!page.ok) {
    throw new Error(`Startseite nicht erreichbar (HTTP ${page.status})`);
  }

  const [robotsRes, llmsRes, sitemapRes] = await Promise.allSettled([
    fetchUrl(`${baseUrl}/robots.txt`),
    fetchUrl(`${baseUrl}/llms.txt`),
    fetchUrl(`${baseUrl}/sitemap.xml`),
  ]);
  const robots = robotsRes.status === 'fulfilled' && robotsRes.value.ok ? robotsRes.value : null;
  const llms = llmsRes.status === 'fulfilled' && llmsRes.value.ok ? llmsRes.value : null;
  const sitemap = sitemapRes.status === 'fulfilled' && sitemapRes.value.ok ? sitemapRes.value : null;

  const $ = cheerio.load(page.body || '');
  const jsonLd = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      jsonLd.push(JSON.parse($(el).contents().text()));
    } catch {
      /* fehlerhaftes JSON-LD wird als eigener Check gemeldet */
      jsonLd.push(null);
    }
  });
  const brokenJsonLd = jsonLd.some((x) => x === null);
  const schemaTypes = collectSchemaTypes(jsonLd.filter(Boolean));

  // ---------- SEO ----------
  const title = $('head title').first().text().trim();
  const titleLen = title.length;
  add('seo', 'title', 'Title-Tag (15–65 Zeichen)',
    titleLen >= 15 && titleLen <= 65 ? 'pass' : titleLen > 0 ? 'fail' : 'fail',
    titleLen ? `${titleLen} Zeichen: „${title.slice(0, 80)}${titleLen > 80 ? '…' : ''}"` : 'fehlt',
    'Hauptkeyword an den Anfang, max. 60–65 Zeichen, Markenname ans Ende.', 3);

  const metaDesc = $('meta[name="description"]').attr('content')?.trim() || '';
  add('seo', 'meta_description', 'Meta-Description (50–160 Zeichen)',
    metaDesc.length >= 50 && metaDesc.length <= 160 ? 'pass' : metaDesc ? 'warn' : 'fail',
    metaDesc ? `${metaDesc.length} Zeichen` : 'fehlt',
    'Keyword + USP + CTA, 50–160 Zeichen.', 2);

  const h1Count = $('h1').length;
  add('seo', 'h1', 'Genau eine H1', h1Count === 1 ? 'pass' : h1Count === 0 ? 'fail' : 'warn',
    `${h1Count} H1-Tags`, 'Genau eine H1 mit dem Hauptkeyword.', 2);

  add('seo', 'canonical', 'Canonical-Tag', $('link[rel="canonical"]').length ? 'pass' : 'fail',
    $('link[rel="canonical"]').attr('href') || 'fehlt', 'Selbstreferenzierendes Canonical setzen.', 2);

  const imgs = $('img');
  const imgsWithAlt = imgs.filter((_, el) => Boolean($(el).attr('alt')?.trim())).length;
  const altPct = imgs.length ? Math.round((imgsWithAlt / imgs.length) * 100) : 100;
  add('seo', 'img_alt', 'Alt-Texte für Bilder (≥90 %)',
    altPct >= 90 ? 'pass' : altPct >= 60 ? 'warn' : 'fail',
    `${imgsWithAlt}/${imgs.length} Bildern (${altPct} %)`,
    'Beschreibende, keyword-relevante Alt-Texte ergänzen.', 2);

  add('seo', 'sitemap', 'sitemap.xml erreichbar', sitemap ? 'pass' : 'fail',
    sitemap ? 'vorhanden' : 'fehlt/nicht erreichbar', 'XML-Sitemap bereitstellen und in robots.txt referenzieren.', 2);

  add('seo', 'robots', 'robots.txt vorhanden', robots ? 'pass' : 'warn',
    robots ? 'vorhanden' : 'fehlt', 'robots.txt mit Sitemap-Verweis anlegen.', 1);

  add('seo', 'lang', 'HTML-lang-Attribut', $('html').attr('lang') ? 'pass' : 'warn',
    $('html').attr('lang') || 'fehlt', 'lang="de" setzen.', 1);

  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  add('seo', 'og', 'Open-Graph-Tags (og:title + og:image)',
    ogTitle && ogImage ? 'pass' : ogTitle || ogImage ? 'warn' : 'fail',
    [ogTitle ? 'og:title ✓' : 'og:title ✗', ogImage ? 'og:image ✓' : 'og:image ✗'].join(', '),
    'Markenkonformes OG-Image (1200×630) + prägnanter og:title.', 1);

  const internalLinks = $('a[href]').filter((_, el) => {
    const href = $(el).attr('href') || '';
    return href.startsWith('/') || href.includes(host);
  }).length;
  add('seo', 'internal_links', 'Interne Verlinkung (≥20 Links)',
    internalLinks >= 20 ? 'pass' : internalLinks >= 8 ? 'warn' : 'fail',
    `${internalLinks} interne Links`, 'Themencluster intern verlinken (Städte-LPs, Blog → LPs).', 1);

  add('seo', 'viewport', 'Mobile Viewport', $('meta[name="viewport"]').length ? 'pass' : 'fail',
    $('meta[name="viewport"]').length ? 'vorhanden' : 'fehlt', 'Viewport-Meta-Tag setzen.', 1);

  // ---------- AEO ----------
  add('aeo', 'faq_schema', 'FAQPage-Schema', schemaTypes.has('FAQPage') ? 'pass' : 'fail',
    schemaTypes.has('FAQPage') ? 'vorhanden' : 'fehlt',
    'FAQ-Sektion mit FAQPage-Markup — Ziel: Featured Snippets & PAA.', 3);

  add('aeo', 'howto_schema', 'HowTo-Schema', schemaTypes.has('HowTo') ? 'pass' : 'warn',
    schemaTypes.has('HowTo') ? 'vorhanden' : 'fehlt',
    '„Dein Weg zum Schrank"-Prozess als HowTo auszeichnen.', 1);

  const questionHeadings = $('h2, h3').filter((_, el) => $(el).text().includes('?')).length;
  add('aeo', 'question_headings', 'Fragen-Überschriften (H2/H3 mit „?")',
    questionHeadings >= 3 ? 'pass' : questionHeadings >= 1 ? 'warn' : 'fail',
    `${questionHeadings} Fragen-Überschriften`,
    'Echte Nutzerfragen als H2/H3 („Was kostet …?") mit direkter Antwort im ersten Satz.', 2);

  const listsTables = $('ul, ol, table').length;
  add('aeo', 'structured_content', 'Listen & Tabellen',
    listsTables >= 5 ? 'pass' : listsTables >= 2 ? 'warn' : 'fail',
    `${listsTables} Listen/Tabellen`, 'Strukturierte Inhalte — Antwortmaschinen zitieren Listen & Tabellen bevorzugt.', 1);

  const hasPrice = /\d+\s*(€|EUR)/.test($('body').text());
  add('aeo', 'price_transparency', 'Preistransparenz (konkrete €-Angaben)',
    schemaTypes.has('Product') || schemaTypes.has('Offer') || hasPrice ? 'pass' : 'fail',
    hasPrice ? 'Preisangaben im Text' : schemaTypes.has('Product') ? 'Product-Schema' : 'keine Preise gefunden',
    'Konkrete Preise („ab 3.500 €") + Product/Offer-Schema für die Preistabelle.', 2);

  // ---------- GEO ----------
  add('geo', 'llms_txt', 'llms.txt vorhanden', llms ? 'pass' : 'fail',
    llms ? `vorhanden (${llms.bytes} Bytes)` : 'fehlt',
    'llms.txt mit Fakten zu Marke, Leistungen, Region und Preisen anlegen — Basis für KI-Zitate.', 3);

  if (robots) {
    const groups = parseRobots(robots.body);
    const blocked = AI_BOTS.filter((b) => isBotBlocked(groups, b));
    add('geo', 'ai_bots', 'KI-Crawler erlaubt (GPTBot, ClaudeBot, Perplexity …)',
      blocked.length === 0 ? 'pass' : blocked.length < AI_BOTS.length ? 'warn' : 'fail',
      blocked.length ? `blockiert: ${blocked.join(', ')}` : 'alle erlaubt',
      'KI-Crawler nicht aussperren — sonst keine Sichtbarkeit in KI-Antworten.', 2);
  } else {
    add('geo', 'ai_bots', 'KI-Crawler erlaubt', 'info', 'robots.txt fehlt — Standard: erlaubt',
      'robots.txt anlegen und KI-Crawler explizit zulassen.', 0);
  }

  add('geo', 'org_schema', 'Organization-Schema', schemaTypes.has('Organization') ? 'pass' : 'fail',
    schemaTypes.has('Organization') ? 'vorhanden' : 'fehlt', 'Organization-Schema mit Logo, sameAs (Social-Profile) ergänzen.', 2);

  add('geo', 'local_schema', 'LocalBusiness-Schema',
    schemaTypes.has('LocalBusiness') || schemaTypes.has('HomeAndConstructionBusiness') ? 'pass' : 'fail',
    schemaTypes.has('LocalBusiness') || schemaTypes.has('HomeAndConstructionBusiness') ? 'vorhanden' : 'fehlt',
    'LocalBusiness mit NAP auf allen Seiten (nicht nur einer LP).', 2);

  const hasAuthor = schemaTypes.has('Person') || /autor|verfasst von|schreinermeister/i.test($('body').text());
  add('geo', 'author_eeat', 'Autor/E-E-A-T-Signale',
    hasAuthor ? 'pass' : 'fail', hasAuthor ? 'Autor-/Meister-Signale gefunden' : 'keine Autor-Signale',
    'Autorenbox (z. B. „Mario Esch, Schreinermeister seit 1996") + Person-Schema.', 1);

  add('geo', 'rating_schema', 'Bewertungs-Schema (AggregateRating/Review)',
    schemaTypes.has('AggregateRating') || schemaTypes.has('Review') ? 'pass' : 'warn',
    schemaTypes.has('AggregateRating') || schemaTypes.has('Review') ? 'vorhanden' : 'fehlt',
    'Echte Bewertungen (4,95/5) als AggregateRating auszeichnen.', 2);

  const bodyText = $('body').text();
  const trustLinks = /impressum/i.test(bodyText) && /(über uns|ueber-uns|about)/i.test(bodyText + $('a').text());
  add('geo', 'trust_pages', 'Trust-Seiten (Impressum + Über uns)',
    trustLinks ? 'pass' : 'warn', trustLinks ? 'verlinkt' : 'nicht eindeutig gefunden',
    'Impressum & „Über uns" prominent verlinken (Trust für Nutzer + KI).', 1);

  if (brokenJsonLd) {
    add('geo', 'jsonld_valid', 'JSON-LD fehlerfrei', 'fail', 'mind. ein JSON-LD-Block ist kein valides JSON',
      'Fehlerhafte strukturierte Daten korrigieren (Rich-Result-Test).', 2);
  } else if (jsonLd.length) {
    add('geo', 'jsonld_valid', 'JSON-LD fehlerfrei', 'pass', `${jsonLd.length} Blöcke, Typen: ${[...schemaTypes].slice(0, 6).join(', ') || '—'}`, '', 1);
  }

  // ---------- Performance ----------
  const kb = Math.round(page.bytes / 1024);
  add('performance', 'html_size', 'HTML-Größe (<150 KB)',
    kb < 150 ? 'pass' : kb < 400 ? 'warn' : 'fail', `${kb} KB`,
    'Page-Builder-Bloat reduzieren, ungenutztes CSS/JS entfernen, Critical CSS.', 3);

  const scripts = $('script[src]').length;
  add('performance', 'script_count', 'Anzahl JS-Dateien (<20)',
    scripts < 20 ? 'pass' : scripts < 40 ? 'warn' : 'fail', `${scripts} Skripte`,
    'Skripte bündeln/entfernen, Third-Party minimieren.', 2);

  const styles = $('link[rel="stylesheet"]').length;
  add('performance', 'css_count', 'Anzahl CSS-Dateien (<10)',
    styles < 10 ? 'pass' : styles < 20 ? 'warn' : 'fail', `${styles} Stylesheets`, 'CSS konsolidieren.', 1);

  add('performance', 'ttfb', 'Antwortzeit Startseite (<800 ms)',
    page.ttfbMs < 800 ? 'pass' : page.ttfbMs < 2000 ? 'warn' : 'fail', `${page.ttfbMs} ms`,
    'Server-Caching (z. B. WP Rocket), CDN, PHP-Version prüfen.', 2);

  add('performance', 'compression', 'Komprimierung (gzip/brotli)',
    /(gzip|br)/.test(page.contentEncoding) ? 'pass' : 'warn',
    page.contentEncoding || 'keine erkannt', 'Brotli/Gzip am Server aktivieren.', 2);

  const lazyImgs = imgs.filter((_, el) => $(el).attr('loading') === 'lazy').length;
  add('performance', 'lazy_loading', 'Lazy Loading für Bilder',
    imgs.length === 0 || lazyImgs > 0 ? 'pass' : 'warn', `${lazyImgs}/${imgs.length} Bilder lazy`,
    'Alle Bilder außer Hero lazy laden.', 1);

  const inlineStyles = $('style').length;
  add('performance', 'inline_styles', 'Inline-Style-Blöcke (<10)',
    inlineStyles < 10 ? 'pass' : inlineStyles < 20 ? 'warn' : 'fail', `${inlineStyles} Blöcke`,
    'Inline-Styles in gebündeltes CSS auslagern.', 1);

  log('info', `Scan ${host}: ${checks.length} Checks, HTML ${kb} KB, TTFB ${page.ttfbMs} ms`);
  return { url: page.finalUrl, checks };
}
