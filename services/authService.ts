import { DEFAULT_USERS } from '../types/defaults';
import type { User, UserRole } from '../types/global.d';

// --- Lógica de Autenticación (Simulada) ---

/**
 * Servicio de autenticación simulado.
 * Permite login y logout usando usuarios almacenados en localStorage o la lista por defecto.
 */
export const authService = {
  /**
   * Intenta autenticar un usuario contra la lista almacenada en localStorage.
   * Retorna un token simulado si las credenciales son correctas.
   *
   * @param user Nombre de usuario
   * @param pass Contraseña
   * @returns { token: string | null; username: string | null }
   */
  login: async (
    user: string,
    pass: string
  ): Promise<{ token: string | null; username: string | null }> => {
    
    await new Promise(res => setTimeout(res, 500));
    
    try {
      // --- ¡ASEGÚRATE DE QUE ESTA LÍNEA ES EXACTA! ---
      //      (con '127.0.0.1' y la diagonal al final)
      
      const response = await fetch('http://127.0.0.1:8000/api/token/', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user, password: pass }),
      });

      if (!response.ok) {
        // Si el password está mal, response.ok será falso (ej. 401)
        console.error('Error en el login (¿credenciales?):', response.statusText);
        return { token: null, username: null };
      }

      // Si todo OK (200)
      const data = await response.json();
      
      // Retornamos el token de acceso
      return { token: data.access, username: user };

    } catch (error) {
      // Esto atrapa errores de red (ej. si el server se cae)
      console.error('Error de red en el login:', error);
      return { token: null, username: null };
    }
  },
  
  /**
   * Simula el cierre de sesión eliminando el token y el nombre de usuario.
   *
   * @param setAuthToken Función para actualizar el estado del token
   * @param setUsername Función para actualizar el estado del usuario
   */
  logout: (
    setAuthToken: React.Dispatch<React.SetStateAction<string | null>>, 
    setUsername: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setAuthToken(null);
    setUsername(null);
  },
};

/**
 * Determina el rol del usuario a partir del token simulado.
 *
 * @param token Token de autenticación
 * @returns El rol del usuario ('admin' | 'operador' | 'viewer') o null si inválido
 */
export const getUserRoleFromToken = (token: string | null): UserRole => {
  if (!token) return null;
  if (token === 'fake-admin-token') return 'admin';
  if (token === 'fake-operador-token') return 'operador';
  if (token === 'fake-viewer-token') return 'viewer';
  return null;
};
