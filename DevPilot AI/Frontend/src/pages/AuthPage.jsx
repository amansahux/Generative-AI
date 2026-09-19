import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    let res;
    if (isLogin) {
      res = await login({ email: formData.email, password: formData.password });
    } else {
      res = await register(formData);
    }

    if (res.success) {
      navigate('/chat');
    } else {
      setError(res.error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--surface-container-lowest)' }}>
      {/* Left Half - Brand */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)', borderRight: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Rocket size={40} color="var(--primary-container)" />
          <h1 style={{ fontSize: '32px', fontWeight: '600' }}>DevPilot AI</h1>
        </div>
        <h2 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }}>Your AI-Powered<br/>Coding Companion</h2>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '40px' }}>Write better code, faster. Debug smarter. Ship with confidence.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {['🚀 AI Code Generation', '🛡️ Security Audits', '⚡ Instant Debugging'].map(feature => (
            <div key={feature} className="glass-panel" style={{ padding: '12px 20px', display: 'inline-flex', alignSelf: 'flex-start' }}>
              <span style={{ fontWeight: '500' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Half - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-container-low)' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--border-subtle)' }}>
            <button 
              onClick={() => {setIsLogin(true); setError('');}}
              style={{ paddingBottom: '12px', color: isLogin ? 'var(--text-primary)' : 'var(--text-muted)', borderBottom: isLogin ? '2px solid var(--primary-container)' : '2px solid transparent', fontWeight: isLogin ? '600' : '400' }}
            >
              Sign In
            </button>
            <button 
              onClick={() => {setIsLogin(false); setError('');}}
              style={{ paddingBottom: '12px', color: !isLogin ? 'var(--text-primary)' : 'var(--text-muted)', borderBottom: !isLogin ? '2px solid var(--primary-container)' : '2px solid transparent', fontWeight: !isLogin ? '600' : '400' }}
            >
              Create Account
            </button>
          </div>

          {error && <div style={{ backgroundColor: 'var(--error-container)', color: 'var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Full Name</label>
                <input required type="text" className="input-glass" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Alex Rivera" />
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Email Address</label>
              <input required type="email" className="input-glass" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="alex@example.com" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Password</label>
              <input required type="password" className="input-glass" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
            </div>
            
            <button type="submit" className="btn-primary" style={{ marginTop: '16px', padding: '14px' }} disabled={isLoading}>
              {isLoading ? 'Please wait...' : (isLogin ? 'Sign In to Workspace' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
