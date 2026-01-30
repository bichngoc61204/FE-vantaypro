import React from 'react';
import { FiHome, FiSmile } from 'react-icons/fi';
import { useLanguage } from '../../../../context/useLanguage';

const ParentDashboard = () => {
    const { t } = useLanguage();

    return (
        <div className="parent-dashboard">
            <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiHome /> {t('dashboard')}
            </h2>
            
            <div style={{ 
                background: 'var(--white)', 
                padding: '24px', 
                borderRadius: '12px', 
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'var(--primary-light)', 
                    color: 'var(--primary-color)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px'
                }}>
                    <FiSmile />
                </div>
                
            </div>
        </div>
    );
};

export default ParentDashboard;
