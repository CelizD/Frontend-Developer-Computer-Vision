import { User } from './global.d';

export const DEFAULT_USERS: User[] = [
  { id: 'u1', username: 'admin', password: 'admin', role: 'admin' },
  { id: 'u2', username: 'operador', password: 'operador', role: 'operador' },
  { id: 'u3', username: 'viewer', password: 'viewer', role: 'viewer' },
];
