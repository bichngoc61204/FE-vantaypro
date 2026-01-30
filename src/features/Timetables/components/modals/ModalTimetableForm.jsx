import React, { useState, useMemo, useEffect } from "react";
import { FiCheckCircle, FiUnlock, FiLock, FiAlertTriangle } from "react-icons/fi";
import ModalShell from "../ModalShell";
import Select from "../../../dashboard/admin/components/ui/Select";
import Calendar from "../../../dashboard/admin/components/ui/Calendar/Calendar";
import { getCurrentYearId, parseISODate, uid } from "../../utils/timetableUtils";

export default function ModalTimetableForm({
  modal,
  onClose,
  years,
  classes,
  timetables,
  setTimetables,
}) {
  const mode = modal.payload?.mode; // create/edit
  const ttId = modal.payload?.ttId;
  const yearId = modal.payload?.yearId;

  const old = useMemo(() => timetables.find((x) => x.id === ttId) || null, [timetables, ttId]);

  const [form, setForm] = useState(() => ({
    academic_year_id: old?.academic_year_id || yearId || getCurrentYearId(years),
    class_id: old?.class_id || classes.find((c) => c.academic_year_id === (old?.academic_year_id || yearId))?.id || classes[0]?.id,
    effective_from: old?.effective_from || (years.find((y) => y.id === (old?.academic_year_id || yearId))?.start_date || "2025-01-01"),
    effective_to: old?.effective_to || (years.find((y) => y.id === (old?.academic_year_id || yearId))?.end_date || "2025-05-31"),
    is_locked: old?.is_locked ?? false,
  }));

  const yearOptions = years.map((y) => ({ value: y.id, label: y.name }));
  const classOptions = classes
    .filter((c) => c.academic_year_id === form.academic_year_id)
    .map((c) => ({ value: c.id, label: c.class_name }));

  useEffect(() => {
    if (!classOptions.some((x) => x.value === form.class_id)) {
      setForm((p) => ({ ...p, class_id: classOptions[0]?.value || "" }));
    }
  }, [form.academic_year_id]); // eslint-disable-line

  const invalidRange = useMemo(() => {
    if (!form.effective_from || !form.effective_to) return true;
    return parseISODate(form.effective_from) > parseISODate(form.effective_to);
  }, [form]);

  const save = () => {
    if (invalidRange) return;

    if (mode === "create") {
      setTimetables((prev) => [
        { id: uid(), ...form },
        ...prev,
      ]);
    } else {
      setTimetables((prev) => prev.map((x) => (x.id === ttId ? { ...x, ...form } : x)));
    }
    onClose();
  };

  return (
    <ModalShell
      title={mode === "create" ? "Thêm thời khóa biểu" : "Sửa thời khóa biểu"}
      subtitle="TKB gắn với lớp + năm học + khoảng hiệu lực. TKB có thể khóa để tránh chỉnh sửa sau vận hành."
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn" onClick={save} disabled={invalidRange || !form.class_id}>
            <FiCheckCircle /> Lưu
          </button>
        </>
      }
    >
      <div className="formGrid">
        <div className="formRow">
          <label>Năm học</label>
          <Select
            value={form.academic_year_id}
            onChange={(v) => setForm((p) => ({ ...p, academic_year_id: v }))}
            options={yearOptions}
          />
        </div>
        <div className="formRow">
          <label>Lớp</label>
          <Select
            value={form.class_id}
            onChange={(v) => setForm((p) => ({ ...p, class_id: v }))}
            options={classOptions.length ? classOptions : [{ value: "", label: "Không có lớp trong năm học" }]}
          />
        </div>
        <div className="formRow">
          <Calendar label="Hiệu lực từ" value={form.effective_from} onChange={(v) => setForm((p) => ({ ...p, effective_from: v }))} />
        </div>
        <div className="formRow">
          <Calendar label="Hiệu lực đến" value={form.effective_to} onChange={(v) => setForm((p) => ({ ...p, effective_to: v }))} />
        </div>
        <div className="formRow">
          <label>Trạng thái</label>
          <div className="row">
            <span className={`pill ${form.is_locked ? "pill--danger" : "pill--ok"}`}>{form.is_locked ? "LOCKED" : "OPEN"}</span>
            <button className="btn btn-ghost" type="button" onClick={() => setForm((p) => ({ ...p, is_locked: !p.is_locked }))}>
              {form.is_locked ? <FiUnlock /> : <FiLock />} Toggle
            </button>
          </div>
        </div>
      </div>

      {invalidRange ? (
        <div className="warnBox">
          <FiAlertTriangle />
          <div>
            <div className="strong">Khoảng hiệu lực không hợp lệ</div>
            <div className="muted">effective_from phải nhỏ hơn hoặc bằng effective_to.</div>
          </div>
        </div>
      ) : null}
    </ModalShell>
  );
}
