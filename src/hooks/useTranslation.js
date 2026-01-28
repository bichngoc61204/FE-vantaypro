import { useState, useEffect } from 'react';

const useTranslation = () => {
  const [lang, setLang] = useState('vi'); 

  const translations = {
    vi: {
      'admin.sidebar.dashboard': 'Tổng quan',
      'admin.sidebar.teachers': 'Giáo viên',
      'admin.sidebar.classes': 'Lớp học',
      'admin.sidebar.subjects': 'Môn học',
      'admin.sidebar.assignment': 'Phân công giảng dạy',
      'admin.sidebar.timetable': 'Thời khóa biểu',
      'admin.sidebar.system_config': 'Cấu hình hệ thống',
      'admin.sidebar.statistics': 'Thống kê',
      'admin.sidebar.audit_log': 'Audit log',
      'admin.header.profile': 'Hồ sơ',
      'admin.header.logout': 'Đăng xuất',
      'admin.header.theme_dark': 'Giao diện tối',
      'admin.header.theme_light': 'Giao diện sáng',
      'admin.header.lang_vi': 'Tiếng Việt',
      'admin.header.lang_en': 'English'
    },
    en: {
      'admin.sidebar.dashboard': 'Dashboard',
      'admin.sidebar.teachers': 'Teachers',
      'admin.sidebar.classes': 'Classes',
      'admin.sidebar.subjects': 'Subjects',
      'admin.sidebar.assignment': 'Assignments',
      'admin.sidebar.timetable': 'Timetable',
      'admin.sidebar.system_config': 'System Config',
      'admin.sidebar.statistics': 'Statistics',
      'admin.sidebar.audit_log': 'Audit Log',
      'admin.header.profile': 'Profile',
      'admin.header.logout': 'Logout',
      'admin.header.theme_dark': 'Dark Mode',
      'admin.header.theme_light': 'Light Mode',
      'admin.header.lang_vi': 'Vietnamese',
      'admin.header.lang_en': 'English'
    }
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const i18n = {
    changeLanguage: (language) => setLang(language),
    language: lang
  };

  return { t, i18n };
};

export default useTranslation;
