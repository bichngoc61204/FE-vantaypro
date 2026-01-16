
import React from 'react';

export function LegendRow({ label, value, dot }) {
  return (
    <div className="legendRow">
      <span className={`dot ${dot}`} />
      <span className="legendLabel">{label}</span>
      <span className="legendValue">{value}</span>
    </div>
  );
}

export function Fact({ icon, label, value }) {
  return (
    <div className="fact">
      <div className="factIcon">{icon}</div>
      <div className="factText">
        <div className="factLabel">{label}</div>
        <div className="factValue">{value}</div>
      </div>
    </div>
  );
}

export function QualityStat({ label, value, dot }) {
  return (
    <div className="qualityStat">
      <div className="qualityLeft">
        <span className={`dot ${dot}`} />
        <span className="qualityLabel">{label}</span>
      </div>
      <div className="qualityValue">{value}</div>
    </div>
  );
}
