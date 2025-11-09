import React from 'react';
import { useAppContext } from '../../context/AppContext';

const MobileHeader = () => {
  const { theme, t, activeNav, setIsSidebarOpen, handlePauseToggle, isPaused } = useAppContext();
  
  const formattedNav = t(`views.${activeNav.toLowerCase().replace('á', 'a')}`);

  return (
    <div className={`md:hidden flex items-center justify-between p-4 mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center">
        {/* Botón de Hamburguesa */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`p-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}
        >
          {/* Icono de hamburguesa simulado */}
          ☰
        </button>
        <h1 className={`text-xl font-bold ml-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {formattedNav}
        </h1>
      </div>

      {/* Botón de Pausa (solo en Dashboard) */}
      {activeNav === 'Dashboard' && (
        <button
          onClick={handlePauseToggle}
          className={`p-2 rounded-md font-semibold transition-colors text-sm
            ${isPaused 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'}
          `}
        >
          {isPaused ? t('dashboard.resume') : t('dashboard.pause')}
        </button>
      )}
    </div>
  );
};

export default MobileHeader;