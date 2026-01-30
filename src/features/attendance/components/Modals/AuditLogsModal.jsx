import React, { useMemo, useState } from "react";
import ModalShell from "./ModalShell";
import Select from "../../../dashboard/admin/components/ui/Select";
import { FiInfo } from "react-icons/fi";

export default function AuditLogsModal({ onClose, auditLogs }) {
  const [action, setAction] = useState("ALL");

  const actions = useMemo(() => {
    const set = new Set(auditLogs.map((x) => x.action));
    return ["ALL", ...Array.from(set)];
  }, [auditLogs]);

  const rows = useMemo(() => {
    if (action === "ALL") return auditLogs;
    return auditLogs.filter((x) => x.action === action);
  }, [auditLogs, action]);

  return (
    <ModalShell
      title="Audit logs"
      subtitle="Nhật ký thao tác admin (reconcile/lock/import/export/dedup...)"
      onClose={onClose}
      footer={<button className="btn" onClick={onClose}>Đóng</button>}
    >
      <div className="formGrid">
        <div className="formRow">
          <label>Lọc theo action</label>
          <Select value={action} onChange={setAction} options={actions.map((a) => ({ value: a, label: a }))} />
        </div>

        <div className="infoBox">
          <FiInfo />
          <div>
            <div className="strong">Tổng bản ghi</div>
            <div className="muted">{rows.length}</div>
          </div>
        </div>

        <div className="tableWrap">
          <table className="table" style={{ minWidth: 820 }}>
            <thead>
              <tr>
                <th>At</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="mono">{r.at.replace("T", " ")}</td>
                  <td className="mono">{r.actor}</td>
                  <td className="mono strong">{r.action}</td>
                  <td className="mono">{r.target}</td>
                  <td className="muted">{r.note}</td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td colSpan={5} className="empty">Không có audit logs.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </ModalShell>
  );
}
