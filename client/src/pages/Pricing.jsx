import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

const Pricing = () => {
  const { user, updatePreferences } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleUpgrade = (plan) => {
    updatePreferences({ subscription_plan: plan });
    alert(`Successfully upgraded to ${plan} Plan!`);
  };

  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: '/forever',
      features: ['Basic AI Assistant', 'Up to 50 transactions/mo', 'Single currency'],
      color: 'var(--text-secondary)'
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: '/month',
      features: ['Proactive AI Warnings', 'Unlimited transactions', 'Multi-currency support', 'Basic Scheduled Payments'],
      color: 'var(--accent)'
    },
    {
      name: 'Enterprise',
      price: '$49.99',
      period: '/month',
      features: ['Everything in Premium', 'Dedicated Account Manager', 'Advanced API Access', 'Custom AI Models'],
      color: 'var(--danger)'
    }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '40px', maxWidth: '1200px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Upgrade Your Experience</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '8px' }}>
          Current Plan: <strong style={{ color: 'var(--text-primary)' }}>{user?.subscription_plan || 'Starter'}</strong>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {plans.map(plan => (
          <div key={plan.name} className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            {user?.subscription_plan === plan.name && (
              <div style={{ position: 'absolute', top: 0, right: 0, background: plan.color, color: 'white', padding: '4px 12px', borderBottomLeftRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                CURRENT
              </div>
            )}
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: plan.color }}>{plan.name}</h3>
            <div style={{ marginTop: '16px', marginBottom: '32px' }}>
              <span style={{ fontSize: '3rem', fontWeight: '800' }}>{plan.price}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{plan.period}</span>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
              {plan.features.map(feature => (
                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '0.95rem' }}>
                  <Check size={16} color={plan.color} />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button 
              className="btn-premium" 
              style={{ width: '100%', marginTop: '24px', background: user?.subscription_plan === plan.name ? 'var(--glass-border)' : plan.color }}
              disabled={user?.subscription_plan === plan.name}
              onClick={() => handleUpgrade(plan.name)}
            >
              {user?.subscription_plan === plan.name ? 'Active' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
