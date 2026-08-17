import React from 'react';
import { api, PILLARS } from '../api.js';
import { Card, Pill, ErrorNote, Empty, Spinner, useData } from '../components/ui.jsx';

const PILLAR_LABELS = {
  ...Object.fromEntries(PILLARS.map((p) => [p.key, p.label])),
  brand: 'Marke',
  content: 'Content',
};

const STATUS_FLOW = { open: 'in_progress', in_progress: 'done', done: 'open' };
const STATUS_LABEL = { open: '○ Offen', in_progress: '◐ In Arbeit', done: '● Erledigt' };

export default function Roadmap() {
  const { data: actions, error, loading, reload } = useData(() => api.get('/api/actions'), []);
  const { data: brands } = useData(() => api.get('/api/brands'), []);
  const [filter, setFilter] = React.useState({ priority: '', pillar: '', status: '' });
  const [actionError, setActionError] = React.useState(null);
  const [form, setForm] = React.useState({ title: '', description: '', priority: 'P1', pillar: 'seo', brandId: '' });
  const [showForm, setShowForm] = React.useState(false);

  if (loading) return <p><Spinner /> Lade Roadmap…</p>;
  if (error) return <ErrorNote error={error.message} onRetry={reload} />;

  const filtered = actions.filter(
    (a) =>
      (!filter.priority || a.priority === filter.priority) &&
      (!filter.pillar || a.pillar === filter.pillar) &&
      (!filter.status || a.status === filter.status)
  );

  const cycleStatus = async (a) => {
    setActionError(null);
    try {
      await api.patch(`/api/actions/${a.id}`, { status: STATUS_FLOW[a.status] });
      reload();
    } catch (e) {
      setActionError(e.message);
    }
  };

  const removeAction = async (a) => {
    if (!window.confirm(`Maßnahme „${a.title}" löschen?`)) return;
    try {
      await api.del(`/api/actions/${a.id}`);
      reload();
    } catch (e) {
      setActionError(e.message);
    }
  };

  const addAction = async (e) => {
    e.preventDefault();
    setActionError(null);
    try {
      await api.post('/api/actions', { ...form, brandId: form.brandId || undefined });
      setForm({ title: '', description: '', priority: 'P1', pillar: 'seo', brandId: '' });
      setShowForm(false);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const doneCount = actions.filter((a) => a.status === 'done').length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Maßnahmen-Roadmap</h1>
          <p>
            Priorisierte To-dos aus den Audits (P0 = kritisch, P1 = Wachstum, P2 = Ausbau). Klick auf den
            Status schaltet weiter: Offen → In Arbeit → Erledigt.
          </p>
        </div>
        <div className="stat" style={{ textAlign: 'right' }}>
          <span className="value">{doneCount}/{actions.length}</span>
          <span className="label">erledigt</span>
        </div>
      </div>
      <ErrorNote error={actionError} />

      <Card>
        <div className="form-row">
          <select value={filter.priority} onChange={(e) => setFilter({ ...filter, priority: e.target.value })}>
            <option value="">Alle Prioritäten</option>
            <option>P0</option>
            <option>P1</option>
            <option>P2</option>
          </select>
          <select value={filter.pillar} onChange={(e) => setFilter({ ...filter, pillar: e.target.value })}>
            <option value="">Alle Bereiche</option>
            {Object.entries(PILLAR_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="">Alle Status</option>
            <option value="open">Offen</option>
            <option value="in_progress">In Arbeit</option>
            <option value="done">Erledigt</option>
          </select>
          <div style={{ flex: 1 }} />
          <button className="btn" onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Abbrechen' : '+ Neue Maßnahme'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={addAction} style={{ borderTop: '1px solid var(--grid)', paddingTop: 10 }}>
            <div className="form-row">
              <input
                placeholder="Titel der Maßnahme"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ flex: 1, minWidth: 240 }}
                required
              />
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option>P0</option>
                <option>P1</option>
                <option>P2</option>
              </select>
              <select value={form.pillar} onChange={(e) => setForm({ ...form, pillar: e.target.value })}>
                {Object.entries(PILLAR_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <select value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })}>
                <option value="">— Marke —</option>
                {(brands || []).map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <textarea
                rows={2}
                placeholder="Beschreibung (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ flex: 1 }}
              />
              <button className="btn primary" type="submit">Anlegen</button>
            </div>
          </form>
        )}

        {filtered.length === 0 ? (
          <Empty>Keine Maßnahmen für diesen Filter.</Empty>
        ) : (
          filtered.map((a) => (
            <div className={`action-row ${a.status === 'done' ? 'done' : ''}`} key={a.id}>
              <button className="btn small" style={{ minWidth: 110 }} onClick={() => cycleStatus(a)}>
                {STATUS_LABEL[a.status]}
              </button>
              <div className="body">
                <div className="title">{a.title}</div>
                {a.description && <div className="desc">{a.description}</div>}
                <div className="tags">
                  <Pill tone={a.priority.toLowerCase()}>{a.priority}</Pill>
                  <Pill tone="neutral">{PILLAR_LABELS[a.pillar] || a.pillar}</Pill>
                  {a.brand_name && <Pill tone="neutral">{a.brand_name}</Pill>}
                  {a.domain_host && <Pill tone="neutral">{a.domain_host}</Pill>}
                  <Pill tone="neutral">Impact: {a.impact}</Pill>
                  <Pill tone="neutral">Aufwand: {a.effort}</Pill>
                </div>
              </div>
              <button className="btn small danger" onClick={() => removeAction(a)}>✕</button>
            </div>
          ))
        )}
      </Card>
    </>
  );
}
