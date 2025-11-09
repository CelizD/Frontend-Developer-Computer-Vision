import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import PageHeader from '../components/PageHeader';

/**
 * Componente de Perfil de Usuario
 * Permite ver información básica y cambiar contraseña (simulado)
 */
const Profile = () => {
  const { userRole, username, t } = useAppContext();

  // Estados simulados de información de usuario
  const [fullName, setFullName] = useState("Admin User");
  const [email, setEmail] = useState("admin@institucion.com");

  // Traducción del rol
  const userRoleText = t(`sidebar.${userRole || 'viewer'}`);

  // Función simulada para actualizar información de usuario
  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('profile.updateInfo') + " (simulado)");
  };

  // Función simulada para actualizar contraseña
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('profile.updatePass') + " (simulado)");
  };

  return (
    <>
      <PageHeader />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información de Usuario */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="font-semibold mb-4 text-black dark:text-white text-xl">{t('profile.userInfo')}</h3>
          <form onSubmit={handleUpdateInfo} className="space-y-4">
            {/* Nombre de usuario */}
            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('profile.username')}</label>
              <p className="text-lg font-medium text-black dark:text-white">{username}</p>
            </div>

            {/* Rol de usuario */}
            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('profile.role')}</label>
              <p className="text-lg font-medium text-black dark:text-white">{userRoleText}</p>
            </div>

            {/* Nombre completo */}
            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <label htmlFor="profile-fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.fullName')}</label>
              <input 
                type="text" id="profile-fullname" value={fullName} 
                onChange={e => setFullName(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
              />
            </div>

            {/* Email */}
            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.email')}</label>
              <input 
                type="email" id="profile-email" value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
              />
            </div>

            {/* Botón de Guardar cambios */}
            <button type="submit" className="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">
              {t('profile.saveChanges')}
            </button>
          </form>
        </div>

        {/* Cambiar Contraseña */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="font-semibold mb-4 text-black dark:text-white text-xl">{t('profile.changePass')}</h3>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {/* Contraseña actual */}
            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <label htmlFor="profile-pass-current" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.currentPass')}</label>
              <input 
                type="password" id="profile-pass-current"
                className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
              />
            </div>

            {/* Nueva contraseña */}
            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <label htmlFor="profile-pass-new" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.newPass')}</label>
              <input 
                type="password" id="profile-pass-new"
                className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
              />
            </div>

            {/* Confirmar nueva contraseña */}
            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <label htmlFor="profile-pass-confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.confirmPass')}</label>
              <input 
                type="password" id="profile-pass-confirm"
                className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
              />
            </div>

            {/* Botón actualizar contraseña */}
            <button type="submit" className="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">
              {t('profile.updatePass')}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Profile;
