import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Plus, List, Target, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import Calendar from 'react-calendar';
import { isSameDay, format } from 'date-fns';
import toast from 'react-hot-toast';

// Professional Finance Palette: Deep Indigo, White/Slate-50, Amber, Slate Blue, Rose, Teal
const COLORS = ['#4f46e5', '#f8fafc', '#d97706', '#475569', '#e11d48', '#0d9488', 'rgba(148, 163, 184, 0.2)'];

const Dashboard = () => {
  const { user, updatePreferences } = useContext(AuthContext);
  const { t } = useTranslation();
  
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ amount: '', category: '', description: '' });
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(user?.monthly_budget || 0);

  const [accounts, setAccounts] = useState([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', type: 'Bank', balance: '' });

  const [aiInsights, setAiInsights] = useState("");
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const expRes = await axios.get('http://localhost:5000/api/expense');
      setExpenses(expRes.data);
      
      const currentMonthExpenses = expRes.data.filter(e => new Date(e.created_at).getMonth() === new Date().getMonth());
      const sum = currentMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
      setTotal(sum);

      const catRes = await axios.get('http://localhost:5000/api/expense/category-summary');
      setCategoryData(catRes.data);

      const accRes = await axios.get('http://localhost:5000/api/account');
      setAccounts(accRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      const unread = res.data.filter(n => !n.is_read);
      if (unread.length > 0) {
        unread.forEach(n => {
          toast(n.message, { icon: '⚠️', duration: 5000 });
        });
        await axios.put('http://localhost:5000/api/notifications/read-all');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const getAiInsights = async () => {
    setIsInsightsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/ai/insights');
      setAiInsights(res.data.insights);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI insights");
    } finally {
      setIsInsightsLoading(false);
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat(user.language, { style: 'currency', currency: user.currency || 'USD' }).format(amount);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/expense', {
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        description: newExpense.description
      });
      setNewExpense({ amount: '', category: '', description: '' });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/account', {
        name: newAccount.name,
        type: newAccount.type,
        balance: parseFloat(newAccount.balance) || 0
      });
      setNewAccount({ name: '', type: 'Bank', balance: '' });
      setShowAddAccount(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBudgetUpdate = () => {
    updatePreferences({ monthly_budget: budgetInput });
    setIsEditingBudget(false);
  };

  const handleClearData = async () => {
    if (window.confirm("Are you sure you want to clear all your expenses? This cannot be undone.")) {
      try {
        await axios.delete('http://localhost:5000/api/expense/clear');
        fetchData();
        alert("Dashboard cleared.");
      } catch (err) {
        console.error(err);
        alert("Failed to clear data.");
      }
    }
  };

  const budgetProgress = user?.monthly_budget ? Math.min((total / user.monthly_budget) * 100, 100) : 0;
  const isOverBudget = user?.monthly_budget && total > user.monthly_budget;

  // Calculate Remaining Budget for PieChart
  const pieData = [...categoryData];
  const budgetLimit = user?.monthly_budget || 0;
  if (budgetLimit > total) {
    pieData.push({ category: 'Remaining Budget', total: budgetLimit - total });
  }

  // Filter expenses based on selected calendar date
  const filteredExpenses = selectedDate 
    ? expenses.filter(e => isSameDay(new Date(e.created_at), selectedDate))
    : expenses;

  return (
    <div className="container animate-fade-in" style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px' }}>
      
      {/* Top Row: Budget & Total */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Total Card */}
        <div className="glass" style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '1.1rem' }}>This Month's Total</p>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold' }} className="text-gradient">
              {formatMoney(total)}
            </h2>
          </div>
          <div style={{ background: 'var(--glass-bg)', padding: '20px', borderRadius: '50%' }}>
            <TrendingUp size={48} color="var(--accent)" />
          </div>
        </div>

        {/* Budget Card */}
        <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={24} color="var(--accent)" />
              <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>Monthly Budget</span>
            </div>
            {isEditingBudget ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" className="input-premium" style={{ width: '100px', padding: '4px 8px' }} value={budgetInput} onChange={e => setBudgetInput(e.target.value)} />
                <button className="btn-premium" style={{ padding: '4px 12px' }} onClick={handleBudgetUpdate}>Save</button>
              </div>
            ) : (
              <button className="btn-outline" style={{ padding: '4px 12px', fontSize: '0.9rem' }} onClick={() => setIsEditingBudget(true)}>Edit</button>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span>{formatMoney(total)} spent</span>
            <span>{formatMoney(user?.monthly_budget || 0)} limit</span>
          </div>
          
          <div style={{ height: '12px', background: 'var(--glass-bg)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              background: isOverBudget ? 'var(--danger)' : 'var(--accent)', 
              width: `${budgetProgress}%`,
              transition: 'width 0.5s ease',
              boxShadow: isOverBudget ? '0 0 10px var(--danger)' : '0 0 10px var(--accent-glow)'
            }} />
          </div>

          {isOverBudget && (
            <p style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.9rem', fontWeight: 'bold', animation: 'fadeIn 0.5s infinite alternate' }}>
              <AlertTriangle size={16} /> Over Budget!
            </p>
          )}
        </div>
      </div>

      {/* AI Insights Widget */}
      <div className="glass" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>AI Savings Insights</h3>
          <button className="btn-premium" onClick={getAiInsights} disabled={isInsightsLoading}>
            {isInsightsLoading ? "Analyzing..." : "Generate Insights"}
          </button>
        </div>
        {aiInsights && (
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)', lineHeight: '1.6' }}>
            <div dangerouslySetInnerHTML={{ __html: aiInsights.replace(/\n/g, '<br/>') }} />
          </div>
        )}
      </div>

      {/* Accounts Widget */}
      <div className="glass" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>My Accounts</h3>
          <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.9rem' }} onClick={() => setShowAddAccount(!showAddAccount)}>
            <Plus size={16} /> Add Account
          </button>
        </div>
        
        {showAddAccount && (
          <form onSubmit={handleAddAccount} style={{ display: 'flex', gap: '12px', marginBottom: '24px', animation: 'fadeIn 0.3s' }}>
            <input className="input-premium" placeholder="Account Name (e.g. Chase)" value={newAccount.name} onChange={e => setNewAccount({...newAccount, name: e.target.value})} required />
            <select className="input-premium" value={newAccount.type} onChange={e => setNewAccount({...newAccount, type: e.target.value})}>
              <option value="Bank">Bank</option>
              <option value="Wallet">Wallet</option>
              <option value="Credit Card">Credit Card</option>
            </select>
            <input className="input-premium" type="number" placeholder="Balance" value={newAccount.balance} onChange={e => setNewAccount({...newAccount, balance: e.target.value})} />
            <button type="submit" className="btn-premium">Save</button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {accounts.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No accounts added yet.</p>
          ) : accounts.map(acc => (
            <div key={acc.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{acc.type}</p>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '4px 0' }}>{acc.name}</h4>
              <p style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>{formatMoney(acc.balance)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button className="btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleClearData}>
          Clear Data
        </button>
        <button className="btn-premium" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={20} />
          {t('addExpense')}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="glass animate-fade-in" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>{t('amount')}</label>
            <input className="input-premium" type="number" step="0.01" required value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>{t('category')}</label>
            <input className="input-premium" type="text" required value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>{t('description')}</label>
            <input className="input-premium" type="text" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
          </div>
          <button type="submit" className="btn-premium" style={{ height: '44px' }}>{t('save')}</button>
        </form>
      )}

      {/* Middle Row: Charts & Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Category Chart */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>{t('categoryBreakdown')}</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calendar */}
        <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', alignSelf: 'flex-start' }}>Expense Calendar</h3>
          <Calendar 
            onChange={setSelectedDate} 
            value={selectedDate}
            className="premium-calendar"
            tileClassName={({ date }) => {
              if (expenses.some(e => isSameDay(new Date(e.created_at), date))) return 'has-expense';
            }}
          />
          {selectedDate && (
            <button className="btn-outline" style={{ marginTop: '16px', alignSelf: 'flex-start' }} onClick={() => setSelectedDate(null)}>
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <List size={24} color="var(--accent)" />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {selectedDate ? `Transactions on ${format(selectedDate, 'MMM do, yyyy')}` : t('recentTransactions')}
          </h3>
        </div>
        
        {filteredExpenses.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>{t('noExpenses')}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredExpenses.map(exp => (
              <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <h4 style={{ fontWeight: '600', fontSize: '1.1rem' }}>{exp.category}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{exp.description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--danger)' }}>
                    -{formatMoney(exp.amount)}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {new Date(exp.created_at).toLocaleDateString(user.language)}
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

export default Dashboard;
