import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import './i18n'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#e0e0e0',
            border: '1px solid #2a2a2a',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#1fc8db', secondary: '#0a0a0a' } },
          error: { iconTheme: { primary: '#ff4444', secondary: '#0a0a0a' } },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
