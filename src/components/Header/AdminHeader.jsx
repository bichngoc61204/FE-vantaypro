import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import useTranslation from '../../hooks/useTranslation';
import './AdminHeader.css';

const AdminHeader = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useContext(ThemeContext);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    return (
        <header className="admin-header">
            <div className="admin-header-actions">
                {/* Theme Toggle */}
                <button 
                    className="admin-header-btn theme-toggle" 
                    onClick={toggleTheme}
                    title={theme === 'dark' ? t('admin.header.theme_light') : t('admin.header.theme_dark')}
                >
                    {theme === 'dark' ? (
                        <svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
                    ) : (
                        <svg viewBox="0 0 24 24"><path d="M21.096 15.181a1.002 1.002 0 011.666.974A11.966 11.966 0 0112 24c-6.627 0-12-5.373-12-12S5.373 0 12 0c2.756 0 5.297.93 7.354 2.493a1 1 0 01-1.22 1.58A9.973 9.973 0 0012 2C6.477 2 2 6.477 2 12s4.477 10 10 10c4.136 0 7.689-2.508 9.096-6.181a9.982 9.982 0 000-0.638z"/></svg>
                    )}
                </button>

                {/* Language Switcher */}
                <button 
                    className="admin-header-btn lang-switcher" 
                    onClick={toggleLanguage}
                    title="Switch Language"
                >
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                        {i18n.language.toUpperCase()}
                    </span>
                </button>

                {/* User Profile */}
                <div className="admin-header-user">
                    <div className="admin-header-avatar">A</div>
                    <div className="admin-header-info">
                        <span className="admin-header-name">Admin User</span>
                        <span className="admin-header-role">Administrator</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
