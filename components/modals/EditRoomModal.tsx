import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { RoomMetric } from '../../types/global.d';

interface EditRoomModalProps {
  room: RoomMetric;
  onClose: () => void;
  onSave: (room: RoomMetric) => void;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({ room, onClose, onSave }) => {
  const { theme, t } = useAppContext();
  
  const [name, setName] = useState(room.room);
  const [total, setTotal] = useState(room.total);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calcula el nuevo porcentaje y ocupación, asegurando que la ocupación no exceda el nuevo total
    const newTotal = total > 0 ? total : 1;
    const newOccupied = Math.min(room.occupied, newTotal);
    const newPercentage = Math.round((newOccupied / newTotal) * 100);
    
    onSave({
      ...room,
      room: name,
      total: newTotal,
      occupied: newOccupied, 
      percentage: newPercentage,
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-md p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}>
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">{t('editModal.title')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-room-name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('editModal.roomName')}</label>
            <input 
              type="text" id="edit-room-name" value={name} onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} text-black dark:text-white border`}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="edit-room-total" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('editModal.totalSeats')}</label>
            <input 
              type="number" id="edit-room-total" value={total} onChange={(e) => setTotal(Number(e.target.value))} min="1"
              className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} text-black dark:text-white border`}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-black dark:text-white">{t('editModal.cancel')}</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">{t('editModal.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomModal;