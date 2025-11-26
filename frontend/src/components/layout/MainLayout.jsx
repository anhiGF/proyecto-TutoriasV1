// src/components/layout/MainLayout.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function MainLayout({ children }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;

  // Menú dinámico según autenticación y rol
  const navLinks = [];

  // Siempre mostrar Inicio
  navLinks.push({ to: '/', label: 'Inicio' });

  if (!isAuthenticated) {
    // Invitado
    navLinks.push({ to: '/login', label: 'Iniciar sesión' });
  } else {
    // Usuario logueado
    navLinks.push({ to: '/perfil', label: 'Mi perfil' });

    if (role === 'COORDINACION') {
      navLinks.push({ to: '/dashboard-coordinacion', label: 'Panel' });
      navLinks.push({ to: '/usuarios', label: 'Usuarios' });
      navLinks.push({ to: '/tutorias', label: 'Tutorías' });
      navLinks.push({ to: '/canalizaciones', label: 'Canalizaciones' });
    }

    if (role === 'JEFE_DIVISION') {
      navLinks.push({ to: '/dashboard-division', label: 'Panel' });
      navLinks.push({ to: '/canalizaciones', label: 'Canalizaciones' });
    }

    if (role === 'TUTOR') {
      navLinks.push({ to: '/dashboard-tutor', label: 'Panel' });
      navLinks.push({ to: '/tutorias', label: 'Tutorías' });
      navLinks.push({ to: '/canalizaciones', label: 'Canalizaciones' });
    }

    if (role === 'DIRECCION') {
      navLinks.push({ to: '/dashboard-direccion', label: 'Panel' });
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo">Tutorías ITSJ</span>
        </div>

        {/* 👇 SOLO usamos navLinks, nada hardcodeado aquí */}
        <nav className="app-nav">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="app-header-right">
          {isAuthenticated && user ? (
            <>
              <span className="header-user-text">
                Hola, <strong>{user.name}</strong> · {user.role}
              </span>
              <button
                className="btn btn-link header-logout-btn"
                type="button"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <span className="header-user-text">
              No has iniciado sesión
            </span>
          )}
        </div>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <small>Sistema de Tutorías ITSJ · Versión 0.1</small>
      </footer>
    </div>
  );
}
