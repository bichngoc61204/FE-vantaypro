
import React from 'react';
import { formatInt } from '../../utils/dashboardHelpers';

export default function DonutChart({ size = 120, thickness = 14, data }) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const C = 2 * Math.PI * radius;

  const strokes = {
    present: "var(--good)",
    late: "var(--warn)",
    absent: "var(--bad)",
    hasIn: "var(--good)",
    mismatch: "var(--warn)",
    noIn: "var(--bad)",
    need: "var(--warn)",
    sent: "var(--good)",
    failed: "var(--bad)",
  };

  let offset = 0;
  return (
    <svg width={size} height={size} className="donut" role="img" aria-label="Donut chart">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--border)"
        strokeWidth={thickness}
        fill="none"
        opacity="0.65"
      />
      {data.map((seg) => {
        const frac = seg.value / total;
        const dash = frac * C;
        const gap = C - dash;
        const dashArray = `${dash} ${gap}`;
        const dashOffset = -offset;
        offset += dash;
        return (
          <circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokes[seg.key] || "var(--mc)"}
            strokeWidth={thickness}
            fill="none"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          >
            <title>
              {seg.label}: {formatInt(seg.value)} ({((seg.value / total) * 100).toFixed(1)}%)
            </title>
          </circle>
        );
      })}

      <text x="50%" y="48%" textAnchor="middle" className="donutCenterValue">
        {((data[0]?.value / total) * 100).toFixed(0)}%
      </text>
      <text x="50%" y="62%" textAnchor="middle" className="donutCenterLabel">
        Có mặt
      </text>
    </svg>
  );
}
