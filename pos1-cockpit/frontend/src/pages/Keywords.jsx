import React from 'react';
import { api, DOMAIN_COLORS, fmtDate, fmtNum } from '../api.js';
import { Card, Pill, SourceTag, Delta, ErrorNote, Empty, Spinner, useData } from '../components/ui.jsx';
import TrendChart from '../components/TrendChart.jsx';

function KeywordHistory({ keyword }) {
  const { data, error, loading } = useData(
    () => api.get(`/api/keywords/${keyword.id}/history`),
    [keyword.id]
  );
  if (loading) return <p><Spinner /> Lade Verlauf…</p>;
  if (error) return <ErrorNote error={error.message} />;
  const rankSeries = [
    {
      name: `Position „${keyword.keyword}"`,
      color: DOMAIN_COLORS[0],
      points: data.rankings
        .filter((r) => r.position != null)
        .map((r) => ({ x: r.checked_at.slice(0, 10), y: r.position })),
    },
  ];
  return (
    <Card title={`Ranking-Verlauf: ${keyword.keyword}`}>
      <TrendChart series={rankSeries} invertY height={180} yLabel="Google-Position (niedriger = besser)" />
      <div className="small muted mt">Y-Achse invertiert: oben = Platz 1. Nicht platzierte Messungen werden ausgeblendet.</div>
    </Card>
  );
}

export default function Keywords() {
  const { data: keywords, error, loading, reload } = useData(() => api.get('/api/keywords'), []);
  const { data: domains } = useData(() => api.get('/api/domains'), []);
  const [busy, setBusy] = React.useState(false);
  const [refreshInfo, setRefreshInfo] = React.useState(null);
  const [actionError, setActionError] = React.useState(null);
  const [selectedKw, setSelectedKw] = React.useState(null);
  const [form, setForm] = React.useState({ keyword: '', domainId: '', priority: 'MITTEL', isBrand: false });

  if (loading) return <p><Spinner /> Lade Keywords…</p>;
  if (error) return <ErrorNote error={error.message} onRetry={reload} />;

  const ownDomains = (domains || []).filter((d) => d.is_own);

  const refresh = async () => {
    setBusy(true);
    setActionError(null);
    setRefreshInfo(null);
    try {
      const result = await api.post('/api/keywords/refresh', {});
      setRefreshInfo(result);
      reload();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const addKeyword = async (e) => {
    e.preventDefault();
    setActionError(null);
    try {
      await api.post('/api/keywords', {
        keyword: form.keyword,
        domainId: Number(form.domainId || ownDomains[0]?.id),
        priority: form.priority,
        isBrand: form.isBrand,
      });
      setForm({ keyword: '', domainId: form.domainId, priority: 'MITTEL', isBrand: false });
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const removeKeyword = async (kw) => {
    if (!window.confirm(`Keyword „${kw.keyword}" samt Messhistorie löschen?`)) return;
    try {
      await api.del(`/api/keywords/${kw.id}`);
      if (selectedKw?.id === kw.id) setSelectedKw(null);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const posTone = (p) => (p == null ? 'info' : p <= 3 ? 'pass' : p <= 10 ? 'warn' : 'fail');

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Keywords & Rankings</h1>
          <p>Google-Positionen (DE) je Keyword und Domain — inkl. Suchvolumen, CPC und SERP-Features via DataForSEO.</p>
        </div>
        <button className="btn primary" onClick={refresh} disabled={busy}>
          {busy ? '⏳ Prüfe Rankings…' : '↻ Rankings aktualisieren'}
        </button>
      </div>
      <ErrorNote error={actionError} />
      {refreshInfo && (
        <div className="hint-note">
          {refreshInfo.refreshed}/{refreshInfo.total} Keywords aktualisiert.
          {refreshInfo.errors?.length > 0 && ` Fehler: ${refreshInfo.errors.map((e) => e.keyword).join(', ')}`}
        </div>
      )}

      <Card>
        <form onSubmit={addKeyword} className="form-row">
          <input
            placeholder="neues keyword…"
            value={form.keyword}
            onChange={(e) => setForm({ ...form, keyword: e.target.value })}
            style={{ flex: 2, minWidth: 200 }}
            required
          />
          <select value={form.domainId} onChange={(e) => setForm({ ...form, domainId: e.target.value })}>
            {ownDomains.map((d) => (
              <option key={d.id} value={d.id}>{d.host}</option>
            ))}
          </select>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option>HOCH</option>
            <option>MITTEL</option>
            <option>NIEDRIG</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <input
              type="checkbox"
              checked={form.isBrand}
              onChange={(e) => setForm({ ...form, isBrand: e.target.checked })}
            />
            Brand-Keyword
          </label>
          <button className="btn primary" type="submit">+ Keyword</button>
        </form>

        <div className="table-scroll">
          <table className="data">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Domain</th>
                <th className="num">Position</th>
                <th className="num">Δ</th>
                <th className="num">Suchvol./Monat</th>
                <th className="num">CPC</th>
                <th>SERP-Features</th>
                <th>Priorität</th>
                <th>Geprüft</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {keywords.filter((k) => k.is_own).map((k) => (
                <tr
                  key={k.id}
                  onClick={() => setSelectedKw(k)}
                  style={{ cursor: 'pointer', background: selectedKw?.id === k.id ? 'var(--surface-2)' : undefined }}
                >
                  <td>
                    {k.is_brand ? '™ ' : ''}{k.keyword}
                    {k.intent ? <div className="small muted">{k.intent}</div> : null}
                  </td>
                  <td className="small">{k.host}</td>
                  <td className="num">
                    <Pill tone={posTone(k.position)}>
                      {k.position == null ? (k.checked_at ? '>100' : '—') : `Platz ${k.position}`}
                    </Pill>
                  </td>
                  <td className="num">
                    {k.prev_position != null && k.position != null ? (
                      <Delta value={k.prev_position - k.position} />
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="num">{fmtNum(k.search_volume)}</td>
                  <td className="num">{k.cpc != null ? `${Number(k.cpc).toFixed(2)} €` : '—'}</td>
                  <td className="small muted">{(k.serp_features || '').split(',').filter(Boolean).slice(0, 3).join(', ') || '—'}</td>
                  <td><Pill tone={k.priority === 'HOCH' ? 'p0' : k.priority === 'MITTEL' ? 'p1' : 'p2'}>{k.priority}</Pill></td>
                  <td className="small muted">
                    {fmtDate(k.checked_at)} {k.ranking_source && <SourceTag source={k.ranking_source} />}
                  </td>
                  <td>
                    <button className="btn small danger" onClick={(e) => { e.stopPropagation(); removeKeyword(k); }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {keywords.filter((k) => k.is_own).length === 0 && <Empty>Noch keine Keywords angelegt.</Empty>}
      </Card>

      {selectedKw && <div className="section-gap"><KeywordHistory keyword={selectedKw} /></div>}
    </>
  );
}
