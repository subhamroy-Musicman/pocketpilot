import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Settings, Wallet } from 'lucide-react';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout, updatePreferences } = useContext(AuthContext);

  const handleLanguageChange = (e) => {
    updatePreferences({ language: e.target.value });
  };

  const handleCurrencyChange = (e) => {
    updatePreferences({ currency: e.target.value });
  };

  return (
    <nav className="glass" style={{ margin: '20px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'var(--accent)', padding: '8px', borderRadius: '12px' }}>
          <Wallet size={24} color="white" />
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }} className="text-gradient">PocketPilot</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select className="input-premium" value={user?.language || 'en'} onChange={handleLanguageChange} style={{ padding: '8px', width: 'auto' }}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
          <select className="input-premium" value={user?.currency || 'USD'} onChange={handleCurrencyChange} style={{ padding: '8px', width: 'auto' }}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--glass-border)', paddingLeft: '20px' }}>
          <span>{user?.name}</span>
          <button onClick={logout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
            <LogOut size={16} />
            {t('logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
