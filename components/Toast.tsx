import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

// Componente Toast que se muestra en la esquina superior derecha
const Toast = () => {
  const { theme, t, lastEvent } = useAppContext();
  
  const isVisible = !!lastEvent;
  
  // Determinar estilos basados en el nivel del evento
  const toastClasses = useMemo(() => {
    if (!lastEvent) return { color: '', icon: '' };

    switch (lastEvent.level) {
      case 'alert':
        return { 
          color: 'bg-red-600 border-red-800', 
          icon: '🚨' 
        };
      case 'warn':
        return { 
          color: 'bg-yellow-500 border-yellow-700', 
          icon: '⚠️' 
        };
      case 'info':
      default:
        return { 
          color: 'bg-blue-500 border-blue-700', 
          icon: '💡' 
        };
    }
  }, [lastEvent]);

  if (!lastEvent) return null;

  // Función de interpolación simple (similar a la usada en i18n)
  const interpolate = (messageKey: string, args: Record<string, string> | undefined) => {
    let message = t(messageKey);
    if (args) {
      Object.keys(args).forEach(key => {
        message = message.replace(`{${key}}`, args[key]);
      });
    }
    return message;
  };

  const messageText = interpolate(lastEvent.messageKey, lastEvent.messageArgs);

  return (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-500 max-w-sm w-full shadow-2xl rounded-xl
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        ${toastClasses.color} text-white border-2 p-4
      `}
    >
      <div className="flex items-start">
        <span className="text-2xl mr-3">{toastClasses.icon}</span>
        <div>
          <p className="font-bold text-lg mb-1">{t(`level.${lastEvent.level}`)}</p>
          <p className="text-sm">{messageText}</p>
          <p className="text-xs mt-1 opacity-75">{lastEvent.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;