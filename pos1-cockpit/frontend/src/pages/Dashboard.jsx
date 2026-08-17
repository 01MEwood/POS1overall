import React from 'react';
import { api, PILLARS, DOMAIN_COLORS, fmtDate, fmtNum } from '../api.js';
import { Card, Pill, SourceTag, Delta, ErrorNote, Empty, Spinner, useData } from '../components/ui.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import PillarBars from '../components/PillarBars.jsx';
import TrendChart from '../components/TrendChart.jsx';

export default function Dashboard() {
  const { data, error, loading, reload } = useData(() => api.get('/api/overview'), []);
  const [busy, setBusy] = React.useState(false);
  const [actionError, setActionError] = React.useState(null);

  if (loading) return <p><Spinner /> Lade Übersicht…</p>;
  if (error) return <ErrorNote error={error.message} onRetry={reload} />;

  const own = data.domains.filter((d) => d.is_own);
  const competitors = data.domains.filter((d) => !d.is_own);
  const hasAnyScore = data.domains.some((d) => d.scores?.overall);

  const runFullAnalysis = async () => {
    setBusy(true);
    setActionError(null);
    try {
      // Alle Domains scannen, dann Rankings aktualisieren
      for (const d of data.domains) {
        await api.post(`/api/domains/${d.id}/scan`).catch((e) => {
          throw new Error(`${d.host}: ${e.message}`);
        });
      }
      await api.post('/api/keywords/refresh', {});
      reload();
    } catch (e) {
      setActionError(e.message);
      reload();
    } finally {
      setBusy(false);
    }
  };

  const trendSeries = own.map((d, i) => ({
    name: d.host,
    color: DOMAIN_COLORS[i % DOMAIN_COLORS.length],
    points: data.scoreHistory
      .filter((h) => h.domain_id === d.id)
      .map((h) => ({ x: h.computed_at.slice(0, 10), y: Math.round(h.score) })),
  }));

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Benchmark-Dashboard</h1>
          <p>
            Der Weg zu Position 1: Gesamt-Score aus SEO (30 %), AEO (20 %), GEO (20 %), Performance (15 %)
            und Social (15 %) — je Domain, mit Verlauf und Wettbewerbsvergleich.
          </p>
        </div>
        <button className="btn primary" onClick={runFullAnalysis} disabled={busy}>
          {busy ? <>⏳ Analysiere…</> : '▶ Komplett-Analyse starten'}
        </button>
      </div>
      <ErrorNote error={actionError} />

      {!hasAnyScore && (
        <div className="hint-note">
          Noch keine Messdaten. Starte die <strong>Komplett-Analyse</strong> — sie scannt alle Domains
          (SEO/AEO/GEO/Performance) und prüft die Keyword-Rankings.
        </div>
      )}

      <div className="grid cols-3">
        {own.map((d) => (
          <Card key={d.id}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <ScoreRing score={d.scores?.overall?.score ?? null} label="Overall" size={92} />
              <div style={{ flex: 1 }}>
                <h2>{d.label}</h2>
                <div className="small muted">{d.host}</div>
                <div className="mt small">
                  {d.scores?.overall?.delta != null && <Delta value={d.scores.overall.delta} />}{' '}
                  {d.last_scan_at ? (
                    <>
                      <SourceTag source={d.last_scan_source} />{' '}
                      <span className="muted">Scan: {fmtDate(d.last_scan_at)}</span>
                    </>
                  ) : (
                    <span className="muted">noch nicht gescannt</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt">
              <PillarBars scores={d.scores} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid cols-2 section-gap">
        <Card title="Benchmark-Verlauf (Overall-Score)">
          <TrendChart series={trendSeries} yMax={100} height={210} yLabel="Overall-Score" />
        </Card>

        <Card title="Keyword-Lage">
          <div className="grid cols-3">
            <div className="stat">
              <span className="value">{data.keywordSummary.total}</span>
              <span className="label">Keywords im Tracking</span>
            </div>
            <div className="stat">
              <span className="value">{data.keywordSummary.ranked}</span>
              <span className="label">mit Ranking-Messung</span>
            </div>
            <div className="stat">
              <span className="value">{data.keywordSummary.top10}</span>
              <span className="label">in den Top 10</span>
            </div>
          </div>
          <h3 className="section-gap">Größte Bewegungen</h3>
          {data.keywordSummary.movers.length === 0 ? (
            <Empty>Noch keine Veränderungen gemessen (mind. 2 Messungen nötig).</Empty>
          ) : (
            <table className="data">
              <tbody>
                {data.keywordSummary.movers.map((m) => (
                  <tr key={m.id}>
                    <td>{m.keyword}</td>
                    <td className="num">Platz {m.position ?? '—'}</td>
                    <td className="num"><Delta value={m.delta} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <div className="grid cols-2 section-gap">
        <Card title="Wettbewerber-Benchmark (Overall)">
          {competitors.length === 0 ? (
            <Empty>Keine Wettbewerber angelegt (Reiter Websites).</Empty>
          ) : (
            <table className="data">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th className="num">Overall</th>
                  <th className="num">SEO</th>
                  <th className="num">AEO</th>
                  <th className="num">GEO</th>
                </tr>
              </thead>
              <tbody>
                {[...own, ...competitors]
                  .sort((a, b) => (b.scores?.overall?.score ?? -1) - (a.scores?.overall?.score ?? -1))
                  .map((d) => (
                    <tr key={d.id} style={d.is_own ? { fontWeight: 600 } : undefined}>
                      <td>
                        {d.is_own ? '★ ' : ''}{d.host}
                      </td>
                      <td className="num">{d.scores?.overall?.score ?? '—'}</td>
                      <td className="num">{d.scores?.seo?.score ?? '—'}</td>
                      <td className="num">{d.scores?.aeo?.score ?? '—'}</td>
                      <td className="num">{d.scores?.geo?.score ?? '—'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Nächste Maßnahmen">
          {data.nextActions.length === 0 ? (
            <Empty>Alles erledigt 🎉</Empty>
          ) : (
            <table className="data">
              <tbody>
                {data.nextActions.map((a) => (
                  <tr key={a.id}>
                    <td style={{ width: 42 }}>
                      <Pill tone={a.priority.toLowerCase()}>{a.priority}</Pill>
                    </td>
                    <td>
                      {a.title}
                      <div className="small muted">
                        {PILLARS.find((p) => p.key === a.pillar)?.label || a.pillar}
                        {a.brand_name ? ` · ${a.brand_name}` : ''}
                        {a.status === 'in_progress' ? ' · in Arbeit' : ''}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  );
}
