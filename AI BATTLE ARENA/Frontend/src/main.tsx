import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/app.css'
import App from './app/App.tsx'
import { ChatProvider } from './features/chatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </StrictMode>,
)
