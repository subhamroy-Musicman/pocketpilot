import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import OmniAssistant from './components/OmniAssistant';
import { Toaster } from 'react-hot-toast';
import 'react-calendar/dist/Calendar.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  return children;
};

const AppContent = () => {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ display: 'flex' }}>
      {user && <Sidebar />}
      <div style={{ flex: 1, marginLeft: user ? '280px' : '0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </div>
        
        {/* Footbar */}
        <footer style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', background: 'var(--glass-bg)', backdropFilter: 'var(--blur)' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
            Made with <span style={{ color: '#ef4444' }}>❤</span> by Subham Roy
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            For any suggestion or doubt email - <a href="mailto:subhamroy5709@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>subhamroy5709@gmail.com</a>
          </p>
        </footer>
      </div>
      {user && <OmniAssistant />}
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' } }} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
