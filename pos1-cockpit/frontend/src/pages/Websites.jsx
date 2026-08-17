import React from 'react';
import { api, PILLARS, fmtDate, fmtNum } from '../api.js';
import { Card, StatusPill, SourceTag, ErrorNote, Empty, Spinner, useData } from '../components/ui.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import PillarBars from '../components/PillarBars.jsx';

function DomainDetail({ domain, onChanged }) {
  const { data, error, loading, reload } = useData(
    () => api.get(`/api/domains/${domain.id}/scan`),
    [domain.id]
  );
  const { data: backlinks, reload: reloadBacklinks } = useData(
    () => api.get(`/api/domains/${domain.id}/backlinks`),
    [domain.id]
  );
  const [busy, setBusy] = React.useState(false);
  const [scanError, setScanError] = React.useState(null);

  const runScan = async () => {
    setBusy(true);
    setScanError(null);
    try {
      await api.post(`/api/domains/${domain.id}/scan`);
      reload();
      onChanged?.();
    } catch (e) {
      setScanError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const fetchBacklinks = async () => {
    setBusy(true);
    try {
      await api.post(`/api/domains/${domain.id}/backlinks`);
      reloadBacklinks();
    } catch (e) {
      setScanError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const lastBacklink = backlinks?.length ? backlinks[backlinks.length - 1] : null;

  return (
    <Card
      title={`Analyse: ${domain.host}`}
      right={
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn small" onClick={fetchBacklinks} disabled={busy}>
            Backlinks prüfen
          </button>
          <button className="btn small primary" onClick={runScan} disabled={busy}>
            {busy ? 'läuft…' : '↻ Jetzt scannen'}
          </button>
        </div>
      }
    >
      <ErrorNote error={scanError} />
      {loading ? (
        <p><Spinner /> Lade Scan…</p>
      ) : error ? (
        <ErrorNote error={error.message} onRetry={reload} />
      ) : !data.scan ? (
        <Empty>Noch kein Scan — „Jetzt scannen" starten.</Empty>
      ) : (
        <>
          <div className="small muted" style={{ marginBottom: 12 }}>
            <SourceTag source={data.scan.source} /> Letzter Scan: {fmtDate(data.scan.finished_at)} ·{' '}
            {data.scan.url}
            {data.scan.source === 'demo' && (
              <span> · Demo-Scan: bildet den letzten manuellen Audit-Stand bzw. Beispieldaten ab</span>
            )}
          </div>
          {lastBacklink && (
            <div className="small muted" style={{ marginBottom: 12 }}>
              Backlinks: <strong className="delta-flat">{fmtNum(lastBacklink.backlinks)}</strong> ·
              verweisende Domains: <strong className="delta-flat">{fmtNum(lastBacklink.referring_domains)}</strong> ·
              Domain-Rank (0–100): <strong className="delta-flat">{lastBacklink.domain_rank ?? '—'}</strong>{' '}
              <SourceTag source={lastBacklink.source} />
            </div>
          )}
          {PILLARS.filter((p) => p.key !== 'social').map((pillar) => {
            const checks = data.checks.filter((c) => c.pillar === pillar.key);
            if (!checks.length) return null;
            return (
              <div className="check-group" key={pillar.key}>
                <h3>
                  <span className="pillar-dot" style={{ background: pillar.color }} />
                  {pillar.label} — {checks.filter((c) => c.status === 'pass').length}/{checks.length} OK
                </h3>
                {checks.map((c) => (
                  <div className="check-row" key={c.id}>
                    <div><StatusPill status={c.status} /></div>
                    <div>
                      <div>{c.label}</div>
                      {c.value && <div className="meta">Ist: {c.value}</div>}
                      {c.recommendation && c.status !== 'pass' && (
                        <div className="reco">→ {c.recommendation}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </>
      )}
    </Card>
  );
}

export default function Websites() {
  const { data: domains, error, loading, reload } = useData(() => api.get('/api/domains'), []);
  const { data: brands } = useData(() => api.get('/api/brands'), []);
  const [selected, setSelected] = React.useState(null);
  const [form, setForm] = React.useState({ host: '', label: '', brandId: '', isOwn: true });
  const [formError, setFormError] = React.useState(null);

  if (loading) return <p><Spinner /> Lade Domains…</p>;
  if (error) return <ErrorNote error={error.message} onRetry={reload} />;

  const active = domains.find((d) => d.id === selected) || domains[0];

  const addDomain = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await api.post('/api/domains', {
        host: form.host,
        label: form.label || undefined,
        brandId: form.brandId || undefined,
        isOwn: form.isOwn,
      });
      setForm({ host: '', label: '', brandId: '', isOwn: true });
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const removeDomain = async (d) => {
    if (!window.confirm(`Domain ${d.host} samt aller Messdaten löschen?`)) return;
    try {
      await api.del(`/api/domains/${d.id}`);
      setSelected(null);
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Websites</h1>
          <p>OnPage-Analyse je Domain: SEO, AEO (Antwortmaschinen), GEO (KI-Sichtbarkeit) und Performance — mit konkreten Empfehlungen.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '320px 1fr', alignItems: 'start' }}>
        <div>
          <Card title="Domains">
            {domains.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelected(d.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 6px',
                  cursor: 'pointer', borderRadius: 8,
                  background: active?.id === d.id ? 'var(--surface-2)' : 'transparent',
                }}
              >
                <ScoreRing score={d.scores?.overall?.score ?? null} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.host}</div>
                  <div className="small muted">
                    {d.is_own ? d.brand_name || 'eigene Domain' : 'Wettbewerber'}
                  </div>
                </div>
                <button className="btn small danger" title="Löschen" onClick={(e) => { e.stopPropagation(); removeDomain(d); }}>
                  ✕
                </button>
              </div>
            ))}
            <form onSubmit={addDomain} style={{ marginTop: 12, borderTop: '1px solid var(--grid)', paddingTop: 12 }}>
              <div className="form-row">
                <input
                  placeholder="neue-domain.de"
                  value={form.host}
                  onChange={(e) => setForm({ ...form, host: e.target.value })}
                  style={{ flex: 1 }}
                  required
                />
              </div>
              <div className="form-row">
                <select value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })}>
                  <option value="">— Marke (optional) —</option>
                  {(brands || []).map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={!form.isOwn}
                    onChange={(e) => setForm({ ...form, isOwn: !e.target.checked })}
                  />
                  Wettbewerber
                </label>
                <button className="btn small primary" type="submit">+ Hinzufügen</button>
              </div>
              <ErrorNote error={formError} />
            </form>
          </Card>
          {active && (
            <Card title="Säulen-Scores" className="mt">
              <PillarBars scores={active.scores} />
            </Card>
          )}
        </div>

        {active ? <DomainDetail domain={active} onChanged={reload} /> : <Empty>Keine Domain angelegt.</Empty>}
      </div>
    </>
  );
}
