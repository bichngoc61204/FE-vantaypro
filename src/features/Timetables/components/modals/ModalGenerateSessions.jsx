import React, { useState, useMemo, useCallback } from "react";
import { FiZap } from "react-icons/fi";
import ModalShell from "../ModalShell";
import { parseISODate, fmtDate, dowFromDateStr, uid, isBetween } from "../../utils/timetableUtils";
import Calendar from "../../../dashboard/admin/components/ui/Calendar/Calendar";
export default function ModalGenerateSessions({
  modal,
  onClose,
  entries,
  sessions,
  setSessions,
  selectedTT,
  weekOverrides,
  years,
  timetables,
  pushToast,
}) {
  const timetableId = modal.payload?.timetableId;
  const tt = selectedTT || timetables.find((x) => x.id === timetableId);

  const [from, setFrom] = useState(modal.payload?.from || tt?.effective_from);
  const [to, setTo] = useState(modal.payload?.to || tt?.effective_to);
  const [overwrite, setOverwrite] = useState(false);
  const [skipHolidays, setSkipHolidays] = useState(true);

  const year = years.find((y) => y.id === tt?.academic_year_id);

  const entriesForTT = useMemo(() => entries.filter((e) => e.timetable_id === timetableId), [entries, timetableId]);

  const holidayRanges = useMemo(() => {
    const ovs = weekOverrides.filter((w) => w.academic_year_id === year?.id && w.is_holiday);
    return ovs.map((w) => ({ start: w.start_date, end: w.end_date, label: w.label }));
  }, [weekOverrides, year]);

  const isHolidayDate = useCallback(
    (dateStr) => {
      if (!skipHolidays) return false;
      return holidayRanges.some((r) => isBetween(dateStr, r.start, r.end));
    },
    [holidayRanges, skipHolidays]
  );

  const generate = () => {
    if (!tt) return;
    if (parseISODate(from) > parseISODate(to)) return pushToast("Ngày không hợp lệ", "from phải <= to.");

    // build dates in range
    const start = parseISODate(from);
    const end = parseISODate(to);
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const ds = fmtDate(d);
      // only Mon..Sat
      const dow = dowFromDateStr(ds);
      if (dow < 1 || dow > 6) continue;
      if (isHolidayDate(ds)) continue;
      dates.push({ dateStr: ds, dow });
    }

    // create sessions from entries that match date_of_week
    const newSessions = [];
    dates.forEach(({ dateStr, dow }) => {
      entriesForTT.forEach((e) => {
        if (e.date_of_week !== dow) return;
        newSessions.push({
          id: uid(),
          timetable_entry_id: e.id,
          session_date: dateStr,
          start_time: e.start_time,
          end_time: e.end_time,
        });
      });
    });

    setSessions((prev) => {
      let next = prev;

      if (overwrite) {
        const entryIds = new Set(entriesForTT.map((e) => e.id));
        next = prev.filter((s) => !(entryIds.has(s.timetable_entry_id) && isBetween(s.session_date, from, to)));
      }

      // de-dup: keep existing if same entry+date exists
      const idx = new Set(next.map((s) => `${s.timetable_entry_id}|${s.session_date}`));
      const filtered = newSessions.filter((s) => !idx.has(`${s.timetable_entry_id}|${s.session_date}`));
      return [...next, ...filtered];
    });

    onClose();
  };

  return (
    <ModalShell
      title="Sinh phiên điểm danh từ thời khóa biểu"
      subtitle="Tạo attendance_sessions dựa trên timetable_entries trong khoảng ngày. Có thể bỏ qua tuần nghỉ và chọn overwrite."
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn" onClick={generate}><FiZap /> Sinh session</button>
        </>
      }
    >
      <div className="formGrid">
        <div className="formRow">
          <Calendar label="From" value={from} onChange={setFrom} />
        </div>
        <div className="formRow">
          <Calendar label="To" value={to} onChange={setTo} />
        </div>

        <div className="formRow">
          <label>Bỏ qua tuần nghỉ</label>
          <div className="row">
            <span className={`pill ${skipHolidays ? "pill--ok" : "pill--muted"}`}>{skipHolidays ? "YES" : "NO"}</span>
            <button className="btn btn-ghost" type="button" onClick={() => setSkipHolidays((p) => !p)}>
              Toggle
            </button>
          </div>
          {skipHolidays && holidayRanges.length ? (
            <div className="muted" style={{ marginTop: 8 }}>
              Holidays:{" "}
              {holidayRanges.map((h) => (
                <span key={h.label} className="mono" style={{ marginRight: 10 }}>
                  {h.label}({h.start}→{h.end})
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="formRow">
          <label>Overwrite session trong range</label>
          <div className="row">
            <span className={`pill ${overwrite ? "pill--warn" : "pill--muted"}`}>{overwrite ? "OVERWRITE" : "KEEP"}</span>
            <button className="btn btn-ghost" type="button" onClick={() => setOverwrite((p) => !p)}>
              Toggle
            </button>
          </div>
          <div className="muted" style={{ marginTop: 8 }}>
            • KEEP: chỉ thêm session chưa tồn tại. • OVERWRITE: xóa session cũ trong range rồi sinh lại.
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
