import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { User } from '../../types/global.d';
import { webSocketService } from '../../services/webSocketService'; // Importamos el servicio de log

const ManageUsers = () => {
  const { users, setUsers, setEditingUser, username: currentUsername, t } = useAppContext();
  
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<'operador' | 'viewer'>('viewer');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) return;

    if (users.find(u => u.username === newUsername)) {
      alert(t('alert.userExists', { username: newUsername }));
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username: newUsername,
      password: newPassword,
      role: newRole,
    };
    setUsers(prev => [...prev, newUser]);
    setNewUsername("");
    setNewPassword("");
    // Log de evento
    webSocketService.addEvent('alert.userAdded', { username: newUsername }, 'info');
  };

  const handleDeleteUser = (userToDelete: User) => {
    if (userToDelete.username === currentUsername) {
      alert(t('alert.cannotDeleteSelf'));
      return;
    }
    if (window.confirm(t('settings.confirmDelete', { room: userToDelete.username }))) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      // Log de evento
      webSocketService.addEvent('alert.userDeleted', { username: userToDelete.username }, 'warn');
    }
  };

  return (
    <>
      <h3 className="font-semibold mb-4 text-black dark:text-white">{t('settings.manageUsers')}</h3>
      
      {/* Formulario para Añadir Usuario */}
      <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.username')}</label>
          <input 
            type="text" value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.password')}</label>
          <input 
            type="password" value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.role')}</label>
          <select 
            value={newRole} 
            onChange={(e) => setNewRole(e.target.value as any)}
            className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
          >
            <option value="operador">{t('sidebar.operator')}</option>
            <option value="viewer">{t('sidebar.viewer')}</option>
          </select>
        </div>
        <div className="md:col-span-4">
          <button type="submit" className="w-full px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">
            {t('settings.addUser')}
          </button>
        </div>
      </form>

      {/* Lista de Usuarios Actuales */}
      <h4 className="font-semibold mb-2 text-black dark:text-white">{t('settings.userList')}</h4>
      <div className="max-h-64 overflow-y-auto space-y-2">
        {users.map(user => (
          <div key={user.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
            <div>
              <span className="font-medium text-black dark:text-white">{user.username}</span>
              <span className={`text-sm ml-2 px-2 py-0.5 rounded-full ${
                user.role === 'admin' ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200' :
                user.role === 'operador' ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200' :
                'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {t(`sidebar.${user.role}`)}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingUser(user)} className="text-blue-500 hover:text-blue-400">✏️</button>
              <button onClick={() => handleDeleteUser(user)} className="text-red-500 hover:text-red-400" disabled={user.username === currentUsername}>
                {user.username === currentUsername ? '🔒' : '🗑️'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ManageUsers;