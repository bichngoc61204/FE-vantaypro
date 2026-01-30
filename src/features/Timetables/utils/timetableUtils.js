export const MOCK_ACADEMIC_YEARS = [
  { id: "y2324", name: "2023-2024", start_date: "2023-08-15", end_date: "2024-05-31", is_current: false },
  { id: "y2425", name: "2024-2025", start_date: "2024-08-15", end_date: "2025-05-31", is_current: true },
];

export const MOCK_CLASSES = [
  { id: "c10a1", class_name: "10A1", academic_year_id: "y2425" },
  { id: "c10a2", class_name: "10A2", academic_year_id: "y2425" },
  { id: "c11b1", class_name: "11B1", academic_year_id: "y2425" },
  { id: "c12c2", class_name: "12C2", academic_year_id: "y2425" },
];

export const MOCK_SUBJECTS = [
  { id: "s_toan", subject_code: "TOAN", subject_name: "Toán" },
  { id: "s_van", subject_code: "VAN", subject_name: "Ngữ văn" },
  { id: "s_anh", subject_code: "ANH", subject_name: "Tiếng Anh" },
  { id: "s_ly", subject_code: "LY", subject_name: "Vật lý" },
  { id: "s_hoa", subject_code: "HOA", subject_name: "Hóa học" },
  { id: "s_sinh", subject_code: "SINH", subject_name: "Sinh học" },
];

export const MOCK_TEACHERS = [
  { id: "t1", full_name: "Nguyễn Thị Lan", teacher_code: "GV001" },
  { id: "t2", full_name: "Trần Văn Hùng", teacher_code: "GV002" },
  { id: "t3", full_name: "Phạm Thu Hà", teacher_code: "GV003" },
  { id: "t4", full_name: "Lê Minh Đức", teacher_code: "GV004" },
];

// timetables: theo lớp + năm học + hiệu lực + lock
export const INIT_TIMETABLES = [
  { id: "tt_10a1_fall", class_id: "c10a1", academic_year_id: "y2425", effective_from: "2025-01-06", effective_to: "2025-03-30", is_locked: false },
  { id: "tt_10a1_spring", class_id: "c10a1", academic_year_id: "y2425", effective_from: "2025-04-01", effective_to: "2025-05-31", is_locked: true },
  { id: "tt_10a2", class_id: "c10a2", academic_year_id: "y2425", effective_from: "2025-01-06", effective_to: "2025-05-31", is_locked: false },
];

// timetable_entries: slot theo thứ + giờ + môn + GV
export const INIT_ENTRIES = [
  // 10A1 - timetable fall
  { id: "e1", timetable_id: "tt_10a1_fall", date_of_week: 1, start_time: "07:30", end_time: "08:15", subject_id: "s_toan", teacher_id: "t2", room: "A101" },
  { id: "e2", timetable_id: "tt_10a1_fall", date_of_week: 1, start_time: "08:25", end_time: "09:10", subject_id: "s_van", teacher_id: "t1", room: "A101" },
  { id: "e3", timetable_id: "tt_10a1_fall", date_of_week: 2, start_time: "07:30", end_time: "08:15", subject_id: "s_anh", teacher_id: "t3", room: "A102" },
  { id: "e4", timetable_id: "tt_10a1_fall", date_of_week: 3, start_time: "09:20", end_time: "10:05", subject_id: "s_ly", teacher_id: "t4", room: "Lab 2" },

  // 10A2
  { id: "e5", timetable_id: "tt_10a2", date_of_week: 1, start_time: "07:30", end_time: "08:15", subject_id: "s_toan", teacher_id: "t2", room: "B201" },
  { id: "e6", timetable_id: "tt_10a2", date_of_week: 4, start_time: "08:25", end_time: "09:10", subject_id: "s_hoa", teacher_id: "t1", room: "Lab 1" },
];

// weeks: tùy chỉnh tuần học theo năm (có thể override)
export const INIT_WEEK_OVERRIDES = [
  // Ví dụ: tuần 1 của 2024-2025 bắt đầu sớm hơn / hoặc nghỉ tết…
  { id: "w1", academic_year_id: "y2425", week_no: 1, start_date: "2024-08-12", end_date: "2024-08-18", label: "Tuần 1", is_holiday: false },
  { id: "w2", academic_year_id: "y2425", week_no: 2, start_date: "2024-08-19", end_date: "2024-08-25", label: "Tuần 2", is_holiday: false },
  { id: "w_tet", academic_year_id: "y2425", week_no: 22, start_date: "2025-01-27", end_date: "2025-02-02", label: "Nghỉ Tết", is_holiday: true },
];

