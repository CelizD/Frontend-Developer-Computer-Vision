import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './DashboardView.css';

const DashboardView: React.FC = () => {
  const { userRole, username } = useAppContext();

  return (
    <div className="dashboard-view">
      <div className="dashboard-header">
        <h1>Bienvenido, {username}!</h1>
        <p className="dashboard-subtitle">
          {userRole === 'admin' 
            ? 'Panel de control administrativo' 
            : userRole === 'teacher'
            ? 'Monitor de tus aulas'
            : 'Dashboard del estudiante'}
        </p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Tarjetas de métricas */}
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <h3>Aulas Activas</h3>
              <p className="metric-value">12</p>
              <small>+2 desde ayer</small>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h3>Estudiantes</h3>
              <p className="metric-value">345</p>
              <small>Total registrados</small>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">👁️</div>
            <div className="metric-content">
              <h3>Cámaras Activas</h3>
              <p className="metric-value">8</p>
              <small>3 requieren atención</small>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <h3>Uso del Sistema</h3>
              <p className="metric-value">94%</p>
              <small>Óptimo</small>
            </div>
          </div>
        </div>

        {/* Gráficos y más contenido */}
        <div className="dashboard-charts">
          <div className="chart-container">
            <h3>Actividad por Aula</h3>
            <div className="chart-placeholder">
              [Gráfico de actividad]
            </div>
          </div>
          
          <div className="chart-container">
            <h3>Alertas Recientes</h3>
            <div className="alert-list">
              <div className="alert-item">
                <span className="alert-icon">⚠️</span>
                <span className="alert-text">Cámara 3 - Sin conexión</span>
                <span className="alert-time">Hace 2h</span>
              </div>
              <div className="alert-item">
                <span className="alert-icon">👁️</span>
                <span className="alert-text">Detección de movimiento en Aula B</span>
                <span className="alert-time">Hace 4h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;