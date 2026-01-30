import React, { useState, useMemo } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import ModalShell from "../ModalShell";
import Calendar from "../../../dashboard/admin/components/ui/Calendar/Calendar";
import { parseISODate, uid } from "../../utils/timetableUtils";

export default function ModalWeeks({ modal, onClose, years, weekOverrides, setWeekOverrides }) {
  const yearId = modal.payload?.yearId;
  const year = years.find((y) => y.id === yearId) || years[0];

  const list = useMemo(
    () => weekOverrides.filter((w) => w.academic_year_id === yearId).sort((a, b) => a.week_no - b.week_no),
    [weekOverrides, yearId]
  );

  const [draft, setDraft] = useState(() => ({
    week_no: (list[list.length - 1]?.week_no || 0) + 1,
    start_date: year.start_date,
    end_date: year.start_date,
    label: `Tuần ${(list[list.length - 1]?.week_no || 0) + 1}`,
    is_holiday: false,
  }));

  const add = () => {
    if (!draft.start_date || !draft.end_date) return;
    if (parseISODate(draft.start_date) > parseISODate(draft.end_date)) return;

    setWeekOverrides((prev) => [
      ...prev,
      { id: uid(), academic_year_id: yearId, ...draft },
    ]);
    setDraft((p) => ({
      week_no: p.week_no + 1,
      start_date: p.end_date,
      end_date: p.end_date,
      label: `Tuần ${p.week_no + 1}`,
      is_holiday: false,
    }));
  };

  const remove = (id) => setWeekOverrides((prev) => prev.filter((x) => x.id !== id));

  return (
    <ModalShell
      title="Tùy chỉnh tuần học"
      subtitle="Tuần học dùng để hiển thị lịch theo tuần và kiểm soát việc sinh session (ví dụ tuần nghỉ)."
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Đóng</button>
          <button className="btn" onClick={add}><FiPlus /> Thêm tuần</button>
        </>
      }
    >
      <div className="muted" style={{ marginBottom: 10 }}>
        Năm học: <span className="mono">{year?.name}</span> • <span className="mono">{year?.start_date}</span> → <span className="mono">{year?.end_date}</span>
      </div>

      <div className="formGrid">
        <div className="formRow">
          <label>Week No</label>
          <input className="input" type="number" value={draft.week_no} onChange={(e) => setDraft((p) => ({ ...p, week_no: Number(e.target.value) }))} />
        </div>
        <div className="formRow">
          <label>Label</label>
          <input className="input" value={draft.label} onChange={(e) => setDraft((p) => ({ ...p, label: e.target.value }))} />
        </div>
        <div className="formRow">
          <Calendar label="Start" value={draft.start_date} onChange={(v) => setDraft((p) => ({ ...p, start_date: v }))} />
        </div>
        <div className="formRow">
          <Calendar label="End" value={draft.end_date} onChange={(v) => setDraft((p) => ({ ...p, end_date: v }))} />
        </div>
        <div className="formRow">
          <label>Tuần nghỉ?</label>
          <div className="row">
            <span className={`pill ${draft.is_holiday ? "pill--warn" : "pill--muted"}`}>{draft.is_holiday ? "HOLIDAY" : "NORMAL"}</span>
            <button className="btn btn-ghost" type="button" onClick={() => setDraft((p) => ({ ...p, is_holiday: !p.is_holiday }))}>
              Toggle
            </button>
          </div>
        </div>
      </div>

      <div className="list" style={{ marginTop: 12 }}>
        {list.map((w) => (
          <div key={w.id} className="listRow listRow--hover">
            <div className="listMain">
              <div className="strong">
                {w.label} {w.is_holiday ? <span className="pill pill--warn" style={{ marginLeft: 8 }}>Nghỉ</span> : null}
              </div>
              <div className="muted mono">{w.start_date} → {w.end_date}</div>
            </div>
            <div className="listRight">
              <button className="iconBtn danger" onClick={() => remove(w.id)} title="Xóa tuần">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
        {!list.length ? <div className="empty">Chưa có tuần override. Hệ thống sẽ tự tính tuần theo start_date của năm học.</div> : null}
      </div>
    </ModalShell>
  );
}
