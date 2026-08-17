import { log } from './util.js';

/**
 * Seed-Daten: Marken, Domains, Keywords, Social-Kanäle und Roadmap-Maßnahmen.
 * Quellen: report/01-website-analyse.md, report/03-seo-aeo-geo-strategie.md,
 * report/04-meos-pipeline-action-plan.md (Stand 2026) sowie Marios Briefing.
 * Wird nur ausgeführt, wenn die Datenbank leer ist — eigene Daten bleiben unangetastet.
 */
export function seedIfEmpty(db) {
  const count = db.prepare('SELECT COUNT(*) AS c FROM brands').get().c;
  if (count > 0) return;

  log('info', 'Leere Datenbank erkannt — Seed-Daten werden eingespielt.');

  const insertBrand = db.prepare(`INSERT INTO brands
    (slug, name, dpma_status, dpma_note, positioning, target_audience, notes)
    VALUES (@slug, @name, @dpma_status, @dpma_note, @positioning, @target_audience, @notes)`);

  const brandIds = {};
  const brands = [
    {
      slug: 'schreinerhelden',
      name: 'Schreinerhelden',
      dpma_status: 'eingetragen',
      dpma_note: 'Wortmarke beim DPMA eingetragen.',
      positioning:
        'B2C-Marke: Maßgefertigte Schränke vom Schreinermeister — Dachschrägenschränke, Einbauschränke, begehbare Kleiderschränke. Meisterqualität aus Murrhardt für die Region Stuttgart / Rems-Murr.',
      target_audience: 'Private Eigentümer:innen 30–60 im Großraum Stuttgart mit Qualitätsanspruch.',
      notes: 'Ziel: Position 1 für Dachschrägenschrank-Keywords + dominante lokale Marke.',
    },
    {
      slug: 'finverk',
      name: 'Finverk',
      dpma_status: 'eingetragen',
      dpma_note: 'Wortmarke beim DPMA eingetragen.',
      positioning:
        'Positionierung hier pflegen (Reiter Marken → Bearbeiten): Nutzenversprechen, Kategorie, Differenzierung.',
      target_audience: 'Zielgruppe hier pflegen.',
      notes: 'Marke im Aufbau — Kanal- und Content-Strategie über die Reiter Social & Roadmap steuern.',
    },
    {
      slug: 'ims',
      name: 'IHR-Möbel-Schreiner',
      dpma_status: 'nicht eingetragen',
      dpma_note: 'Website-Marke (B2B-Vertical), keine DPMA-Eintragung.',
      positioning:
        'B2B: Fertigungspartner für Schreinereien, Architekten und Objektausstatter — CNC-Fertigung, Serien- und Lohnfertigung mit Meisterbetrieb-Qualität.',
      target_audience: 'Schreiner-Kollegen, Architekturbüros, Objektausstatter im DACH-Raum.',
      notes: 'Verzahnt mit Schreinerhelden (gemeinsame Fertigung), eigener Marktauftritt.',
    },
  ];
  for (const b of brands) brandIds[b.slug] = insertBrand.run(b).lastInsertRowid;

  const insertDomain = db.prepare(
    'INSERT INTO domains (host, label, brand_id, is_own) VALUES (?, ?, ?, ?)'
  );
  const domainIds = {};
  const domains = [
    ['schreinerhelden.de', 'Schreinerhelden', brandIds.schreinerhelden, 1],
    ['finverk.de', 'Finverk', brandIds.finverk, 1],
    ['ihr-moebel-schreiner.de', 'IHR-Möbel-Schreiner', brandIds.ims, 1],
    // Wettbewerber laut SERP-Analyse (report/03, Abschnitt 3.2)
    ['cabinet.de', 'Cabinet (Wettbewerb)', brandIds.schreinerhelden, 0],
    ['deinschrank.de', 'deinSchrank (Wettbewerb)', brandIds.schreinerhelden, 0],
    ['schrankwerk.de', 'Schrankwerk (Wettbewerb)', brandIds.schreinerhelden, 0],
  ];
  for (const [host, label, brandId, isOwn] of domains) {
    domainIds[host] = insertDomain.run(host, label, brandId, isOwn).lastInsertRowid;
  }

  const insertKeyword = db.prepare(
    'INSERT INTO keywords (keyword, domain_id, intent, priority, is_brand) VALUES (?, ?, ?, ?, ?)'
  );
  const kwSH = domainIds['schreinerhelden.de'];
  const kwIMS = domainIds['ihr-moebel-schreiner.de'];
  const kwFV = domainIds['finverk.de'];
  const keywords = [
    // Keyword-Landschaft aus report/03, Abschnitt 3.1
    ['dachschrägenschrank stuttgart', kwSH, 'lokal', 'HOCH', 0],
    ['dachschrägenschrank nach maß stuttgart', kwSH, 'lokal', 'HOCH', 0],
    ['dachschrägenschrank ludwigsburg', kwSH, 'lokal', 'HOCH', 0],
    ['dachschrägenschrank waiblingen', kwSH, 'lokal', 'HOCH', 0],
    ['dachschrägenschrank backnang', kwSH, 'lokal', 'HOCH', 0],
    ['schreiner dachschräge stuttgart', kwSH, 'lokal', 'MITTEL', 0],
    ['einbauschrank dachschräge stuttgart', kwSH, 'lokal', 'MITTEL', 0],
    ['dachschrägenschrank', kwSH, 'generisch', 'MITTEL', 0],
    ['dachschrägenschränke nach maß', kwSH, 'transaktional', 'MITTEL', 0],
    ['was kostet ein dachschrägenschrank', kwSH, 'informational (AEO)', 'HOCH', 0],
    ['begehbarer kleiderschrank nach maß', kwSH, 'transaktional', 'MITTEL', 0],
    ['schrank nach maß stuttgart', kwSH, 'lokal', 'MITTEL', 0],
    ['schreinerhelden', kwSH, 'brand', 'HOCH', 1],
    // IMS (B2B)
    ['lohnfertigung schreiner', kwIMS, 'b2b', 'HOCH', 0],
    ['cnc fertigung möbel', kwIMS, 'b2b', 'MITTEL', 0],
    ['fertigungspartner schreinerei', kwIMS, 'b2b', 'HOCH', 0],
    ['serienfertigung holz', kwIMS, 'b2b', 'MITTEL', 0],
    ['ihr möbel schreiner', kwIMS, 'brand', 'MITTEL', 1],
    // Finverk (Positionierung offen → zunächst Brand-Tracking)
    ['finverk', kwFV, 'brand', 'HOCH', 1],
  ];
  for (const [kw, domainId, intent, prio, isBrand] of keywords) {
    insertKeyword.run(kw, domainId, intent, prio, isBrand);
  }

  const insertChannel = db.prepare(`INSERT INTO social_channels
    (brand_id, platform, handle, url, priority, rationale, active)
    VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const channels = [
    // Schreinerhelden: visuelles B2C-Produkt + lokales Geschäft
    [brandIds.schreinerhelden, 'Instagram', '', '', 'primary',
      'Kernkanal B2C: Referenzen, Vorher/Nachher, Werkstatt-Einblicke. Interior-Zielgruppe ist hier.', 1],
    [brandIds.schreinerhelden, 'Pinterest', '', '', 'primary',
      'Interior-Inspiration mit langer Content-Lebensdauer — stärkster organischer Traffic-Kanal für Möbel nach Maß.', 1],
    [brandIds.schreinerhelden, 'Google Business', '', '', 'primary',
      'Local Pack ist kritisch für „Dachschrägenschrank Stuttgart" & Co. — wöchentliche Posts, Projekt-Fotos, Bewertungen sammeln.', 1],
    [brandIds.schreinerhelden, 'YouTube', '', '', 'secondary',
      'Ratgeber & Projekt-Dokus zahlen auf SEO/AEO/GEO ein (Video-SERPs, KI-Zitierfähigkeit).', 1],
    [brandIds.schreinerhelden, 'Facebook', '', '', 'secondary',
      'Zielgruppe 35+ regional, Bewertungen & Empfehlungen.', 1],
    [brandIds.schreinerhelden, 'TikTok', '', '', 'optional',
      'Handwerks-Content wächst stark — Test mit Werkstatt-Shorts (Zweitverwertung der YouTube-Clips).', 0],
    // Finverk: bis zur finalen Positionierung digital-generischer Mix
    [brandIds.finverk, 'LinkedIn', '', '', 'primary',
      'Aufbau von Sichtbarkeit & Thought Leadership im professionellen Umfeld.', 1],
    [brandIds.finverk, 'YouTube', '', '', 'secondary',
      'Erklär- und Nutzen-Content, langfristig durchsuchbar (Google + KI-Antworten).', 1],
    [brandIds.finverk, 'Instagram', '', '', 'secondary',
      'Markenaufbau & Community — Priorität nach finaler Positionierung schärfen.', 1],
    // IMS: reines B2B
    [brandIds.ims, 'LinkedIn', '', '', 'primary',
      'B2B-Entscheider: Architekten, Objektausstatter, Schreiner-Kollegen. Projekt-Cases & Fertigungs-Kompetenz.', 1],
    [brandIds.ims, 'YouTube', '', '', 'secondary',
      'CNC-/Fertigungs-Content als Kompetenzbeweis für Partner und Architekten.', 1],
    [brandIds.ims, 'Google Business', '', '', 'primary',
      'B2B-Suchen sind oft lokal/regional — Profil gepflegt halten.', 1],
    [brandIds.ims, 'Xing', '', '', 'optional',
      'DACH-B2B mit abnehmender Relevanz — Profil pflegen, kein aktiver Content.', 0],
  ];
  for (const c of channels) insertChannel.run(...c);

  const insertAction = db.prepare(`INSERT INTO actions
    (title, description, pillar, priority, status, impact, effort, brand_id, domain_id)
    VALUES (@title, @description, @pillar, @priority, 'open', @impact, @effort, @brand_id, @domain_id)`);

  const shB = brandIds.schreinerhelden;
  const shD = domainIds['schreinerhelden.de'];
  const actions = [
    // P0 — kritische Fixes aus report/01 (Fehlerliste) und report/03 (Sofortmaßnahmen)
    { title: 'Title-Tags fixen (Startseite 175 → ≤60 Zeichen)', pillar: 'seo', priority: 'P0', impact: 'hoch', effort: 'niedrig', brand_id: shB, domain_id: shD,
      description: 'Yoast-Site-Name-Suffix kürzen. Startseite: „Dachschrägenschrank nach Maß | Schreinerhelden". Stadt-Pattern: „Dachschrägenschrank [Stadt] — Vom Schreinermeister nach Maß".' },
    { title: '301-Redirect /dachschraegenschraenke → /dachschraegenschrank', pillar: 'seo', priority: 'P0', impact: 'hoch', effort: 'niedrig', brand_id: shB, domain_id: shD,
      description: 'Plural-URL liefert aktuell 404 — Linkjuice & Nutzer gehen verloren.' },
    { title: 'Blog-URL /holzmoebel-richtig-pfleg korrigieren', pillar: 'seo', priority: 'P0', impact: 'mittel', effort: 'niedrig', brand_id: shB, domain_id: shD,
      description: 'Abgeschnittene URL auf /holzmoebel-richtig-pflegen ändern + 301 von der alten URL.' },
    { title: 'FAQPage-Schema auf allen Seiten implementieren', pillar: 'aeo', priority: 'P0', impact: 'hoch', effort: 'mittel', brand_id: shB, domain_id: shD,
      description: 'FAQ-Sektion je Seite (Preis, Dauer, Material, Nachrüstung) mit FAQPage-Markup — Ziel: Featured Snippets & PAA-Boxen.' },
    { title: 'LocalBusiness-Schema auf ALLEN Seiten ausrollen', pillar: 'geo', priority: 'P0', impact: 'hoch', effort: 'niedrig', brand_id: shB, domain_id: shD,
      description: 'Aktuell nur auf der Stuttgart-LP. NAP konsistent: Schreinerhelden GmbH & Co. KG, Lindenstr. 9-15, 71540 Murrhardt, 07192/9357200.' },
    { title: 'Breadcrumb-Schema-Bug der Stuttgart-LP fixen', pillar: 'seo', priority: 'P0', impact: 'mittel', effort: 'niedrig', brand_id: shB, domain_id: shD,
      description: 'Breadcrumb endet fälschlich auf „/dachschraegenschrank-stuttgart2".' },
    // P1 — Wachstum
    { title: 'Stadt-LPs: Ludwigsburg, Esslingen, Böblingen', pillar: 'seo', priority: 'P1', impact: 'hoch', effort: 'mittel', brand_id: shB, domain_id: shD,
      description: 'P1-Städte aus der Content-Strategie, je ≥30 % einzigartiger Content. Danach P2: Waiblingen, Fellbach, Leonberg (Helden-Cloner nutzen).' },
    { title: 'llms.txt für alle drei Domains anlegen', pillar: 'geo', priority: 'P1', impact: 'hoch', effort: 'niedrig', brand_id: null, domain_id: null,
      description: 'Kompakte, faktenreiche Selbstbeschreibung für KI-Crawler (GPTBot, ClaudeBot, PerplexityBot) — Basis für Zitierfähigkeit.' },
    { title: 'Meta-Descriptions mit CTA je Stadt-LP', pillar: 'seo', priority: 'P1', impact: 'mittel', effort: 'niedrig', brand_id: shB, domain_id: shD,
      description: 'Muster: „Dachschrägenschrank in [Stadt] vom Schreinermeister ✓ Maßanfertigung ✓ Ab 3.500 € → Jetzt Termin buchen!"' },
    { title: 'OG-Image (1200×630) statt Sterne-PNG', pillar: 'seo', priority: 'P1', impact: 'mittel', effort: 'niedrig', brand_id: shB, domain_id: shD,
      description: 'Professionelles markenkonformes Share-Bild für alle Seiten.' },
    { title: 'Footer-Städteliste verlinken', pillar: 'seo', priority: 'P1', impact: 'mittel', effort: 'niedrig', brand_id: shB, domain_id: shD,
      description: '13+ Städte stehen unverlinkt im Footer — auf die (neuen) Stadt-LPs verlinken.' },
    { title: 'Alle Bilder mit Alt-Texten versehen', pillar: 'seo', priority: 'P1', impact: 'mittel', effort: 'niedrig', brand_id: shB, domain_id: shD,
      description: 'Muster: „Maßgefertigter Dachschrägenschrank in [Stadt] — [Beschreibung]". 7 von 21 Startseiten-Bildern ohne Alt-Text.' },
    { title: 'Google Business: wöchentliche Posts + Projekt-Fotos', pillar: 'social', priority: 'P1', impact: 'hoch', effort: 'niedrig', brand_id: shB, domain_id: null,
      description: 'Local-Pack-Ranking stärken; Bewertungen aktiv sammeln (4,95/5 halten).' },
    { title: 'HTML-Größe der Startseite reduzieren (803 KB → <150 KB)', pillar: 'performance', priority: 'P1', impact: 'hoch', effort: 'hoch', brand_id: shB, domain_id: shD,
      description: 'Elementor-Bloat abbauen, ungenutztes CSS/JS entfernen, Critical CSS, 44 JS-Dateien konsolidieren.' },
    // P2 — Ausbau
    { title: 'Content-Hub „Dachschrägenschrank" (Pillar-Page 2.500+ Wörter)', pillar: 'seo', priority: 'P2', impact: 'hoch', effort: 'hoch', brand_id: shB, domain_id: shD,
      description: 'Pillar + Cluster (Stadt-LPs, Blog, FAQ). Blog-Themen: Kosten, Selber bauen vs. Schreiner, 10 Ideen, Materialvergleich.' },
    { title: 'Autorenbox Mario Esch auf allen Ratgeber-Seiten (E-E-A-T)', pillar: 'geo', priority: 'P2', impact: 'hoch', effort: 'niedrig', brand_id: shB, domain_id: shD,
      description: 'Schreinermeister seit 1996, Dozent Meisterschule — mit Person-Schema auszeichnen.' },
    { title: 'Lokale Backlinks: HWK Stuttgart, IHK, Stadtportale', pillar: 'seo', priority: 'P2', impact: 'mittel', effort: 'mittel', brand_id: shB, domain_id: shD,
      description: 'NAP-konsistente Einträge + lokale Presse (Zeitungen, Portale der Zielstädte).' },
    { title: 'Kostenrechner / Konfigurator auf der Website', pillar: 'geo', priority: 'P2', impact: 'hoch', effort: 'hoch', brand_id: shB, domain_id: shD,
      description: 'Unique Data & Interaktion — stärkt GEO (zitierfähige Preisdaten) und Conversion.' },
    { title: 'Finverk: Positionierung schärfen + Kanalstrategie festlegen', pillar: 'brand', priority: 'P1', impact: 'hoch', effort: 'mittel', brand_id: brandIds.finverk, domain_id: null,
      description: 'Nutzenversprechen, Kategorie, Zielgruppe definieren (Reiter Marken) → dann Social-Prioritäten und Keyword-Set ableiten.' },
    { title: 'Brand-Monitoring: Suchvolumen & SERP-Ownership monatlich', pillar: 'brand', priority: 'P2', impact: 'mittel', effort: 'niedrig', brand_id: null, domain_id: null,
      description: 'Für „schreinerhelden" und „finverk": Suchvolumen-Trend + wie viele Top-10-Treffer die eigene Marke kontrolliert.' },
    { title: 'IMS: LinkedIn-Contentplan (2 Posts/Woche, Projekt-Cases)', pillar: 'social', priority: 'P1', impact: 'hoch', effort: 'mittel', brand_id: brandIds.ims, domain_id: null,
      description: 'Fertigungs-Cases, CNC-Einblicke, Partner-Testimonials — Ziel: Inbound-Anfragen von Architekten & Kollegen.' },
  ];
  for (const a of actions) insertAction.run(a);

  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('seeded_at', datetime('now'))").run();
  log('info', `Seed abgeschlossen: ${brands.length} Marken, ${domains.length} Domains, ${keywords.length} Keywords, ${channels.length} Kanäle, ${actions.length} Maßnahmen.`);
}
