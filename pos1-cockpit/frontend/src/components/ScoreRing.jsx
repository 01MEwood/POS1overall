import React from 'react';

const TONE_COLORS = {
  pass: 'var(--good)',
  warn: 'var(--warning)',
  fail: 'var(--critical)',
  info: 'var(--muted)',
};

/** Donut-Ring 0–100 mit Zahl in der Mitte. Farbe folgt der Bewertung (Status), mit Zahl als zweitem Kanal. */
export default function ScoreRing({ score, size = 96, label }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const value = score == null ? 0 : Math.max(0, Math.min(100, score));
  const tone = score == null ? 'info' : score >= 75 ? 'pass' : score >= 50 ? 'warn' : 'fail';
  return (
    <div className="ring-wrap">
      <svg width={size} height={size} role="img" aria-label={`${label || 'Score'}: ${score ?? 'k. A.'} von 100`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--grid)" strokeWidth={stroke} />
        {score != null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={TONE_COLORS[tone]}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * c} ${c}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={size / 3.4}
          fontWeight="700"
        >
          {score == null ? '—' : Math.round(score)}
        </text>
      </svg>
      {label && <div className="ring-label">{label}</div>}
    </div>
  );
}
