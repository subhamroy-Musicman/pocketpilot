import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login, register } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        <div className="flex-center" style={{ flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <img src="/logo.png" alt="PocketPilot Logo" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '16px', boxShadow: 'var(--shadow-glow)' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }} className="text-gradient">PocketPilot</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? t('welcome') : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <input
              className="input-premium"
              type="text"
              placeholder={t('name')}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          )}
          <input
            className="input-premium"
            type="email"
            placeholder={t('email')}
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            className="input-premium"
            type="password"
            placeholder={t('password')}
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit" className="btn-premium" style={{ marginTop: '8px' }}>
            {isLogin ? t('login') : t('register')}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button 
            className="btn-outline" 
            style={{ border: 'none' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
