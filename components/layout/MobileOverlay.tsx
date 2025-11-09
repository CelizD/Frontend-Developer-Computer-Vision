import React from 'react';
// Importa el contexto global de la app para controlar el estado del sidebar
import { useAppContext } from '../../context/AppContext';

const MobileOverlay = () => {
  // Extrae del contexto si el sidebar está abierto y la función para cerrarlo
  const { isSidebarOpen, setIsSidebarOpen } = useAppContext();

  return (
    // Overlay que aparece cuando el sidebar móvil está abierto
    <div
      className={`
        fixed inset-0           // Ocupa toda la pantalla
        bg-black bg-opacity-50  // Fondo semitransparente negro
        z-30                    // Coloca el overlay sobre otros elementos
        transition-opacity duration-300 // Animación de aparición/desaparición
        md:hidden               // Solo visible en pantallas pequeñas (mobile)
        ${isSidebarOpen 
          ? 'opacity-100 pointer-events-auto'  // Visible y clickeable
          : 'opacity-0 pointer-events-none'}   // Invisible e ignorado por clics
      `}
      // Al hacer click en el overlay, cierra el sidebar
      onClick={() => setIsSidebarOpen(false)}
    />
  );
};

export default MobileOverlay;
