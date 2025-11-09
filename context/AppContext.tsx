import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  createContext,
  useContext,
  useCallback
} from "react";

// 1. Importaciones de Tipos
// Importamos todos los tipos de nuestro módulo central
import { 
        Lang, RoomMetric, EventLog, DashboardWidgets, 
        User, AppContextType, UserRole, NavItem, HistoricalMetric 
} from '../types/global.d';
import { DEFAULT_USERS } from '../types/defaults';

// 2. Importaciones de Utilidades, Hooks y Servicios
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getT } from '../utils/i18n';
import { playAlertSound } from '../utils/sound';
import { authService, getUserRoleFromToken } from '../services/authService';
import { webSocketService } from '../services/webSocketService';


// --- Creación del Contexto y Hook ---

// 3. Crear el Context
// El tipo se define en global.d.ts y se importa como AppContextType
const AppContext = createContext<AppContextType | null>(null);

// 4. Crear el Hook para consumir el Context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe ser usado dentro de un AppProvider");
  }
  return context;
};

// --- Componente Proveedor Principal (AppProvider) ---

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // --- 5. Estados y Métricas (Persistentes) ---
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('asistencia-theme', 'dark');
  const [lang, setLang] = useLocalStorage<Lang>('asistencia-lang', 'es');
  const [metrics, setMetrics] = useLocalStorage<RoomMetric[]>('asistencia-metrics', [
    { room: "Aula 101", percentage: 84, occupied: 21, total: 25, status: 'Online' },
    { room: "Aula 102", percentage: 60, occupied: 15, total: 25, status: 'Online' },
    { room: "Aula 201", percentage: 48, occupied: 12, total: 25, status: 'Online' },
    { room: "Laboratorio", percentage: 92, occupied: 23, total: 25, status: 'Online' },
  ]);
        const [eventLog, setEventLog] = useLocalStorage<EventLog[]>('asistencia-eventlog', []);
        const [users, setUsers] = useLocalStorage<User[]>('asistencia-users', DEFAULT_USERS);

        // Datos históricos (simulados por defecto: 7 días basados en las aulas actuales)
        const defaultHistorical = Array.from({ length: 7 }).map((_, i) => {
                const dayOffset = 6 - i; // días atrás
                const date = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000).toISOString();
                const rooms = metrics.reduce((acc, m) => {
                        acc[m.room] = { percentage: m.percentage };
                        return acc;
                }, {} as Record<string, { percentage: number }>);
                                const percentages = (Object.values(rooms) as Array<{ percentage: number }>).map(r => r.percentage);
                                const sum = percentages.reduce((s, n) => s + n, 0);
                        const globalPercent = Math.round((percentages.length > 0 ? sum / percentages.length : 0) || 0);
                return { date, globalPercent, rooms } as HistoricalMetric;
        });

        const [historicalData, setHistoricalData] = useLocalStorage<HistoricalMetric[]>('asistencia-historical', defaultHistorical);

  const [alertThreshold, setAlertThreshold] = useLocalStorage('asistencia-threshold', 90);
  const [defaultSeats, setDefaultSeats] = useLocalStorage('asistencia-default-seats', 20);
// CORREGIDO: Se incluyeron los setters reales de useLocalStorage
  const [notificationEmail, setNotificationEmail] = useLocalStorage('asistencia-notif-email', 'admin@institucion.com');
  const [enableEmailNotifications, setEnableEmailNotifications] = useLocalStorage('asistencia-notif-enable', false);
  const [dashboardWidgets, setDashboardWidgets] = useLocalStorage<DashboardWidgets>('asistencia-widgets', {
    showAttendance: true,
    showTrend: true,
  });

  // --- 6. Estados y Lógica (Volátiles) ---
  const t = useMemo(() => getT(lang), [lang]);
  const [activeNav, setActiveNav] = useState<NavItem>('Dashboard');
  const [liveMetrics, setLiveMetrics] = useState<RoomMetric[]>(metrics);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  // Autenticación y Layout
  const [authToken, setAuthToken] = useLocalStorage<string | null>('asistencia-token', null);
  const [username, setUsername] = useLocalStorage<string | null>('asistencia-username', null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authView, setAuthView] = useState<'login' | 'recovery'>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Para Skeleton Loaders

  // Modales y Datos en Vivo
  const [editingRoom, setEditingRoom] = useState<RoomMetric | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [lastEvent, setLastEvent] = useState<EventLog | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useLocalStorage('asistencia-tour-v1', false);
  const [tourStep, setTourStep] = useState(0);


  // --- 7. Lógica Derivada y Referencias ---
  const userRole = useMemo(() => getUserRoleFromToken(authToken), [authToken]);
  const alertThresholdRef = useRef(alertThreshold);
  useEffect(() => {
    alertThresholdRef.current = alertThreshold;
  }, [alertThreshold]);
  

  // --- 8. Handlers Principales ---

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(null);
    const user = (e.target as any).username.value;
    const pass = (e.target as any).password.value;
    
    const { token, username: loggedInUsername } = await authService.login(user, pass);
    
    if (token) {
      setAuthToken(token);
      setUsername(loggedInUsername);
    } else {
      setAuthError(t('login.error'));
    }
    setIsLoggingIn(false);
  }, [setAuthToken, setUsername, t]);

  const handleLogout = useCallback(() => {
    authService.logout(setAuthToken, setUsername);
    setActiveNav('Dashboard');
    setHasSeenTour(false);
  }, [setAuthToken, setUsername, setHasSeenTour]);

  const handlePauseToggle = useCallback(() => {
    if (isPaused) webSocketService.resume(() => alertThresholdRef.current);
    else webSocketService.pause();
    setIsPaused(!isPaused);
  }, [isPaused]);

  const handleTourFinish = useCallback(() => {
    setTourStep(0);
    setHasSeenTour(true);
  }, [setHasSeenTour]);

