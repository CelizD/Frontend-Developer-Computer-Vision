import React, { useState } from 'react';
// Importa el contexto global (métricas de aulas, setters, traducciones, etc.)
import { useAppContext } from '../../context/AppContext';
import { RoomMetric } from '../../types/global.d';
// Servicio de WebSocket para registrar eventos/logs
import { webSocketService } from '../../services/webSocketService';

const ManageRooms = () => {
  // Obtiene datos y funciones del contexto
  const { metrics, setMetrics, setEditingRoom, defaultSeats, t } = useAppContext();
  const [newRoomName, setNewRoomName] = useState(""); // Estado local para el nombre de nueva aula
  
  // Maneja la creación de una nueva aula
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() === "") return; // No permitir nombres vacíos

    const newRoom: RoomMetric = {
      room: newRoomName,
      occupied: 0,
      total: defaultSeats,
      percentage: 0,
      status: 'Online'
    };
    
    // Agrega la nueva aula a las métricas
    setMetrics(prevMetrics => [...prevMetrics, newRoom]);
    setNewRoomName(""); // Limpia el input
    // Log de evento mediante WebSocket
    webSocketService.addEvent('alert.roomAdded', { room: newRoomName }, 'info');
  };

  // Maneja la eliminación de un aula
  const handleDeleteRoom = (roomName: string) => {
    // Confirmación antes de eliminar
    if (window.confirm(t('settings.confirmDelete', { room: roomName }))) {
      setMetrics(prevMetrics => prevMetrics.filter(m => m.room !== roomName));
      // Log de evento mediante WebSocket
      webSocketService.addEvent('alert.roomDeleted', { room: roomName }, 'warn');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
      {/* Título del panel */}
      <h3 className="font-semibold mb-4 text-black dark:text-white">{t('settings.manage')}</h3>
      
      {/* Formulario para añadir nueva aula */}
      <form onSubmit={handleAddRoom} className="flex gap-2 mb-4">
        <input 
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder={t('settings.addPlaceholder')}
          className="flex-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
        />
        <button type="submit" className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">+</button>
      </form>

      {/* Lista de aulas actuales */}
      <h4 className="font-semibold mb-2 text-black dark:text-white">{t('settings.currentRooms')}</h4>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {metrics.map(room => (
          <div key={room.room} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
            <div>
              {/* Nombre del aula y número de asientos */}
              <span className="font-medium text-black dark:text-white">{room.room}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400"> ({room.total} {t('settings.seatsSuffix')})</span>
            </div>
            {/* Botones de editar y eliminar */}
            <div className="flex gap-2">
              <button onClick={() => setEditingRoom(room)} className="text-blue-500 hover:text-blue-400">✏️</button>
              <button onClick={() => handleDeleteRoom(room.room)} className="text-red-500 hover:text-red-400">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRooms;
