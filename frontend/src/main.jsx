import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#f9fafb',
          fontSize: '14px',
          borderRadius: '10px',
        },
        success: {
          iconTheme: {
            primary: '#6366f1',
            secondary: '#f9fafb',
          },
        },
      }}
    />
  </React.StrictMode>
)