// src/pages/Dashboard/CoordinatorDashboardPage.jsx
import { useNavigate } from 'react-router-dom';

export function CoordinatorDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h1 className="card-title">Panel de Coordinación</h1>
      <p className="card-subtitle">
        IU-07 · Resumen general del sistema de Tutorías.
      </p>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Estudiantes en riesgo</h2>
          <p className="card-subtitle">Resumen rápido de estudiantes marcados con alerta.</p>
          <p><strong>23</strong> estudiantes en seguimiento.</p>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Canalizaciones abiertas</h2>
          <p className="card-subtitle">Casos pendientes de cierre o contrarreferencia.</p>
          <p><strong>12</strong> canalizaciones activas.</p>
          <button
            className="btn btn-link"
            type="button"
            onClick={() => navigate('/canalizaciones')}
          >
            Ver listado de canalizaciones →
          </button>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Documentos recientes</h2>
          <p className="card-subtitle">Oficios, reportes y formatos cargados al sistema.</p>
          <p><strong>5</strong> documentos nuevos este mes.</p>
        </div>
      </div>
    </div>
  );
}
