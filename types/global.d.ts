// --- Tipos de Datos Globales ---

export type Lang = 'es' | 'en';

export type RoomMetric = {
  room: string;
  percentage: number;
  occupied: number;
  total: number;
  status: 'Online' | 'Offline' | 'Luz Baja' | 'Alert';
};export type User = {
  id: string;
  username: string;
  password: string; // Nota: En una app real, la contraseña NUNCA se guarda en texto plano, ni siquiera en el front-end. Esto es solo para la simulación.
  role: 'admin' | 'operador' | 'viewer';
};

export type UserRole = 'admin' | 'operador' | 'viewer' | null;

export type NavItem = 'Dashboard' | 'Cámaras' | 'Analítica' | 'Reportes' | 'Registro' | 'Ajustes' | 'Perfil' | 'Ayuda';

export type EventLog = {
  id: string;
  timestamp: string;
  messageKey: string;
  messageArgs?: Record<string, string>;
  level: 'info' | 'warn' | 'alert';
};

export type DashboardWidgets = {
  showAttendance: boolean;
  showTrend: boolean;
};

export type HistoricalMetric = {
  date: string;
  globalPercent: number;
  rooms: Record<string, { percentage: number }>;
};


// --- Tipos para el Context API ---

// (Recomendación: Mover todos estos tipos de funciones y estados aquí)

export type AppContextType = {
  // Estado
  theme: 'dark' | 'light';
  lang: Lang;
  t: (key: string, args?: Record<string, string>) => string;
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
  
  // CORRECCIÓN: Se añaden las propiedades del Tour
  tourStep: number;
  
  // Setters y Handlers
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  setLang: React.Dispatch<React.SetStateAction<Lang>>;
  setMetrics: React.Dispatch<React.SetStateAction<RoomMetric[]>>;
  setEventLog: React.Dispatch<React.SetStateAction<EventLog[]>>;
  setActiveNav: React.Dispatch<React.SetStateAction<NavItem>>;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => void;
  handlePauseToggle: () => void;
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
  
  // CORRECCIÓN: Se añaden los setters y handlers del Tour
  setTourStep: React.Dispatch<React.SetStateAction<number>>;
  handleTourFinish: () => void;
};

export {};