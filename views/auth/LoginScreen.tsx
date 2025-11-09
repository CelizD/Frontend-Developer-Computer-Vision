import React from 'react';
import { useAppContext } from '../../context/AppContext'; // Importar contexto

const LoginScreen = ({ onShowRecovery }: { onShowRecovery: () => void }) => {
  const { theme, t, handleLogin, isLoggingIn, authError } = useAppContext(); 
  
  return (
    <div className={`w-full min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}>
        <h1 className={`text-3xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('login.title')}</h1>
        <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.subtitle')}</p>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('login.username')}</label>
            <input 
              type="text" id="username" name="username" defaultValue="admin"
              className={`w-full p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border`} 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('login.password')}</label>
            <input 
              type="password" id="password" name="password" defaultValue="admin"
              className={`w-full p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border`} 
            />
          </div>
          
          {authError && <p className="text-red-500 text-sm text-center mb-4">{authError}</p>}

          <button 
            type="submit" disabled={isLoggingIn}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-md font-semibold transition-all disabled:bg-gray-500"
          >
            {isLoggingIn ? t('login.loggingIn') : t('login.submit')}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <button 
            onClick={onShowRecovery}
            className="text-sm text-blue-500 hover:underline"
          >
            {t('login.forgot')}
          </button>
        </div>
        
        <div className="mt-4 text-xs text-center text-gray-500">
          <p>{t('login.demo')}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;