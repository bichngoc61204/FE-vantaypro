import React, { useMemo } from "react";
import ModalShell from "./ModalShell";
import { FiDatabase, FiEye, FiInfo } from "react-icons/fi";

export default function SessionDetailsModal({
  modal,
  onClose,
  sessions,
  classes,
  students,
  records,
  logs,
}) {
  const sessionId = modal?.payload?.sessionId;
  const ss = sessions.find((x) => x.id === sessionId);
  const cls = classes.find((c) => c.id === ss?.class_id);

  const rec = useMemo(() => records.filter((r) => r.attendance_session_id === sessionId), [records, sessionId]);

  const dist = useMemo(() => {
    const d = { PRESENT: 0, LATE: 0, ABSENT_EXCUSED: 0, ABSENT_UNEXCUSED: 0 };
    rec.forEach((r) => (d[r.status] = (d[r.status] || 0) + 1));
    return d;
  }, [rec]);

  const dayLogs = useMemo(() => {
    if (!ss) return [];
    const stIds = students.filter((s) => s.class_id === ss.class_id).map((x) => x.id);
    return logs
      .filter((l) => stIds.includes(l.student_id))
      .filter((l) => l.log_time.slice(0, 10) === ss.session_date)
      .sort((a, b) => (a.log_time > b.log_time ? 1 : -1));
  }, [ss, logs, students]);

  const stById = useMemo(() => new Map(students.map((s) => [s.id, s])), [students]);

  return (
    <ModalShell
      title={`Chi tiết session • ${cls?.class_name || "—"} • ${ss?.session_date || ""}`}
      subtitle={`${ss?.start_time || ""}-${ss?.end_time || ""} • ${ss?.is_locked ? "LOCKED" : "OPEN"} • ${ss?.id || ""}`}
      onClose={onClose}
      footer={<button className="btn" onClick={onClose}>Đóng</button>}
    >
      {!ss ? (
        <div className="empty">Không tìm thấy session.</div>
      ) : (
        <div className="panel">
          <div className="infoBox">
            <FiInfo />
            <div>
              <div className="strong">Phân bổ records</div>
              <div className="muted">
                Present {dist.PRESENT} • Late {dist.LATE} • Excused {dist.ABSENT_EXCUSED} • Unexcused {dist.ABSENT_UNEXCUSED} • Total {rec.length}
              </div>
            </div>
          </div>

          <div className="panelSection">
            <div className="panelSectionTitle">
              <FiEye /> Records theo học sinh
            </div>

            <div className="tableWrap">
              <table className="table" style={{ minWidth: 820 }}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {rec.map((r) => {
                    const st = stById.get(r.student_id);
                    return (
                      <tr key={r.id}>
                        <td>
                          <div className="strong">{st?.full_name || "—"}</div>
                          <div className="muted mono">{st?.student_code || r.student_id}</div>
                        </td>
                        <td className="mono">{r.status}</td>
                        <td className="muted">{r.note || "—"}</td>
                      </tr>
                    );
                  })}
                  {!rec.length ? (
                    <tr>
                      <td colSpan={3} className="empty">Chưa có records (cần đối soát).</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panelSection">
            <div className="panelSectionTitle">
              <FiDatabase /> Logs trong ngày (cùng lớp)
            </div>

            <div className="tableWrap">
              <table className="table" style={{ minWidth: 860 }}>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Student</th>
                    <th>Type</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {dayLogs.slice(0, 20).map((l) => {
                    const st = stById.get(l.student_id);
                    return (
                      <tr key={l.id}>
                        <td className="mono">{l.log_time.replace("T", " ")}</td>
                        <td>
                          <div className="strong">{st?.full_name || "—"}</div>
                          <div className="muted mono">{st?.student_code || "—"}</div>
                        </td>
                        <td className="mono">{l.log_type}</td>
                        <td className="mono muted">{l.source}</td>
                      </tr>
                    );
                  })}
                  {!dayLogs.length ? (
                    <tr>
                      <td colSpan={4} className="empty">Không có logs trong ngày.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="hint">Logs là dữ liệu gốc (IN/OUT). Records là kết quả đã đối soát theo session.</div>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
