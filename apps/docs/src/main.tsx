import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App';
import './styles/docs.css';
import './styles/susi-theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Hash routing, so the built site works on any static host without rewrites */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
