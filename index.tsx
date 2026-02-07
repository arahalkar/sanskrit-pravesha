
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Safe start
window.addEventListener('error', (event) => {
  console.error('Samskrita Global Error:', event.error);
});

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
