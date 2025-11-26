// src/pages/Home/HomePage.jsx
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="card">
      <h1 className="card-title">Sistema de Tutorías ITSJ</h1>
      <p className="card-subtitle">
        Plataforma web para la gestión de tutorías, canalizaciones, reportes e
        identificación de estudiantes en situación de riesgo.
      </p>

      <p>
        Para acceder a las funciones del sistema es necesario iniciar sesión con
        tu cuenta institucional.
      </p>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <Link to="/login">
          <button className="btn btn-primary">
            Iniciar sesión
          </button>
        </Link>

        {/* Botón secundario, ejemplo: manual o ayuda */}
        <button className="btn btn-link" type="button">
          Ver manual de usuario (próximamente)
        </button>
      </div>
    </div>
  );
}
