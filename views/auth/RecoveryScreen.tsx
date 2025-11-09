import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext'; // Importar contexto para acceder al estado global
import { webSocketService } from '../../services/webSocketService'; // Servicio para logs de eventos simulados

const RecoveryScreen = ({ onShowLogin }: { onShowLogin: () => void }) => {
  // Extraer del contexto: tema, traducciones, lista de usuarios y función para actualizar usuarios
  const { theme, t, users, setUsers } = useAppContext();
  
  // Estados locales para manejar pasos del flujo, inputs y mensajes
  const [step, setStep] = useState(1); // Paso 1: solicitar código, Paso 2: restablecer contraseña
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Mensaje de error
  const [success, setSuccess] = useState<string | null>(null); // Mensaje de éxito

  // Maneja la solicitud de código de recuperación (Paso 1)
  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    const userExists = users.find(u => u.username === username); // Verificar si existe el usuario
    if (userExists) {
      setStep(2); // Avanzar al paso 2
      setError(null); // Limpiar errores
      // Simular envío de código de recuperación mediante un log
      webSocketService.addEvent('alert.systemInfo', { room: username }, 'info'); 
    } else {
      setError(t('alert.userNotFound')); // Mostrar error si no existe el usuario
    }
  };

  // Maneja el restablecimiento de contraseña (Paso 2)
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validación simulada del código y coincidencia de contraseñas
    if (code !== '12345') { // Código hardcodeado
      setError(t('alert.invalidCode'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('alert.passwordMismatch'));
      return;
    }

    // Actualizar la contraseña en la lista de usuarios (simulación)
    const newUsers = users.map(u => 
      u.username === username ? { ...u, password: newPassword } : u
    );
    setUsers(newUsers);
    
    setSuccess(t('alert.passwordSuccess')); // Mostrar mensaje de éxito
    setTimeout(() => {
      onShowLogin(); // Volver al login después de 2 segundos
    }, 2000);
  };
  
  return (
    // Contenedor principal centrado y con fondo según tema
    <div className={`w-full min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      
      {/* Caja del formulario con padding, borde y sombra según tema */}
      <div className={`w-full max-w-md p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}>
        
        {/* Título principal */}
        <h1 className={`text-3xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('login.recoverTitle')}</h1>
        
        {/* Paso 1: Solicitar código de recuperación */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="mt-6">
            {/* Instrucciones */}
            <p className={`text-center mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.recoverStep1')}</p>
            {/* Input de usuario */}
            <div className="mb-4">
              <label htmlFor="username" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('login.username')}</label>
              <input 
                type="text" id="username" value={username} onChange={e => setUsername(e.target.value)}
                className={`w-full p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border`} 
              />
            </div>
            {/* Mostrar error si aplica */}
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            {/* Botón de enviar */}
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-md font-semibold transition-all"
            >
              {t('login.sendCode')}
            </button>
          </form>
        )}
        
        {/* Paso 2: Restablecer contraseña */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="mt-6">
            {/* Instrucciones */}
            <p className={`text-center mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.recoverStep2')}</p>
            {/* Input de código */}
            <div className="mb-4">
              <label htmlFor="code" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('login.code')}</label>
              <input 
                type="text" id="code" value={code} onChange={e => setCode(e.target.value)}
                className={`w-full p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border`} 
              />
            </div>
            {/* Input de nueva contraseña */}
            <div className="mb-4">
              <label htmlFor="newpass" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('login.newPassword')}</label>
              <input 
                type="password" id="newpass" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className={`w-full p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border`} 
              />
            </div>
            {/* Input de confirmación de contraseña */}
            <div className="mb-6">
              <label htmlFor="confirmpass" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('login.confirmNewPassword')}</label>
              <input 
                type="password" id="confirmpass" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border`} 
              />
            </div>

            {/* Mostrar mensajes de error o éxito */}
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

            {/* Botón de reset */}
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-md font-semibold transition-all"
            >
              {t('login.resetPassword')}
            </button>
          </form>
        )}
        
        {/* Botón para volver al login */}
        <div className="text-center mt-4">
          <button 
            onClick={onShowLogin}
            className="text-sm text-blue-500 hover:underline"
          >
            {t('login.backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoveryScreen;
