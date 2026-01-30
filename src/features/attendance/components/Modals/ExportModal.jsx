import React, { useMemo, useState } from "react";
import ModalShell from "./ModalShell";
import Select from "../../../dashboard/admin/components/ui/Select";
import { FiDownload, FiInfo } from "react-icons/fi";

export default function ExportModal({ modal, onClose, pushToast, setAuditLogs }) {
  const payload = modal?.payload || {};
  const [type, setType] = useState("SUMMARY"); // SUMMARY | SESSIONS | LOGS | RECORDS | ANOMALIES
  const [format, setFormat] = useState("XLSX"); // XLSX | CSV

  const from = payload.from;
  const to = payload.to;
  const totals = payload.totals || {};

  const titleMap = useMemo(
    () => ({
      SUMMARY: "Báo cáo tổng hợp",
      SESSIONS: "Danh sách phiên điểm danh",
      LOGS: "Dữ liệu máy (logs)",
      RECORDS: "Bảng điểm danh (records)",
      ANOMALIES: "Danh sách bất thường",
    }),
    []
  );

  const doExport = () => {
    setAuditLogs((prev) => [
      {
        id: `au_${Date.now()}`,
        at: new Date().toISOString().slice(0, 19),
        actor: "admin@school.edu",
        action: "EXPORT",
        target: type,
        note: `format=${format} range=${from}-${to}`,
      },
      ...prev,
    ]);

    onClose();
    pushToast("Export (mock)", `${titleMap[type]} • ${format} • ${from} → ${to}`);
  };

  return (
    <ModalShell
      title="Export báo cáo điểm danh"
      subtitle="Chọn loại dữ liệu và định dạng file"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Hủy
          </button>
          <button className="btn" onClick={doExport}>
            <FiDownload /> Export
          </button>
        </>
      }
    >
      <div className="formGrid">
        <div className="formRow">
          <label>Loại export</label>
          <Select
            value={type}
            onChange={setType}
            options={[
              { value: "SUMMARY", label: "Tổng hợp (KPI + phân bổ trạng thái)" },
              { value: "SESSIONS", label: "Sessions (phiên điểm danh)" },
              { value: "LOGS", label: "Logs (dữ liệu máy vân tay)" },
              { value: "RECORDS", label: "Records (kết quả điểm danh)" },
              { value: "ANOMALIES", label: "Anomalies (bất thường)" },
            ]}
          />
        </div>

        <div className="formRow">
          <label>Định dạng</label>
          <Select
            value={format}
            onChange={setFormat}
            options={[
              { value: "XLSX", label: "Excel (.xlsx)" },
              { value: "CSV", label: "CSV (.csv)" },
            ]}
          />
        </div>

        <div className="infoBox">
          <FiInfo />
          <div>
            <div className="strong">Phạm vi export</div>
            <div className="muted">
              {from || "—"} → {to || "—"} • totals: sessions {totals.sessions ?? "—"}, logs {totals.logs ?? "—"}, anomalies{" "}
              {totals.anomalies ?? "—"}
            </div>
          </div>
        </div>

        <div className="hint">
          Hiện export là mock. Khi nối API thật: gọi endpoint export và nhận file download.
        </div>
      </div>
    </ModalShell>
  );
}
