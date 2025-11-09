import React from 'react';

// Props del componente
type Props = {
  // Estado de la cámara; puede estar en inglés o español, o cualquier string genérico
  status?: 'Online' | 'Offline' | 'Alert' | 'LowLight' | 'Luz Baja' | string;
};

const CameraStatusIcon: React.FC<Props> = ({ status = 'Online' }) => {
  // Mapeo de estados a emojis de color
  const map: Record<string, string> = {
    Online: '🟢',       // Verde: cámara activa
    Offline: '⚫',      // Negro: cámara inactiva
    Alert: '🔴',        // Rojo: alerta
    LowLight: '🟡',     // Amarillo: poca luz
    'Luz Baja': '🟡',   // Alias en español para poca luz
  };

  // Renderiza el emoji correspondiente al estado, si no existe usa blanco ⚪
  return <span aria-label="camera-status">{map[status] ?? '⚪'}</span>;
};

export default CameraStatusIcon;