// CORREGIDO: Handler para crear un nuevo usuario (simulado)
const handleCreateUser = useCallback((newUser: User) => {
    setUsers(prevUsers => {
        // Asignar un ID único (simulado, aunque ManageUsers ya lo hace, lo reaseguramos aquí)
        const id = crypto.randomUUID(); 
        const userWithId = { ...newUser, id };
        return [...prevUsers, userWithId];
    });
    // Loguear la acción
    webSocketService.addEvent('alert.userCreated', { username: newUser.username }, 'info');
}, [setUsers]);

// CORREGIDO: Handler para eliminar un usuario
const handleDeleteUser = useCallback((userId: string, username: string) => {
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    // Loguear la acción
    webSocketService.addEvent('alert.userDeleted', { username: username }, 'warn');
}, [setUsers]);

  
  // --- 9. Efectos Centrales (Conexión de Lógica) ---

  // Efecto 1: Tema y Carga
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);
  
  // Efecto 2: Carga de Vista (Skeleton)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [activeNav]);


  // Efecto 3: Conexión WebSocket y Suscripción de Datos
  useEffect(() => {
    if (authToken && userRole) {
      setAuthView('login');
      
      const onMetricsReceived = (newMetrics: RoomMetric[]) => setLiveMetrics([...newMetrics]);
      const onEventReceived = (allEvents: EventLog[]) => {
        setEventLog(allEvents);
        // Lógica de Toast y Sonido (Centralizada aquí)
        if (allEvents.length > 0 && (!lastEvent || allEvents[0].id !== lastEvent.id)) {
          const newEvent = allEvents[0];
          setLastEvent(newEvent);
          if (newEvent.level === 'alert') playAlertSound();
        }
      };
      
      webSocketService.initialize(metrics, eventLog, () => alertThresholdRef.current);
      webSocketService.subscribe(onMetricsReceived);
      webSocketService.subscribeToEvents(onEventReceived);

      if (!hasSeenTour) setTourStep(1);

      return () => {
        webSocketService.pause();
        webSocketService.unsubscribe(onMetricsReceived);
        webSocketService.unsubscribeFromEvents(onEventReceived);
      };
    }
  // Se excluye 'lastEvent' de las dependencias para evitar un loop en la lógica de Toast
  }, [authToken, userRole, hasSeenTour, metrics, eventLog]); 


  // Efecto 4: Sincronización de Metrics y Habitación Seleccionada
  useEffect(() => {
    webSocketService.updateMetricsList(metrics);
  }, [metrics]);

  useEffect(() => {
    if (liveMetrics.length > 0 && !selectedRoom) {
      setSelectedRoom(liveMetrics[0].room);
    }
    if (selectedRoom && !liveMetrics.find(m => m.room === selectedRoom)) {
      setSelectedRoom(liveMetrics.length > 0 ? liveMetrics[0].room : null);
    }
  }, [liveMetrics, selectedRoom]);

  // Efecto 5: Temporizador de Toast
  useEffect(() => {
    if (lastEvent) {
      const timer = setTimeout(() => setLastEvent(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastEvent]);


  // --- 10. Valor del Context (TODOS LOS HANDLERS EXPUESTOS) ---
  const contextValue: AppContextType = {
    theme, setTheme,
    lang, setLang,
    t,
    userRole, username,
    metrics, setMetrics,
    liveMetrics,
    eventLog, 
    setEventLog,
    activeNav, setActiveNav,
    selectedRoom, setSelectedRoom,
    isPaused, handlePauseToggle,
    alertThreshold, setAlertThreshold,
    defaultSeats, setDefaultSeats,
    notificationEmail, 
    enableEmailNotifications, 
    setNotificationEmail,
    setEnableEmailNotifications,
    dashboardWidgets, setDashboardWidgets,
    users, setUsers,
    editingRoom,
    setEditingRoom,
    editingUser,
    setEditingUser,
    historicalData, setHistoricalData,
    lastEvent,
    isLoggingIn, authError,
    isLoading,
    handleLogin, handleLogout,
    isSidebarOpen, setIsSidebarOpen,
    authView, setAuthView,
    tourStep,
    setTourStep,
    handleTourFinish,
    // NUEVOS HANDLERS DE GESTIÓN DE USUARIOS
    handleCreateUser,
    handleDeleteUser,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};