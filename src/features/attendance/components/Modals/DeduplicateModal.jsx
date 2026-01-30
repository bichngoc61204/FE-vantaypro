import React, { useMemo, useState } from "react";
import ModalShell from "./ModalShell";
import { FiTool, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { dtToDateStr, dtToTimeStr, timeToMinutes } from "../../utils/attendanceUtils";

// Nếu bạn muốn dùng lại utils có sẵn: đổi path import cho đúng project bạn.
// Hoặc xóa 3 hàm trên và copy lại từ attendanceUtils.

function minutesFromLog(dt) {
  const t = dtToTimeStr(dt);
  return timeToMinutes(t);
}

export default function DeduplicateModal({
  modal,
  onClose,
  logs,
  setLogs,
  setAuditLogs,
  pushToast,
}) {
  const [thresholdSec, setThresholdSec] = useState(30);

  const scope = modal?.payload || {};
  const from = scope.from;
  const to = scope.to;

  const { dupIds, previewRows } = useMemo(() => {
    // tìm trùng theo: student_id + date + type + delta(minutes) gần nhau
    const sorted = [...logs].sort((a, b) => (a.log_time > b.log_time ? 1 : -1));
    const dup = new Set();
    const preview = [];

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];

      const sameStudent = prev.student_id === cur.student_id;
      const sameDate = dtToDateStr(prev.log_time) === dtToDateStr(cur.log_time);
      const sameType = prev.log_type === cur.log_type;

      if (!sameStudent || !sameDate || !sameType) continue;

      const diffMin = Math.abs(minutesFromLog(cur.log_time) - minutesFromLog(prev.log_time));
      const diffSec = diffMin * 60;

      if (diffSec <= thresholdSec) {
        dup.add(cur.id);
        if (preview.length < 8) {
          preview.push({
            keep: prev.id,
            remove: cur.id,
            student_id: cur.student_id,
            date: dtToDateStr(cur.log_time),
            type: cur.log_type,
            a: prev.log_time,
            b: cur.log_time,
          });
        }
      }
    }

    return { dupIds: [...dup], previewRows: preview };
  }, [logs, thresholdSec]);

  const apply = () => {
    if (!dupIds.length) {
      pushToast("Không có log trùng", "Không phát hiện log trùng trong ngưỡng hiện tại.");
      return;
    }

    setLogs((prev) => prev.filter((l) => !dupIds.includes(l.id)));

    setAuditLogs((prev) => [
      {
        id: `au_${Date.now()}`,
        at: new Date().toISOString().slice(0, 19),
        actor: "admin@school.edu",
        action: "DEDUP_LOGS",
        target: `thresholdSec=${thresholdSec}`,
        note: `removed=${dupIds.length} range=${from || "-"}-${to || "-"}`,
      },
      ...prev,
    ]);

    onClose();
    pushToast("Đã lọc log trùng", `Đã xóa ${dupIds.length} logs trùng (ngưỡng ${thresholdSec}s).`);
  };

  return (
    <ModalShell
      title="Lọc log trùng (De-dup)"
      subtitle="Loại bỏ log bị gửi lặp từ máy (cùng học sinh • cùng ngày • cùng loại • thời gian gần nhau)"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Hủy
          </button>
          <button className="btn" onClick={apply}>
            <FiCheckCircle /> Apply
          </button>
        </>
      }
    >
      <div className="formGrid">
        <div className="formRow">
          <label>Ngưỡng trùng (giây)</label>
          <input
            className="input"
            type="number"
            min={5}
            max={600}
            value={thresholdSec}
            onChange={(e) => setThresholdSec(Number(e.target.value || 0))}
          />
          <div className="muted">Ví dụ 30s: 2 logs IN sát nhau 10s sẽ coi là trùng.</div>
        </div>

        <div className="warnBox">
          <FiAlertTriangle />
          <div>
            <div className="strong">Lưu ý</div>
            <div className="muted">De-dup nên chạy trước khi reconcile để tránh tạo record sai (late/absent).</div>
          </div>
        </div>

        <div className="panelSection">
          <div className="panelSectionTitle">
            <FiTool /> Preview trùng (tối đa 8)
          </div>

          <div className="muted">Số log sẽ bị xóa: <span className="mono">{dupIds.length}</span></div>

          <div className="tableWrap" style={{ marginTop: 10 }}>
            <table className="table" style={{ minWidth: 740 }}>
              <thead>
                <tr>
                  <th>Giữ</th>
                  <th>Xóa</th>
                  <th>Student</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Time A</th>
                  <th>Time B</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((r) => (
                  <tr key={r.remove}>
                    <td className="mono">{r.keep}</td>
                    <td className="mono">{r.remove}</td>
                    <td className="mono">{r.student_id}</td>
                    <td className="mono">{r.date}</td>
                    <td><span className="pill pill--info">{r.type}</span></td>
                    <td className="mono">{r.a.replace("T", " ")}</td>
                    <td className="mono">{r.b.replace("T", " ")}</td>
                  </tr>
                ))}
                {!previewRows.length ? (
                  <tr>
                    <td colSpan={7} className="empty">Không có log trùng theo ngưỡng hiện tại.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
