import React, { useState } from 'react';
import './ParentAttendance.css';
import { AiOutlineCalendar } from 'react-icons/ai';
import { HiChevronDown } from 'react-icons/hi';

/* ===== ENUM ===== */
export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  LATE: 'LATE',
  ABSENT_EXCUSED: 'ABSENT_EXCUSED',
  ABSENT_UNEXCUSED: 'ABSENT_UNEXCUSED'
};

/* ===== MOCK DATA (đúng ERD attendance) ===== */
const MOCK_ATTENDANCE = [
  {
    id: 1,
    student_id: 'HS001',
    subject_name: 'Toán',
    session_date: '2024-05-10',
    checkin_time: '07:30',
    checkout_time: '09:00',
    status: AttendanceStatus.PRESENT,
    note: ''
  },
  {
    id: 2,
    student_id: 'HS001',
    subject_name: 'Văn',
    session_date: '2024-05-10',
    checkin_time: '07:45',
    checkoutout_time: '09:15',
    checkout_time: '09:15',
    status: AttendanceStatus.LATE,
    note: 'Kẹt xe'
  },
  {
    id: 3,
    student_id: 'HS001',
    subject_name: 'Anh',
    session_date: '2024-05-08',
    checkin_time: null,
    checkout_time: null,
    status: AttendanceStatus.ABSENT_UNEXCUSED,
    note: ''
  }
];

/* ===== STATUS CLASS ===== */
const STATUS_CLASS = {
  PRESENT: 'status present',
  LATE: 'status late',
  ABSENT_EXCUSED: 'status excused',
  ABSENT_UNEXCUSED: 'status absent'
};

const ParentAttendance = () => {
  const [filter, setFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('05');

  const filteredRecords = MOCK_ATTENDANCE.filter(r => {
    const matchStatus = filter === 'all' || r.status === filter;
    const matchMonth = r.session_date.split('-')[1] === selectedMonth;
    return matchStatus && matchMonth;
  });

  const groupedRecords = filteredRecords.reduce((acc, cur) => {
    acc[cur.session_date] = acc[cur.session_date] || [];
    acc[cur.session_date].push(cur);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedRecords).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div className="attendance-wrapper">
      <div className="attendance-card">

        {/* HEADER */}
        <div className="attendance-header">
          <div>
            <h3>Lịch sử điểm danh</h3>
            <p>Dữ liệu chi tiết theo từng ngày học</p>
          </div>

          <div className="attendance-filters">
            {/* Month */}
            <div className="filter-group">
              <label>Tháng</label>
              <div className="select-wrapper">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="05">Tháng 05</option>
                  <option value="04">Tháng 04</option>
                  <option value="03">Tháng 03</option>
                </select>
                <HiChevronDown size={14} />
              </div>
            </div>

            {/* Status */}
            <div className="filter-group">
              <label>Trạng thái</label>
              <div className="status-filter">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: AttendanceStatus.PRESENT, label: 'Có mặt' },
                  { id: AttendanceStatus.LATE, label: 'Muộn' },
                  { id: AttendanceStatus.ABSENT_UNEXCUSED, label: 'Nghỉ' }
                ].map(btn => (
                  <button
                    key={btn.id}
                    className={filter === btn.id ? 'active' : ''}
                    onClick={() => setFilter(btn.id)}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LIST */}
        {sortedDates.map(date => (
          <div key={date} className="attendance-day">
            <div className="date-row">
              <AiOutlineCalendar size={16} />
              <span>{date}</span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Môn học</th>
                  <th>Vào</th>
                  <th>Ra</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {groupedRecords[date].map(r => (
                  <tr key={r.id}>
                    <td>{r.subject_name}</td>
                    <td>{r.checkin_time || '--:--'}</td>
                    <td>{r.checkout_time || '--:--'}</td>
                    <td>
                      <span className={STATUS_CLASS[r.status]}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{r.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {sortedDates.length === 0 && (
          <div className="empty-state">
            <AiOutlineCalendar size={32} />
            <p>Không có dữ liệu</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ParentAttendance;
