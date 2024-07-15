import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import { CssBaseline } from '@mui/material';
import { LanguageProvider } from './LanguageContext';
import './i18n';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
