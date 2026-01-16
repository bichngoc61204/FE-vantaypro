
import React from 'react';
import { formatInt } from '../../utils/dashboardHelpers';

export default function FunnelChart({ steps }) {
  // steps: [{label,value,key}]
  const width = 320;
  const height = 160;
  const pad = 10;
  const max = Math.max(...steps.map((s) => s.value), 1);

  const colors = {
    need: "var(--warn)",
    sent: "var(--good)",
    failed: "var(--bad)",
  };

  const rows = steps.length;
  const rowH = (height - pad * 2) / rows;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="funnel">
      {steps.map((s, i) => {
        const topW = (s.value / max) * (width - 40) + 40;
        const botW = i < rows - 1 ? (steps[i + 1].value / max) * (width - 40) + 40 : topW * 0.78;
        const y0 = pad + i * rowH;
        const y1 = y0 + rowH - 8;

        const xTop = (width - topW) / 2;
        const xBot = (width - botW) / 2;

        const points = [
          [xTop, y0],
          [xTop + topW, y0],
          [xBot + botW, y1],
          [xBot, y1],
        ]
          .map((p) => p.join(","))
          .join(" ");

        return (
          <g key={s.label}>
            <polygon points={points} fill={colors[s.key] || "var(--mc)"} opacity="0.92">
              <title>
                {s.label}: {formatInt(s.value)}
              </title>
            </polygon>
            <text x={width / 2} y={y0 + rowH / 2 + 4} textAnchor="middle" className="funnelText">
              {s.label}: {formatInt(s.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
