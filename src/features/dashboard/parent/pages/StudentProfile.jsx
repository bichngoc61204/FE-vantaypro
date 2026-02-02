import React from 'react';
import './StudentProfile.css';

import {
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaAward,
  FaBookOpen,
  FaFingerprint
} from 'react-icons/fa';

/* ================= MOCK DATA ================= */
const MOCK_STUDENT = {
  full_name: 'Nguyễn Minh Khang',
  student_code: 'HS20240512',
  avatar_url: 'https://i.pravatar.cc/300?img=12',
  fingerprint_id: 'FP-102938',
  gender: 'Nam',
  dob: '15 / 05 / 2012',
  phone: '090xxxx123',
  email: 'khang.nm@student.edu.vn',
  role: 'Lớp phó học tập'
};

const MOCK_CLASS = {
  class_name: '5A1'
};
/* ============================================= */

const StudentProfile = () => {
  return (
    <div className="student-profile">
      <div className="profile-grid">
        {/* LEFT: BASIC INFO */}
        <div className="profile-left">
          <div className="profile-card">
            <img
              src={MOCK_STUDENT.avatar_url}
              alt={MOCK_STUDENT.full_name}
              className="profile-avatar"
            />

            <h3>{MOCK_STUDENT.full_name}</h3>
            <span className="student-code">{MOCK_STUDENT.student_code}</span>

            <div className="profile-meta">
              <div className="meta-item">
                <FaBookOpen />
                <div>
                  <span>Lớp học</span>
                  <strong>{MOCK_CLASS.class_name}</strong>
                </div>
              </div>

              <div className="meta-item">
                <FaFingerprint />
                <div>
                  <span>Vân tay</span>
                  <strong>{MOCK_STUDENT.fingerprint_id}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: DETAIL */}
        <div className="profile-right">
          <div className="detail-card">
            <h4>Thông tin chi tiết</h4>

            <div className="detail-grid">
              <div className="detail-item">
                <label><FaUser /> Họ và tên</label>
                <p>{MOCK_STUDENT.full_name}</p>
              </div>

              <div className="detail-item">
                <label><FaCalendarAlt /> Ngày sinh</label>
                <p>{MOCK_STUDENT.dob}</p>
              </div>

              <div className="detail-item">
                <label><FaUser /> Giới tính</label>
                <p>{MOCK_STUDENT.gender}</p>
              </div>

              <div className="detail-item">
                <label><FaAward /> Vai trò lớp</label>
                <p className="highlight">{MOCK_STUDENT.role}</p>
              </div>

              <div className="detail-item">
                <label><FaPhone /> SĐT liên hệ</label>
                <p>{MOCK_STUDENT.phone}</p>
              </div>

              <div className="detail-item">
                <label><FaEnvelope /> Email</label>
                <p>{MOCK_STUDENT.email}</p>
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="achievement-card">
            <h4><FaAward /> Thành tích tiêu biểu</h4>

            <ul>
              <li>
                <span>1</span>
                <div>
                  <strong>Giải Nhì Olympic Toán cấp Quận</strong>
                  <p>Học kỳ I • 2023 – 2024</p>
                </div>
              </li>

              <li>
                <span>2</span>
                <div>
                  <strong>Học sinh xuất sắc 5 năm liền</strong>
                  <p>Bậc Tiểu học</p>
                </div>
              </li>
            </ul>

            <FaAward className="achievement-bg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
