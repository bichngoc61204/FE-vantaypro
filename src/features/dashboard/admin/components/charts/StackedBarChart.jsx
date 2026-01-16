
import React from 'react';
import { formatInt } from '../../utils/dashboardHelpers';

export default function StackedBarChart({ height = 220, data, showHint = false }) {
  // data: [{label, segments:[{key,label,value}], hint?}]
  const width = 560; // internal viewbox
  const padding = { l: 24, r: 12, t: 12, b: 36 };
  const innerW = width - padding.l - padding.r;
  const innerH = height - padding.t - padding.b;
  const n = data.length || 1;
  const gap = 10;
  const barW = (innerW - gap * (n - 1)) / n;

  const max = Math.max(
    ...data.map((d) => d.segments.reduce((sum, s) => sum + s.value, 0)),
    1
  );

  const colors = {
    present: "var(--good)",
    late: "var(--warn)",
    absent: "var(--bad)",
    hasIn: "var(--good)",
    mismatch: "var(--warn)",
    noIn: "var(--bad)",
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart">
      {/* grid lines */}
      {[0.25, 0.5, 0.75, 1].map((p) => {
        const y = padding.t + innerH * (1 - p);
        return <line key={p} x1={padding.l} x2={width - padding.r} y1={y} y2={y} className="gridLine" />;
      })}

      {data.map((d, i) => {
        const x = padding.l + i * (barW + gap);
        let y = padding.t + innerH;
        const total = d.segments.reduce((sum, s) => sum + s.value, 0) || 1;

        return (
          <g key={d.label}>
            {d.segments.map((s) => {
              const h = (s.value / max) * innerH;
              y -= h;
              return (
                <rect
                  key={s.key}
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx="8"
                  fill={colors[s.key] || "var(--mc)"}
                  opacity="0.92"
                >
                  <title>
                    {d.label} {showHint && d.hint ? `(${d.hint})` : ""} — {s.label}: {formatInt(s.value)}{" "}
                    ({((s.value / total) * 100).toFixed(1)}%)
                  </title>
                </rect>
              );
            })}

            <text x={x + barW / 2} y={height - 14} textAnchor="middle" className="axisLabel">
              {d.label}
            </text>

            {showHint && d.hint ? (
              <text x={x + barW / 2} y={height - 2} textAnchor="middle" className="axisHint">
                {d.hint}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
