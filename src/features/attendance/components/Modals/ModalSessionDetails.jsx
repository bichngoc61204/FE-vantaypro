import React, { useMemo } from "react";
import { FiEye } from "react-icons/fi";
import ModalShell from "./ModalShell";

export default function ModalSessionDetails({ modal, onClose, students, classes, sessions, records, logs, pushToast }) {
  const sessionId = modal.payload?.sessionId;
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

  return (
    <ModalShell
      title={`Chi tiết phiên điểm danh • ${cls?.class_name || "—"} • ${ss?.session_date || ""}`}
      subtitle={`${ss?.start_time || ""}-${ss?.end_time || ""} • ${ss?.is_locked ? "LOCKED" : "OPEN"}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Đóng</button>
          <button className="btn btn-ghost" onClick={() => pushToast("Mở trang record (mock)", "Ở hệ thống thật bạn sẽ navigate sang trang chi tiết records theo sessionId.")}>
            <FiEye /> Xem bảng records
          </button>
        </>
      }
    >
      {!ss ? (
        <div className="empty">Không tìm thấy session.</div>
      ) : (
        <div className="panel">
          <div className="panelSection">
            <div className="panelSectionTitle">Tổng quan</div>
            <div className="attSummary">
              <div className="attItem ok">Present: {dist.PRESENT}</div>
              <div className="attItem warn">Late: {dist.LATE}</div>
              <div className="attItem info">Excused: {dist.ABSENT_EXCUSED}</div>
              <div className="attItem danger">Unexcused: {dist.ABSENT_UNEXCUSED}</div>
              <div className="attItem muted">Total records: {rec.length}</div>
            </div>
          </div>

          <div className="panelSection">
            <div className="panelSectionTitle">Dữ liệu máy trong ngày (logs)</div>
            <div className="miniTable">
              {dayLogs.slice(0, 10).map((l) => {
                const st = students.find((x) => x.id === l.student_id);
                return (
                  <div key={l.id} className="miniRow">
                    <div className="mono">{l.log_time.replace("T", " ")}</div>
                    <div className="strong">{st?.full_name || "—"}</div>
                    <div className={`pill ${l.log_type === "IN" ? "pill--ok" : "pill--info"}`}>{l.log_type}</div>
                    <div className="muted mono">{l.source}</div>
                  </div>
                );
              })}
              {!dayLogs.length ? <div className="empty">Không có logs trong ngày.</div> : null}
            </div>
            <div className="hint">
              • Admin dùng logs để kiểm tra thiết bị có ghi nhận đủ không (thiếu IN/OUT, trùng log, log ngoài giờ...).
            </div>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
