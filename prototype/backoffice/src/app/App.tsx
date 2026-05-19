import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
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
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </>
  );
}
