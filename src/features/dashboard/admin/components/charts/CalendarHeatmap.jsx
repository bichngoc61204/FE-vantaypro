
import React from 'react';

function heatTone(absentRate) {
    // absentRate (%) => 4 levels
    if (absentRate <= 1.6) return "heat--1";
    if (absentRate <= 2.6) return "heat--2";
    if (absentRate <= 3.8) return "heat--3";
    return "heat--4";
  }

export default function CalendarHeatmap({ data }) {
  // data: [{date: iso, value: %, label: "MM/DD"}] length 30
  // Render as 6 weeks x 7 days grid (approx)
  const cells = 42; // 6 weeks
  const padCells = Array.from({ length: Math.max(0, cells - data.length) }, () => null);
  const all = [...padCells, ...data]; // align last days at end
  const rows = 6;
  const cols = 7;

  return (
    <div className="heatmapWrap">
      <div className="heatmapGrid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {all.map((d, idx) => {
          if (!d) return <div key={idx} className="heatCell heatCell--empty" />;
          const tone = heatTone(d.value); // absentRate
          return (
            <div
              key={idx}
              className={`heatCell ${tone}`}
              title={`${d.label} — Absent rate: ${d.value.toFixed(1)}%`}
            >
              <span className="heatLabel">{d.label}</span>
            </div>
          );
        })}
      </div>

      <div className="heatLegend">
        <span className="muted small">Absent thấp</span>
        <span className="heatDot heatDot--1" />
        <span className="heatDot heatDot--2" />
        <span className="heatDot heatDot--3" />
        <span className="heatDot heatDot--4" />
        <span className="muted small">Absent cao</span>
      </div>
    </div>
  );
}
