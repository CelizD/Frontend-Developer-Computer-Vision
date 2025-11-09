import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext'; // Importar contexto
import { webSocketService } from '../../services/webSocketService'; // Importar para logs

const RecoveryScreen = ({ onShowLogin }: { onShowLogin: () => void }) => {
  const { theme, t, users, setUsers } = useAppContext();
  
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    const userExists = users.find(u => u.username === username);
    if (userExists) {
      setStep(2);
      setError(null);
      // Simular envío de código de recuperación
      webSocketService.addEvent('alert.systemInfo', { room: username }, 'info');
    } else {
      setError(t('alert.userNotFound'));
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validación simulada del código y contraseña
    if (code !== '12345') {
      setError(t('alert.invalidCode'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('alert.passwordMismatch'));
      return;
    }

    // Actualizar la contraseña en la lista de usuarios
    const newUsers = users.map(u => 
      u.username === username ? { ...u, password: newPassword } : u
    );
    setUsers(newUsers);
    
    setSuccess(t('alert.passwordSuccess'));
    setTimeout(() => {
      onShowLogin(); // Volver al login después del éxito
    }, 2000);
  };
  
  return (
    <div className={`w-full min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}>
        <h1 className={`text-3xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('login.recoverTitle')}</h1>
        
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="mt-6">
            <p className={`text-center mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.recoverStep1')}</p>
            <div className="mb-4">
              <label htmlFor="username" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('login.username')}</label>
              <input 
                type="text" id="username" value={username} onChange={e => setUsername(e.target.value)}
                className={`w-full p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border`} 
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-md font-semibold transition-all"
            >
              {t('login.sendCode')}
            </button>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="mt-6">
            <p className={`text-center mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.recoverStep2')}</p>
            <div className="mb-4">
              <label htmlFor="code" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('login.code')}</label>
              <input 
                type="text" id="code" value={code} onChange={e => setCode(e.target.value)}
                className={`w-full p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border`} 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newpass" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('login.newPassword')}</label>
              <input 
                type="password" id="newpass" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className={`w-full p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border`} 
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmpass" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('login.confirmNewPassword')}</label>
              <input 
                type="password" id="confirmpass" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border`} 
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-md font-semibold transition-all"
            >
              {t('login.resetPassword')}
            </button>
          </form>
        )}
        
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