
import React from 'react';

export default function Table({ columns, rows, emptyText }) {
  return (
    <div className="tableWrap">
      <div className="table">
        <div className="thead">
          {columns.map((c) => (
            <div key={c.key} className={`th ${c.align ? `t-${c.align}` : ""}`} style={{ width: c.width }}>
              {c.header}
            </div>
          ))}
        </div>

        <div className="tbody">
          {rows.length === 0 ? (
            <div className="emptyRow">{emptyText}</div>
          ) : (
            rows.map((r) => (
              <div key={r.key} className="tr">
                {columns.map((c) => (
                  <div
                    key={c.key}
                    className={`td ${c.align ? `t-${c.align}` : ""}`}
                    style={{ width: c.width }}
                  >
                    {r[c.key]}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
