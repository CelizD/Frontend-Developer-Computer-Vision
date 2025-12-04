import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa tu app real
import './index.css';   // ¡Importa los estilos!

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);