import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/app/App';
import '@/styles/index.css';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Force rebuild - v2
ReactDOM.createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);