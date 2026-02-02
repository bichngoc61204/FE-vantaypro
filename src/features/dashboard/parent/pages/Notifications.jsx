import React, { useState } from 'react';
import './Notifications.css';

import {
  FaBell,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaInfoCircle,
  FaClock
} from 'react-icons/fa';

/* ================= MOCK DATA ================= */
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Học sinh đi muộn',
    message: 'Học sinh Nguyễn Văn A đi muộn 15 phút vào tiết 1.',
    category: 'ATTENDANCE',
    sent_at: '08:10 12/05',
    is_read: false
  },
  {
    id: 2,
    title: 'Thông báo khẩn',
    message: 'Ngày mai học sinh nghỉ học do thời tiết xấu.',
    category: 'URGENT',
    sent_at: '18:30 11/05',
    is_read: false
  },
  {
    id: 3,
    title: 'Thông báo chung',
    message: 'Nhà trường tổ chức họp phụ huynh vào cuối tháng.',
    category: 'INFO',
    sent_at: '09:00 10/05',
    is_read: true
  }
];
/* ============================================= */

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const filtered =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => !n.is_read);

  const getIcon = (category) => {
    switch (category) {
      case 'URGENT':
        return <FaExclamationTriangle className="icon urgent" />;
      case 'ATTENDANCE':
        return <FaClock className="icon attendance" />;
      default:
        return <FaInfoCircle className="icon info" />;
    }
  };

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );
  };

  return (
    <div className="notifications">
      <div className="notifications-card">
        {/* HEADER */}
        <div className="notifications-header">
          <div className="header-left">
            <h3>Thông báo từ trường</h3>
            <span className="badge">
              {notifications.filter((n) => !n.is_read).length} MỚI
            </span>
          </div>

          <div className="filter">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              TẤT CẢ
            </button>
            <button
              className={filter === 'unread' ? 'active' : ''}
              onClick={() => setFilter('unread')}
            >
              CHƯA ĐỌC
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="notifications-list">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`notification-item 
                  ${isExpanded ? 'expanded' : ''}
                  ${!item.is_read ? 'unread' : ''}`}
              >
                <div
                  className="notification-main"
                  onClick={() => handleToggle(item.id)}
                >
                  <div className="icon-wrapper">
                    {getIcon(item.category)}
                  </div>

                  <div className="notification-content">
                    <div className="notification-title">
                      <h5>{item.title}</h5>
                      <span>{item.sent_at}</span>
                    </div>

                    {!isExpanded && (
                      <p className="preview">
                        {item.message}
                      </p>
                    )}
                  </div>

                  <div className="chevron">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="notification-detail">
                    <p>{item.message}</p>
                    <div className="detail-footer">
                      <span>ID: #MSG_{item.id}</span>
                      <span className="seen">ĐÃ XEM</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="empty">
              <FaBell size={42} />
              <h4>Không có thông báo mới</h4>
              <p>Hộp thư của bạn hiện đang trống.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
