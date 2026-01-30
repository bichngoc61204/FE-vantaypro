import './ParentHeader.css';
import { FiGlobe, FiMoon, FiSun, FiUser, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../../../../../context/useTheme';
import { useLanguage } from '../../../../../context/useLanguage';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParentHeader = () => {
    const { theme, setLight, setDark } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();
    const [showDrp, setShowDrp] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowDrp(false);
        navigate('/');
    }

    return (
        <header className="parent-header">
            <div className="parent-header-left">
                <span className="parent-header-title">
                    {t('parentPortal')}
                </span>
            </div>

            <div className="parent-header-right">
                <div className="parent-header-user-wrapper">
                    <div 
                        className="parent-header-user"
                        onClick={() => setShowDrp(!showDrp)}
                        style={{ cursor: 'pointer' }}
                    >
                        <FiUser />
                        <span className="parent-header-user-name">{t('parent')}</span>
                    </div>

                    {showDrp && (
                        <div className="parent-header-dropdown">
                            {/* User Info */}
                            <div className="acc-user">
                                <span className="acc-name">{t('parent')}</span>
                                <span className="acc-mail">parent@example.com</span>
                            </div>

                            {/* Language Switcher */}
                            <div className="acc-section">
                                <span>{t('language')}</span>
                                <div className="lang-switcher" onClick={toggleLanguage}>
                                    <span>{language === 'en' ? 'English' : 'Tiếng Việt'}</span>
                                    <FiGlobe />
                                </div>
                            </div>

                            {/* Theme Mode Switcher */}
                            <div className="acc-section">
                                <span>{t('theme')}</span>
                                <div className="switcher">
                                    <button
                                        className={`switcher-item ${theme === 'light' ? 'active' : ''}`}
                                        onClick={setLight}
                                        aria-label="Light"
                                    >
                                        <FiSun />
                                    </button>
                                    <button
                                        className={`switcher-item ${theme === 'dark' ? 'active' : ''}`}
                                        onClick={setDark}
                                        aria-label="Dark"
                                    >
                                        <FiMoon />
                                    </button>
                                </div>
                            </div>

                            <div className="parent-header-dropdown-item" onClick={handleLogout} style={{ marginTop: '5px' }}>
                                <FiLogOut />
                                <span>{t('logout')}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};


export default ParentHeader;
