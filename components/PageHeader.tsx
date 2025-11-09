import React from 'react';
import { useAppContext } from '../context/AppContext';

// 1. Definición de la interfaz de Props
interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  actionComponent?: React.ReactNode;
}

// Un simple componente de ícono genérico
const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="text-3xl mr-3 text-blue-500">{children}</span>
);

// 2. El componente ahora acepta props opcionales
const PageHeader = ({ 
    title: overrideTitle, 
    subtitle: overrideSubtitle, 
    actionComponent 
}: PageHeaderProps) => {
    
  const { activeNav, t, theme } = useAppContext();
  
  // Normaliza la clave de navegación para la traducción (ej: 'Cámaras' -> 'cameras')
  const key = activeNav.toLowerCase().replace('á', 'a'); 
  
  // Usar override si está presente, sino usar la traducción automática
  const title = overrideTitle || t(`views.${key}`);
  const description = overrideSubtitle || t(`views.${key}Desc`);

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
      <div className="flex items-center justify-between"> {/* Agregado justify-between para el actionComponent */}
        <div className="flex items-center">
          <Icon>{iconMap[activeNav as keyof typeof iconMap] || '🏠'}</Icon>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
          </div>
        </div>
        {actionComponent} {/* Renderiza el componente de acción (ej. selector de sala) */}
      </div>
    </header>
  );
};

export default PageHeader;