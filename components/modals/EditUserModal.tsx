import React, { useState } from 'react';
// Importa el contexto global de la app (tema y traducciones)
import { useAppContext } from '../../context/AppContext';
import { User } from '../../types/global.d'; // Tipo de usuario

// Props que recibe el modal
interface EditUserModalProps {
  user: User;                   // Usuario a editar
  onClose: () => void;           // Función para cerrar el modal
  onSave: (user: User) => void; // Función que guarda los cambios
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
  const { theme, t } = useAppContext(); // Tema (dark/light) y traducciones
  
  // Estado local para el rol editable del usuario
  const [role, setRole] = useState(user.role);

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Llama a onSave con el usuario actualizado (solo el rol es editable)
    onSave({ ...user, role });
  };

  return (
    // Fondo semi-transparente y centrado del modal
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Contenedor del modal */}
      <div className={`w-full max-w-md p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}>
        
        {/* Título del modal */}
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">{t('editUserModal.title')}</h2>

        {/* Formulario de edición */}
        <form onSubmit={handleSubmit}>

          {/* Campo para el nombre de usuario (solo lectura) */}
          <div className="mb-4">
            <label htmlFor="edit-user-name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              {t('editUserModal.username')}
            </label>
            <input 
              type="text" 
              id="edit-user-name" 
              value={user.username} 
              disabled
              className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-200 border-gray-300'} text-gray-500 dark:text-gray-400 border`}
            />
          </div>

          {/* Selector para el rol del usuario */}
          <div className="mb-6">
            <label htmlFor="edit-user-role" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              {t('editUserModal.role')}
            </label>
            <select 
              id="edit-user-role" 
              value={role} 
              onChange={(e) => setRole(e.target.value as User['role'])}
              className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} text-black dark:text-white border`}
            >
              <option value="admin">{t('sidebar.admin')}</option>
              <option value="operador">{t('sidebar.operator')}</option>
              <option value="viewer">{t('sidebar.viewer')}</option>
            </select>
          </div>

          {/* Botones Cancelar y Guardar */}
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-black dark:text-white"
            >
              {t('editModal.cancel')}
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white"
            >
              {t('editModal.save')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
