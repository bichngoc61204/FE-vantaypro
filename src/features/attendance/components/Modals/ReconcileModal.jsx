import React, { useMemo, useState } from "react";
import ModalShell from "./ModalShell";
import Select from "../../../dashboard/admin/components/ui/Select";
import { FiZap, FiAlertTriangle } from "react-icons/fi";
import { uid } from "../../utils/attendanceUtils";

export default function ReconcileModal({
  modal,
  onClose,
  sessions,
  setSessions,
  records,
  setRecords,
  students,
  setAuditLogs,
  pushToast,
}) {
  const sessionId = modal?.payload?.sessionId;
  const ss = sessions.find((x) => x.id === sessionId);

  const [mode, setMode] = useState("SMART"); // SMART | OVERWRITE
  const [note, setNote] = useState("");

  const classStudents = useMemo(() => {
    if (!ss) return [];
    return students.filter((s) => s.class_id === ss.class_id);
  }, [students, ss]);

  const reconcile = () => {
    if (!ss) return;
    if (ss.is_locked) {
      pushToast("Session đã khóa", "Bạn cần mở khóa trước khi đối soát lại.");
      return;
    }

    setRecords((prev) => {
      let next = prev;
      if (mode === "OVERWRITE") next = prev.filter((r) => r.attendance_session_id !== sessionId);

      const existed = new Set(next.filter((r) => r.attendance_session_id === sessionId).map((r) => r.student_id));

      const newRecs = classStudents
        .filter((s) => !existed.has(s.id))
        .map((s) => {
          const roll = Math.random();
          let st = "PRESENT";
          if (roll > 0.88) st = "ABSENT_UNEXCUSED";
          else if (roll > 0.78) st = "LATE";
          return {
            id: uid(),
            attendance_session_id: sessionId,
            student_id: s.id,
            status: st,
            note: note || "",
          };
        });

      return [...next, ...newRecs];
    });

    setSessions((prev) =>
      prev.map((x) =>
        x.id === sessionId
          ? { ...x, records_generated: true, status: x.status === "GENERATED" ? "IN_PROGRESS" : x.status }
          : x
      )
    );

    setAuditLogs((prev) => [
      {
        id: uid(),
        at: new Date().toISOString().slice(0, 19),
        actor: "admin@school.edu",
        action: "RECONCILE_SESSION",
        target: sessionId,
        note: `mode=${mode} note=${note || "-"}`,
      },
      ...prev,
    ]);

    onClose();
    pushToast("Đối soát xong (mock)", `Session ${sessionId} • mode=${mode}`);
  };

  return (
    <ModalShell
      title="Đối soát dữ liệu (Reconcile)"
      subtitle="Tạo/cập nhật attendance_records từ logs + cấu hình check-in (hiện mock)"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Hủy
          </button>
          <button className="btn" onClick={reconcile}>
            <FiZap /> Chạy đối soát
          </button>
        </>
      }
    >
      {!ss ? (
        <div className="empty">Không tìm thấy session.</div>
      ) : (
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
              • SMART: an toàn khi đã có chỉnh tay. • OVERWRITE: dùng khi dữ liệu sai hàng loạt.
            </div>
          </div>

          <div className="formRow">
            <label>Ghi chú</label>
            <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="VD: máy lỗi, đối soát lại..." />
          </div>

          {ss.is_locked ? (
            <div className="warnBox">
              <FiAlertTriangle />
              <div>
                <div className="strong">Session đang bị khóa</div>
                <div className="muted">Bạn phải mở khóa trước khi chạy đối soát.</div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </ModalShell>
  );
}
