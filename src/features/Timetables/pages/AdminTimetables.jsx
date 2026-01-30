import React, { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiLock,
  FiUnlock,
  FiPlus,
  FiEdit2,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiZap,
  FiInfo,
  FiSearch,
  FiCheckCircle,
  FiAlertTriangle,
  FiEye,
} from "react-icons/fi";

import Card from "../../dashboard/admin/components/ui/Card";
import Select from "../../dashboard/admin/components/ui/Select";
import SearchInput from "../../dashboard/admin/components/ui/SearchInput";
import Pagination from "../../dashboard/admin/components/ui/Pagination";
import ConfirmModal from "../../dashboard/admin/components/ui/ConfirmModal";

import ModalHost from "../components/ModalHost";
import "../styles/AdminTimetables.css";
import Calendar from "../../dashboard/admin/components/ui/Calendar/Calendar";

import {
  MOCK_ACADEMIC_YEARS,
  MOCK_CLASSES,
  MOCK_SUBJECTS,
  MOCK_TEACHERS,
  INIT_TIMETABLES,
  INIT_ENTRIES,
  INIT_WEEK_OVERRIDES,
  INIT_SESSIONS,
  INIT_RECORDS,
  DAYS,
  DEFAULT_SLOTS,
  getCurrentYearId,
  pickWeekForDate,
  parseISODate,
  fmtDate,
  isBetween,
  timeKey,
  isPastSession,
  norm,
} from "../utils/timetableUtils";

