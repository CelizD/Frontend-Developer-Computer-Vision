export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface RoomMetric {
  room: string;
  capacity: number;
  currentOccupancy: number;
  temperature: number;
  humidity: number;
  noiseLevel: number;
  lastUpdated: Date;
  cameraStatus: 'active' | 'inactive' | 'error';
}

export interface CameraConfig {
  id: string;
  name: string;
  url: string;
  type: 'webcam' | 'ip' | 'rtsp';
  requiresAuth: boolean;
  username?: string;
  password?: string;
  status: 'connected' | 'disconnected' | 'error';
}

export interface DetectionResult {
  id: string;
  timestamp: Date;
  cameraId: string;
  objects: DetectedObject[];
  confidence: number;
}

export interface DetectedObject {
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

// Tipos para las vistas
export type ViewType = 'dashboard' | 'computer-vision' | 'analytics' | 'users' | 'settings';