import React from 'react';
import { PILLARS } from '../api.js';

/** Horizontale Säulen-Balken (0–100) mit fixer Serienfarbe je Säule. */
export default function PillarBars({ scores }) {
  if (!scores) return null;
  return (
    <div className="bars">
      {PILLARS.map((p) => {
        const entry = scores[p.key];
        const val = entry?.score ?? entry ?? null;
        return (
          <div className="bar-row" key={p.key}>
            <span className="name">
              <span className="pillar-dot" style={{ background: p.color }} />
              {p.label}
            </span>
            <div className="bar-track" role="img" aria-label={`${p.label}: ${val ?? 'keine Daten'} von 100`}>
              {val != null && (
                <div className="bar-fill" style={{ width: `${Math.max(2, val)}%`, background: p.color }} />
              )}
            </div>
            <span className="val">{val == null ? '—' : Math.round(val)}</span>
          </div>
        );
      })}
    </div>
  );
}
