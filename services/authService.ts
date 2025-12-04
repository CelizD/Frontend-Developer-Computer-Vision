// services/authService.ts
import { User, UserRole } from '../types/global.d';

export const authService = {
  login: async (user: string, pass: string): Promise<{ token: string | null; username: string | null }> => {
    try {
      // Hacemos POST a tu nuevo login simple en Django
      const response = await fetch('http://127.0.0.1:8000/api/login/', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });

      if (!response.ok) {
        console.error('Error en login');
        return { token: null, username: null };
      }

      const data = await response.json();
      
      // Guardamos una "marca" simple de que estamos logueados
      // No es un token JWT real, pero sirve para que la app sepa que el usuario entró.
      localStorage.setItem('username', data.username);
      
      return { token: 'session-active', username: data.username }; 

    } catch (error) {
      console.error('Error de red:', error);
      return { token: null, username: null };
    }
  },

  logout: (setAuthToken: any, setUsername: any) => {
    localStorage.removeItem('username');
    setAuthToken(null);
    setUsername(null);
  },
};