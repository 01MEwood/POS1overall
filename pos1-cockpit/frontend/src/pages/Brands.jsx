import React from 'react';
import { api, DOMAIN_COLORS, fmtDate, fmtNum } from '../api.js';
import { Card, Pill, SourceTag, ErrorNote, Empty, Spinner, useData } from '../components/ui.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import TrendChart from '../components/TrendChart.jsx';

function BrandEditor({ brand, onSaved }) {
  const [form, setForm] = React.useState({
    positioning: brand.positioning || '',
    target_audience: brand.target_audience || '',
    notes: brand.notes || '',
  });
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [saved, setSaved] = React.useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.patch(`/api/brands/${brand.id}`, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save}>
      <label className="field">
        Positionierung
        <textarea rows={3} value={form.positioning} onChange={(e) => setForm({ ...form, positioning: e.target.value })} />
      </label>
      <label className="field mt">
        Zielgruppe
        <textarea rows={2} value={form.target_audience} onChange={(e) => setForm({ ...form, target_audience: e.target.value })} />
      </label>
      <label className="field mt">
        Notizen / Markenziele
        <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </label>
      <div className="form-row">
        <button className="btn primary" disabled={busy} type="submit">
          {busy ? 'Speichere…' : 'Speichern'}
        </button>
        {saved && <span className="delta-up">✓ gespeichert</span>}
      </div>
      <ErrorNote error={error} />
    </form>
  );
}

