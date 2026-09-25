import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Proactively clean up any conflicting or corrupted legacy service worker caches
if (typeof window !== 'undefined' && 'caches' in window) {
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key.includes('study-app-cache') || key.includes('v1')) {
        caches.delete(key).then(() => {
          console.log('[Cache Cleanup] Removido cache antigo:', key);
        });
      }
    });
  }).catch((err) => console.warn('Cache cleanup note:', err));
}

// Unregister legacy manual service workers if present
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const reg of registrations) {
      if (reg.active?.scriptURL && reg.active.scriptURL.includes('service-worker.js')) {
        reg.unregister().then(() => {
          console.log('[SW Cleanup] Desregistrado service-worker.js legado');
        });
      }
    }
  }).catch((err) => console.warn('SW cleanup note:', err));
}

// Safe PWA registration via VitePWA
try {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true });
  }).catch(() => {
    // Graceful fallback if virtual module is not available
  });
} catch (e) {
  console.warn('PWA register note:', e);
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
