// src/components/layout/MainLayout.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockRiesgosEstudiantes } from '../../mock/riesgosEstudiantes.js';

export function MainLayout({ children }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const role = user?.role;

  // —— Cálculo del nivel de riesgo global para el badge ——
  let riesgoGlobal = null;

  if (role === 'COORDINACION' || role === 'JEFE_DIVISION') {
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

  if (!isAuthenticated) {
    navLinks.push({ to: '/', label: 'Inicio' });
    navLinks.push({ to: '/login', label: 'Iniciar sesión' });
  } else {
    navLinks.push({ to: '/perfil', label: 'Mi perfil' });

    if (role === 'COORDINACION') {
      navLinks.push({ to: '/dashboard-coordinacion', label: 'Panel' });
      navLinks.push({ to: '/usuarios', label: 'Usuarios' });
      navLinks.push({ to: '/tutorias', label: 'Tutorías' });
      navLinks.push({ to: '/canalizaciones', label: 'Canalizaciones' });
      navLinks.push({ to: '/riesgos', label: 'Riesgo' });
      navLinks.push({ to: '/alertas/configuracion', label: 'Configuración' });
      navLinks.push({ to: '/documentos', label: 'Documentos' });
      navLinks.push({ to: '/reportes', label: 'Reportes' });
      navLinks.push({ to: '/estadisticas', label: 'Estadísticas' });
      navLinks.push({ to: '/bitacora', label: 'Bitácora' });
      navLinks.push({ to: '/gestion-estudiantes', label: 'Estudiantes' });
    }

    if (role === 'JEFE_DIVISION') {
      navLinks.push({ to: '/dashboard-division', label: 'Panel' });
      navLinks.push({ to: '/canalizaciones', label: 'Canalizaciones' });
      navLinks.push({ to: '/riesgos', label: 'Riesgo' });
      navLinks.push({ to: '/documentos', label: 'Documentos' });
      navLinks.push({ to: '/reportes', label: 'Reportes' });
      navLinks.push({ to: '/estadisticas', label: 'Estadísticas' });
    }

    if (role === 'TUTOR') {
      navLinks.push({ to: '/dashboard-tutor', label: 'Panel' });
      navLinks.push({ to: '/tutorias', label: 'Tutorías' });
      navLinks.push({ to: '/canalizaciones', label: 'Canalizaciones' });
      navLinks.push({ to: '/riesgos', label: 'Riesgo' });
      navLinks.push({ to: '/documentos', label: 'Documentos' });
      navLinks.push({ to: '/reportes', label: 'Reportes' });
      navLinks.push({ to: '/estadisticas', label: 'Estadísticas' });
    }

    if (role === 'DIRECCION') {
      navLinks.push({ to: '/dashboard-direccion', label: 'Panel' });
      navLinks.push({ to: '/documentos', label: 'Documentos' });
      navLinks.push({ to: '/reportes', label: 'Reportes' });
      navLinks.push({ to: '/estadisticas', label: 'Estadísticas' });
      navLinks.push({ to: '/bitacora', label: 'Bitácora' });
      navLinks.push({ to: '/gestion-estudiantes', label: 'Estudiantes' });
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
    return <span className="badge-risk" style={{ color: '#2ecc71' }}>🟢</span>;
  }

  return (
    <div className={`app-shell ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      {/* HEADER SUPERIOR (solo barra fina con logo y usuario) */}
      <header className="app-header">
        <div className="app-header-left">
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            ☰
          </button>

          <span className="app-logo">Tutorías ITSJ</span>
        </div>

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
            <span className="header-user-text">No has iniciado sesión</span>
          )}
        </div>
      </header>

      {/* CUERPO: SIDEBAR + CONTENIDO */}
      <div className="app-body">
        <aside className={`app-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
          <nav className="sidebar-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  'sidebar-link' + (isActive ? ' is-active' : '')
                }
              >
                <span className="sidebar-link-bullet">•</span>

                <span className="sidebar-link-text">
                  {link.label}
                  {link.to === '/riesgos' && <RiesgoBadge />}
                </span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="app-main">
          {children}
        </main>
      </div>

      <footer className="app-footer">
        <small>Sistema de Tutorías ITSJ · Versión 0.1</small>
      </footer>
    </div>
  );
}
