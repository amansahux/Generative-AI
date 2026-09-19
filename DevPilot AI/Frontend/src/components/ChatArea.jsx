import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Send, Code, Paperclip } from 'lucide-react';

const ChatArea = ({ activeSessionId, onNewSessionCreated }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeSessionId) {
      fetchHistory(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);

  const fetchHistory = async (id) => {
    try {
      const res = await chatAPI.getSessionHistory(id);
      if (res.data.success) {
        setMessages(res.data.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    scrollToBottom();

    try {
      const payload = { content: input };
      if (activeSessionId) {
        payload.sessionId = activeSessionId;
      }
      
      const res = await chatAPI.sendMessage(payload);
      
      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'ai', content: res.data.data }]);
        
        // If it was a new session, we need to notify parent to refresh sidebar
        if (!activeSessionId) {
          onNewSessionCreated();
        }
      }
    } catch (error) {
      console.error('Failed to send message', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-container-low)', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(26, 26, 46, 0.8)', backdropFilter: 'blur(12px)', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <h3 style={{ fontSize: '15px', fontWeight: '500' }}>DevPilot Workspace</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface-container)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary-container)' }}></div>
          DevPilot AI v2 (Fast • 128k)
        </div>
      </div>

      {/* Message Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '80px 32px 120px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {messages.length === 0 && !isTyping && (
          <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--glow-violet)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Code size={32} color="var(--primary-container)" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>How can I help you code today?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>I can help you refactor code, write tests, understand complex logic, or build entirely new features.</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '800px', padding: '0 32px' }}>
        <form onSubmit={handleSend} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <button type="button" style={{ color: 'var(--text-muted)' }}><Paperclip size={20} /></button>
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Ask DevPilot anything... (Press Enter to send)" 
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '15px', outline: 'none' }} 
          />
          <button type="submit" disabled={!input.trim() || isTyping} style={{ background: 'linear-gradient(90deg, #6C5CE7, #8E7CFF)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!input.trim() || isTyping) ? 0.5 : 1, transition: 'all 0.2s' }}>
            <Send size={18} style={{ marginLeft: '2px' }} />
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
          DevPilot AI can make mistakes. Verify critical code before production.
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
