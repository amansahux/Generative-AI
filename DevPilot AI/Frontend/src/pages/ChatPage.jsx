import React from 'react';

const ChatPage = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', color: 'white', background: 'var(--surface-container-low)' }}>
      {/* Sidebar Placeholder */}
      <div style={{ width: '280px', background: 'var(--canvas-sidebar)', borderRight: '1px solid var(--border-subtle)', padding: '20px' }}>
        <h2>DevPilot AI</h2>
      </div>
      
      {/* Main Chat Area Placeholder */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)' }}>Header</div>
        <div style={{ flex: 1, padding: '20px' }}>Chat Messages</div>
        <div style={{ padding: '20px', borderTop: '1px solid var(--border-subtle)' }}>Input Area</div>
      </div>
    </div>
  );
};

export default ChatPage;