// attendance_sessions: sinh từ timetable_entries theo ngày
export const INIT_SESSIONS = [
  // 10A1 - một vài session đã sinh
  { id: "as1", timetable_entry_id: "e1", session_date: "2025-01-13", start_time: "07:30", end_time: "08:15" },
  { id: "as2", timetable_entry_id: "e2", session_date: "2025-01-13", start_time: "08:25", end_time: "09:10" },
  { id: "as3", timetable_entry_id: "e3", session_date: "2025-01-14", start_time: "07:30", end_time: "08:15" },
];

// attendance_records: demo để xem khi click ô
export const INIT_RECORDS = [
  { id: "r1", attendance_session_id: "as1", status: "PRESENT" },
  { id: "r2", attendance_session_id: "as1", status: "LATE" },
  { id: "r3", attendance_session_id: "as1", status: "ABSENT_UNEXCUSED" },
  { id: "r4", attendance_session_id: "as2", status: "PRESENT" },
  { id: "r5", attendance_session_id: "as2", status: "PRESENT" },
  { id: "r6", attendance_session_id: "as2", status: "ABSENT_EXCUSED" },
];

export const DAYS = [
  { dow: 1, label: "Thứ 2" },
  { dow: 2, label: "Thứ 3" },
  { dow: 3, label: "Thứ 4" },
  { dow: 4, label: "Thứ 5" },
  { dow: 5, label: "Thứ 6" },
  { dow: 6, label: "Thứ 7" },
];

// slots hiển thị grid (có thể lấy từ system_config / ca học)
export const DEFAULT_SLOTS = [
  { start: "07:30", end: "08:15", label: "Tiết 1" },
  { start: "08:25", end: "09:10", label: "Tiết 2" },
  { start: "09:20", end: "10:05", label: "Tiết 3" },
  { start: "10:15", end: "11:00", label: "Tiết 4" },
  { start: "13:30", end: "14:15", label: "Tiết 5" },
  { start: "14:25", end: "15:10", label: "Tiết 6" },
];

/* ===================== UTIL ===================== */

export const uid = () => `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;

export const norm = (s) => (s || "").toLowerCase().trim();

export const parseISODate = (d) => new Date(`${d}T00:00:00`);
export const fmtDate = (d) => d.toISOString().slice(0, 10);

export function getCurrentYearId(years) {
  return years.find((y) => y.is_current)?.id || years[0]?.id;
}

// week number from overrides, fallback: compute based on year start_date
export function pickWeekForDate({ dateStr, year, overrides }) {
  const d = parseISODate(dateStr);
  const ov = overrides
    .filter((w) => w.academic_year_id === year.id)
    .find((w) => d >= parseISODate(w.start_date) && d <= parseISODate(w.end_date));
  if (ov) return ov;

  // fallback compute
  const start = parseISODate(year.start_date);
  const diffDays = Math.floor((d - start) / (1000 * 60 * 60 * 24));
  const weekNo = Math.max(1, Math.floor(diffDays / 7) + 1);
  const startDate = new Date(start);
  startDate.setDate(start.getDate() + (weekNo - 1) * 7);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return {
    id: `auto_${year.id}_${weekNo}`,
    academic_year_id: year.id,
    week_no: weekNo,
    start_date: fmtDate(startDate),
    end_date: fmtDate(endDate),
    label: `Tuần ${weekNo}`,
    is_holiday: false,
  };
}

export function dowFromDateStr(dateStr) {
  // JS: 0=Sun ... 6=Sat => map Mon=1..Sat=6
  const d = parseISODate(dateStr);
  const js = d.getDay();
  if (js === 0) return 7;
  return js;
}

export function isBetween(dateStr, fromStr, toStr) {
  const d = parseISODate(dateStr);
  return d >= parseISODate(fromStr) && d <= parseISODate(toStr);
}

export function timeKey(start, end) {
  return `${start}-${end}`;
}

export function isPastSession(sessionDate, endTime, now = new Date("2025-01-15T10:30:00")) {
  const dt = new Date(`${sessionDate}T${endTime}:00`);
  return dt.getTime() <= now.getTime();
}
