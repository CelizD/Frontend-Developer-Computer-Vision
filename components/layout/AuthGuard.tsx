import React from 'react';
import { Navigate } from 'react-router-dom';

// Este componente protege tus rutas
// Si no hay token, redirige a /login

type AuthGuardProps = {
  authToken: string | null;
  children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ authToken, children }) => {
  if (!authToken) {
    // No está logueado, llévalo a /login
    return <Navigate to="/login" replace />;
  }

  // Está logueado, muestra el contenido (ej. el Dashboard)
  return <>{children}</>;
};

export default AuthGuard;