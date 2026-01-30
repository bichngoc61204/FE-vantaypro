
import { useState, useMemo } from 'react';
import { uid, nowStr } from '../utils/helpers';

export const useSystemData = () => {
    //  Mock data (replace by API later) 
    const [educationLevels, setEducationLevels] = useState([
        { id: "el1", name: "Tiểu học", description: "Cấp 1", is_active: true },
        { id: "el2", name: "THCS", description: "Cấp 2", is_active: true },
        { id: "el3", name: "THPT", description: "Cấp 3", is_active: true },
    ]);

    const [grades, setGrades] = useState([
        { id: "g1", education_level_id: "el3", grade_name: "10" },
        { id: "g2", education_level_id: "el3", grade_name: "11" },
        { id: "g3", education_level_id: "el3", grade_name: "12" },
        { id: "g4", education_level_id: "el2", grade_name: "6" },
        { id: "g5", education_level_id: "el2", grade_name: "7" },
        { id: "g6", education_level_id: "el2", grade_name: "8" },
        { id: "g7", education_level_id: "el2", grade_name: "9" },
    ]);

    const [academicYears, setAcademicYears] = useState([
        {
            id: "ay1",
            name: "2024-2025",
            start_date: "2024-09-01",
            end_date: "2025-05-31",
            is_current: false,
        },
        {
            id: "ay2",
            name: "2025-2026",
            start_date: "2025-09-01",
            end_date: "2026-05-31",
            is_current: true,
        },
    ]);

    const [subjects, setSubjects] = useState([
        { id: "s1", subject_code: "TOAN", subject_name: "Toán", is_active: true },
        { id: "s2", subject_code: "VAN", subject_name: "Ngữ văn", is_active: true },
        { id: "s3", subject_code: "ANH", subject_name: "Tiếng Anh", is_active: true },
        { id: "s4", subject_code: "LY", subject_name: "Vật lý", is_active: true },
    ]);

    const [studentRoles, setStudentRoles] = useState([
        { id: "sr1", role_code: "LEADER", role_name: "Lớp trưởng", description: "", is_active: true },
        { id: "sr2", role_code: "VICE_LEADER", role_name: "Lớp phó", description: "", is_active: true },
        { id: "sr3", role_code: "NONE", role_name: "Không", description: "Mặc định", is_active: true },
    ]);

    const [systemConfig, setSystemConfig] = useState({
        checkin_start_time: "07:00",
        checkin_end_time: "07:45",
        checkout_time: "16:30",
        absent_rule:
            "Vắng có phép: có đơn xin nghỉ được duyệt.\nVắng không phép: không có log IN và không có đơn.\nĐi muộn: log IN sau giờ bắt đầu tiết + ngưỡng trễ.",
        updated_at: "2026-01-17 12:00",
    });

    const [auditLogs, setAuditLogs] = useState([
        { id: "a1", user_id: "admin", action: "SET_CURRENT_YEAR", entity: "academic_years", entity_id: "ay2", created_at: "2026-01-15 08:10" },
        { id: "a2", user_id: "admin", action: "UPDATE_SYSTEM_CONFIG_TIME", entity: "system_config", entity_id: "singleton", created_at: "2026-01-16 09:22" },
        { id: "a3", user_id: "admin", action: "TOGGLE_SUBJECT", entity: "subjects", entity_id: "s4", created_at: "2026-01-16 10:05" },
    ]);

    // Audit helper
    const pushAudit = (action, entity, entityId) => {
        setAuditLogs((prev) => [
            { id: uid(), user_id: "admin", action, entity, entity_id: entityId, created_at: nowStr() },
            ...prev,
        ]);
    };

    // Derived
    const levelName = (id) => educationLevels.find((x) => x.id === id)?.name || "—";
    const currentYear = useMemo(() => academicYears.find((y) => y.is_current) || null, [academicYears]);

    // Actions
    const actions = {
        // Levels
        upsertLevel: (payload) => {
            if (payload.id) {
                setEducationLevels((prev) => prev.map((x) => (x.id === payload.id ? { ...x, ...payload } : x)));
                pushAudit("UPDATE_EDU_LEVEL", "education_levels", payload.id);
            } else {
                const id = uid();
                setEducationLevels((prev) => [{ id, name: payload.name, description: payload.description || "", is_active: !!payload.is_active }, ...prev]);
                pushAudit("CREATE_EDU_LEVEL", "education_levels", id);
            }
        },
        toggleLevel: (id) => {
             setEducationLevels((prev) => prev.map((x) => (x.id === id ? { ...x, is_active: !x.is_active } : x)));
             pushAudit("TOGGLE_EDU_LEVEL", "education_levels", id);
        },
        deleteLevel: (id) => { // Added just in case, though usually soft delete
             setEducationLevels((prev) => prev.filter(x => x.id !== id));
             pushAudit("DELETE_EDU_LEVEL", "education_levels", id);
        },

        // Grades
        upsertGrade: (payload) => {
            if (payload.id) {
                setGrades((prev) => prev.map((x) => (x.id === payload.id ? { ...x, ...payload } : x)));
                pushAudit("UPDATE_GRADE", "grades", payload.id);
            } else {
                const id = uid();
                setGrades((prev) => [{ id, education_level_id: payload.education_level_id, grade_name: payload.grade_name }, ...prev]);
                pushAudit("CREATE_GRADE", "grades", id);
            }
        },
        deleteGrade: (id) => {
            setGrades((prev) => prev.filter((x) => x.id !== id));
            pushAudit("DELETE_GRADE", "grades", id);
        },

        // Years
        upsertYear: (payload) => {
            if (payload.id) {
                setAcademicYears((prev) => prev.map((x) => (x.id === payload.id ? { ...x, ...payload } : x)));
                pushAudit("UPDATE_ACADEMIC_YEAR", "academic_years", payload.id);
            } else {
                const id = uid();
                setAcademicYears((prev) => [
                    { id, name: payload.name, start_date: payload.start_date, end_date: payload.end_date, is_current: false },
                    ...prev,
                ]);
                pushAudit("CREATE_ACADEMIC_YEAR", "academic_years", id);
            }
        },
        setCurrentYear: (id) => {
            setAcademicYears((prev) => prev.map((y) => ({ ...y, is_current: y.id === id })));
            pushAudit("SET_CURRENT_YEAR", "academic_years", id);
        },
        deleteYear: (id) => {
             setAcademicYears((prev) => prev.filter((x) => x.id !== id));
             pushAudit("DELETE_ACADEMIC_YEAR", "academic_years", id);
        },

        // Subjects
        upsertSubject: (payload) => {
            if (payload.id) {
                setSubjects((prev) => prev.map((x) => (x.id === payload.id ? { ...x, ...payload } : x)));
                pushAudit("UPDATE_SUBJECT", "subjects", payload.id);
            } else {
                const id = uid();
                setSubjects((prev) => [{ id, subject_code: payload.subject_code, subject_name: payload.subject_name, is_active: !!payload.is_active }, ...prev]);
                pushAudit("CREATE_SUBJECT", "subjects", id);
            }
        },
        toggleSubject: (id) => {
            setSubjects((prev) => prev.map((x) => (x.id === id ? { ...x, is_active: !x.is_active } : x)));
            pushAudit("TOGGLE_SUBJECT", "subjects", id);
        },
        deleteSubject: (id) => {
             setSubjects((prev) => prev.filter((x) => x.id !== id));
             pushAudit("DELETE_SUBJECT", "subjects", id);
        },

        // Roles
        upsertRole: (payload) => {
            if (payload.id) {
                setStudentRoles((prev) => prev.map((x) => (x.id === payload.id ? { ...x, ...payload } : x)));
                pushAudit("UPDATE_STUDENT_ROLE", "student_roles", payload.id);
            } else {
                const id = uid();
                setStudentRoles((prev) => [
                    { id, role_code: payload.role_code, role_name: payload.role_name, description: payload.description || "", is_active: !!payload.is_active },
                    ...prev,
                ]);
                pushAudit("CREATE_STUDENT_ROLE", "student_roles", id);
            }
        },
        toggleRole: (id) => {
            setStudentRoles((prev) => prev.map((x) => (x.id === id ? { ...x, is_active: !x.is_active } : x)));
            pushAudit("TOGGLE_STUDENT_ROLE", "student_roles", id);
        },
        deleteRole: (id) => {
             setStudentRoles((prev) => prev.filter((x) => x.id !== id));
             pushAudit("DELETE_STUDENT_ROLE", "student_roles", id);
        },

        // Config
        saveConfig: (payload) => {
            setSystemConfig((prev) => ({ ...prev, ...payload, updated_at: nowStr() }));
            if (payload._changed === "time") pushAudit("UPDATE_SYSTEM_CONFIG_TIME", "system_config", "singleton");
            if (payload._changed === "absent") pushAudit("UPDATE_SYSTEM_CONFIG_ABSENT_RULE", "system_config", "singleton");
        },
    };

    return {
        educationLevels,
        grades,
        academicYears,
        subjects,
        studentRoles,
        systemConfig,
        auditLogs,
        levelName,
        currentYear,
        pushAudit,
        actions
    };
};
