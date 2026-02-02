import React from 'react';
import './ParentDashboard.css';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaFingerprint
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';


/* ================= MOCK DATA ================= */

const MOCK_STUDENT = {
  full_name: 'Nguyễn Văn An'
};

const MOCK_CLASS = {
  class_name: '10A1',
  academic_year: '2024 - 2025'
};

const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  LATE: 'LATE',
  ABSENT: 'ABSENT'
};

const MOCK_ATTENDANCE = [
  {
    id: 1,
    subject_name: 'Toán',
    session_date: '20/05/2024',
    status: ATTENDANCE_STATUS.PRESENT
  },
  {
    id: 2,
    subject_name: 'Vật lý',
    session_date: '19/05/2024',
    status: ATTENDANCE_STATUS.LATE,
    note: 'Đi trễ 10 phút'
  },
  {
    id: 3,
    subject_name: 'Hóa học',
    session_date: '18/05/2024',
    status: ATTENDANCE_STATUS.ABSENT,
    note: 'Nghỉ không phép'
  }
];

const MOCK_TIMETABLE = [
  {
    id: 1,
    start_time: '07:00',
    end_time: '07:45',
    subject_name: 'Toán',
    teacher_name: 'Thầy Minh'
  },
  {
    id: 2,
    start_time: '07:50',
    end_time: '08:35',
    subject_name: 'Vật lý',
    teacher_name: 'Cô Lan'
  },
  {
    id: 3,
    start_time: '08:40',
    end_time: '09:25',
    subject_name: 'Hóa học',
    teacher_name: 'Thầy Hùng'
  },
  {
    id: 4,
    start_time: '09:35',
    end_time: '10:20',
    subject_name: 'Sinh học',
    teacher_name: 'Cô Mai'
  }
];


/* ================= COMPONENT ================= */

const ParentDashboard = () => {

const navigate = useNavigate();

  const presentCount = MOCK_ATTENDANCE.filter(a => a.status === ATTENDANCE_STATUS.PRESENT).length;
  const lateCount = MOCK_ATTENDANCE.filter(a => a.status === ATTENDANCE_STATUS.LATE).length;
  const absentCount = MOCK_ATTENDANCE.filter(a => a.status === ATTENDANCE_STATUS.ABSENT).length;

  return (
    <div className="dashboard">
      {/* TOP */}
      <div className="dashboard-top">
        <div className="attendance-today">
          <div className="attendance-header">
            <div className="icon-box emerald">
              <FaFingerprint />
            </div>
            <div>
              <h4>Chuyên cần hôm nay</h4>
              <p>Hôm nay: 20/05/2024</p>
            </div>
          </div>

          <div className="attendance-info">
            <div className="info-row">
              <span>Vào trường</span>
              <strong>07:25 AM</strong>
            </div>
            <div className="info-row">
              <span>Rời trường</span>
              <em>--:--</em>
            </div>
            <div className="status-live">
              <span className="dot" />
              <span>Đang học tại trường</span>
            </div>
          </div>
        </div>

        <div className="welcome-card">
          <h3>Chào buổi sáng, Anh An!</h3>
          <p>
            Hôm nay {MOCK_STUDENT.full_name} có 5 tiết học.
            Đừng quên kiểm tra thông báo mới từ nhà trường.
          </p>

          <div className="class-info">
            <div>
              <small>Lớp học</small>
              <strong>{MOCK_CLASS.class_name}</strong>
            </div>
            <div>
              <small>Năm học</small>
              <strong>{MOCK_CLASS.academic_year}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card">
          <FaCheckCircle className="icon green" />
          <div>
            <small>Có mặt</small>
            <strong>{presentCount} buổi</strong>
          </div>
        </div>

        <div className="stat-card">
          <FaClock className="icon amber" />
          <div>
            <small>Đi muộn</small>
            <strong>{lateCount} buổi</strong>
          </div>
        </div>

        <div className="stat-card">
          <FaExclamationCircle className="icon rose" />
          <div>
            <small>Vắng mặt</small>
            <strong>{absentCount} buổi</strong>
          </div>
        </div>

        <div className="stat-card">
          <FaCalendarAlt className="icon emerald" />
          <div>
            <small>Hôm nay</small>
            <strong>5 tiết</strong>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="dashboard-bottom">
        <div className="timetable">
          <div className="card-header">
            <h4>Lịch học tiếp theo</h4>
            <button onClick={() => navigate('/parent/timetable')}>Xem tất cả</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tiết</th>
                <th>Thời gian</th>
                <th>Môn học</th>
                <th>Giáo viên</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TIMETABLE.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.start_time} - {item.end_time}</td>
                  <td>{item.subject_name}</td>
                  <td>{item.teacher_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="attendance-recent">
          <h4>Điểm danh gần đây</h4>

          {MOCK_ATTENDANCE.map(item => (
            <div key={item.id} className="attendance-item">
              <span className={`dot ${item.status.toLowerCase()}`} />
              <div>
                <div className="row">
                  <strong>{item.subject_name}</strong>
                  <small>{item.session_date}</small>
                </div>
                <div className="row">
                  <span className={`badge ${item.status.toLowerCase()}`}>
                    {item.status === 'PRESENT' ? 'CÓ MẶT' :
                     item.status === 'LATE' ? 'ĐI MUỘN' : 'VẮNG'}
                  </span>
                  {item.note && <em>"{item.note}"</em>}
                </div>
              </div>
            </div>
          ))}

          <button className="view-more" onClick={() => navigate('/parent/attendance')}>
            Xem báo cáo chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
