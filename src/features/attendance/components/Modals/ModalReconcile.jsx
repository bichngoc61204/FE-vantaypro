import React, { useState } from "react";
import { FiZap, FiAlertTriangle } from "react-icons/fi";
import ModalShell from "./ModalShell";
import Select from "../../../dashboard/admin/components/ui/Select";
import { uid } from "../../utils/attendanceUtils";

export default function ModalReconcile({ modal, onClose, sessions, setSessions, records, setRecords, students, pushToast }) {
  const sessionId = modal.payload?.sessionId;
  const ss = sessions.find((x) => x.id === sessionId);

  const [mode, setMode] = useState("SMART"); // SMART | OVERWRITE
  const [note, setNote] = useState("");

  const reconcile = () => {
    if (!ss) return;
    if (ss.is_locked) return pushToast("Session đã khóa", "Bạn cần mở khóa trước khi đối soát.");

    const classStudents = students.filter((s) => s.class_id === ss.class_id);

    setRecords((prev) => {
      let next = prev;

      if (mode === "OVERWRITE") {
        next = prev.filter((r) => r.attendance_session_id !== sessionId);
      }

      const existed = new Set(next.filter((r) => r.attendance_session_id === sessionId).map((r) => r.student_id));

      // mock generate: random status based on “giờ”
      const newRecs = classStudents
        .filter((s) => !existed.has(s.id))
        .map((s) => {
          const roll = Math.random();
          let st = "PRESENT";
          if (roll > 0.88) st = "ABSENT_UNEXCUSED";
          else if (roll > 0.78) st = "LATE";
          return { id: uid(), attendance_session_id: sessionId, student_id: s.id, status: st, note: note || "" };
        });

      return [...next, ...newRecs];
    });

    setSessions((prev) =>
      prev.map((x) =>
        x.id === sessionId ? { ...x, records_generated: true, status: x.status === "GENERATED" ? "IN_PROGRESS" : x.status } : x
      )
    );

    onClose();
  };

  return (
    <ModalShell
      title="Đối soát dữ liệu (Reconcile)"
      subtitle="Tạo/cập nhật attendance_records từ dữ liệu máy + cấu hình hệ thống. (Hiện là mock)"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn" onClick={reconcile}>
            <FiZap /> Chạy đối soát
          </button>
        </>
      }
    >
      {!ss ? (
        <div className="empty">Không tìm thấy session.</div>
      ) : (
        <>
          <div className="formGrid">
            <div className="formRow">
              <label>Chế độ</label>
              <Select
                value={mode}
                onChange={setMode}
                options={[
                  { value: "SMART", label: "SMART (giữ record cũ, chỉ bổ sung thiếu)" },
                  { value: "OVERWRITE", label: "OVERWRITE (xóa record cũ rồi sinh lại)" },
                ]}
              />
              <div className="muted">
                • SMART: an toàn khi giáo viên đã chỉnh tay. • OVERWRITE: dùng khi dữ liệu bị lỗi nghiêm trọng.
              </div>
            </div>

            <div className="formRow">
              <label>Ghi chú (optional)</label>
              <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="VD: Đối soát lại do máy lỗi..." />
            </div>
          </div>

          {ss.is_locked ? (
            <div className="warnBox">
              <FiAlertTriangle />
              <div>
                <div className="strong">Session đang bị khóa</div>
                <div className="muted">Bạn phải mở khóa session trước khi chạy đối soát.</div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </ModalShell>
  );
}
