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
      <div style={{ flex: 1, marginLeft: user ? '280px' : '0', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
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
