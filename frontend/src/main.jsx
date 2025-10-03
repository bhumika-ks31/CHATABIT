import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/Store.js';

// Update this depending on your environment
export const serverUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://chatabit-backend1.onrender.com'; /

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
