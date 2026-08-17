import React from 'react';

/**
 * Mehrserien-Linienchart (SVG) mit Crosshair + Tooltip.
 * series: [{ name, color, points: [{x: ISO-Datum/Label, y: Zahl}] }]
 * invertY: true für Ranking-Positionen (Platz 1 oben).
 */
export default function TrendChart({ series, height = 200, invertY = false, yMax = null, yLabel = '' }) {
  const wrapRef = React.useRef(null);
  const [width, setWidth] = React.useState(560);
  const [hover, setHover] = React.useState(null);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width;
      if (w) setWidth(Math.max(280, w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Punkte je x-Wert deduplizieren (letzter gewinnt = neueste Messung des Tages)
  // und Serien ohne einen einzigen Messwert aussortieren (sonst NaN-Koordinaten).
  const valid = (series || [])
    .map((s) => {
      const byX = new Map();
      for (const p of s.points || []) if (p.y != null) byX.set(p.x, p);
      return { ...s, points: [...byX.values()] };
    })
    .filter((s) => s.points.length > 0);
  if (!valid.length) return <div className="empty">Noch keine Verlaufsdaten — erste Messung ausführen.</div>;

  // Gemeinsame X-Achse aus allen Zeitpunkten
  const xKeys = [...new Set(valid.flatMap((s) => s.points.map((p) => p.x)))].sort();
  const pad = { l: 34, r: 12, t: 10, b: 24 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;

  const allY = valid.flatMap((s) => s.points.map((p) => p.y));
  let yMin = Math.min(...allY);
  let yTop = yMax != null ? yMax : Math.max(...allY);
  if (yMin === yTop) { yMin = Math.max(0, yMin - 5); yTop = yTop + 5; }
  const yRange = yTop - yMin || 1;

  const xPos = (x) => pad.l + (xKeys.length === 1 ? w / 2 : (xKeys.indexOf(x) / (xKeys.length - 1)) * w);
  const yPos = (y) => {
    const norm = (y - yMin) / yRange;
    return pad.t + (invertY ? norm * h : (1 - norm) * h);
  };

  const gridLines = 4;
  const gridYs = Array.from({ length: gridLines + 1 }, (_, i) => yMin + (yRange / gridLines) * i);

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    let best = null;
    for (const key of xKeys) {
      const px = xPos(key);
      if (!best || Math.abs(px - mx) < Math.abs(best.px - mx)) best = { key, px };
    }
    if (best) {
      const values = valid
        .map((s) => {
          const pt = s.points.find((p) => p.x === best.key);
          return pt ? { name: s.name, color: s.color, y: pt.y } : null;
        })
        .filter(Boolean);
      setHover({ ...best, values, my: e.clientY - rect.top });
    }
  };

  const fmtX = (x) => (x?.length >= 10 ? x.slice(8, 10) + '.' + x.slice(5, 7) + '.' : x);

  return (
    <div className="chart-box" ref={wrapRef} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg width={width} height={height} role="img" aria-label={yLabel || 'Verlauf'}>
        {gridYs.map((gy, i) => (
          <g key={i}>
            <line x1={pad.l} x2={width - pad.r} y1={yPos(gy)} y2={yPos(gy)} stroke="var(--grid)" strokeWidth="1" />
            <text x={pad.l - 6} y={yPos(gy) + 4} textAnchor="end" fontSize="10.5" fill="var(--muted)">
              {Math.round(gy)}
            </text>
          </g>
        ))}
        {xKeys.map((x, i) =>
          (xKeys.length <= 8 || i % Math.ceil(xKeys.length / 8) === 0) ? (
            <text key={x} x={xPos(x)} y={height - 6} textAnchor="middle" fontSize="10.5" fill="var(--muted)">
              {fmtX(x)}
            </text>
          ) : null
        )}
        {hover && (
          <line x1={hover.px} x2={hover.px} y1={pad.t} y2={height - pad.b} stroke="var(--baseline)" strokeWidth="1" />
        )}
        {valid.map((s) => {
          const pts = s.points;
          const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${xPos(p.x)},${yPos(p.y)}`).join(' ');
          return (
            <g key={s.name}>
              <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {pts.map((p) => (
                <circle
                  key={p.x}
                  cx={xPos(p.x)}
                  cy={yPos(p.y)}
                  r={hover?.key === p.x ? 4.5 : 3}
                  fill={s.color}
                  stroke="var(--surface)"
                  strokeWidth="2"
                />
              ))}
            </g>
          );
        })}
      </svg>
      {hover && hover.values.length > 0 && (
        <div
          className="chart-tooltip"
          style={{
            left: Math.min(hover.px + 12, width - 150),
            top: Math.max(4, hover.my - 14),
          }}
        >
          <div className="muted small">{fmtX(hover.key)}</div>
          {hover.values.map((v) => (
            <div key={v.name}>
              <span className="pillar-dot" style={{ background: v.color }} />
              {v.name}: <strong>{v.y}</strong>
            </div>
          ))}
        </div>
      )}
      {valid.length >= 2 && (
        <div className="legend">
          {valid.map((s) => (
            <span className="item" key={s.name}>
              <span className="pillar-dot" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
