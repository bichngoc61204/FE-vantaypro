
import React from 'react';

export default function SparklineBinary({ values }) {
  // values: array of 0/1; 1 is "present-like", 0 is "issue/absent-like"
  const width = 140;
  const height = 28;
  const pad = 2;
  const n = values.length || 1;
  const step = (width - pad * 2) / (n - 1 || 1);

  const points = values
    .map((v, i) => {
      const x = pad + i * step;
      const y = pad + (1 - v) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="spark">
      <polyline points={points} fill="none" stroke="var(--mc)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => {
        const x = pad + i * step;
        const y = pad + (1 - v) * (height - pad * 2);
        return <circle key={i} cx={x} cy={y} r="2.5" fill={v ? "var(--good)" : "var(--bad)"} opacity="0.9" />;
      })}
    </svg>
  );
}
