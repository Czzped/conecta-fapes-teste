import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

// Roteamento por URL (react-router). O Dashboard deriva a tela atual do caminho
// (ver src/app/routing/paths.ts), então deep-link, refresh e voltar/avançar
// do navegador funcionam. O login segue em memória (protótipo, sem backend).
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(38, 38, 38, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontFamily: 'var(--font-family)'
          }
        }}
      />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
        />
        {/* O Dashboard atende todos os caminhos internos e resolve a tela pela URL. */}
        <Route
          path="/*"
          element={
            isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
