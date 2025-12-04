import React from 'react';
import { useAppContext } from '../../context/AppContext';

// Importa todas tus vistas
import DashboardView from '../../views/DashboardView';
import CamarasView from '../../views/CamarasView';
import Analytics from '../../views/Analytics';
import Reportes from '../../views/Reportes';
import RegistroView from '../../views/RegistroView';
import Settings from '../../views/Settings';
import Profile from '../../views/Profile';
import Help from '../../views/Help';
import NotFound from '../../views/NotFound'; // Importa NotFound por si acaso

// Este objeto mapea el nombre de la vista (del estado) al componente
const views = {
  'Dashboard': DashboardView,
  'Cámaras': CamarasView,
  'Analítica': Analytics,
  'Reportes': Reportes,
  'Registro': RegistroView,
  'Ajustes': Settings,
  'Perfil': Profile,
  'Ayuda': Help,
};

// --- INICIO DE LA SOLUCIÓN ---
// 1. Crea un tipo dinámico a partir de las llaves (keys) del objeto 'views'
type ViewKey = keyof typeof views;
// --- FIN DE LA SOLUCIÓN ---

const AppContent: React.FC = () => {
  const { currentView } = useAppContext();

  // --- INICIO DE LA SOLUCIÓN ---
  // 2. Asegura a TypeScript que 'currentView' es una de esas llaves
  const componentKey = currentView as ViewKey;
  // --- FIN DE LA SOLUCIÓN ---

  // 3. Usa la llave 'segura' para buscar el componente
  const ComponentToRender = views[componentKey];

  if (!ComponentToRender) {
    // Si la llave no existe, muestra un componente NotFound
    return (
      <main className="app-content">
        <NotFound />
      </main>
    );
  }

  return (
    <main className="app-content">
      <ComponentToRender />
    </main>
  );
};

export default AppContent;