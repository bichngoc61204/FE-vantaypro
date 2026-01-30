import React, { useMemo, useState } from "react";
import ModalShell from "./ModalShell";
import Select from "../../../dashboard/admin/components/ui/Select";
import { FiUpload, FiDatabase, FiAlertTriangle } from "react-icons/fi";

const DEVICE_OPTIONS = [
  { value: "DEVICE_01", label: "Máy 01 (Cổng chính)" },
  { value: "DEVICE_02", label: "Máy 02 (Cổng phụ)" },
  { value: "DEVICE_SYNC", label: "Sync service" },
];

export default function ImportLogsModal({
  modal,
  onClose,
  students,
  setLogs,
  setAuditLogs,
  pushToast,
}) {
  const [device, setDevice] = useState("DEVICE_01");
  const [mode, setMode] = useState("APPEND"); // APPEND | REPLACE_RANGE
  const [fileName, setFileName] = useState("");
  const [parsing, setParsing] = useState(false);

  const payload = modal?.payload || {};
  const from = payload.from;
  const to = payload.to;

  const preview = useMemo(() => {
    // mock preview: 5 dòng
    const pick = students.slice(0, 5);
    return pick.map((s, idx) => ({
      row: idx + 1,
      student: `${s.student_code} - ${s.full_name}`,
      time: `${from || "2025-01-01"}T07:${String(10 + idx * 3).padStart(2, "0")}:00`,
      type: "IN",
      device,
    }));
  }, [students, from, device]);

  const onChooseFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
  };

  const applyImport = async () => {
    if (!fileName) {
      pushToast("Thiếu file", "Bạn cần chọn file Excel/CSV logs trước khi import.");
      return;
    }

    setParsing(true);

    // mock import: tạo 10 logs ngẫu nhiên trong ngày from
    const baseDate = from || "2025-01-01";
    const randomStudents = [...students].sort(() => Math.random() - 0.5).slice(0, 10);

    const imported = randomStudents.map((st, i) => ({
      id: `imp_${Date.now()}_${i}`,
      student_id: st.id,
      log_time: `${baseDate}T07:${String(12 + i).padStart(2, "0")}:00`,
      log_type: "IN",
      source: device,
    }));

    setLogs((prev) => {
      if (mode === "APPEND") return [...imported, ...prev];

      // REPLACE_RANGE: xóa logs trong range [from..to] rồi add
      const next = prev.filter((l) => {
        const d = l.log_time.slice(0, 10);
        if (!from || !to) return true;
        return d < from || d > to;
      });
      return [...imported, ...next];
    });

    setAuditLogs((prev) => [
      {
        id: `au_${Date.now()}`,
        at: new Date().toISOString().slice(0, 19),
        actor: "admin@school.edu",
        action: "IMPORT_LOGS",
        target: device,
        note: `file=${fileName} mode=${mode}`,
      },
      ...prev,
    ]);

    setParsing(false);
    onClose();
    pushToast("Import thành công (mock)", `Đã import ${imported.length} logs từ ${fileName}.`);
  };

  return (
    <ModalShell
      title="Import logs từ máy vân tay"
      subtitle="Chọn file Excel/CSV, cấu hình mode và xem preview trước khi import"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} disabled={parsing}>
            Hủy
          </button>
          <button className="btn" onClick={applyImport} disabled={parsing}>
            <FiUpload /> {parsing ? "Đang import..." : "Import"}
          </button>
        </>
      }
    >
      <div className="formGrid">
        <div className="formRow">
          <label>Thiết bị / nguồn</label>
          <Select value={device} onChange={setDevice} options={DEVICE_OPTIONS} />
        </div>

        <div className="formRow">
          <label>Chế độ import</label>
          <Select
            value={mode}
            onChange={setMode}
            options={[
              { value: "APPEND", label: "APPEND (thêm vào dữ liệu hiện có)" },
              { value: "REPLACE_RANGE", label: "REPLACE (xóa logs trong khoảng lọc rồi import)" },
            ]}
          />
          <div className="muted">
            • REPLACE dùng khi import lại dữ liệu do máy sync sai/thiếu. <br />
            • Khoảng lọc: {from || "—"} → {to || "—"}
          </div>
        </div>

        <div className="formRow">
          <label>File logs</label>
          <input
            className="input"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={onChooseFile}
          />
          <div className="muted">Đang chọn: <span className="mono">{fileName || "Chưa có"}</span></div>
        </div>

        <div className="warnBox">
          <FiAlertTriangle />
          <div>
            <div className="strong">Lưu ý mapping</div>
            <div className="muted">Nếu học sinh chưa có fingerprint_id, logs có thể không đối soát được thành records.</div>
          </div>
        </div>

        <div className="panelSection">
          <div className="panelSectionTitle">
            <FiDatabase /> Preview (mock)
          </div>

          <div className="tableWrap">
            <table className="table" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Học sinh</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Device</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((r) => (
                  <tr key={r.row}>
                    <td className="mono">{r.row}</td>
                    <td className="strong">{r.student}</td>
                    <td className="mono">{r.time.replace("T", " ")}</td>
                    <td><span className="pill pill--ok">{r.type}</span></td>
                    <td className="mono muted">{r.device}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="hint">Preview chỉ mô phỏng. Khi nối API thật, bạn sẽ parse file và show preview thật.</div>
        </div>
      </div>
    </ModalShell>
  );
}
