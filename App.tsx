import React, { JSX } from 'react';

// Importaciones de Contexto y Lógica Central
import { AppProvider, useAppContext } from './context/AppContext';
import { webSocketService } from './services/webSocketService'; // Necesario para los Handlers de Modales
import { User, RoomMetric } from './types/global.d'; 

// Importaciones de Vistas de Autenticación
import LoginScreen from './views/auth/LoginScreen';
import RecoveryScreen from './views/auth/RecoveryScreen';

// Importaciones de Componentes de Layout y UI Globales
import Sidebar from './components/layout/Sidebar';
import MobileHeader from './components/layout/MobileHeader';
import MobileOverlay from './components/layout/MobileOverlay';
import AppContent from './components/layout/AppContent'; 
import Toast from './components/Toast';

// Importaciones de Modales
import TourModal from './components/modals/TourModal';
import EditRoomModal from './components/modals/EditRoomModal';
import EditUserModal from './components/modals/EditUserModal';


// --- Componente de Orquestación Principal (App) ---
const App = () => {
  const { 
    theme, userRole, username, handleLogout, authView, setAuthView,
    setEditingRoom, setEditingUser, editingRoom, editingUser
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

  // --- Layout Autenticado ---

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} text-gray-900 dark:text-gray-100`}>
      {/* Layout Estático */}
      <Sidebar onLogout={handleLogout} />
      <MobileOverlay />
      
      <main className="flex-1 flex flex-col p-0 md:p-6 overflow-auto">
        <MobileHeader />
        <div className="flex-1 p-6 md:p-0">
          {/* Contenido de la Página Activa */}
          <AppContent />
        </div>
      </main>
    </div>
  );
};


// --- Componente Wrapper y Handlers de Modales Globales ---
// Este wrapper renderiza la App y mantiene los Modales/Toasts flotantes.

const AppWrapper = () => {
  const {
    userRole, setUsers, 
    editingRoom, setEditingRoom, 
    editingUser, setEditingUser, 
    setMetrics, setSelectedRoom, selectedRoom, 
    // CORRECCIÓN 2: Se importan las props para el TourModal
    tourStep, setTourStep, handleTourFinish 
  } = useAppContext();

  // Handler para guardar la edición de un Aula (moverse aquí desde AppProvider)
  const handleSaveRoom = (updatedRoom: RoomMetric) => {
    setMetrics(prevMetrics => 
      prevMetrics.map(m => m.room === (editingRoom as RoomMetric).room ? updatedRoom : m)
    );
    // Mantener la selección actual del Dashboard
    if (selectedRoom === (editingRoom as RoomMetric).room) {
      setSelectedRoom(updatedRoom.room);
    }
    setEditingRoom(null);
  };
  
  // Handler para guardar la edición de un Usuario (moverse aquí desde AppProvider)
  const handleSaveUser = (updatedUser: User) => {
    setUsers(prevUsers =>
      prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
    setEditingUser(null);
    webSocketService.addEvent('alert.userUpdated', { username: updatedUser.username }, 'info'); 
  };

  return (
    <>
      <App />
      <Toast />
      {/* CORRECCIÓN 2: Se pasan las props reales del contexto al TourModal para evitar el error. */}
      <TourModal 
            step={tourStep} 
            setStep={setTourStep} 
            onFinish={handleTourFinish} 
        /> 

      {editingRoom && userRole === 'admin' && (
        <EditRoomModal
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onSave={handleSaveRoom}
        />
      )}
      {editingUser && userRole === 'admin' && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </>
  );
};


// --- Export Principal (El Componente Dashboard Anterior) ---

export default function Dashboard(): JSX.Element {
  return (
    <AppProvider>
      <AppWrapper />
    </AppProvider>
  );
}