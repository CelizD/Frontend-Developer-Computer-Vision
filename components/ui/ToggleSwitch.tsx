import React from 'react';

// Props del ToggleSwitch
interface ToggleSwitchProps {
  id: string;                       // ID único del toggle
  enabled: boolean;                  // Estado actual (on/off)
  setEnabled: (enabled: boolean) => void; // Función para cambiar el estado
}

// Componente funcional
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, enabled, setEnabled }) => (
  // Botón principal que actúa como interruptor
  <button 
    id={id} 
    onClick={() => setEnabled(!enabled)} // Invierte el estado al hacer clic
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
      enabled ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600' // Color según estado
    }`}
    role="switch"            // Accesibilidad ARIA
    aria-checked={enabled}   // Accesibilidad ARIA
  >
    {/* Texto oculto para lectores de pantalla */}
    <span className="sr-only">Toggle</span>

    {/* Circulo del toggle que se mueve */}
    <span 
      aria-hidden="true"
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0' // Movimiento según estado
      }`} 
    />
  </button>
);

export default ToggleSwitch;
