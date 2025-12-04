import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Configurar la URL base del backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos para la API
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Camera {
  id: string;
  name: string;
  ip: string;
  port: number;
  username: string;
  password: string;
  rtsp_url: string;
  status: 'online' | 'offline';
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface CreateCameraData {
  name: string;
  ip: string;
  port: number;
  username: string;
  password: string;
  rtsp_url: string;
}

// Servicios de autenticación
export const authService = {
  async login(data: LoginData): Promise<{ token: string; user: User }> {
    const response = await api.post('/api/auth/login', data);
    const { token } = response.data;
    const decoded: any = jwtDecode(token);
    
    const user: User = {
      id: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      createdAt: decoded.createdAt
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  },

  async register(data: RegisterData): Promise<{ token: string; user: User }> {
    const response = await api.post('/api/auth/register', data);
    const { token } = response.data;
    const decoded: any = jwtDecode(token);
    
    const user: User = {
      id: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      createdAt: decoded.createdAt
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};

// Servicios de cámaras
export const cameraService = {
  async getAllCameras(): Promise<Camera[]> {
    const response = await api.get('/api/cameras');
    return response.data;
  },

  async getCameraById(id: string): Promise<Camera> {
    const response = await api.get(`/api/cameras/${id}`);
    return response.data;
  },

  async createCamera(data: CreateCameraData): Promise<Camera> {
    const response = await api.post('/api/cameras', data);
    return response.data;
  },

  async updateCamera(id: string, data: Partial<CreateCameraData>): Promise<Camera> {
    const response = await api.put(`/api/cameras/${id}`, data);
    return response.data;
  },

  async deleteCamera(id: string): Promise<void> {
    await api.delete(`/api/cameras/${id}`);
  },

  async getCameraStreamUrl(id: string): Promise<string> {
    const response = await api.get(`/api/cameras/${id}/stream`);
    return response.data.streamUrl;
  },

  async testCameraConnection(data: { ip: string; port: number; username: string; password: string }): Promise<boolean> {
    try {
      const response = await api.post('/api/cameras/test', data);
      return response.data.success;
    } catch {
      return false;
    }
  }
};