import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService, cameraService, Camera, User } from '../services/api';

// Tipos de vistas disponibles
export type ViewType = 'dashboard' | 'computer-vision' | 'cameras' | 'settings' | 'users';

interface AppContextType {
  // Estados de UI
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Estados de autenticación
  user: User | null;
  isLoading: boolean;
  authView: 'login' | 'register' | 'recovery';
  setAuthView: (view: 'login' | 'register' | 'recovery') => void;
  
  // Funciones de autenticación
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  
  // Estados de vista
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  
  // Estados de cámaras
  cameras: Camera[];
  setCameras: React.Dispatch<React.SetStateAction<Camera[]>>;
  selectedCamera: Camera | null;
  setSelectedCamera: (camera: Camera | null) => void;
  loadingCameras: boolean;
  refreshCameras: () => Promise<void>;
  
  // Funciones de cámaras
  addCamera: (cameraData: any) => Promise<{ success: boolean; message?: string }>;
  updateCamera: (id: string, cameraData: any) => Promise<{ success: boolean; message?: string }>;
  deleteCamera: (id: string) => Promise<{ success: boolean; message?: string }>;
  testCameraConnection: (cameraData: any) => Promise<boolean>;
  
  // Estados para modales
  isCameraModalOpen: boolean;
  setIsCameraModalOpen: (isOpen: boolean) => void;
  editingCamera: Camera | null;
  setEditingCamera: (camera: Camera | null) => void;
  
  // Estado del tour
  tourStep: number;
  setTourStep: (step: number) => void;
  handleTourFinish: () => void;
}

// Crear el contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

// Proveedor del contexto
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estados de UI
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de autenticación
  const [user, setUser] = useState<User | null>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    }
    return authService.getCurrentUser();
  });
  const [authView, setAuthView] = useState<'login' | 'register' | 'recovery'>('login');
  
  // Estados de vista
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  // Estados de cámaras
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [loadingCameras, setLoadingCameras] = useState(false);
  
  // Estados de modales
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  
  // Estado del tour
  const [tourStep, setTourStep] = useState<number>(0);

  // Cargar cámaras al iniciar si el usuario está autenticado
  useEffect(() => {
    if (user) {
      loadCameras();
    }
  }, [user]);

  // Función para cargar cámaras
  const loadCameras = async () => {
    setLoadingCameras(true);
    try {
      const camerasData = await cameraService.getAllCameras();
      setCameras(camerasData);
    } catch (error) {
      console.error('Error cargando cámaras:', error);
    } finally {
      setLoadingCameras(false);
    }
  };

  // Función para cambiar tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Función de login
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: userData } = await authService.login({ username, password });
      setUser(userData);
      setCurrentView('dashboard');
      await loadCameras();
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de autenticación' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Función de registro
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: userData } = await authService.register({ username, email, password });
      setUser(userData);
      setCurrentView('dashboard');
      await loadCameras();
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error en el registro' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setCameras([]);
    setCurrentView('dashboard');
    setSelectedCamera(null);
  };

  // Función para agregar cámara
  const addCamera = async (cameraData: any) => {
    try {
      const newCamera = await cameraService.createCamera(cameraData);
      setCameras(prev => [...prev, newCamera]);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al agregar cámara' 
      };
    }
  };

  // Función para actualizar cámara
  const updateCamera = async (id: string, cameraData: any) => {
    try {
      const updatedCamera = await cameraService.updateCamera(id, cameraData);
      setCameras(prev => prev.map(cam => 
        cam.id === id ? updatedCamera : cam
      ));
      if (selectedCamera?.id === id) {
        setSelectedCamera(updatedCamera);
      }
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar cámara' 
      };
    }
  };

  // Función para eliminar cámara
  const deleteCamera = async (id: string) => {
    try {
      await cameraService.deleteCamera(id);
      setCameras(prev => prev.filter(cam => cam.id !== id));
      if (selectedCamera?.id === id) {
        setSelectedCamera(null);
      }
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al eliminar cámara' 
      };
    }
  };

  // Función para probar conexión de cámara
  const testCameraConnection = async (cameraData: any) => {
    try {
      return await cameraService.testCameraConnection(cameraData);
    } catch {
      return false;
    }
  };

  // Función para refrescar cámaras
  const refreshCameras = async () => {
    await loadCameras();
  };

  // Función para terminar el tour
  const handleTourFinish = () => {
    setTourStep(0);
    localStorage.setItem('tourCompleted', 'true');
  };

  // Valor del contexto
  const contextValue: AppContextType = {
    // UI
    theme,
    toggleTheme,
    isLoading,
    
    // Autenticación
    user,
    authView,
    setAuthView,
    login,
    register,
    logout,
    
    // Vistas
    currentView,
    setCurrentView,
    
    // Cámaras
    cameras,
    setCameras,
    selectedCamera,
    setSelectedCamera,
    loadingCameras,
    refreshCameras,
    addCamera,
    updateCamera,
    deleteCamera,
    testCameraConnection,
    
    // Modales
    isCameraModalOpen,
    setIsCameraModalOpen,
    editingCamera,
    setEditingCamera,
    
    // Tour
    tourStep,
    setTourStep,
    handleTourFinish
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe ser usado dentro de AppProvider');
  }
  return context;
};