import React from 'react';
import { api, fmtDate, fmtNum } from '../api.js';
import { Card, Pill, Delta, ErrorNote, Empty, Spinner, useData } from '../components/ui.jsx';
import TrendChart from '../components/TrendChart.jsx';

const PRIORITY_LABEL = { primary: 'Kernkanal', secondary: 'Ausbau', optional: 'Optional' };
const PRIORITY_TONE = { primary: 'p0', secondary: 'p1', optional: 'p2' };

function KpiForm({ channel, onSaved }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = React.useState({ date: today, followers: '', posts: '', reach: '', engagement: '', notes: '' });
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(null);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post('/api/social/kpis', { channelId: channel.id, ...form });
      setForm({ ...form, followers: '', posts: '', reach: '', engagement: '', notes: '' });
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save}>
      <div className="form-row">
        <label className="field">Datum<input type="date" value={form.date} max={today} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
        <label className="field">Follower<input type="number" min="0" value={form.followers} onChange={(e) => setForm({ ...form, followers: e.target.value })} /></label>
        <label className="field">Posts (Monat)<input type="number" min="0" value={form.posts} onChange={(e) => setForm({ ...form, posts: e.target.value })} /></label>
        <label className="field">Reichweite<input type="number" min="0" value={form.reach} onChange={(e) => setForm({ ...form, reach: e.target.value })} /></label>
        <label className="field">Engagement %<input type="number" min="0" step="0.1" value={form.engagement} onChange={(e) => setForm({ ...form, engagement: e.target.value })} /></label>
        <button className="btn primary" type="submit" disabled={busy}>{busy ? '…' : '+ Eintragen'}</button>
      </div>
      <ErrorNote error={error} />
    </form>
  );
}

