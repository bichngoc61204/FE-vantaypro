import React, { useState, useMemo } from "react";
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import ModalShell from "../ModalShell";
import Select from "../../../dashboard/admin/components/ui/Select";
import { uid } from "../../utils/timetableUtils";

export default function ModalEntryForm({
  modal,
  onClose,
  entries,
  setEntries,
  subjects,
  teachers,
  selectedTT,
}) {
  const mode = modal.payload?.mode; // create/edit
  const entryId = modal.payload?.entryId;

  const old = useMemo(() => entries.find((x) => x.id === entryId) || null, [entries, entryId]);

  const [form, setForm] = useState(() => ({
    timetable_id: old?.timetable_id || modal.payload?.timetable_id,
    date_of_week: old?.date_of_week || modal.payload?.date_of_week,
    start_time: old?.start_time || modal.payload?.start_time,
    end_time: old?.end_time || modal.payload?.end_time,
    subject_id: old?.subject_id || subjects[0]?.id || "",
    teacher_id: old?.teacher_id || teachers[0]?.id || "",
    room: old?.room || "",
  }));

  const subjectOptions = subjects.map((s) => ({ value: s.id, label: `${s.subject_code} • ${s.subject_name}` }));
  const teacherOptions = teachers.map((t) => ({ value: t.id, label: `${t.full_name} • ${t.teacher_code}` }));

  const save = () => {
    if (!selectedTT) return;

    if (mode === "create") {
      // 1 slot chỉ nên có 1 entry, nếu đã tồn tại => replace
      setEntries((prev) => {
        const existed = prev.find(
          (e) =>
            e.timetable_id === form.timetable_id &&
            e.date_of_week === form.date_of_week &&
            e.start_time === form.start_time &&
            e.end_time === form.end_time
        );
        if (existed) {
          return prev.map((x) => (x.id === existed.id ? { ...x, ...form } : x));
        }
        return [{ id: uid(), ...form }, ...prev];
      });
    } else {
      setEntries((prev) => prev.map((x) => (x.id === entryId ? { ...x, ...form } : x)));
    }
    onClose();
  };

  return (
    <ModalShell
      title={mode === "create" ? "Thêm tiết học" : "Sửa tiết học"}
      subtitle="Tiết học thuộc TKB: thứ trong tuần + khung giờ. Dùng để sinh attendance_sessions."
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn" onClick={save}>
            <FiCheckCircle /> Lưu
          </button>
        </>
      }
    >
      <div className="formGrid">
        <div className="formRow">
          <label>Thứ</label>
          <input className="input" value={`Thứ ${form.date_of_week + 1}`} disabled />
        </div>
        <div className="formRow">
          <label>Giờ</label>
          <input className="input" value={`${form.start_time} - ${form.end_time}`} disabled />
        </div>

        <div className="formRow">
          <label>Môn học</label>
          <Select value={form.subject_id} onChange={(v) => setForm((p) => ({ ...p, subject_id: v }))} options={subjectOptions} />
        </div>

        <div className="formRow">
          <label>Giáo viên</label>
          <Select value={form.teacher_id} onChange={(v) => setForm((p) => ({ ...p, teacher_id: v }))} options={teacherOptions} />
        </div>

        <div className="formRow">
          <label>Phòng</label>
          <input className="input" value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} placeholder="VD: A101 / Lab 2…" />
        </div>
      </div>

      {selectedTT?.is_locked ? (
        <div className="warnBox">
          <FiAlertTriangle />
          <div>
            <div className="strong">TKB đang bị khóa</div>
            <div className="muted">Nếu bạn thấy modal này, tức là luồng UI đã cho mở nhưng nên chặn save ở backend.</div>
          </div>
        </div>
      ) : null}
    </ModalShell>
  );
}
