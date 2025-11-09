import { User } from './global.d';

/**
 * Lista de usuarios por defecto para la aplicación.
 * Se utiliza principalmente para simulación de autenticación
 * y pruebas locales sin necesidad de una base de datos real.
 */
export const DEFAULT_USERS: User[] = [
  { id: 'u1', username: 'admin', password: 'admin', role: 'admin' },
  { id: 'u2', username: 'operador', password: 'operador', role: 'operador' },
  { id: 'u3', username: 'viewer', password: 'viewer', role: 'viewer' },
];
