import { DEFAULT_USERS } from '../types/defaults';
import type { User, UserRole } from '../types/global.d';

// --- Lógica de Autenticación (Simulada) ---

/**
 * Intenta autenticar un usuario contra la lista almacenada en localStorage.
 * Retorna un token simulado si las credenciales son correctas.
 *
 * @param user Nombre de usuario
 * @param pass Contraseña
 * @returns { token: string | null; username: string | null }
 */
export const authService = {
  login: async (user: string, pass: string): Promise<{ token: string | null; username: string | null }> => {
    await new Promise(res => setTimeout(res, 500));
    
    // Cargar la lista de usuarios (usando la lista por defecto si no está en localStorage)
    const usersData = window.localStorage.getItem('asistencia-users');
    const users: User[] = usersData ? JSON.parse(usersData) : DEFAULT_USERS;
    
    const foundUser = users.find(u => u.username === user && u.password === pass);
    
    if (foundUser) {
      const token = `fake-${foundUser.role}-token`;
      return { token, username: foundUser.username };
    }
    
    return { token: null, username: null };
  },
  
  /**
   * Simula el cierre de sesión eliminando el token y el nombre de usuario.
   */
  logout: (setAuthToken: React.Dispatch<React.SetStateAction<string | null>>, setUsername: React.Dispatch<React.SetStateAction<string | null>>) => {
    setAuthToken(null);
    setUsername(null);
  },
};

/**
 * Determina el rol del usuario a partir del token simulado.
 *
 * @param token Token de autenticación
 * @returns El rol del usuario o null.
 */
export const getUserRoleFromToken = (token: string | null): UserRole => {
  if (!token) return null;
  if (token === 'fake-admin-token') return 'admin';
  if (token === 'fake-operador-token') return 'operador';
  if (token === 'fake-viewer-token') return 'viewer';
  return null;
};