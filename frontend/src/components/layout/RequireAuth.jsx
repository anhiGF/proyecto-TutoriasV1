// src/components/layout/RequireAuth.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function RequireAuth({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="card">
        <h1 className="card-title">Acceso restringido</h1>
        <p className="card-subtitle">
          No cuentas con permisos para acceder a este módulo.
        </p>
      </div>
    );
  }

  return children;
}
