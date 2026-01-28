
import React from 'react';
import {
  FiSettings,
  FiLayers,
  FiHash,
  FiCalendar,
  FiBookOpen,
  FiAward,
  FiFileText
} from "react-icons/fi";

export const TABS = [
  { key: "levels", label: "Cấp học", icon: <FiLayers /> },
  { key: "grades", label: "Khối", icon: <FiHash /> },
  { key: "years", label: "Năm học", icon: <FiCalendar /> },
  { key: "subjects", label: "Môn học", icon: <FiBookOpen /> },
  { key: "roles", label: "Vai trò học sinh", icon: <FiAward /> },
  { key: "config", label: "Quy tắc điểm danh", icon: <FiSettings /> },
  { key: "audit", label: "Audit log", icon: <FiFileText /> },
];

export const ENTITY_OPTIONS = [
  { value: "ALL", label: "Tất cả đối tượng" },
  { value: "education_levels", label: "education_levels" },
  { value: "grades", label: "grades" },
  { value: "academic_years", label: "academic_years" },
  { value: "subjects", label: "subjects" },
  { value: "student_roles", label: "student_roles" },
  { value: "system_config", label: "system_config" },
];

export const SUBJECT_STATUS_OPTIONS = [
    { value: "ALL", label: "Tất cả trạng thái" },
    { value: "ACTIVE", label: "ACTIVE" },
    { value: "INACTIVE", label: "INACTIVE" },
];
