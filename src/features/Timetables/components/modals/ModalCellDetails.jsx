import React, { useMemo } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";
import ModalShell from "../ModalShell";
import { isPastSession } from "../../utils/timetableUtils";

export default function ModalCellDetails({
  modal,
  onClose,
  entries,
  sessions,
  records,
  subjects,
  teachers,
  weekInfo,
  weekDates,
  entryIndex,
  sessionsByEntryAndDate,
  onEditEntry,
  onDeleteEntry,
  onAddEntry,
  selectedTT,
  pushToast,
}) {
  const { dow, slot, dateStr, entryId, sessionId } = modal.payload || {};
  const entry = useMemo(() => (entryId ? entries.find((e) => e.id === entryId) : null), [entries, entryId]);

  const subjectById = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);
  const teacherById = useMemo(() => new Map(teachers.map((t) => [t.id, t])), [teachers]);

  const dayLabel = weekDates.find((d) => d.dow === dow)?.label || `Thứ ${dow + 1}`;
  const isHoliday = !!weekInfo.is_holiday;

  const session = useMemo(() => (sessionId ? sessions.find((s) => s.id === sessionId) : null), [sessions, sessionId]);

  const past = session ? isPastSession(session.session_date, session.end_time) : false;

  const summary = useMemo(() => {
    if (!session) return null;
    const rec = records.filter((r) => r.attendance_session_id === session.id);
    const dist = { PRESENT: 0, LATE: 0, ABSENT_EXCUSED: 0, ABSENT_UNEXCUSED: 0 };
    rec.forEach((r) => (dist[r.status] = (dist[r.status] || 0) + 1));
    return { total: rec.length, ...dist };
  }, [session, records]);

  const openAttendance = () => {
    if (!session) return pushToast("Chưa có phiên điểm danh", "Hãy sinh session trước (Sinh phiên điểm danh).");
    if (!past) return pushToast("Chưa tới giờ tiết học", "Tiết học chưa diễn ra, chưa có dữ liệu điểm danh.");
    // Nếu hệ thống bạn có route admin/attendance?session_id=..., hãy navigate ở đây
    pushToast(
      "Xem điểm danh (mock)",
      `Session: ${session.id} • ${session.session_date} ${session.start_time}-${session.end_time} • Tổng record: ${summary?.total ?? 0}`
    );
  };

  return (
    <ModalShell
      title={`Chi tiết tiết học • ${dayLabel} • ${slot.start}-${slot.end}`}
      subtitle={`${dateStr}${isHoliday ? " • Tuần nghỉ" : ""}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Đóng</button>
          {entry ? (
            <>
              <button className="btn btn-ghost" onClick={openAttendance}>
                <FiEye /> Xem điểm danh
              </button>
              <button className="btn btn-ghost" onClick={() => onEditEntry(entry)} disabled={selectedTT?.is_locked}>
                <FiEdit2 /> Sửa
              </button>
              <button className="btn btn-ghost danger" onClick={() => onDeleteEntry(entry)} disabled={selectedTT?.is_locked}>
                <FiTrash2 /> Xóa
              </button>
            </>
          ) : (
            <button
              className="btn"
              onClick={() => onAddEntry(dow, slot)}
              disabled={selectedTT?.is_locked || isHoliday}
            >
              <FiPlus /> Thêm tiết
            </button>
          )}
        </>
      }
    >
      {!entry ? (
        <div className="empty">Ô này chưa có tiết học.</div>
      ) : (
        <div className="panel">
          <div className="panelSection">
            <div className="panelSectionTitle">Thông tin tiết học</div>
            <div className="kv">
              <div className="kvRow">
                <div className="kvKey">Môn</div>
                <div className="kvVal">
                  {subjectById.get(entry.subject_id)?.subject_code} • {subjectById.get(entry.subject_id)?.subject_name}
                </div>
              </div>
              <div className="kvRow">
                <div className="kvKey">Giáo viên</div>
                <div className="kvVal">{teacherById.get(entry.teacher_id)?.full_name}</div>
              </div>
              <div className="kvRow">
                <div className="kvKey">Phòng</div>
                <div className="kvVal mono">{entry.room || "—"}</div>
              </div>
            </div>
          </div>

          <div className="panelSection">
            <div className="panelSectionTitle">Phiên điểm danh</div>
            {session ? (
              <>
                <div className="row">
                  <span className={`pill ${past ? "pill--ok" : "pill--muted"}`}>
                    {past ? <FiCheckCircle /> : <FiInfo />}
                    {past ? "Đã qua tiết" : "Chưa diễn ra"}
                  </span>
                  <span className="pill pill--info">Session</span>
                  <span className="mono muted">
                    {session.session_date} {session.start_time}-{session.end_time}
                  </span>
                </div>

                {summary ? (
                  <div className="attSummary">
                    <div className="attItem ok">Present: {summary.PRESENT}</div>
                    <div className="attItem warn">Late: {summary.LATE}</div>
                    <div className="attItem info">Excused: {summary.ABSENT_EXCUSED}</div>
                    <div className="attItem danger">Unexcused: {summary.ABSENT_UNEXCUSED}</div>
                    <div className="attItem muted">Total: {summary.total}</div>
                  </div>
                ) : null}

                <div className="hint">
                  Click “Xem điểm danh” để mở trang điểm danh theo session (nếu bạn có route) hoặc hiển thị bảng record chi tiết.
                </div>
              </>
            ) : (
              <div className="warnBox">
                <FiAlertTriangle />
                <div>
                  <div className="strong">Chưa có attendance_session</div>
                  <div className="muted">
                    Bạn cần bấm “Sinh phiên điểm danh” (theo tuần / theo khoảng ngày) để tạo session cho tiết học này.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ModalShell>
  );
}
