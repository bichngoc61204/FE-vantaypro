
import React from 'react';

export function Pill({ children, tone = "info" }) {
  return <span className={`pill pill--${tone}`}>{children}</span>;
}

export function DeltaPill({ label, value, unit }) {
  const tone = value >= 0 ? "good" : "warn";
  const sign = value >= 0 ? "+" : "";
  return (
    <span className={`pill pill--${tone}`} title="So sánh với ngày trước">
      {label}: {sign}
      {typeof value === "number" ? value.toFixed(1) : value}
      {unit}
    </span>
  );
}
