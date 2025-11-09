import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types/global.d';

// NOTA: Asumimos que las Vistas ya están o se moverán a src/views/
import DashboardView from '../../views/DashboardView';
import CamerasView from '../../views/CamarasView';
import Analytics from '../../views/Analytics';
import Reports from '../../views/Reportes';
import Logs from '../../views/Logs';
import Settings from '../../views/Settings';
import Profile from '../../views/Profile';
import Help from '../../views/Help';
import NotFound from '../../views/NotFound'; // Componente de fallback

const getRequiredRole = (nav: string): UserRole => {
  if (nav === 'Ajustes') return 'admin';
  if (nav === 'Analítica' || nav === 'Reportes') return 'operador';
  return 'viewer';
};

const AppContent = () => {
  const { activeNav, userRole } = useAppContext();
  
  const requiredRole = getRequiredRole(activeNav);
  const isAllowed = userRole === 'admin' || 
    (userRole === 'operador' && requiredRole !== 'admin') || 
    (userRole === 'viewer' && requiredRole === 'viewer');

  // Mapa de Navegación
	const ViewComponent = {
		'Dashboard': DashboardView,
		'Cámaras': CamerasView,
		'Analítica': Analytics,
		'Reportes': Reports,
		'Registro': Logs,
		'Ajustes': Settings,
		'Perfil': Profile,
		'Ayuda': Help,
	}[activeNav as keyof typeof ViewComponent];

  if (!isAllowed) {
    return <NotFound title="Acceso Denegado" description="No tienes permisos para ver esta página." />;
  }

  return ViewComponent ? <ViewComponent /> : <NotFound title="404" description="Página no encontrada" />;
};

export default AppContent;