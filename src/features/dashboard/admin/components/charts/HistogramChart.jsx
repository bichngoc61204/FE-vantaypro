
import React from 'react';
import { formatInt } from '../../utils/dashboardHelpers';

export default function HistogramChart({ height = 220, data }) {
  // data: [{label, value}]
  const width = 560;
  const padding = { l: 24, r: 12, t: 12, b: 34 };
  const innerW = width - padding.l - padding.r;
  const innerH = height - padding.t - padding.b;
  const n = data.length || 1;
  const gap = 10;
  const barW = (innerW - gap * (n - 1)) / n;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart">
      {[0.25, 0.5, 0.75, 1].map((p) => {
        const y = padding.t + innerH * (1 - p);
        return <line key={p} x1={padding.l} x2={width - padding.r} y1={y} y2={y} className="gridLine" />;
      })}

      {data.map((d, i) => {
        const x = padding.l + i * (barW + gap);
        const h = (d.value / max) * innerH;
        const y = padding.t + innerH - h;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={h} rx="10" fill="var(--mc)" opacity="0.9">
              <title>
                {d.label}: {formatInt(d.value)} log IN
              </title>
            </rect>
            <text x={x + barW / 2} y={height - 12} textAnchor="middle" className="axisLabel">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
