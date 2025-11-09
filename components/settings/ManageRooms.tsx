import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { RoomMetric } from '../../types/global.d';
import { webSocketService } from '../../services/webSocketService'; // Importamos el servicio de log

const ManageRooms = () => {
  const { metrics, setMetrics, setEditingRoom, defaultSeats, t } = useAppContext();
  const [newRoomName, setNewRoomName] = useState("");
  
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() === "") return;
    
    const newRoom: RoomMetric = {
      room: newRoomName, occupied: 0, total: defaultSeats, percentage: 0, status: 'Online'
    };
    setMetrics(prevMetrics => [...prevMetrics, newRoom]);
    setNewRoomName("");
    // Log de evento
    webSocketService.addEvent('alert.roomAdded', { room: newRoomName }, 'info');
  };

  const handleDeleteRoom = (roomName: string) => {
    if (window.confirm(t('settings.confirmDelete', { room: roomName }))) {
      setMetrics(prevMetrics => prevMetrics.filter(m => m.room !== roomName));
      // Log de evento
      webSocketService.addEvent('alert.roomDeleted', { room: roomName }, 'warn');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-4 text-black dark:text-white">{t('settings.manage')}</h3>
      
      {/* Formulario para Añadir Aula */}
      <form onSubmit={handleAddRoom} className="flex gap-2 mb-4">
        <input 
          type="text" value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder={t('settings.addPlaceholder')}
          className="flex-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
        />
        <button type="submit" className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">+</button>
      </form>

      {/* Lista de Aulas Actuales */}
      <h4 className="font-semibold mb-2 text-black dark:text-white">{t('settings.currentRooms')}</h4>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {metrics.map(room => (
          <div key={room.room} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
            <div>
              <span className="font-medium text-black dark:text-white">{room.room}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400"> ({room.total} {t('settings.seatsSuffix')})</span>
            </div>
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