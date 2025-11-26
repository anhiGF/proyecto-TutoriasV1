// src/pages/Profile/ProfilePage.jsx
import { useAuth } from '../../context/AuthContext.jsx';

export function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="card">
        <h1 className="card-title">No hay sesión activa</h1>
        <p className="card-subtitle">
          Inicia sesión para ver tu perfil.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1 className="card-title">Mi perfil</h1>
      <p className="card-subtitle">
        Información de tu cuenta en el Sistema de Tutorías.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div><strong>Nombre:</strong> {user.name}</div>
        <div><strong>Correo institucional:</strong> {user.email}</div>
        <div><strong>Rol:</strong> {user.role}</div>
        <div><strong>División / Programa:</strong> {user.division}</div>
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
        🔐 Tu sesión se guarda hasta por unos minutos en este navegador.
        Si recargas después de un rato, es posible que tengas que iniciar sesión de nuevo.
      </p>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <button className="btn btn-primary" type="button">
          Editar perfil (próximamente)
        </button>
        <button className="btn btn-link" type="button" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
