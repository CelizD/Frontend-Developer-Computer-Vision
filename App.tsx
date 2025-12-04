import React, { JSX } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';

// Vistas de autenticación
import LoginScreen from './views/auth/LoginScreen';
import RecoveryScreen from './views/auth/RecoveryScreen';

// Componentes de layout
import Sidebar from './components/layout/Sidebar';
import MobileHeader from './components/layout/MobileHeader';
import MobileOverlay from './components/layout/MobileOverlay';
import Toast from './components/ui/Toast';
import TourModal from './components/ui/TourModal';

// Vistas principales
import DashboardView from './views/dashboard/DashboardView';
import CamerasView from './views/cameras/CamerasView';
import ComputerVisionView from './views/computer-vision/ComputerVisionView';
import UsersView from './views/users/UsersView';
import SettingsView from './views/settings/SettingsView';

// Modales
import EditRoomModal from './components/modals/EditRoomModal';
import EditUserModal from './components/modals/EditUserModal';
import CameraModal from './components/camera/CameraModal';

import './App.css';

/**
 * Componente principal de la App
 */
const App = () => {
  const { 
    theme, userRole, username, handleLogout, authView, setAuthView,
    currentView
  } = useAppContext();

  // --- Flujo de Autenticación ---
  if (!userRole || !username) {
    if (authView === 'login') {
      return <LoginScreen onShowRecovery={() => setAuthView('recovery')} />;
    }
    if (authView === 'recovery') {
      return <RecoveryScreen onShowLogin={() => setAuthView('login')} />;
    }
  }

  // Renderizar vista actual
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'cameras':
        return <CamerasView />;
      case 'computer-vision':
        return <ComputerVisionView />;
      case 'users':
        return <UsersView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  // --- Layout Principal para usuarios autenticados ---
  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} text-gray-900 dark:text-gray-100`}>
      {/* Sidebar estático */}
      <Sidebar onLogout={handleLogout} />
      <MobileOverlay />
      
      <main className="flex-1 flex flex-col p-0 md:p-6 overflow-auto">
        <MobileHeader />
        <div className="flex-1 p-6 md:p-0">
          {/* Contenido dinámico de la página */}
          {renderView()}
        </div>
      </main>
    </div>
  );
};

/**
 * Wrapper de la App
 */
const AppWrapper = () => {
  const {
    userRole,
    tourStep, setTourStep, handleTourFinish
  } = useAppContext();

  return (
    <>
      <App />
      <Toast />
      <TourModal 
        step={tourStep} 
        setStep={setTourStep} 
        onFinish={handleTourFinish} 
      />
      <CameraModal />
    </>
  );
};

/**
 * Export principal de la App
 */
export default function Dashboard(): JSX.Element {
  return (
    <AppProvider>
      <AppWrapper />
    </AppProvider>
  );
}