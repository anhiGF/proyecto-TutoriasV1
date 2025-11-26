// src/pages/Tutorias/TutoriasStudentHistoryPage.jsx
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockTutorias } from '../../mock/tutorias.js';

export function TutoriasStudentHistoryPage() {
  const { estudianteId } = useParams();
  const navigate = useNavigate();

  const tutoriasEstudiante = useMemo(
    () =>
      mockTutorias
        .filter((t) => t.estudianteId === estudianteId)
        .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora)),
    [estudianteId]
  );

  const nombreEstudiante =
    tutoriasEstudiante[0]?.estudianteNombre || 'Estudiante';

  const canalizaciones = tutoriasEstudiante.filter(
    (t) => t.requiereCanalizacion
  );

  const alertas = tutoriasEstudiante
    .filter((t) => t.factoresRiesgo && t.factoresRiesgo.trim() !== '')
    .map((t) => ({
      id: t.id,
      fecha: t.fecha,
      factores: t.factoresRiesgo,
    }));

  return (
    <div className="card">
      <h1 className="card-title">Historial de tutorías</h1>
      <p className="card-subtitle">
        IU-14 · Vista centrada en el estudiante.
      </p>

      <p style={{ marginBottom: '0.75rem' }}>
        Estudiante: <strong>{nombreEstudiante}</strong> ({estudianteId})
      </p>

      {/* Línea de tiempo */}
      <h2 className="card-title" style={{ fontSize: '1rem', marginTop: '1rem' }}>
        Línea de tiempo de tutorías
      </h2>
      {tutoriasEstudiante.length === 0 ? (
        <p>No hay tutorías registradas para este estudiante.</p>
      ) : (
        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
          {tutoriasEstudiante.map((t) => (
            <li key={t.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{t.fecha}</strong> · {t.hora} · {t.estado} · {t.tipo}{' '}
              <br />
              <span>Tema: {t.tema}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Canalizaciones */}
      <h2 className="card-title" style={{ fontSize: '1rem', marginTop: '1.5rem' }}>
        Canalizaciones asociadas
      </h2>
      {canalizaciones.length === 0 ? (
        <p>No hay canalizaciones registradas para este estudiante.</p>
      ) : (
        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
          {canalizaciones.map((t) => (
            <li key={t.id}>
              <strong>{t.fecha}</strong> · {t.tema}
            </li>
          ))}
        </ul>
      )}

      {/* Alertas */}
      <h2 className="card-title" style={{ fontSize: '1rem', marginTop: '1.5rem' }}>
        Alertas generadas
      </h2>
      {alertas.length === 0 ? (
        <p>No hay alertas registradas.</p>
      ) : (
        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
          {alertas.map((a) => (
            <li key={a.id}>
              <strong>{a.fecha}:</strong> {a.factores}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <button
          className="btn btn-link"
          type="button"
          onClick={() => navigate('/tutorias')}
        >
          ← Volver a la lista de tutorías
        </button>
      </div>
    </div>
  );
}
