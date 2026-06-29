import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Globe, DollarSign, Moon, Sun } from 'lucide-react';

const Settings = () => {
  const { user, updatePreferences } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleLanguageChange = (e) => {
    updatePreferences({ language: e.target.value });
  };

  const handleCurrencyChange = (e) => {
    updatePreferences({ currency: e.target.value });
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    updatePreferences({ theme: newTheme });
    if (newTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--accent)', padding: '12px', borderRadius: '12px' }}>
          <SettingsIcon size={32} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{t('settings')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage your account preferences</p>
        </div>
      </div>

      <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Language Preference */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={20} color="var(--accent)" /> {t('language')}
          </h3>
          <select 
            className="input-premium" 
            value={user?.language || 'en'} 
            onChange={handleLanguageChange}
            style={{ maxWidth: '400px' }}
          >
            <option value="en">English (US)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
            <option value="de">Deutsch (DE)</option>
            <option value="it">Italiano (IT)</option>
            <option value="pt">Português (PT)</option>
            <option value="hi">हिन्दी (IN)</option>
          </select>
        </div>

        {/* Currency Preference */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={20} color="var(--accent)" /> {t('currency')}
          </h3>
          <select 
            className="input-premium" 
            value={user?.currency || 'USD'} 
            onChange={handleCurrencyChange}
            style={{ maxWidth: '400px' }}
          >
            <option value="USD">US Dollar (USD $)</option>
            <option value="EUR">Euro (EUR €)</option>
            <option value="GBP">British Pound (GBP £)</option>
            <option value="INR">Indian Rupee (INR ₹)</option>
            <option value="JPY">Japanese Yen (JPY ¥)</option>
            <option value="CAD">Canadian Dollar (CAD $)</option>
            <option value="AUD">Australian Dollar (AUD $)</option>
            <option value="CNY">Chinese Yuan (CNY)</option>
            <option value="BRL">Brazilian Real (BRL)</option>
          </select>
        </div>

        {/* Theme Preference */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user?.theme === 'light' ? <Sun size={20} color="var(--accent)" /> : <Moon size={20} color="var(--accent)" />} Theme
          </h3>
          <select 
            className="input-premium" 
            value={user?.theme || 'dark'} 
            onChange={handleThemeChange}
            style={{ maxWidth: '400px' }}
          >
            <option value="dark">Dark Mode</option>
            <option value="light">Light Mode</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default Settings;
