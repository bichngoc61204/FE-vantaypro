
import React from 'react';
import { clamp } from '../../utils/dashboardHelpers';

export default function PipelineStep({ title, value, sub, pct }) {
  return (
    <div className="pipeStep">
      <div className="pipeTop">
        <div className="pipeTitle">{title}</div>
        <div className="pipeValue">{value}</div>
      </div>
      <div className="pipeSub">{sub}</div>
      <div className="pipeBar">
        <div className="pipeBarFill" style={{ width: `${clamp(pct, 0, 100)}%` }} />
      </div>
      <div className="pipePct">{pct.toFixed(1)}%</div>
    </div>
  );
}
