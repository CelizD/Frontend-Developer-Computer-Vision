import React from 'react';
import { useAppContext, ViewType } from '../../context/AppContext';
import './Sidebar.css';

const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { 
    currentView, 
    setCurrentView, 
    user, 
    theme 
  } = useAppContext();

  // Definir las vistas disponibles
  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: '📊' },
    { id: 'cameras' as ViewType, label: 'Cámaras', icon: '📹' },
    { id: 'computer-vision' as ViewType, label: 'Computer Vision', icon: '👁️' },
    { id: 'settings' as ViewType, label: 'Configuración', icon: '⚙️' },
  ];

  // Si es admin, agregar vista de usuarios
  if (user?.role === 'admin') {
    menuItems.splice(3, 0, { id: 'users' as ViewType, label: 'Usuarios', icon: '👥' });
  }

  const handleNavigation = (viewId: ViewType) => {
    setCurrentView(viewId);
    // Cerrar sidebar en móvil si está abierto
    const mobileOverlay = document.querySelector('.mobile-overlay');
    if (mobileOverlay?.classList.contains('active')) {
      mobileOverlay.classList.remove('active');
    }
  };

  return (
    <aside className={`sidebar ${theme === 'dark' ? 'dark' : 'light'}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">📹</div>
        <h2>Cam IP System</h2>
        <p className="logo-subtitle">Frontend</p>
      </div>
      
      {/* Información del usuario */}
      <div className="user-info">
        <div className="user-avatar">
          {user?.role === 'admin' ? '👨‍💼' : '👤'}
        </div>
        <div className="user-details">
          <p className="username">{user?.username || 'Usuario'}</p>
          <p className="user-role">{user?.role || 'user'}</p>
          <p className="user-email">{user?.email || 'email@ejemplo.com'}</p>
        </div>
      </div>
      
      {/* Menú de navegación */}
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => handleNavigation(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {currentView === item.id && (
                  <span className="active-indicator"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Estadísticas rápidas */}
      <div className="sidebar-stats">
        <div className="stat-item">
          <span className="stat-label">Cámaras:</span>
          <span className="stat-value">0</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Online:</span>
          <span className="stat-value">0</span>
        </div>
      </div>
      
      {/* Footer del sidebar */}
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-btn">
          <span className="logout-icon">🚪</span>
          <span>Cerrar Sesión</span>
        </button>
        
        <div className="theme-toggle">
          <span className="theme-label">Tema {theme === 'dark' ? '🌙' : '☀️'}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;