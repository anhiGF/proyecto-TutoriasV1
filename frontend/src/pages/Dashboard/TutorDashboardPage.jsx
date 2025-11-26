// src/pages/Dashboard/TutorDashboardPage.jsx
import { useNavigate } from 'react-router-dom';

export function TutorDashboardPage() {
  const navigate = useNavigate();

  const irNuevaTutoria = () => {
    navigate('/tutorias/nueva');
  };

  const irTutorias = () => {
    navigate('/tutorias');
  };

  return (
    <div className="card">
      <h1 className="card-title">Panel del Tutor Académico</h1>
      <p className="card-subtitle">
        IU-10 · Acceso rápido a tus estudiantes, alertas y tutorías.
      </p>

      {/* Fila 1: resumen general */}
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          marginBottom: '1rem',
        }}
      >
        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Estudiantes asignados</h2>
          <p className="card-subtitle">Número de estudiantes bajo tu tutoría.</p>
          <p><strong>15</strong> estudiantes asignados.</p>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Próximas tutorías</h2>
          <p className="card-subtitle">Sesiones programadas para los próximos días.</p>
          <p><strong>3</strong> tutorías agendadas.</p>
        </div>
      </div>

      {/* Fila 2: alertas particulares */}
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'minmax(260px, 2fr) minmax(220px,1fr)',
          marginBottom: '1rem',
        }}
      >
        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Alertas particulares de tus estudiantes</h2>
          <p className="card-subtitle">
            Estudiantes con situaciones que requieren seguimiento cercano.
          </p>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
            <li>
              <strong>NC12345</strong> · Faltas recurrentes · Riesgo académico.
            </li>
            <li>
              <strong>NC67890</strong> · Bajo rendimiento en 3 materias.
            </li>
            <li>
              <strong>NC54321</strong> · Canalizado a apoyo psicológico.
            </li>
          </ul>
          <button className="btn btn-link" type="button">
            Ver listado completo de alertas →
          </button>
        </div>

        {/* Atajos del tutor */}
        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Atajos rápidos</h2>
          <p className="card-subtitle">
            Acciones frecuentes dentro del sistema de tutorías.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={irNuevaTutoria}
            >
              Registrar nueva tutoría
            </button>
            <button className="btn btn-link" type="button" onClick={irTutorias}>
              Ver historial de cada estudiante
            </button>
            <button className="btn btn-link" type="button">
              Registrar observación rápida
            </button>
            <button
            className="btn btn-link"
            type="button"
            onClick={() => navigate('/canalizaciones')}
          >
            Ver listado de canalizaciones →
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
