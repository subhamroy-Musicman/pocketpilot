import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Clock, Plus, ShieldCheck, ShieldAlert } from 'lucide-react';

const Schedule = () => {
  const { user, updatePreferences } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [pinInput, setPinInput] = useState('');
  const [showPinSetup, setShowPinSetup] = useState(!user?.has_pin);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/schedule');
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSetPin = () => {
    if (pinInput.length < 4) {
      alert("PIN must be at least 4 characters");
      return;
    }
    updatePreferences({ bank_pin: pinInput });
    setShowPinSetup(false);
    alert("Bank PIN successfully updated!");
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px', maxWidth: '1000px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Scheduled Payments</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Automate your bills and EMIs using Omni-AI.</p>
        </div>
        
        <div className="glass" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px', border: user?.has_pin ? '1px solid var(--accent)' : '1px solid var(--danger)' }}>
          {user?.has_pin ? <ShieldCheck color="var(--accent)" /> : <ShieldAlert color="var(--danger)" />}
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Bank PIN</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{user?.has_pin ? 'Configured & Secured' : 'Not Configured'}</p>
          </div>
          {!showPinSetup && <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem', marginLeft: '12px' }} onClick={() => setShowPinSetup(true)}>{user?.has_pin ? 'Update' : 'Setup'}</button>}
        </div>
      </div>

      {showPinSetup && (
        <div className="glass animate-fade-in" style={{ padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Enter 4-Digit Bank PIN for AI Automation</label>
            <input 
              type="password" 
              maxLength="4"
              className="input-premium" 
              value={pinInput} 
              onChange={e => setPinInput(e.target.value)} 
              placeholder="****"
            />
          </div>
          <button className="btn-premium" onClick={handleSetPin}>Save PIN</button>
          <button className="btn-outline" onClick={() => setShowPinSetup(false)}>Cancel</button>
        </div>
      )}

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color="var(--accent)" /> Upcoming Deductions
        </h3>

        {schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
            <p>No scheduled payments yet.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Ask Omni-AI: "Schedule my $50 internet bill for every month"</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {schedules.map(schedule => (
              <div key={schedule.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <h4 style={{ fontWeight: '600', fontSize: '1.1rem' }}>{schedule.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{schedule.category} • {schedule.frequency}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--danger)' }}>
                    -{schedule.amount} {user?.currency}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    Next: {schedule.next_date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Schedule;
