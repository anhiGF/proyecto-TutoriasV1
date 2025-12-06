// src/components/layout/MainLayout.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockRiesgosEstudiantes } from '../../mock/riesgosEstudiantes.js';

export function MainLayout({ children }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;

  // —— Cálculo del nivel de riesgo global para el badge ——
    // —— Cálculo del nivel de riesgo global para el badge ——
    let riesgoGlobal = null;

    if (role === 'COORDINACION' || role === 'JEFE_DIVISION') {
      // 👇 Solo consideramos los que NO están atendidos
      const lista = mockRiesgosEstudiantes.filter((e) => !e.atendido);

      if (lista.some((e) => e.riesgo === 'ROJO')) {
        riesgoGlobal = 'ROJO';
      } else if (lista.some((e) => e.riesgo === 'AMARILLO')) {
        riesgoGlobal = 'AMARILLO';
      } else if (lista.some((e) => e.riesgo === 'VERDE')) {
        riesgoGlobal = 'VERDE';
      }
    }


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
      navLinks.push({ to: '/riesgos', label: 'Riesgo' });
      navLinks.push({ to: '/alertas/configuracion', label: 'Configuracion' });
    }

    if (role === 'JEFE_DIVISION') {
      navLinks.push({ to: '/dashboard-division', label: 'Panel' });
      navLinks.push({ to: '/canalizaciones', label: 'Canalizaciones' });
      navLinks.push({ to: '/riesgos', label: 'Riesgo' });
    }

    if (role === 'TUTOR') {
      navLinks.push({ to: '/dashboard-tutor', label: 'Panel' });
      navLinks.push({ to: '/tutorias', label: 'Tutorías' });
      navLinks.push({ to: '/canalizaciones', label: 'Canalizaciones' });
      navLinks.push({ to: '/riesgos', label: 'Riesgo' });
    }

    if (role === 'DIRECCION') {
      navLinks.push({ to: '/dashboard-direccion', label: 'Panel' });
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };
  
    function RiesgoBadge() {
      if (!riesgoGlobal) return null;

      if (riesgoGlobal === 'ROJO') {
        return <span className="badge-risk" style={{ color: '#e74c3c' }}>🔴</span>;
      }
      if (riesgoGlobal === 'AMARILLO') {
        return <span className="badge-risk" style={{ color: '#f1c40f' }}>🟡</span>;
      }
      // VERDE
      return <span className="badge-risk" style={{ color: '#2ecc71' }}>🟢</span>;
    }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo">Tutorías ITSJ</span>
        </div>

        {/* 👇 SOLO usamos navLinks */}
        <nav className="app-header-nav">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className="nav-link">

              {link.label}

              {/* Badge SOLO para el enlace de riesgos */}
              {link.to === '/riesgos' && <RiesgoBadge />}

            </NavLink>
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
