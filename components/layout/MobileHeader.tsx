import React from 'react';
// Importa el contexto global de la aplicación
import { useAppContext } from '../../context/AppContext';

const MobileHeader = () => {
  // Extrae del contexto el tema, traducciones, navegación activa y funciones de la app
  const { theme, t, activeNav, setIsSidebarOpen, handlePauseToggle, isPaused } = useAppContext();
  
  // Formatea el nombre de la vista activa para mostrarlo en el header, reemplazando acentos
  const formattedNav = t(`views.${activeNav.toLowerCase().replace('á', 'a')}`);

  return (
    // Contenedor principal del header en versión móvil (oculto en pantallas md y mayores)
    <div className={`md:hidden flex items-center justify-between p-4 mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      
      <div className="flex items-center">
        {/* Botón de menú hamburguesa para abrir el sidebar */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`p-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}
        >
          {/* Icono de hamburguesa simulado */}
          ☰
        </button>

        {/* Título de la vista activa */}
        <h1 className={`text-xl font-bold ml-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {formattedNav}
        </h1>
      </div>

      {/* Botón de Pausa/Continuar, solo visible en Dashboard */}
      {activeNav === 'Dashboard' && (
        <button
          onClick={handlePauseToggle} // Llama a la función para pausar o reanudar
          className={`p-2 rounded-md font-semibold transition-colors text-sm
            ${isPaused 
              ? 'bg-green-600 hover:bg-green-500 text-white' // Estilo si está pausado (resume)
              : 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'} // Estilo si está activo (pause)
          `}
        >
          {/* Texto dinámico según el estado de pausa */}
          {isPaused ? t('dashboard.resume') : t('dashboard.pause')}
        </button>
      )}
    </div>
  );
};

export default MobileHeader;
