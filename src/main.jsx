import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ClarezaDigital from './ClarezaDigital.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClarezaDigital />
  </StrictMode>,
)
