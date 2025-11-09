import React from 'react';
// Importa el contexto global para acceder a estado y funciones
import { useAppContext } from '../../context/AppContext';
import { NavItem } from '../../types/global.d'; // Tipos de navegación

// Definición de los items de navegación y el rol mínimo requerido para acceder
const navItems: { name: NavItem; role: 'admin' | 'operador' | 'viewer' }[] = [
  { name: 'Dashboard', role: 'viewer' },
  { name: 'Cámaras', role: 'viewer' },
  { name: 'Analítica', role: 'operador' },
  { name: 'Reportes', role: 'operador' },
  { name: 'Registro', role: 'viewer' },
  { name: 'Ajustes', role: 'admin' },
];

// Función para asignar un "nivel" a cada rol para comparación más fácil
const getRoleLevel = (role: string) => {
  if (role === 'admin') return 3;
  if (role === 'operador') return 2;
  return 1; // viewer
};

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  // Extrae del contexto: tema, traducciones, navegación activa, rol de usuario, etc.
  const { 
    theme, t, activeNav, setActiveNav, userRole, username, 
    isSidebarOpen, setIsSidebarOpen 
  } = useAppContext();
  
  // Nivel del rol actual del usuario
  const currentRoleLevel = getRoleLevel(userRole || 'viewer');

  // Componente interno para renderizar cada item de navegación
  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const requiredLevel = getRoleLevel(item.role); // Nivel requerido para este item
    const isAllowed = currentRoleLevel >= requiredLevel; // Verifica si el usuario puede acceder
    const isActive = activeNav === item.name; // Verifica si es la sección activa

    if (!isAllowed) return null; // No mostrar si no tiene permiso
    
    return (
      <li className="mb-2">
        <button
          onClick={() => { setActiveNav(item.name); setIsSidebarOpen(false); }} // Cambia la vista y cierra sidebar en móvil
          className={`w-full text-left flex items-center p-3 rounded-xl transition-all ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg' // Estilo si es activo
              : theme === 'dark' 
                ? 'text-gray-300 hover:bg-gray-700' // Estilo en modo oscuro
                : 'text-gray-700 hover:bg-gray-200' // Estilo en modo claro
          }`}
        >
          {/* Icono simulado con la primera letra */}
          <span className="mr-3 text-lg">{item.name[0]}</span>
          <span>{t(`sidebar.${item.name.toLowerCase().replace('á', 'a')}`)}</span>
        </button>
      </li>
    );
  };

  // Texto del rol del usuario traducido
  const roleText = t(`sidebar.${userRole || 'viewer'}`);

  return (
    <div 
      className={`
        fixed md:relative z-40 md:z-auto 
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        w-64 p-6 flex flex-col transition-transform duration-300
        ${theme === 'dark' ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'}
        h-full md:h-screen
      `}
    >
      {/* Encabezado del Sidebar */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-blue-500">{t('sidebar.title')}</h2>
        <p className="text-sm font-light mt-1">{t('sidebar.subtitle')}</p>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {navItems.map(item => <NavLink key={item.name} item={item} />)}
        </ul>
      </nav>

      {/* Pie de página con perfil y botón de logout */}
      <div className={`pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* Perfil de usuario */}
        <div 
          onClick={() => setActiveNav('Perfil')} // Navega a Perfil
          className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors mb-4 ${
            activeNav === 'Perfil' 
              ? 'bg-blue-600 text-white shadow-lg'
              : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          {/* Avatar con inicial */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-3 
            ${activeNav === 'Perfil' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}
          `}>
            {username ? username[0].toUpperCase() : 'U'}
          </div>
          <div>
            <p className="font-semibold text-sm">{username}</p>
            <p className="text-xs opacity-75">{roleText}</p>
          </div>
        </div>

        {/* Botón de Logout */}
        <button
          onClick={onLogout}
          className={`w-full p-3 rounded-xl font-semibold transition-colors 
            ${theme === 'dark' ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}
          `}
        >
          {t('sidebar.logout')}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
