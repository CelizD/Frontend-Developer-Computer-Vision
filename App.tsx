import React, { JSX } from 'react';

// --- Importaciones de Contexto y Tipos Globales ---
import { AppProvider, useAppContext } from './context/AppContext';
import { webSocketService } from './services/webSocketService'; // Para notificaciones y eventos globales
import { User, RoomMetric } from './types/global.d'; 

// --- Vistas de Autenticación ---
import LoginScreen from './views/auth/LoginScreen';
import RecoveryScreen from './views/auth/RecoveryScreen';

// --- Componentes de Layout y UI Globales ---
import Sidebar from './components/layout/Sidebar';
import MobileHeader from './components/layout/MobileHeader';
import MobileOverlay from './components/layout/MobileOverlay';
import AppContent from './components/layout/AppContent'; 
import Toast from './components/Toast';

// --- Modales ---
import TourModal from './components/modals/TourModal';
import EditRoomModal from './components/modals/EditRoomModal';
import EditUserModal from './components/modals/EditUserModal';

/**
 * Componente principal de la App
 * Maneja la lógica de autenticación y renderiza el layout autenticado
 */
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
          <AppContent />
        </div>
      </main>
    </div>
  );
};

/**
 * Wrapper de la App
 * Maneja los Modales globales y notificaciones (Toast)
 */
const AppWrapper = () => {
  const {
    userRole, setUsers, 
    editingRoom, setEditingRoom, 
    editingUser, setEditingUser, 
    setMetrics, setSelectedRoom, selectedRoom,
    tourStep, setTourStep, handleTourFinish
  } = useAppContext();

  // --- Handler para guardar cambios en un aula ---
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
  
  // --- Handler para guardar cambios en un usuario ---
  const handleSaveUser = (updatedUser: User) => {
    setUsers(prevUsers =>
      prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
    setEditingUser(null);
    // Agregar evento global vía WebSocket
    webSocketService.addEvent('alert.userUpdated', { username: updatedUser.username }, 'info'); 
  };

  return (
    <>
      <App />
      <Toast />

      {/* Modal del Tour interactivo */}
      <TourModal 
        step={tourStep} 
        setStep={setTourStep} 
        onFinish={handleTourFinish} 
      /> 

      {/* Modal de edición de aula (solo admin) */}
      {editingRoom && userRole === 'admin' && (
        <EditRoomModal
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onSave={handleSaveRoom}
        />
      )}

      {/* Modal de edición de usuario (solo admin) */}
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

/**
 * Export principal de la App
 * Envuelve todo en AppProvider para proveer contexto global
 */
export default function Dashboard(): JSX.Element {
  return (
    <AppProvider>
      <AppWrapper />
    </AppProvider>
  );
}
