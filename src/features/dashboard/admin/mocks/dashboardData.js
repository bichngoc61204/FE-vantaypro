import { makeTrend30Days } from "../utils/dashboardHelpers";

export const TODAY = "2026-01-16"; // (Asia/Ho_Chi_Minh) sample

// School meta
export const school = {
  name: "Vân tay Pro — THPT Demo",
  timezone: "Asia/Ho_Chi_Minh",
  academicYear: "2025–2026",
};

// Core structures
export const classes = [
  { id: "C10A1", class_name: "10A1" },
  { id: "C10A2", class_name: "10A2" },
  { id: "C11B1", class_name: "11B1" },
  { id: "C11B2", class_name: "11B2" },
  { id: "C12C1", class_name: "12C1" },
  { id: "C12C2", class_name: "12C2" },
];

export const teachers = [
  { id: "T001", full_name: "Nguyễn Minh An", teacher_code: "GV001" },
  { id: "T002", full_name: "Trần Thị Bích", teacher_code: "GV002" },
  { id: "T003", full_name: "Lê Hoàng Long", teacher_code: "GV003" },
  { id: "T004", full_name: "Phạm Thu Trang", teacher_code: "GV004" },
  { id: "T005", full_name: "Võ Quốc Huy", teacher_code: "GV005" },
];

