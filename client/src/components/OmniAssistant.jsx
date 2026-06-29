import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Sparkles, Send, X, MessageSquare, Mic } from 'lucide-react';

const OmniAssistant = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev + " " + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/chat', { message: userMsg });
      
      let aiText = "";
      if (res.data.action === "ADD_EXPENSE") {
        aiText = `✅ Expense Added: ${res.data.expense.amount} for ${res.data.expense.category} (${res.data.expense.description})`;
        if (res.data.warning) {
          aiText += `\n\n⚠️ **AI Warning**: ${res.data.warning}`;
        }
        // We'd ideally want to trigger a dashboard refresh here. A global event or context function could do it.
        // For now, reloading the page is a simple trick, but the user can just hit refresh.
        // window.location.reload(); 
      } else if (res.data.action === "SCHEDULE_PAYMENT") {
        aiText = res.data.reply;
      } else {
        aiText = res.data.reply;
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't process that right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        className="glass"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: 'var(--accent)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5)',
          zIndex: 1000,
          border: 'none'
        }}
      >
        <Sparkles size={28} color="white" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="glass animate-fade-in" style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '350px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          background: 'rgba(20, 22, 28, 0.95)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '16px', background: 'var(--accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
              <MessageSquare size={20} />
              <span style={{ fontWeight: '600' }}>{t('aiInsights')}</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>
                <Sparkles size={40} style={{ margin: '0 auto', marginBottom: '16px', opacity: 0.5 }} />
                <p>Hello! I can log expenses for you or answer questions about your spending.</p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? 'var(--accent)' : 'var(--glass-bg)',
                padding: '10px 14px',
                borderRadius: '16px',
                maxWidth: '80%',
                border: m.role === 'user' ? 'none' : '1px solid var(--glass-border)'
              }}>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{m.text}</p>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--glass-bg)', padding: '10px 14px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.9rem' }}>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '8px' }}>
            <button 
              type="button"
              onClick={toggleListen}
              className={`btn-outline ${isListening ? 'pulse' : ''}`}
              style={{ padding: '0 12px', borderRadius: 'var(--radius-md)', borderColor: isListening ? 'var(--danger)' : 'var(--glass-border)', color: isListening ? 'var(--danger)' : 'var(--text-primary)' }}
              title="Voice Input"
            >
              <Mic size={18} />
            </button>
            <input 
              type="text" 
              className="input-premium"
              placeholder={t('askAi')}
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ flex: 1, background: 'rgba(0,0,0,0.3)' }}
            />
            <button type="submit" className="btn-premium" style={{ padding: '0 16px', borderRadius: 'var(--radius-md)' }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default OmniAssistant;
