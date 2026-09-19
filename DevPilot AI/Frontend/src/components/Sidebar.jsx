import React, { useEffect, useState } from 'react';
import { Plus, Search, MessageSquare, Trash2, Settings, LogOut, Rocket } from 'lucide-react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeSessionId, onSelectSession, onNewSession }) => {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await chatAPI.getSessions();
      if (res.data.success) {
        setSessions(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch sessions', error);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await chatAPI.deleteSession(id);
      setSessions(sessions.filter(s => s._id !== id));
      if (activeSessionId === id) {
        onNewSession();
      }
    } catch (error) {
      console.error('Failed to delete session', error);
    }
  };

  const filteredSessions = sessions.filter(s => s.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ width: '280px', display: 'flex', flexDirection: 'column', background: 'var(--canvas-sidebar)', borderRight: '1px solid var(--border-subtle)' }}>
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Rocket color="var(--primary-container)" size={24} />
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600' }}>DevPilot AI</h2>
          <span style={{ fontSize: '11px', color: 'var(--primary)', padding: '2px 6px', background: 'var(--glow-violet)', borderRadius: '4px' }}>Pro Workspace</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '0 20px 20px' }}>
        <button onClick={onNewSession} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <Plus size={18} /> New Chat
        </button>
        
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', background: 'var(--surface-container-lowest)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px 8px 36px', color: 'white', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Session List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
        {filteredSessions.map(session => (
          <div 
            key={session._id}
            onClick={() => onSelectSession(session._id)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
              background: activeSessionId === session._id ? 'var(--glow-violet)' : 'transparent',
              borderLeft: activeSessionId === session._id ? '2px solid var(--primary-container)' : '2px solid transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
              <MessageSquare size={16} color="var(--text-muted)" />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.title || 'New Chat'}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(session.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
            <button onClick={(e) => handleDelete(e, session._id)} style={{ color: 'var(--text-muted)', display: 'flex' }} title="Delete chat">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div style={{ padding: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500' }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Online</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ color: 'var(--text-muted)' }}><Settings size={18} /></button>
          <button onClick={logout} style={{ color: 'var(--text-muted)' }}><LogOut size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