// "Dashboard dataset"
export const DASH = {
  schoolWide: {
    sessionsToday: [
      { period: "Tiết 1", start: "07:00", end: "07:45", present: 860, late: 58, absent: 32 },
      { period: "Tiết 2", start: "07:55", end: "08:40", present: 878, late: 46, absent: 26 },
      { period: "Tiết 3", start: "08:50", end: "09:35", present: 886, late: 38, absent: 26 },
      { period: "Tiết 4", start: "09:45", end: "10:30", present: 894, late: 28, absent: 28 },
      { period: "Tiết 5", start: "13:00", end: "13:45", present: 842, late: 52, absent: 56 },
      { period: "Tiết 6", start: "13:55", end: "14:40", present: 852, late: 44, absent: 54 },
      { period: "Tiết 7", start: "14:50", end: "15:35", present: 858, late: 40, absent: 52 },
      { period: "Tiết 8", start: "15:45", end: "16:30", present: 862, late: 36, absent: 52 },
    ],

    checkinHistogram: [
      { label: "06:10", value: 18 },
      { label: "06:20", value: 52 },
      { label: "06:30", value: 120 },
      { label: "06:40", value: 240 },
      { label: "06:50", value: 310 },
      { label: "07:00", value: 190 },
      { label: "07:10", value: 84 },
      { label: "07:20", value: 36 },
      { label: "07:30", value: 20 },
    ],

    topHotspots: [
      { key: "12C2", label: "12C2", late: 22, absent: 11, total: 33 },
      { key: "11B2", label: "11B2", late: 18, absent: 9, total: 27 },
      { key: "10A2", label: "10A2", late: 16, absent: 8, total: 24 },
      { key: "12C1", label: "12C1", late: 12, absent: 10, total: 22 },
      { key: "10A1", label: "10A1", late: 14, absent: 6, total: 20 },
    ],

    trend30: makeTrend30Days(TODAY),

    integrity7: [
      { date: "01/10", hasInValid: 940, mismatch: 36, noIn: 24 },
      { date: "01/11", hasInValid: 948, mismatch: 32, noIn: 20 },
      { date: "01/12", hasInValid: 952, mismatch: 29, noIn: 19 },
      { date: "01/13", hasInValid: 946, mismatch: 35, noIn: 19 },
      { date: "01/14", hasInValid: 958, mismatch: 24, noIn: 18 },
      { date: "01/15", hasInValid: 954, mismatch: 28, noIn: 18 },
      { date: "01/16", hasInValid: 950, mismatch: 34, noIn: 16 },
    ],

    pipeline: {
      sessionsGenerated: 8 * 6,
      recordsExpected: 8 * 6 * 160,
      recordsCreated: 8 * 6 * 156,
      teacherConfirmed: 8 * 6 * 148,
      notificationsNeeded: 92,
      notificationsSent: 79,
      notificationsFailed: 13,
    },

    override: {
      todayCount: 64,
      avg7Days: 52,
      trend7: [
        { d: "01/10", v: 44 },
        { d: "01/11", v: 49 },
        { d: "01/12", v: 51 },
        { d: "01/13", v: 56 },
        { d: "01/14", v: 48 },
        { d: "01/15", v: 53 },
        { d: "01/16", v: 64 },
      ],
      topEditors: [
        { name: "Nguyễn Minh An", edits: 18 },
        { name: "Trần Thị Bích", edits: 14 },
        { name: "Lê Hoàng Long", edits: 12 },
        { name: "Phạm Thu Trang", edits: 11 },
        { name: "Võ Quốc Huy", edits: 9 },
      ],
    },

    studentsAtRisk: [
      {
        student_code: "HS10231",
        full_name: "Nguyễn Thanh Tùng",
        class_name: "12C2",
        absent_unexcused_14d: 4,
        late_14d: 6,
        streak_absent: 2,
        spark: [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0],
        note: "Hay đi muộn tiết 1, cần nhắc phụ huynh",
      },
      {
        student_code: "HS08812",
        full_name: "Trần Bảo Linh",
        class_name: "11B2",
        absent_unexcused_14d: 3,
        late_14d: 7,
        streak_absent: 1,
        spark: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
        note: "Chấm vân tay trễ, kiểm tra giờ vào cổng",
      },
      {
        student_code: "HS07450",
        full_name: "Lê Minh Khang",
        class_name: "10A2",
        absent_unexcused_14d: 5,
        late_14d: 2,
        streak_absent: 3,
        spark: [1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        note: "Vắng liên tiếp 3 buổi, cần liên hệ ngay",
      },
      {
        student_code: "HS06611",
        full_name: "Phạm Gia Hân",
        class_name: "12C1",
        absent_unexcused_14d: 2,
        late_14d: 8,
        streak_absent: 0,
        spark: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        note: "Đi muộn nhiều (threshold 15’), cân nhắc điều chỉnh quy tắc/nhắc nhở",
      },
    ],

    anomalies: [
      {
        time: "07:12",
        type: "Thiếu attendance_records",
        entity: "attendance_sessions",
        entity_id: "SES-20260116-10A2-P1",
        detail: "10A2 / Tiết 1: thiếu 11 record (có session nhưng chưa tạo đủ record theo sĩ số).",
        severity: "HIGH",
      },
      {
        time: "07:05",
        type: "Log IN bất thường",
        entity: "attendance_logs",
        entity_id: "LOG-20260116-BURST",
        detail: "Cổng A: tăng đột biến 210 log trong 2 phút (khả năng trùng log/thiết bị gửi lại).",
        severity: "MEDIUM",
      },
      {
        time: "13:08",
        type: "Mismatch IN ↔ trạng thái",
        entity: "attendance_records",
        entity_id: "REC-20260116-MISMATCH",
        detail: "12C2 / Tiết 5: 7 học sinh có IN hợp lệ nhưng bị đánh dấu LATE/ABSENT do sai khung giờ.",
        severity: "HIGH",
      },
      {
        time: "14:20",
        type: "OUT sớm tăng",
        entity: "attendance_logs",
        entity_id: "LOG-OUT-EARLY",
        detail: "11B2: tăng OUT trước 15:00 (nghi vấn ra về giữa buổi).",
        severity: "LOW",
      },
    ],

    auditLogs: [
      { at: "16:10", user: "ADMIN", action: "UPDATE_SYSTEM_CONFIG", entity: "system_config", entity_id: "CFG-1", note: "Cập nhật threshold đi muộn = 15 phút" },
      { at: "15:55", user: "GV001", action: "OVERRIDE_ATTENDANCE", entity: "attendance_records", entity_id: "REC-12C2-P5-032", note: "Chuyển ABSENT → PRESENT (lỗi thiết bị)" },
      { at: "15:42", user: "GV002", action: "ADD_NOTE", entity: "attendance_records", entity_id: "REC-11B2-P6-014", note: "Ghi chú: đi muộn do kẹt xe" },
      { at: "14:05", user: "ADMIN", action: "IMPORT_TIMETABLE", entity: "timetable_entries", entity_id: "IMP-20260116", note: "Import thời khóa biểu tuần 3" },
      { at: "08:20", user: "GV003", action: "CONFIRM_SESSION", entity: "attendance_sessions", entity_id: "SES-20260116-12C1-P2", note: "Xác nhận phiên điểm danh" },
    ],
  },

  classMap: {
    C12C2: {
      sessionsToday: [
        { period: "Tiết 1", start: "07:00", end: "07:45", present: 145, late: 10, absent: 5 },
        { period: "Tiết 2", start: "07:55", end: "08:40", present: 148, late: 8, absent: 4 },
        { period: "Tiết 3", start: "08:50", end: "09:35", present: 150, late: 6, absent: 4 },
        { period: "Tiết 4", start: "09:45", end: "10:30", present: 151, late: 5, absent: 4 },
        { period: "Tiết 5", start: "13:00", end: "13:45", present: 140, late: 12, absent: 8 },
        { period: "Tiết 6", start: "13:55", end: "14:40", present: 142, late: 10, absent: 8 },
        { period: "Tiết 7", start: "14:50", end: "15:35", present: 143, late: 9, absent: 8 },
        { period: "Tiết 8", start: "15:45", end: "16:30", present: 144, late: 8, absent: 8 },
      ],
      checkinHistogram: [
        { label: "06:20", value: 8 },
        { label: "06:30", value: 22 },
        { label: "06:40", value: 48 },
        { label: "06:50", value: 62 },
        { label: "07:00", value: 40 },
        { label: "07:10", value: 18 },
      ],
      topHotspots: [
        { key: "P5", label: "Tiết 5", late: 12, absent: 8, total: 20 },
        { key: "P6", label: "Tiết 6", late: 10, absent: 8, total: 18 },
        { key: "P1", label: "Tiết 1", late: 10, absent: 5, total: 15 },
        { key: "P8", label: "Tiết 8", late: 8, absent: 8, total: 16 },
      ],
      trend30: makeTrend30Days(TODAY, { basePresentRate: 0.925, volatility: 0.035, baseLate: 18 }),
      integrity7: [
        { date: "01/10", hasInValid: 150, mismatch: 6, noIn: 4 },
        { date: "01/11", hasInValid: 151, mismatch: 5, noIn: 4 },
        { date: "01/12", hasInValid: 153, mismatch: 4, noIn: 3 },
        { date: "01/13", hasInValid: 149, mismatch: 6, noIn: 5 },
        { date: "01/14", hasInValid: 154, mismatch: 3, noIn: 3 },
        { date: "01/15", hasInValid: 152, mismatch: 4, noIn: 4 },
        { date: "01/16", hasInValid: 151, mismatch: 6, noIn: 3 },
      ],
      pipeline: {
        sessionsGenerated: 8,
        recordsExpected: 8 * 160,
        recordsCreated: 8 * 156,
        teacherConfirmed: 8 * 149,
        notificationsNeeded: 18,
        notificationsSent: 14,
        notificationsFailed: 4,
      },
      override: {
        todayCount: 14,
        avg7Days: 11,
        trend7: [
          { d: "01/10", v: 9 },
          { d: "01/11", v: 10 },
          { d: "01/12", v: 12 },
          { d: "01/13", v: 11 },
          { d: "01/14", v: 10 },
          { d: "01/15", v: 12 },
          { d: "01/16", v: 14 },
        ],
        topEditors: [
          { name: "Nguyễn Minh An", edits: 6 },
          { name: "Trần Thị Bích", edits: 4 },
          { name: "Lê Hoàng Long", edits: 3 },
          { name: "Phạm Thu Trang", edits: 1 },
        ],
      },
      studentsAtRisk: [
        {
          student_code: "HS10231",
          full_name: "Nguyễn Thanh Tùng",
          class_name: "12C2",
          absent_unexcused_14d: 4,
          late_14d: 6,
          streak_absent: 2,
          spark: [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0],
          note: "Hay đi muộn tiết 1, cần nhắc phụ huynh",
        },
        {
          student_code: "HS10490",
          full_name: "Võ Tuấn Kiệt",
          class_name: "12C2",
          absent_unexcused_14d: 3,
          late_14d: 4,
          streak_absent: 1,
          spark: [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
          note: "Thiếu log IN 2 lần, nghi vấn máy",
        },
      ],
      anomalies: [
        {
          time: "13:08",
          type: "Mismatch IN ↔ trạng thái",
          entity: "attendance_records",
          entity_id: "REC-20260116-MISMATCH",
          detail: "12C2 / Tiết 5: 7 học sinh có IN hợp lệ nhưng bị đánh dấu LATE/ABSENT do sai khung giờ.",
          severity: "HIGH",
        },
      ],
      auditLogs: [
        { at: "15:55", user: "GV001", action: "OVERRIDE_ATTENDANCE", entity: "attendance_records", entity_id: "REC-12C2-P5-032", note: "Chuyển ABSENT → PRESENT (lỗi thiết bị)" },
        { at: "14:40", user: "GV001", action: "CONFIRM_SESSION", entity: "attendance_sessions", entity_id: "SES-20260116-12C2-P6", note: "Xác nhận phiên điểm danh" },
      ],
    },
  },
};
