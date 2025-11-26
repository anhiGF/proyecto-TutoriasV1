// src/pages/Dashboard/DivisionDashboardPage.jsx
export function DivisionDashboardPage() {
  // Más adelante estos valores saldrán del backend
  const divisionNombre = 'Ingeniería en Sistemas Computacionales';

  return (
    <div className="card">
      <h1 className="card-title">Panel de Jefatura de División</h1>
      <p className="card-subtitle">
        IU-09 · Información filtrada por división / programa educativo.
      </p>

      <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
        División / Programa: <strong>{divisionNombre}</strong>
      </p>

      {/* Primera fila de tarjetas */}
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          marginBottom: '1rem',
        }}
      >
        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Estudiantes en riesgo (división)</h2>
          <p className="card-subtitle">Solo los estudiantes de tu división.</p>
          <p><strong>8</strong> estudiantes en riesgo.</p>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Tutorías registradas</h2>
          <p className="card-subtitle">Tutorías realizadas en el periodo actual.</p>
          <p><strong>37</strong> tutorías en este periodo.</p>
        </div>
      </div>

      {/* Segunda fila: Canalizaciones y Documentos */}
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
        }}
      >
        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Canalizaciones en la división</h2>
          <p className="card-subtitle">
            Casos canalizados desde los tutores de tu programa.
          </p>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
            <li><strong>5</strong> canalizaciones activas.</li>
            <li><strong>9</strong> canalizaciones cerradas este semestre.</li>
            <li><strong>2</strong> en espera de contrarreferencia.</li>
          </ul>
          <button className="btn btn-link" type="button">
            Ver listado de canalizaciones →
          </button>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Documentos de la división</h2>
          <p className="card-subtitle">
            Reportes, oficios y formatos asociados a tu división.
          </p>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
            <li>Reporte de avance de tutorías ISC – Marzo.</li>
            <li>Relación de estudiantes en riesgo – Parcial 1.</li>
            <li>Formato de canalización actualizado 2025.</li>
          </ul>
          <button className="btn btn-link" type="button">
            Ver todos los documentos →
          </button>
        </div>
      </div>
    </div>
  );
}
