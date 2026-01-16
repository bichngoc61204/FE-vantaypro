
import React from 'react';

export default function LineChart({ height = 220, data, yLabel, yDomain, formatY }) {
  // data: [{x, y}]
  const width = 560;
  const padding = { l: 44, r: 12, t: 14, b: 34 };
  const innerW = width - padding.l - padding.r;
  const innerH = height - padding.t - padding.b;

  const ys = data.map((d) => d.y);
  const minY = yDomain ? yDomain[0] : Math.min(...ys, 0);
  const maxY = yDomain ? yDomain[1] : Math.max(...ys, 1);
  const xStep = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const points = data
    .map((d, i) => {
      const x = padding.l + i * xStep;
      const y = padding.t + (1 - (d.y - minY) / (maxY - minY || 1)) * innerH;
      return [x, y];
    })
    .map((p) => p.join(","))
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart">
      {/* y label */}
      <text x={12} y={16} className="chartYL">
        {yLabel}
      </text>

      {/* grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p) => {
        const y = padding.t + innerH * p;
        return <line key={p} x1={padding.l} x2={width - padding.r} y1={y} y2={y} className="gridLine" />;
      })}

      {/* line */}
      <polyline points={points} fill="none" stroke="var(--mc)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

      {/* points */}
      {data.map((d, i) => {
        const x = padding.l + i * xStep;
        const y = padding.t + (1 - (d.y - minY) / (maxY - minY || 1)) * innerH;
        const label = formatY ? formatY(d.y) : String(d.y);
        return (
          <circle key={i} cx={x} cy={y} r="4.5" fill="var(--card-bg)" stroke="var(--mc)" strokeWidth="2">
            <title>
              {d.x}: {label}
            </title>
          </circle>
        );
      })}

      {/* x axis labels (sparse) */}
      {data.map((d, i) => {
        if (i % 6 !== 0 && i !== data.length - 1) return null;
        const x = padding.l + i * xStep;
        return (
          <text key={i} x={x} y={height - 12} textAnchor="middle" className="axisLabel">
            {d.x}
          </text>
        );
      })}
    </svg>
  );
}
