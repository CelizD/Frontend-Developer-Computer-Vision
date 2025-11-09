import React from 'react';
// Importa el contexto de la aplicación para obtener el estado global
import { useAppContext } from '../../context/AppContext';
// Importa el tipo de rol de usuario
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
import NotFound from '../../views/NotFound'; // Componente que se muestra cuando no se encuentra la vista o hay error

// Función que determina el rol requerido para acceder a cada sección de la app
const getRequiredRole = (nav: string): UserRole => {
  if (nav === 'Ajustes') return 'admin'; // Solo admins pueden acceder a Ajustes
  if (nav === 'Analítica' || nav === 'Reportes') return 'operador'; // Operadores o admins pueden acceder
  return 'viewer'; // Por defecto cualquier usuario puede ver
};

const AppContent = () => {
  // Se obtiene la navegación activa y el rol del usuario desde el contexto global
  const { activeNav, userRole } = useAppContext();
  
  // Determina qué rol se requiere para la vista activa
  const requiredRole = getRequiredRole(activeNav);

  // Verifica si el usuario tiene permisos para ver la vista activa
  const isAllowed = userRole === 'admin' || 
    (userRole === 'operador' && requiredRole !== 'admin') || 
    (userRole === 'viewer' && requiredRole === 'viewer');

  // Mapeo de nombres de navegación a componentes de vista
  const ViewComponent = {
    'Dashboard': DashboardView,
    'Cámaras': CamerasView,
    'Analítica': Analytics,
    'Reportes': Reports,
    'Registro': Logs,
    'Ajustes': Settings,
    'Perfil': Profile,
    'Ayuda': Help,
  }[activeNav as keyof typeof ViewComponent]; // Selecciona el componente según la navegación activa

  // Si el usuario no tiene permisos, se muestra un mensaje de acceso denegado
  if (!isAllowed) {
    return <NotFound title="Acceso Denegado" description="No tienes permisos para ver esta página." />;
  }

  // Renderiza el componente correspondiente o un NotFound si no existe
  return ViewComponent ? <ViewComponent /> : <NotFound title="404" description="Página no encontrada" />;
};

export default AppContent;
