import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { UserProvider } from './context/UseProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <BrowserRouter>
      <StrictMode>
        <App />
        <Toaster position="top-right" reverseOrder={false} />
      </StrictMode>,
    </BrowserRouter>
  </UserProvider>
)
