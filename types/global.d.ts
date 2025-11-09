// --- Tipos de Datos Globales ---

/** Idiomas soportados en la aplicación */
export type Lang = 'es' | 'en';

/** Métricas de ocupación de un aula o cámara */
export type RoomMetric = {
  room: string;                  // Nombre del aula
  percentage: number;            // Porcentaje de ocupación
  occupied: number;              // Número de asientos ocupados
  total: number;                 // Total de asientos disponibles
  status: 'Online' | 'Offline' | 'Luz Baja' | 'Alert'; // Estado de la cámara
};

/** Información de usuario (solo para simulación) */
export type User = {
  id: string;                    // ID único
  username: string;              // Nombre de usuario
  password: string;              // Nota: En producción, NUNCA se guarda en texto plano
  role: 'admin' | 'operador' | 'viewer'; // Rol del usuario
};

/** Rol de usuario */
export type UserRole = 'admin' | 'operador' | 'viewer' | null;

/** Ítems del menú de navegación */
export type NavItem = 'Dashboard' | 'Cámaras' | 'Analítica' | 'Reportes' | 'Registro' | 'Ajustes' | 'Perfil' | 'Ayuda';

/** Registro de eventos generados en la app */
export type EventLog = {
  id: string;                    // ID único del evento
  timestamp: string;             // Hora de creación
  messageKey: string;            // Clave i18n para mostrar el mensaje
  messageArgs?: Record<string, string>; // Argumentos opcionales para interpolación
  level: 'info' | 'warn' | 'alert';    // Nivel de severidad
};

/** Widgets visibles en el dashboard */
export type DashboardWidgets = {
  showAttendance: boolean;       // Mostrar widget de asistencia
  showTrend: boolean;            // Mostrar widget de tendencia
};

/** Métricas históricas por aula */
export type HistoricalMetric = {
  date: string;                  // Fecha del registro
  globalPercent: number;         // Porcentaje global promedio
  rooms: Record<string, { percentage: number }>; // Porcentaje por aula
};

// --- Tipos para AppContext (Context API) ---

export type AppContextType = {
  // Estados principales
  theme: 'dark' | 'light';
  lang: Lang;
  t: (key: string, args?: Record<string, string>) => string; // Función de traducción
  userRole: UserRole;
  username: string | null;
  metrics: RoomMetric[];
  liveMetrics: RoomMetric[];
  eventLog: EventLog[];
  activeNav: NavItem;
  selectedRoom: string | null;
  isPaused: boolean;
  alertThreshold: number;
  defaultSeats: number;
  notificationEmail: string;
  enableEmailNotifications: boolean;
  dashboardWidgets: DashboardWidgets;
  users: User[];
  isLoggingIn: boolean;
  authError: string | null;
  isLoading: boolean;
  isSidebarOpen: boolean;
  authView: 'login' | 'recovery';
  lastEvent: EventLog | null;
  historicalData: HistoricalMetric[];
  editingRoom: RoomMetric | null;
  editingUser: User | null;

  // Propiedades para el tour de la app
  tourStep: number;

  // Setters de estado (React Dispatch)
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  setLang: React.Dispatch<React.SetStateAction<Lang>>;
  setMetrics: React.Dispatch<React.SetStateAction<RoomMetric[]>>;
  setEventLog: React.Dispatch<React.SetStateAction<EventLog[]>>;
  setActiveNav: React.Dispatch<React.SetStateAction<NavItem>>;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  setAlertThreshold: React.Dispatch<React.SetStateAction<number>>;
  setDefaultSeats: React.Dispatch<React.SetStateAction<number>>;
  setNotificationEmail: React.Dispatch<React.SetStateAction<string>>;
  setEnableEmailNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setDashboardWidgets: React.Dispatch<React.SetStateAction<DashboardWidgets>>;
  setEditingRoom: React.Dispatch<React.SetStateAction<RoomMetric | null>>;
  setEditingUser: React.Dispatch<React.SetStateAction<User | null>>;
  setHistoricalData: React.Dispatch<React.SetStateAction<HistoricalMetric[]>>;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAuthView: React.Dispatch<React.SetStateAction<'login' | 'recovery'>>;
  setTourStep: React.Dispatch<React.SetStateAction<number>>;

  // Handlers principales
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => void;
  handlePauseToggle: () => void;
  handleTourFinish: () => void;

  // Handlers de gestión de usuarios
  handleCreateUser: (newUser: User) => void;
  handleDeleteUser: (userId: string, username: string) => void;
};

export {};