function ChannelDetail({ channel, onChanged }) {
  const { data: kpis, error, loading, reload } = useData(
    () => api.get(`/api/social/channels/${channel.id}/kpis`),
    [channel.id]
  );
  const [edit, setEdit] = React.useState({ handle: channel.handle || '', url: channel.url || '' });
  const [saveError, setSaveError] = React.useState(null);

  React.useEffect(() => {
    setEdit({ handle: channel.handle || '', url: channel.url || '' });
  }, [channel.id]);

  const saveProfile = async () => {
    setSaveError(null);
    try {
      await api.patch(`/api/social/channels/${channel.id}`, edit);
      onChanged?.();
    } catch (e) {
      setSaveError(e.message);
    }
  };

  const removeKpi = async (id) => {
    try {
      await api.del(`/api/social/kpis/${id}`);
      reload();
      onChanged?.();
    } catch (e) {
      setSaveError(e.message);
    }
  };

  const series = kpis?.length
    ? [{
        name: 'Follower',
        color: '#d55181',
        points: kpis.filter((k) => k.followers != null).map((k) => ({ x: k.metric_date, y: k.followers })),
      }]
    : [];

  return (
    <Card title={`${channel.brand_name} · ${channel.platform}`}>
      <div className="form-row">
        <label className="field">Handle<input value={edit.handle} placeholder="@schreinerhelden" onChange={(e) => setEdit({ ...edit, handle: e.target.value })} /></label>
        <label className="field" style={{ flex: 1 }}>Profil-URL<input value={edit.url} placeholder="https://…" onChange={(e) => setEdit({ ...edit, url: e.target.value })} style={{ width: '100%' }} /></label>
        <button className="btn" onClick={saveProfile}>Speichern</button>
      </div>
      <ErrorNote error={saveError} />
      <p className="small muted">{channel.rationale}</p>

      <h3 className="section-gap">KPIs erfassen</h3>
      <KpiForm channel={channel} onSaved={() => { reload(); onChanged?.(); }} />

      {loading ? (
        <p><Spinner /> Lade KPI-Verlauf…</p>
      ) : error ? (
        <ErrorNote error={error.message} onRetry={reload} />
      ) : kpis.length === 0 ? (
        <Empty>Noch keine KPI-Einträge — Startwerte erfassen, dann monatlich pflegen.</Empty>
      ) : (
        <>
          <div className="section-gap">
            <TrendChart series={series} height={170} yLabel="Follower" />
          </div>
          <div className="table-scroll mt">
            <table className="data">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th className="num">Follower</th>
                  <th className="num">Posts</th>
                  <th className="num">Reichweite</th>
                  <th className="num">Engagement</th>
                  <th>Notiz</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {[...kpis].reverse().map((k) => (
                  <tr key={k.id}>
                    <td>{fmtDate(k.metric_date)}</td>
                    <td className="num">{fmtNum(k.followers)}</td>
                    <td className="num">{fmtNum(k.posts)}</td>
                    <td className="num">{fmtNum(k.reach)}</td>
                    <td className="num">{k.engagement != null ? `${k.engagement} %` : '—'}</td>
                    <td className="small muted">{k.notes || ''}</td>
                    <td><button className="btn small danger" onClick={() => removeKpi(k.id)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}

export default function Social() {
  const { data: channels, error, loading, reload } = useData(() => api.get('/api/social'), []);
  const { data: brands } = useData(() => api.get('/api/brands'), []);
  const [selectedId, setSelectedId] = React.useState(null);
  const [actionError, setActionError] = React.useState(null);
  const [form, setForm] = React.useState({ brandId: '', platform: '', priority: 'secondary', rationale: '' });

  if (loading) return <p><Spinner /> Lade Kanäle…</p>;
  if (error) return <ErrorNote error={error.message} onRetry={reload} />;

  const active = channels.find((c) => c.id === selectedId) || channels.find((c) => c.active) || channels[0];
  const byBrand = new Map();
  for (const c of channels) {
    if (!byBrand.has(c.brand_name)) byBrand.set(c.brand_name, []);
    byBrand.get(c.brand_name).push(c);
  }

  const toggleActive = async (c) => {
    try {
      await api.patch(`/api/social/channels/${c.id}`, { active: !c.active });
      reload();
    } catch (e) {
      setActionError(e.message);
    }
  };

  const addChannel = async (e) => {
    e.preventDefault();
    setActionError(null);
    try {
      await api.post('/api/social/channels', {
        brandId: Number(form.brandId || (brands || [])[0]?.id),
        platform: form.platform,
        priority: form.priority,
        rationale: form.rationale,
      });
      setForm({ brandId: form.brandId, platform: '', priority: 'secondary', rationale: '' });
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Social Media</h1>
          <p>
            Die effektivsten Kanäle je Marke — priorisiert nach Zielgruppen-Fit. KPIs monatlich erfassen,
            Wachstum fließt in den Social-Score der Marke ein.
          </p>
        </div>
      </div>
      <ErrorNote error={actionError} />

      <div className="grid" style={{ gridTemplateColumns: '380px 1fr', alignItems: 'start' }}>
        <div>
          {[...byBrand.entries()].map(([brandName, list]) => (
            <Card title={brandName} key={brandName} className="mt" >
              {list.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 6px', cursor: 'pointer',
                    borderRadius: 8, opacity: c.active ? 1 : 0.5,
                    background: active?.id === c.id ? 'var(--surface-2)' : 'transparent',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{c.platform}</div>
                    <div className="small muted">
                      {c.followers != null ? `${fmtNum(c.followers)} Follower` : 'keine KPIs'}
                      {c.prev_followers != null && c.followers != null && (
                        <> <Delta value={c.followers - c.prev_followers} /></>
                      )}
                      {c.last_entry ? ` · ${fmtDate(c.last_entry)}` : ''}
                    </div>
                  </div>
                  <Pill tone={PRIORITY_TONE[c.priority]}>{PRIORITY_LABEL[c.priority]}</Pill>
                  <button
                    className="btn small"
                    title={c.active ? 'Kanal pausieren' : 'Kanal aktivieren'}
                    onClick={(e) => { e.stopPropagation(); toggleActive(c); }}
                  >
                    {c.active ? '⏸' : '▶'}
                  </button>
                </div>
              ))}
            </Card>
          ))}

          <Card title="Kanal hinzufügen" className="mt">
            <form onSubmit={addChannel}>
              <div className="form-row">
                <select value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })}>
                  {(brands || []).map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <input
                  placeholder="Plattform (z. B. Newsletter)"
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  required
                />
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="primary">Kernkanal</option>
                  <option value="secondary">Ausbau</option>
                  <option value="optional">Optional</option>
                </select>
              </div>
              <div className="form-row">
                <input
                  placeholder="Warum dieser Kanal? (Begründung)"
                  value={form.rationale}
                  onChange={(e) => setForm({ ...form, rationale: e.target.value })}
                  style={{ flex: 1 }}
                />
                <button className="btn primary" type="submit">+ Kanal</button>
              </div>
            </form>
          </Card>
        </div>

        {active ? (
          <ChannelDetail channel={active} onChanged={reload} />
        ) : (
          <Empty>Kein Kanal ausgewählt.</Empty>
        )}
      </div>
    </>
  );
}
