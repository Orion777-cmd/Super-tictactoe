import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TicTacToeProvider } from './state/tictactoeContext.tsx'
import { AuthProvider } from './state/authContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <TicTacToeProvider>
        <App />
      </TicTacToeProvider>
    </AuthProvider>

  </React.StrictMode>,
)
