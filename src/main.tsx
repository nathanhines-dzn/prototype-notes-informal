import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrototypeProvider } from './context/PrototypeContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <PrototypeProvider>
        <App />
      </PrototypeProvider>
    </ToastProvider>
  </StrictMode>,
)
