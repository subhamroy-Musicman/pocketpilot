import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Clock, Zap, Settings as SettingsIcon } from 'lucide-react';

const Sidebar = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: isActive ? 'var(--accent-glow)' : 'transparent',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-primary)',
      fontWeight: '500',
      textDecoration: 'none',
      transition: 'background 0.2s'
    };
  };

  return (
    <div className="sidebar glass" style={{ width: '280px', height: '100vh', padding: '24px', display: 'flex', flexDirection: 'column', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none', position: 'fixed', left: 0, top: 0 }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <img src="/logo.png" alt="PocketPilot Logo" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="text-gradient">PocketPilot</h1>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link to="/dashboard" style={getLinkStyle('/dashboard')}>
          <LayoutDashboard size={20} />
          {t('dashboard')}
        </Link>
        <Link to="/schedule" style={getLinkStyle('/schedule')}>
          <Clock size={20} />
          Schedule
        </Link>
        <Link to="/pricing" style={getLinkStyle('/pricing')}>
          <Zap size={20} />
          Upgrade Plan
        </Link>
        <Link to="/settings" style={getLinkStyle('/settings')}>
          <SettingsIcon size={20} />
          {t('settings')}
        </Link>
      </nav>

      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.name}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{user?.subscription_plan || 'Starter'} Plan</p>
          </div>
        </div>

        <button className="btn-outline" onClick={logout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
          <LogOut size={18} />
          {t('logout')}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
