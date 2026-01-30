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
  
  export const MOCK_STUDENTS = [
    { id: "st1", student_code: "HS001", full_name: "Nguyễn An", class_id: "c10a1", fingerprint_id: "fp_1001" },
    { id: "st2", student_code: "HS002", full_name: "Trần Bình", class_id: "c10a1", fingerprint_id: "fp_1002" },
    { id: "st3", student_code: "HS003", full_name: "Lê Chi", class_id: "c10a1", fingerprint_id: "fp_1003" },
    { id: "st4", student_code: "HS004", full_name: "Phạm Duy", class_id: "c10a2", fingerprint_id: "fp_2001" },
    { id: "st5", student_code: "HS005", full_name: "Võ Em", class_id: "c10a2", fingerprint_id: null }, // missing fp -> anomaly
  ];
  
  export const SYSTEM_CONFIG = {
    checkin_start_time: "07:00",
    checkin_end_time: "07:45",
    late_threshold_minutes: 15,
    checkout_time: "17:00",
  };
  
  export const INIT_SESSIONS = [
    // session đại diện cho 1 tiết học cụ thể (đã sinh từ TKB)
    { id: "ss1", academic_year_id: "y2425", class_id: "c10a1", session_date: "2025-01-13", start_time: "07:30", end_time: "08:15", status: "CLOSED", is_locked: true, records_generated: true },
    { id: "ss2", academic_year_id: "y2425", class_id: "c10a1", session_date: "2025-01-13", start_time: "08:25", end_time: "09:10", status: "IN_PROGRESS", is_locked: false, records_generated: true },
    { id: "ss3", academic_year_id: "y2425", class_id: "c10a2", session_date: "2025-01-13", start_time: "07:30", end_time: "08:15", status: "GENERATED", is_locked: false, records_generated: false },
    { id: "ss4", academic_year_id: "y2425", class_id: "c11b1", session_date: "2025-01-14", start_time: "09:20", end_time: "10:05", status: "GENERATED", is_locked: false, records_generated: false },
  ];
  
  export const INIT_LOGS = [
    // raw logs (IN/OUT) từ máy vân tay - không gắn tiết học
    { id: "l1", student_id: "st1", log_time: "2025-01-13T07:18:00", log_type: "IN", source: "DEVICE_01" },
    { id: "l2", student_id: "st2", log_time: "2025-01-13T07:52:00", log_type: "IN", source: "DEVICE_01" }, // late-ish
    { id: "l3", student_id: "st3", log_time: "2025-01-13T07:10:00", log_type: "IN", source: "DEVICE_01" },
    { id: "l4", student_id: "st1", log_time: "2025-01-13T16:58:00", log_type: "OUT", source: "DEVICE_01" },
  
    { id: "l5", student_id: "st4", log_time: "2025-01-13T07:33:00", log_type: "IN", source: "DEVICE_02" },
    { id: "l6", student_id: "st4", log_time: "2025-01-13T07:33:10", log_type: "IN", source: "DEVICE_02" }, // duplicate
  ];
  
  export const INIT_RECORDS = [
    // kết quả điểm danh cuối cùng theo session + student
    { id: "r1", attendance_session_id: "ss1", student_id: "st1", status: "PRESENT", note: "" },
    { id: "r2", attendance_session_id: "ss1", student_id: "st2", status: "LATE", note: "Vào cổng sau giờ chuẩn" },
    { id: "r3", attendance_session_id: "ss1", student_id: "st3", status: "PRESENT", note: "" },
  
    { id: "r4", attendance_session_id: "ss2", student_id: "st1", status: "PRESENT", note: "" },
    { id: "r5", attendance_session_id: "ss2", student_id: "st2", status: "PRESENT", note: "" },
    { id: "r6", attendance_session_id: "ss2", student_id: "st3", status: "ABSENT_UNEXCUSED", note: "" },
  ];
