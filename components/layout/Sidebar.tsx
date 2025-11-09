import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { NavItem } from '../../types/global.d'; // Importamos NavItem desde los tipos

const navItems: { name: NavItem; role: 'admin' | 'operador' | 'viewer' }[] = [
  { name: 'Dashboard', role: 'viewer' },
  { name: 'Cámaras', role: 'viewer' },
  { name: 'Analítica', role: 'operador' },
  { name: 'Reportes', role: 'operador' },
  { name: 'Registro', role: 'viewer' },
  { name: 'Ajustes', role: 'admin' },
];

const getRoleLevel = (role: string) => {
  if (role === 'admin') return 3;
  if (role === 'operador') return 2;
  return 1;
};

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const { 
    theme, t, activeNav, setActiveNav, userRole, username, 
    isSidebarOpen, setIsSidebarOpen 
  } = useAppContext();
  
  const currentRoleLevel = getRoleLevel(userRole || 'viewer');

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const requiredLevel = getRoleLevel(item.role);
    const isAllowed = currentRoleLevel >= requiredLevel;
    const isActive = activeNav === item.name;

    if (!isAllowed) return null;
    
    return (
      <li className="mb-2">
        <button
          onClick={() => { setActiveNav(item.name); setIsSidebarOpen(false); }}
          className={`w-full text-left flex items-center p-3 rounded-xl transition-all ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg'
              : theme === 'dark' 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          {/* Icono simulado (simplemente la primera letra o un emoji) */}
          <span className="mr-3 text-lg">{item.name[0]}</span>
          <span>{t(`sidebar.${item.name.toLowerCase().replace('á', 'a')}`)}</span>
        </button>
      </li>
    );
  };

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
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-blue-500">{t('sidebar.title')}</h2>
        <p className="text-sm font-light mt-1">{t('sidebar.subtitle')}</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {navItems.map(item => <NavLink key={item.name} item={item} />)}
        </ul>
      </nav>

      {/* Pie de página (Perfil y Logout) */}
      <div className={`pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div 
          onClick={() => setActiveNav('Perfil')}
          className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors mb-4 ${
            activeNav === 'Perfil' 
              ? 'bg-blue-600 text-white shadow-lg'
              : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
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