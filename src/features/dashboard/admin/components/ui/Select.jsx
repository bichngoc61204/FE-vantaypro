
import React from 'react';
import { FiChevronDown } from "react-icons/fi";

export default function Select({ value, onChange, options }) {
  return (
    <div className="selectWrap">
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="selectIcon" />
    </div>
  );
}