export default function AdminTimetables() {
  const [years] = useState(MOCK_ACADEMIC_YEARS);
  const [classes] = useState(MOCK_CLASSES);
  const [subjects] = useState(MOCK_SUBJECTS);
  const [teachers] = useState(MOCK_TEACHERS);

  const [timetables, setTimetables] = useState(INIT_TIMETABLES);
  const [entries, setEntries] = useState(INIT_ENTRIES);
  const [weekOverrides, setWeekOverrides] = useState(INIT_WEEK_OVERRIDES);

  const [sessions, setSessions] = useState(INIT_SESSIONS);
  const [records] = useState(INIT_RECORDS);

  // filters
  const [yearId, setYearId] = useState(getCurrentYearId(years));
  const year = useMemo(() => years.find((y) => y.id === yearId) || years[0], [years, yearId]);

  const classOptions = useMemo(() => {
    const cls = classes.filter((c) => c.academic_year_id === yearId);
    return [{ value: "ALL", label: "Tất cả lớp" }, ...cls.map((c) => ({ value: c.id, label: c.class_name }))];
  }, [classes, yearId]);

  const [classId, setClassId] = useState(classOptions[1]?.value || "ALL");
  useEffect(() => {
    // reset class when year changes
    setClassId(classOptions[1]?.value || "ALL");
  }, [yearId]); // eslint-disable-line

  const [q, setQ] = useState("");

  // pick timetable by class (and effective)
  const timetablesForClass = useMemo(() => {
    const list = timetables.filter((tt) => tt.academic_year_id === yearId);
    return classId === "ALL" ? list : list.filter((tt) => tt.class_id === classId);
  }, [timetables, yearId, classId]);

  const timetableOptions = useMemo(() => {
    const clsName = (cid) => classes.find((c) => c.id === cid)?.class_name || "—";
    const label = (tt) => `${clsName(tt.class_id)} • ${tt.effective_from} → ${tt.effective_to}${tt.is_locked ? " • LOCKED" : ""}`;
    const list = timetablesForClass
      .filter((tt) => {
        const s = `${label(tt)}`;
        return !norm(q) || norm(s).includes(norm(q));
      })
      .sort((a, b) => (a.class_id > b.class_id ? 1 : -1));
    return list.map((tt) => ({ value: tt.id, label: label(tt) }));
  }, [timetablesForClass, classes, q]);

  const [timetableId, setTimetableId] = useState(timetableOptions[0]?.value || "");
  useEffect(() => {
    setTimetableId(timetableOptions[0]?.value || "");
  }, [timetableOptions]); // eslint-disable-line

  const selectedTT = useMemo(() => timetables.find((x) => x.id === timetableId) || null, [timetables, timetableId]);

  const selectedClass = useMemo(() => classes.find((c) => c.id === selectedTT?.class_id) || null, [classes, selectedTT]);

  // week view state
  const [anchorDate, setAnchorDate] = useState(() => {
    // default = year start_date
    return year?.start_date || "2024-08-15";
  });
  useEffect(() => setAnchorDate(year?.start_date || "2024-08-15"), [yearId]); // eslint-disable-line

  const weekInfo = useMemo(() => pickWeekForDate({ dateStr: anchorDate, year, overrides: weekOverrides }), [anchorDate, year, weekOverrides]);

  // derived: week dates Mon..Sat (use weekInfo.start_date as Monday-like anchor; assume start_date is Monday)
  const weekDates = useMemo(() => {
    const start = parseISODate(weekInfo.start_date);
    // Build Mon..Sat
    return DAYS.map((d, idx) => {
      const x = new Date(start);
      x.setDate(start.getDate() + idx);
      return { dow: d.dow, label: d.label, dateStr: fmtDate(x) };
    });
  }, [weekInfo]);

  // grid: for the selected timetable only
  const entriesForTT = useMemo(() => entries.filter((e) => e.timetable_id === timetableId), [entries, timetableId]);

  const subjectById = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);
  const teacherById = useMemo(() => new Map(teachers.map((t) => [t.id, t])), [teachers]);

  const cellKey = (dow, slot) => `${dow}|${slot.start}|${slot.end}`;
  const entryIndex = useMemo(() => {
    const m = new Map();
    entriesForTT.forEach((e) => m.set(cellKey(e.date_of_week, { start: e.start_time, end: e.end_time }), e));
    return m;
  }, [entriesForTT]);

  // sessions for a given entry in current week
  const sessionsByEntryAndDate = useMemo(() => {
    const m = new Map(); // `${entryId}|${date}` => session
    sessions.forEach((s) => {
      m.set(`${s.timetable_entry_id}|${s.session_date}`, s);
    });
    return m;
  }, [sessions]);

  // right-panel stats
  const stats = useMemo(() => {
    if (!selectedTT) return null;
    const eCount = entriesForTT.length;

    // coverage per week (existing sessions in this week for this timetable)
    const entryIds = new Set(entriesForTT.map((e) => e.id));
    const sessionsInWeek = sessions.filter((s) => entryIds.has(s.timetable_entry_id) && isBetween(s.session_date, weekInfo.start_date, weekInfo.end_date));
    const sessionCount = sessionsInWeek.length;

    // missing teacher / subject
    const missing = entriesForTT.filter((e) => !e.teacher_id || !e.subject_id).length;

    // holiday week
    const isHoliday = !!weekInfo.is_holiday;

    return { eCount, sessionCount, missing, isHoliday };
  }, [selectedTT, entriesForTT, sessions, weekInfo]);

  // table pagination for "Danh sách TKB" (if you want list view)
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filteredTTList = useMemo(() => {
    const nq = norm(q);
    const clsName = (cid) => classes.find((c) => c.id === cid)?.class_name || "—";
    return timetablesForClass.filter((tt) => {
      const s = `${clsName(tt.class_id)} ${tt.effective_from} ${tt.effective_to} ${tt.is_locked ? "locked" : "open"}`;
      return !nq || norm(s).includes(nq);
    });
  }, [timetablesForClass, classes, q]);

  useEffect(() => setPage(1), [q, yearId, classId]);

  const totalPages = Math.max(1, Math.ceil(filteredTTList.length / PAGE_SIZE));
  const pagedTTList = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTTList.slice(start, start + PAGE_SIZE);
  }, [filteredTTList, page]);

  // modal system
  const [modal, setModal] = useState({ open: false, type: "", payload: null });
  const [confirm, setConfirm] = useState(null);

  /* ===================== ACTIONS (MOCK) ===================== */

  const pushToast = (title, desc) => setModal({ open: true, type: "toast", payload: { title, desc } });

  const onAddTimetable = () => setModal({ open: true, type: "ttForm", payload: { mode: "create", yearId } });
  const onEditTimetable = (ttId) => setModal({ open: true, type: "ttForm", payload: { mode: "edit", ttId } });

  const onToggleLock = () => {
    if (!selectedTT) return;
    const action = selectedTT.is_locked ? "Mở khóa" : "Khóa";
    setConfirm({
      title: `${action} thời khóa biểu?`,
      description: selectedTT.is_locked
        ? "Mở khóa để cho phép chỉnh sửa TKB và tiết học."
        : "Khóa TKB để đóng băng dữ liệu (tránh sửa sau khi đã vận hành/sinh phiên điểm danh).",
      confirmLabel: action,
      onConfirm: () => {
        setTimetables((prev) => prev.map((x) => (x.id === selectedTT.id ? { ...x, is_locked: !x.is_locked } : x)));
        setConfirm(null);
      },
    });
  };

  const onAddEntry = (dow, slot) => {
    if (!selectedTT) return;
    if (selectedTT.is_locked) return pushToast("TKB đang bị khóa", "Bạn cần mở khóa trước khi thêm/sửa tiết học.");
    setModal({
      open: true,
      type: "entryForm",
      payload: {
        mode: "create",
        timetable_id: selectedTT.id,
        date_of_week: dow,
        start_time: slot.start,
        end_time: slot.end,
      },
    });
  };

  const onEditEntry = (entry) => {
    if (!selectedTT) return;
    if (selectedTT.is_locked) return pushToast("TKB đang bị khóa", "Bạn cần mở khóa trước khi thêm/sửa tiết học.");
    setModal({ open: true, type: "entryForm", payload: { mode: "edit", entryId: entry.id } });
  };

  const onDeleteEntry = (entry) => {
    if (!selectedTT) return;
    if (selectedTT.is_locked) return pushToast("TKB đang bị khóa", "Bạn cần mở khóa trước khi xóa tiết học.");
    setConfirm({
      title: "Xóa tiết học?",
      description: "Xóa tiết học sẽ ảnh hưởng tới các phiên điểm danh đã sinh (nếu có). Khuyến nghị: chỉ xóa khi chưa vận hành.",
      confirmLabel: "Xóa",
      onConfirm: () => {
        setEntries((prev) => prev.filter((x) => x.id !== entry.id));
        setConfirm(null);
      },
    });
  };

  const onManageWeeks = () => setModal({ open: true, type: "weeks", payload: { yearId } });

  const onGenerateSessions = () => {
    if (!selectedTT) return;
    setModal({
      open: true,
      type: "generateSessions",
      payload: {
        timetableId: selectedTT.id,
        from: weekInfo.start_date,
        to: weekInfo.end_date,
      },
    });
  };

  const openCellDetails = (dow, slot) => {
    if (!selectedTT) return;
    const entry = entryIndex.get(cellKey(dow, slot)) || null;
    const dateStr = weekDates.find((d) => d.dow === dow)?.dateStr;
    const session = entry && dateStr ? sessionsByEntryAndDate.get(`${entry.id}|${dateStr}`) : null;

    setModal({
      open: true,
      type: "cellDetails",
      payload: {
        dow,
        slot,
        dateStr,
        entryId: entry?.id || null,
        sessionId: session?.id || null,
      },
    });
  };

  /* ===================== RENDER ===================== */

  return (
    <div className="tt-page">
      {/* Top Toolbar */}
      <div className="tt-toolbar">
        <div className="tt-toolbar__left">
          <div className="tt-header">
            <FiCalendar />
            <div>
              <div className="tt-title">Quản lý thời khóa biểu</div>
              <div className="tt-sub">
                Theo năm học • tùy chỉnh tuần học • sinh phiên điểm danh từ TKB • xem điểm danh khi click tiết học
              </div>
            </div>
          </div>
        </div>

        <div className="tt-toolbar__right">
          <button className="btn" onClick={onAddTimetable}>
            <FiPlus /> Thêm TKB
          </button>
          <button className="btn btn-ghost" onClick={() => pushToast("Import Excel (mock)", "Import TKB theo mẫu: timetables + timetable_entries.")}>
            <FiUpload /> Import
          </button>
          <button className="btn btn-ghost" onClick={() => pushToast("Export Excel (mock)", "Export TKB + weeks + mapping GV/Môn để đối soát.")}>
            <FiDownload /> Export
          </button>
          <button className="btn btn-ghost" onClick={() => pushToast("Refresh (mock)", "Khi tích hợp API: refetch years/classes/timetables/entries/sessions.")}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card icon={<FiSearch />} title="Bộ lọc" subtitle="Chọn năm học • lớp • thời khóa biểu hiệu lực">
        <div className="tt-filters">
          <div className="tt-filter">
            <label>Năm học</label>
            <Select
              value={yearId}
              onChange={setYearId}
              options={years.map((y) => ({ value: y.id, label: y.name }))}
            />
          </div>

          <div className="tt-filter">
            <label>Lớp</label>
            <Select value={classId} onChange={setClassId} options={classOptions} />
          </div>

          <div className="tt-filter tt-filter--wide">
            <label>Thời khóa biểu (hiệu lực)</label>
            <Select value={timetableId} onChange={setTimetableId} options={timetableOptions} />
          </div>

          <div className="tt-filter tt-filter--wide">
            <label>Tìm nhanh</label>
            <SearchInput
              value={q}
              onChange={setQ}
              placeholder='Tìm theo lớp / khoảng hiệu lực / trạng thái "LOCKED"...'
              label={null}
            />
          </div>
        </div>

        <div className="tt-actionsRow">
          <div className="tt-chip">
            <FiInfo /> Năm học: <span className="mono">{year?.start_date}</span> → <span className="mono">{year?.end_date}</span>
          </div>

          <div className="tt-actionsRight">
            <button className="btn btn-ghost" onClick={onManageWeeks}>
              <FiCalendar /> Tuần học
            </button>

            <button className={`btn ${selectedTT?.is_locked ? "btn-warn" : ""}`} onClick={onToggleLock} disabled={!selectedTT}>
              {selectedTT?.is_locked ? <FiUnlock /> : <FiLock />}
              {selectedTT?.is_locked ? "Mở khóa TKB" : "Khóa TKB"}
            </button>

            <button className="btn btn-ghost" onClick={onGenerateSessions} disabled={!selectedTT}>
              <FiZap /> Sinh phiên điểm danh
            </button>

            <button className="btn btn-ghost" onClick={() => onEditTimetable(selectedTT?.id)} disabled={!selectedTT}>
              <FiEdit2 /> Sửa TKB
            </button>
          </div>
        </div>
      </Card>

      {/* Main Layout */}
      <div className="tt-grid">
        <div className="tt-left">
          {/* LEFT: Timetable grid */}
          <Card
            icon={<FiCalendar />}
            title={`Lưới thời khóa biểu • ${selectedClass?.class_name || "—"} • ${weekInfo.label}`}
            subtitle={`${weekInfo.start_date} → ${weekInfo.end_date}${weekInfo.is_holiday ? " • (Tuần nghỉ)" : ""}`}
            right={
              <div className="tt-weekNav">
                <button
                  className="iconBtn"
                  onClick={() => {
                    const d = parseISODate(anchorDate);
                    d.setDate(d.getDate() - 7);
                    setAnchorDate(fmtDate(d));
                  }}
                  title="Tuần trước"
                >
                  ‹
                </button>
                <div style={{width: 150}}>
                  <Calendar 
                    value={anchorDate} 
                    onChange={setAnchorDate} 
                    placeholder="Chọn tuần"
                  />
                </div>
                <button
                  className="iconBtn"
                  onClick={() => {
                    const d = parseISODate(anchorDate);
                    d.setDate(d.getDate() + 7);
                    setAnchorDate(fmtDate(d));
                  }}
                  title="Tuần sau"
                >
                  ›
                </button>
              </div>
            }
          >
            {!selectedTT ? (
              <div className="empty">Chưa chọn thời khóa biểu.</div>
            ) : (
              <div className="tt-boardWrap">
                <table className="tt-board">
                  <thead>
                    <tr>
                      <th className="stickyCol">Tiết</th>
                      {weekDates.map((d) => (
                        <th key={d.dow}>
                          <div className="thMain">{d.label}</div>
                          <div className="thSub mono">{d.dateStr}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {DEFAULT_SLOTS.map((slot) => (
                      <tr key={timeKey(slot.start, slot.end)}>
                        <td className="stickyCol">
                          <div className="slotLbl">
                            <div className="strong">{slot.label}</div>
                            <div className="muted mono">{slot.start} - {slot.end}</div>
                          </div>
                        </td>

                        {weekDates.map((d) => {
                          const entry = entryIndex.get(cellKey(d.dow, slot)) || null;
                          const session = entry ? sessionsByEntryAndDate.get(`${entry.id}|${d.dateStr}`) : null;
                          const past = session ? isPastSession(session.session_date, session.end_time) : false;

                          const subj = entry ? subjectById.get(entry.subject_id) : null;
                          const tch = entry ? teacherById.get(entry.teacher_id) : null;

                          // attendance summary if past and has session
                          let att = null;
                          if (session && past) {
                            const rec = records.filter((r) => r.attendance_session_id === session.id);
                            const dist = { PRESENT: 0, LATE: 0, ABSENT_EXCUSED: 0, ABSENT_UNEXCUSED: 0 };
                            rec.forEach((r) => (dist[r.status] = (dist[r.status] || 0) + 1));
                            const total = rec.length;
                            att = { total, ...dist };
                          }

                          const cellTone =
                            !entry ? "empty" :
                            weekInfo.is_holiday ? "holiday" :
                            selectedTT.is_locked ? "locked" :
                            "filled";

                          return (
                            <td
                              key={`${d.dow}-${slot.start}`}
                              className={`cell cell--${cellTone}`}
                              onClick={() => openCellDetails(d.dow, slot)}
                            >
                              {!entry ? (
                                <div className="cellEmpty">
                                  <div className="muted">—</div>
                                  <button
                                    className="miniBtn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAddEntry(d.dow, slot);
                                    }}
                                    disabled={selectedTT.is_locked || weekInfo.is_holiday}
                                    title={weekInfo.is_holiday ? "Tuần nghỉ" : "Thêm tiết học"}
                                  >
                                    <FiPlus /> Thêm
                                  </button>
                                </div>
                              ) : (
                                <div className="cellBox">
                                  <div className="cellTop">
                                    <span className="pill pill--info">{subj?.subject_code || "—"}</span>
                                    {session ? (
                                      <span className={`pill ${past ? "pill--ok" : "pill--muted"}`}>
                                        <FiCheckCircle /> Session
                                      </span>
                                    ) : (
                                      <span className="pill pill--warn">
                                        <FiAlertTriangle /> Chưa sinh
                                      </span>
                                    )}
                                  </div>

                                  <div className="cellMain">
                                    <div className="strong">{subj?.subject_name || "Chưa chọn môn"}</div>
                                    <div className="muted">{tch?.full_name || "Chưa chọn GV"}</div>
                                    <div className="muted mono">{entry.room || "— room"}</div>
                                  </div>

                                  {att ? (
                                    <div className="cellAtt">
                                      <span className="attDot ok" title="Present" /> {att.PRESENT}
                                      <span className="attDot warn" title="Late" /> {att.LATE}
                                      <span className="attDot danger" title="Absent" /> {att.ABSENT_EXCUSED + att.ABSENT_UNEXCUSED}
                                      <span className="muted">/ {att.total}</span>
                                    </div>
                                  ) : (
                                    <div className="cellHint muted">
                                      {session ? (past ? "Click để xem điểm danh" : "Chưa tới giờ tiết học") : "Click để thao tác"}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="hint">
              • Click ô TKB để xem chi tiết / sửa / xóa / xem điểm danh (nếu tiết đã qua).
              <br />
              • “Sinh phiên điểm danh” sẽ tạo attendance_sessions từ timetable_entries theo khoảng ngày (tuần hoặc toàn năm).
            </div>
          </Card>
        </div>

        {/* RIGHT: Ops panel */}
        <div className="tt-right">
          <Card icon={<FiInfo />} title="Tóm tắt vận hành" subtitle="Nhìn để ra quyết định: lock / sinh session / xử lý thiếu dữ liệu">
            {!selectedTT ? (
              <div className="empty">Chưa chọn thời khóa biểu.</div>
            ) : (
              <div className="ops">
                <div className="opsRow">
                  <div className="opsLabel">Trạng thái TKB</div>
                  <div className="opsValue">
                    <span className={`pill ${selectedTT.is_locked ? "pill--danger" : "pill--ok"}`}>
                      {selectedTT.is_locked ? <FiLock /> : <FiUnlock />}
                      {selectedTT.is_locked ? "LOCKED" : "OPEN"}
                    </span>
                  </div>
                </div>

                <div className="opsRow">
                  <div className="opsLabel">Hiệu lực</div>
                  <div className="opsValue mono">{selectedTT.effective_from} → {selectedTT.effective_to}</div>
                </div>

                <div className="opsRow">
                  <div className="opsLabel">Tuần hiện tại</div>
                  <div className="opsValue">
                    <span className={`pill ${stats?.isHoliday ? "pill--warn" : "pill--muted"}`}>
                      {stats?.isHoliday ? <FiAlertTriangle /> : <FiCalendar />}
                      {weekInfo.label}
                    </span>
                    <div className="muted mono">{weekInfo.start_date} → {weekInfo.end_date}</div>
                  </div>
                </div>

                <div className="opsGrid">
                  <div className="kpi">
                    <div className="kpiLabel">Số tiết cấu hình</div>
                    <div className="kpiVal">{stats?.eCount ?? 0}</div>
                  </div>
                  <div className="kpi">
                    <div className="kpiLabel">Session trong tuần</div>
                    <div className="kpiVal">{stats?.sessionCount ?? 0}</div>
                  </div>
                  <div className="kpi">
                    <div className="kpiLabel">Thiếu môn/GV</div>
                    <div className="kpiVal">{stats?.missing ?? 0}</div>
                  </div>
                </div>

                <div className="opsActions">
                  <button className="btn btn-ghost" onClick={onGenerateSessions} disabled={selectedTT.is_locked}>
                    <FiZap /> Sinh session tuần này
                  </button>
                  <button className="btn btn-ghost" onClick={onManageWeeks}>
                    <FiCalendar /> Tùy chỉnh tuần học
                  </button>
                </div>

                <div className="warnList">
                  {stats?.isHoliday ? (
                    <div className="warnItem">
                      <FiAlertTriangle />
                      <div>
                        <div className="strong">Tuần nghỉ</div>
                        <div className="muted">Khuyến nghị không sinh session trong tuần nghỉ (tránh dữ liệu rác).</div>
                      </div>
                    </div>
                  ) : null}

                  {stats?.missing ? (
                    <div className="warnItem">
                      <FiAlertTriangle />
                      <div>
                        <div className="strong">Có tiết thiếu môn/GV</div>
                        <div className="muted">Sẽ làm báo cáo và sinh session bị sai. Hãy click vào ô và cập nhật.</div>
                      </div>
                    </div>
                  ) : (
                    <div className="warnItem ok">
                      <FiCheckCircle />
                      <div>
                        <div className="strong">Dữ liệu tiết học ổn</div>
                        <div className="muted">Bạn có thể sinh session và khóa TKB để vận hành ổn định.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* OPTIONAL: List timetables (quick manage) */}
          <Card icon={<FiEye />} title="Danh sách TKB" subtitle="Quản trị nhanh: xem/sửa/khóa theo danh sách">
            <div className="list">
              {pagedTTList.map((tt) => {
                const cls = classes.find((c) => c.id === tt.class_id)?.class_name || "—";
                const isSel = tt.id === timetableId;
                return (
                  <div key={tt.id} className={`listRow listRow--hover ${isSel ? "isSel" : ""}`}>
                    <div className="listMain" onClick={() => setTimetableId(tt.id)}>
                      <div className="strong">{cls}</div>
                      <div className="muted mono">{tt.effective_from} → {tt.effective_to}</div>
                    </div>
                    <div className="listRight">
                      <span className={`pill ${tt.is_locked ? "pill--danger" : "pill--ok"}`}>
                        {tt.is_locked ? "LOCKED" : "OPEN"}
                      </span>
                      <button className="iconBtn" title="Sửa" onClick={() => onEditTimetable(tt.id)}>
                        <FiEdit2 />
                      </button>
                    </div>
                  </div>
                );
              })}
              {!pagedTTList.length ? <div className="empty">Không có TKB phù hợp.</div> : null}
            </div>
            <div className="pager">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {modal.open ? (
        <ModalHost
          modal={modal}
          onClose={() => setModal({ open: false, type: "", payload: null })}
          years={years}
          classes={classes}
          subjects={subjects}
          teachers={teachers}
          timetables={timetables}
          setTimetables={setTimetables}
          entries={entries}
          setEntries={setEntries}
          weekOverrides={weekOverrides}
          setWeekOverrides={setWeekOverrides}
          sessions={sessions}
          setSessions={setSessions}
          records={records}
          selectedTT={selectedTT}
          weekInfo={weekInfo}
          weekDates={weekDates}
          entryIndex={entryIndex}
          subjectById={subjectById}
          teacherById={teacherById}
          sessionsByEntryAndDate={sessionsByEntryAndDate}
          onEditEntry={onEditEntry}
          onDeleteEntry={onDeleteEntry}
          onAddEntry={onAddEntry}
          pushToast={pushToast}
        />
      ) : null}

      {confirm ? (
        <ConfirmModal
          open={true}
          title={confirm.title}
          description={confirm.description}
          confirmLabel={confirm.confirmLabel}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      ) : null}
    </div>
  );
}
