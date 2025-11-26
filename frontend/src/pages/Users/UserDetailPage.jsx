// src/pages/Users/UserDetailPage.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockUsers } from '../../mock/users.js';

export function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useState(() => mockUsers.find((u) => u.id === Number(id)));

  if (!user) {
    return (
      <div className="card">
        <h1 className="card-title">Usuario no encontrado</h1>
        <p className="card-subtitle">
          El usuario con ID {id} no existe en el sistema demo.
        </p>
        <button className="btn btn-primary" type="button" onClick={() => navigate('/usuarios')}>
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h1 className="card-title">Detalle de usuario</h1>
      <p className="card-subtitle">IU-06 · Vista individual con información del usuario.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div><strong>ID:</strong> {user.id}</div>
        <div><strong>Nombre:</strong> {user.name}</div>
        <div><strong>Correo:</strong> {user.email}</div>
        <div><strong>Rol:</strong> {user.role}</div>
        <div><strong>División / Programa:</strong> {user.division}</div>
        <div><strong>Estado:</strong> {user.status}</div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/usuarios">
          <button className="btn btn-link" type="button">
            ← Volver a gestión de usuarios
          </button>
        </Link>
      </div>
    </div>
  );
}
