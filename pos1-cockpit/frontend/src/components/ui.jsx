import React from 'react';

export function Card({ title, children, right, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {(title || right) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
          {title && <div className="card-title">{title}</div>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function Pill({ tone = 'neutral', children }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

/** Status-Pill mit Icon + Text — Status wird nie über Farbe allein transportiert. */
export function StatusPill({ status }) {
  const map = {
    pass: ['✓', 'OK'],
    warn: ['!', 'Verbessern'],
    fail: ['✕', 'Kritisch'],
    info: ['i', 'Info'],
  };
  const [icon, label] = map[status] || map.info;
  return (
    <span className={`pill ${status}`}>
      {icon} {label}
    </span>
  );
}

export function SourceTag({ source }) {
  if (!source) return null;
  const demo = source === 'demo';
  return <span className={`pill ${demo ? 'demo' : 'live'}`}>{demo ? '◌ Demo' : '● Live'}</span>;
}

export function Delta({ value, invert = false, suffix = '' }) {
  if (value == null || value === 0) return <span className="delta-flat">±0{suffix}</span>;
  const good = invert ? value < 0 : value > 0;
  return (
    <span className={good ? 'delta-up' : 'delta-down'}>
      {value > 0 ? '▲' : '▼'} {Math.abs(value)}{suffix}
    </span>
  );
}

export function ErrorNote({ error, onRetry }) {
  if (!error) return null;
  return (
    <div className="error-note">
      {String(error)}{' '}
      {onRetry && (
        <button className="btn small" onClick={onRetry} style={{ marginLeft: 8 }}>
          Erneut versuchen
        </button>
      )}
    </div>
  );
}

export function Empty({ children }) {
  return <div className="empty">{children}</div>;
}

export function Spinner() {
  return <span className="spin" aria-label="lädt" />;
}

/** Kleiner Daten-Hook: lädt per fetcher, liefert {data, error, loading, reload}. */
export function useData(fetcher, deps = []) {
  const [state, setState] = React.useState({ data: null, error: null, loading: true });
  // Versionszähler gegen Race-Conditions: nur die Antwort des letzten Aufrufs
  // darf den State setzen (sonst überschreibt eine langsame alte Antwort die neue Auswahl).
  const versionRef = React.useRef(0);
  const load = React.useCallback(() => {
    const version = ++versionRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((data) => {
        if (versionRef.current === version) setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (versionRef.current === version) setState({ data: null, error, loading: false });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  React.useEffect(() => {
    load();
  }, [load]);
  return { ...state, reload: load };
}
