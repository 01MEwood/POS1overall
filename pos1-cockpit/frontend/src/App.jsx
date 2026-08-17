import React from 'react';
import { api } from './api.js';
import { useData } from './components/ui.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Websites from './pages/Websites.jsx';
import Keywords from './pages/Keywords.jsx';
import Brands from './pages/Brands.jsx';
import Social from './pages/Social.jsx';
import Roadmap from './pages/Roadmap.jsx';

const PAGES = [
  { key: 'dashboard', label: '📊 Dashboard', component: Dashboard },
  { key: 'websites', label: '🌐 Websites', component: Websites },
  { key: 'keywords', label: '🔑 Keywords', component: Keywords },
  { key: 'brands', label: '™️ Marken', component: Brands },
  { key: 'social', label: '📣 Social Media', component: Social },
  { key: 'roadmap', label: '🗺️ Roadmap', component: Roadmap },
];

export default function App() {
  const [page, setPage] = React.useState('dashboard');
  const { data: status } = useData(() => api.get('/api/status'), []);
  const Active = PAGES.find((p) => p.key === page)?.component || Dashboard;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          POS<span>1</span> Cockpit
        </div>
        {PAGES.map((p) => (
          <button
            key={p.key}
            className={`navbtn ${page === p.key ? 'active' : ''}`}
            onClick={() => setPage(p.key)}
          >
            {p.label}
          </button>
        ))}
        <div className="spacer" />
        {status && (
          <div className="mode-badge">
            DataForSEO: <strong>{status.mode === 'live' ? 'Live' : 'Demo'}</strong>
            {status.mode === 'live' && (
              <div className="small muted">Kosten: {status.dataforseoCostTotal.toFixed(3)} $</div>
            )}
            {status.mode === 'demo' && (
              <div className="small muted">Beispieldaten — Credentials in .env setzen</div>
            )}
          </div>
        )}
      </aside>
      <main className="main">
        <Active />
      </main>
    </div>
  );
}
