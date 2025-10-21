import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Este archivo solamente monta la aplicación principal en la página.
const rootElement = document.getElementById('root')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
