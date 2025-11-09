import React from 'react';
import { useAppContext } from '../context/AppContext';

// Un simple componente de ícono genérico
const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="text-3xl mr-3 text-blue-500">{children}</span>
);

const PageHeader = () => {
  const { activeNav, t, theme } = useAppContext();
  
  // Normaliza la clave de navegación para la traducción (ej: 'Cámaras' -> 'cameras')
  const key = activeNav.toLowerCase().replace('á', 'a'); 
  
  const title = t(`views.${key}`);
  const description = t(`views.${key}Desc`);

  // Asignación de íconos simulados
  const iconMap = {
    'Dashboard': '📊',
    'Cámaras': '🎥',
    'Analítica': '📈',
    'Reportes': '📄',
    'Registro': '📜',
    'Ajustes': '⚙️',
    'Perfil': '👤',
    'Ayuda': '❓',
  };

  return (
    <header className={`mb-8 p-4 md:p-0 ${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'} md:border-none`}>
      <div className="flex items-center">
        <Icon>{iconMap[activeNav as keyof typeof iconMap] || '🏠'}</Icon>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;