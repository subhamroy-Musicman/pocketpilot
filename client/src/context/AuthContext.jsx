import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import i18n from '../i18n';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/me');
      setUser(res.data);
      if (res.data.language) i18n.changeLanguage(res.data.language);
      if (res.data.theme === 'light') {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    if (res.data.user.language) i18n.changeLanguage(res.data.user.language);
    if (res.data.user.theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  const register = async (name, email, password, user_type = 'student') => {
    await axios.post('http://localhost:5000/api/auth/register', { name, email, password, user_type });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updatePreferences = async (preferences) => {
    try {
      const res = await axios.put('http://localhost:5000/api/user/preferences', preferences);
      setUser(prev => ({ ...prev, ...res.data.updated }));
      if (preferences.language) i18n.changeLanguage(preferences.language);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
};
