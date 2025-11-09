import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

// Componente Toast que se muestra en la esquina superior derecha
const Toast = () => {
  // Se obtiene del contexto: tema actual, función de traducción, y el último evento
  const { theme, t, lastEvent } = useAppContext();
  
  // Determina si el toast debe mostrarse (si hay un último evento)
  const isVisible = !!lastEvent;
  
  // Calcula colores e icono según el nivel del evento
  const toastClasses = useMemo(() => {
    if (!lastEvent) return { color: '', icon: '' };

    switch (lastEvent.level) {
      case 'alert':
        return { 
          color: 'bg-red-600 border-red-800', // Fondo y borde rojo para alertas
          icon: '🚨' // Icono de alerta
        };
      case 'warn':
        return { 
          color: 'bg-yellow-500 border-yellow-700', // Fondo y borde amarillo para advertencias
          icon: '⚠️' // Icono de advertencia
        };
      case 'info':
      default:
        return { 
          color: 'bg-blue-500 border-blue-700', // Fondo y borde azul para información
          icon: '💡' // Icono informativo
        };
    }
  }, [lastEvent]); // Se recalcula solo cuando cambia lastEvent

  // Si no hay evento, no renderiza nada
  if (!lastEvent) return null;

  // Función para reemplazar placeholders en el mensaje con valores concretos
  const interpolate = (messageKey: string, args: Record<string, string> | undefined) => {
    let message = t(messageKey); // Obtiene la traducción
    if (args) {
      Object.keys(args).forEach(key => {
        message = message.replace(`{${key}}`, args[key]); // Reemplaza {key} con el valor
      });
    }
    return message;
  };

  // Aplica interpolación al mensaje del evento
  const messageText = interpolate(lastEvent.messageKey, lastEvent.messageArgs);

  return (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-500 max-w-sm w-full shadow-2xl rounded-xl
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} // Animación de entrada/salida
        ${toastClasses.color} text-white border-2 p-4
      `}
      role="alert" // Accesibilidad: anuncia el Toast a lectores de pantalla
    >
      <div className="flex items-start">
        {/* Icono según nivel del evento */}
        <span className="text-2xl mr-3">{toastClasses.icon}</span>

        {/* Contenido del Toast */}
        <div>
          {/* Título del nivel (alert, warn, info) */}
          <p className="font-bold text-lg mb-1">{t(`level.${lastEvent.level}`)}</p>
          
          {/* Mensaje interpolado */}
          <p className="text-sm">{messageText}</p>
          
          {/* Timestamp del evento */}
          <p className="text-xs mt-1 opacity-75">{lastEvent.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;