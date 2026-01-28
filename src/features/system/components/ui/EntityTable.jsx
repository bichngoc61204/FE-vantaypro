
import React from 'react';

const EntityTable = ({ columns, rows, emptyText }) => {
  return (
    <div className="tableWrap">
      <table className="tbl">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: c.align || "left" }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align || "left" }}>
                  {r.cells[c.key]}
                </td>
              ))}
            </tr>
          ))}
          {!rows.length ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="empty">{emptyText || "Không có dữ liệu."}</div>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default EntityTable;
