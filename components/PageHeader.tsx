import React from 'react';
import { useAppContext } from '../context/AppContext';

// 1. Interfaz de Props opcionales para el encabezado
interface PageHeaderProps {
  title?: string;                  // Título opcional que sobrescribe el predeterminado
  subtitle?: string;               // Subtítulo opcional
  actionComponent?: React.ReactNode; // Componente adicional a la derecha (ej. botones, selectores)
}

// 2. Componente genérico para íconos
const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="text-3xl mr-3 text-blue-500">{children}</span>
);

// 3. Componente principal PageHeader
const PageHeader = ({ 
    title: overrideTitle, 
    subtitle: overrideSubtitle, 
    actionComponent 
}: PageHeaderProps) => {
    
  const { activeNav, t, theme } = useAppContext();
  
  // 4. Normalizar la clave de navegación para traducciones
  const key = activeNav.toLowerCase().replace('á', 'a'); 
  
  // 5. Usar título y descripción de props si se pasan, sino traducción automática
  const title = overrideTitle || t(`views.${key}`);
  const description = overrideSubtitle || t(`views.${key}Desc`);

  // 6. Map de íconos para cada sección
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
      {/* Contenedor flex principal con espacio entre título/ícono y acción */}
      <div className="flex items-center justify-between">
        
        {/* Bloque izquierdo: ícono + título + descripción */}
        <div className="flex items-center">
          <Icon>{iconMap[activeNav as keyof typeof iconMap] || '🏠'}</Icon>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
          </div>
        </div>

        {/* Bloque derecho: renderiza un componente opcional de acción */}
        {actionComponent}
      </div>
    </header>
  );
};

export default PageHeader;
