import { Link, useLocation } from 'react-router-dom';
import useTranslation from '../../hooks/useTranslation';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const menuItems = [
        {
            key: 'admin.sidebar.dashboard',
            path: '/admin/dashboard',
            icon: (
                <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            )
        },
        {
            key: 'admin.sidebar.teachers',
            path: '/admin/teachers',
            icon: (
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            )
        },
        {
            key: 'admin.sidebar.classes',
            path: '/admin/classes',
            icon: (
                <svg viewBox="0 0 24 24"><path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z"/></svg>
            )
        },
        {
            key: 'admin.sidebar.subjects',
            path: '/admin/subjects',
            icon: (
                <svg viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 2.5c1.93 0 3.5 1.57 3.5 3.5S13.93 11.5 12 11.5 8.5 9.93 8.5 8 10.07 4.5 12 4.5zM6 20v-1.9c0-2.04 4.07-3.1 6-3.1s6 1.06 6 3.1V20H6z"/></svg>
            )
        },
        {
            key: 'admin.sidebar.assignment',
            path: '/admin/assignments',
            icon: (
                <svg viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            )
        },
        {
            key: 'admin.sidebar.timetable',
            path: '/admin/timetable',
            icon: (
                <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            )
        },
        {
            key: 'admin.sidebar.system_config',
            path: '/admin/config',
            icon: (
                <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L6.18 8.87c-.12.21-.07.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
            )
        },
        {
            key: 'admin.sidebar.statistics',
            path: '/admin/statistics',
            icon: (
                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
            )
        },
        {
            key: 'admin.sidebar.audit_log',
            path: '/admin/audit',
            icon: (
                <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
            )
        }
    ];

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
                <Link to="/admin" className="admin-sidebar-logo">
                    Dashboard <span>Pro</span>
                </Link>
            </div>
            <div className="admin-sidebar-menu">
                <div className="admin-sidebar-list">
                    {menuItems.map((item) => (
                        <div key={item.key} className="admin-sidebar-item">
                            <Link 
                                to={item.path} 
                                className={`admin-sidebar-link ${isActive(item.path)}`}
                            >
                                <span className="admin-sidebar-icon">
                                    {item.icon}
                                </span>
                                <span className="admin-sidebar-text">
                                    {t(item.key)}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <div className="admin-sidebar-footer">
                FingerprintPro © 2025
            </div>
        </aside>
    );
};

export default AdminSidebar;
