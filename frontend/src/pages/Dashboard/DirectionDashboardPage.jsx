// src/pages/Dashboard/DirectionDashboardPage.jsx
import { useNavigate } from 'react-router-dom';

export function DirectionDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h1 className="card-title">Panel de Dirección</h1>
      <p className="card-subtitle">
        IU-11 · Visualización de indicadores generales e informes institucionales.
      </p>

      {/* Fila 1: indicadores generales */}
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          marginBottom: '1rem',
        }}
      >
        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Tutorías totales</h2>
          <p className="card-subtitle">Histórico global del sistema.</p>
          <p><strong>128</strong> tutorías registradas.</p>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Canalizaciones</h2>
          <p className="card-subtitle">Casos que han requerido atención especializada.</p>
          <p><strong>24</strong> canalizaciones registradas.</p>
          <button
            className="btn btn-link"
            type="button"
            onClick={() => navigate('/canalizaciones')}
          >
            Ver listado de canalizaciones →
          </button>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Estudiantes en riesgo</h2>
          <p className="card-subtitle">Suma de todas las divisiones.</p>
          <p><strong>31</strong> estudiantes en situación de riesgo.</p>
        </div>
      </div>

      {/* Fila 2: reportes e informes institucionales */}
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'minmax(260px,2fr) minmax(220px,1fr)',
        }}
      >
        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Reportes institucionales</h2>
          <p className="card-subtitle">
            Documentos generados a partir del sistema de tutorías.
          </p>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
            <li>
              Informe institucional de tutorías – Ciclo 2024-2025.
            </li>
            <li>
              Reporte de canalizaciones a servicios externos – Semestre A.
            </li>
            <li>
              Consolidado de estudiantes en riesgo por programa educativo.
            </li>
            <li>
              Indicadores de cumplimiento de sesiones de tutoría por división.
            </li>
          </ul>
          <button className="btn btn-link" type="button">
            Ver todos los reportes institucionales →
          </button>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Más indicadores generales</h2>
          <p className="card-subtitle">
            Resumen rápido de algunos KPI relevantes.
          </p>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
            <li>Tasa de asistencia a tutorías: <strong>86%</strong></li>
            <li>Porcentaje de casos canalizados atendidos: <strong>78%</strong></li>
            <li>
              Porcentaje de estudiantes en riesgo con plan de seguimiento:
              {' '}
              <strong>64%</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