function BrandKpis({ brand }) {
  const { data, error, loading, reload } = useData(() => api.get(`/api/brands/${brand.id}/kpis`), [brand.id]);
  const [busy, setBusy] = React.useState(false);
  const [ownError, setOwnError] = React.useState(null);

  if (loading) return <p><Spinner /> Lade Marken-KPIs…</p>;
  if (error) return <ErrorNote error={error.message} onRetry={reload} />;

  const refreshOwnership = async () => {
    setBusy(true);
    setOwnError(null);
    try {
      await api.post(`/api/brands/${brand.id}/ownership`);
      reload();
    } catch (e) {
      setOwnError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const volumeSeries = data.volumeHistory
    .filter((v) => v.points.length)
    .map((v, i) => ({
      name: `Suchvolumen „${v.keyword}"`,
      color: DOMAIN_COLORS[i % DOMAIN_COLORS.length],
      points: v.points.map((p) => ({ x: p.fetched_at.slice(0, 10), y: p.search_volume })),
    }));

  const followerSeries = data.followerTrend.length
    ? [{ name: 'Follower gesamt', color: '#d55181', points: data.followerTrend.map((p) => ({ x: p.date, y: p.followers })) }]
    : [];

  return (
    <>
      <div className="grid cols-3">
        <Card title="Brand-Suchnachfrage">
          {data.positions.length === 0 ? (
            <Empty>Kein Brand-Keyword angelegt (Reiter Keywords, „Brand-Keyword" ankreuzen).</Empty>
          ) : (
            data.positions.map((p) => (
              <div key={p.keyword} className="stat" style={{ marginBottom: 10 }}>
                <span className="value">
                  {p.position != null ? `Platz ${p.position}` : '—'}
                </span>
                <span className="label">
                  „{p.keyword}" · geprüft {fmtDate(p.checked_at)} {p.source && <SourceTag source={p.source} />}
                </span>
              </div>
            ))
          )}
        </Card>
        <Card
          title="SERP-Ownership (Top 10)"
          right={<button className="btn small" onClick={refreshOwnership} disabled={busy}>{busy ? '…' : '↻ Prüfen'}</button>}
        >
          <ErrorNote error={ownError} />
          {data.ownership ? (
            <div className="stat">
              <span className="value">
                {data.ownership.top10Owned}/{data.ownership.top10Total}
              </span>
              <span className="label">
                Top-10-Treffer für „{brand.name.toLowerCase()}" unter eigener Kontrolle
                <br />
                {fmtDate(data.ownership.checkedAt)} <SourceTag source={data.ownership.source} />
              </span>
            </div>
          ) : (
            <Empty>Noch nicht geprüft. Ziel: 10/10 — Website, Social-Profile & Verzeichnisse dominieren die Marken-SERP.</Empty>
          )}
        </Card>
        <Card title="Social-Reifegrad">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ScoreRing score={data.socialScore} label="Kanal-Setup + Datenpflege + Wachstum" size={110} />
          </div>
        </Card>
      </div>

      <div className="grid cols-2 section-gap">
        <Card title="Suchvolumen-Verlauf (Markenname)">
          <TrendChart series={volumeSeries} height={190} yLabel="Suchvolumen/Monat" />
        </Card>
        <Card title="Follower-Entwicklung (alle Kanäle)">
          <TrendChart series={followerSeries} height={190} yLabel="Follower" />
        </Card>
      </div>
    </>
  );
}

export default function Brands() {
  const { data: brands, error, loading, reload } = useData(() => api.get('/api/brands'), []);
  const [selectedId, setSelectedId] = React.useState(null);

  if (loading) return <p><Spinner /> Lade Marken…</p>;
  if (error) return <ErrorNote error={error.message} onRetry={reload} />;

  const active = brands.find((b) => b.id === selectedId) || brands[0];

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Markenentwicklung</h1>
          <p>
            Schreinerhelden & Finverk (beide DPMA-eingetragen) zu Top-Marken entwickeln: Positionierung,
            Suchnachfrage, SERP-Ownership und Social-Reifegrad im Blick.
          </p>
        </div>
      </div>

      <div className="grid cols-3">
        {brands.map((b) => (
          <Card key={b.id}>
            <div
              onClick={() => setSelectedId(b.id)}
              style={{ cursor: 'pointer', outline: active?.id === b.id ? '1px solid var(--seo)' : 'none', outlineOffset: 8, borderRadius: 4 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h2>{b.name}</h2>
                <Pill tone={b.dpma_status === 'eingetragen' ? 'pass' : 'neutral'}>
                  {b.dpma_status === 'eingetragen' ? '® DPMA' : 'ohne Eintragung'}
                </Pill>
              </div>
              <div className="small muted">{b.domains.filter((d) => d.is_own).map((d) => d.host).join(', ') || 'keine Domain'}</div>
              <p className="small" style={{ color: 'var(--ink-2)', marginTop: 8 }}>
                {(b.positioning || '').slice(0, 140)}{(b.positioning || '').length > 140 ? '…' : ''}
              </p>
              <div className="small muted">
                {b.channels.filter((c) => c.active).length} aktive Kanäle · {b.openActions} offene Maßnahmen
              </div>
            </div>
          </Card>
        ))}
      </div>

      {active && (
        <>
          <div className="section-gap">
            <BrandKpis brand={active} />
          </div>
          <div className="grid cols-2 section-gap">
            <Card title={`Markenprofil bearbeiten: ${active.name}`}>
              {/* key erzwingt Remount beim Markenwechsel — sonst bleibt der Formular-State der vorherigen Marke stehen */}
              <BrandEditor key={active.id} brand={active} onSaved={reload} />
            </Card>
            <Card title="Markenschutz & Hinweise">
              <p className="small" style={{ color: 'var(--ink-2)' }}>
                <strong>DPMA-Status:</strong> {active.dpma_status}
                {active.dpma_note ? ` — ${active.dpma_note}` : ''}
              </p>
              <p className="small muted">
                Empfehlung für eingetragene Marken: Markenname konsequent mit ® führen (Website-Footer,
                Impressum, Profile), Nizza-Klassen und Schutzfristen im Blick behalten (Verlängerung alle
                10 Jahre), Marken-Monitoring auf ähnliche Anmeldungen.
              </p>
              {active.notes && (
                <>
                  <h3 className="mt">Markenziele</h3>
                  <p className="small" style={{ color: 'var(--ink-2)' }}>{active.notes}</p>
                </>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}
