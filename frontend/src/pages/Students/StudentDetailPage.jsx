// src/pages/Students/StudentDetailPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

import { mockRiesgosEstudiantes } from '../../mock/riesgosEstudiantes.js';
import { mockTutorias } from '../../mock/tutorias.js';
import { mockCanalizaciones } from '../../mock/canalizaciones.js';
import { mockCalificaciones } from '../../mock/calificaciones.js';
import { mockAsistencias } from '../../mock/asistencias.js';

function getBadgeClass(riesgo) {
  if (riesgo === 'ROJO') return 'badge badge-danger';
  if (riesgo === 'AMARILLO') return 'badge badge-warning';
  return 'badge badge-success';
}

function getBadgeLabel(riesgo) {
  if (riesgo === 'ROJO') return 'Alto';
  if (riesgo === 'AMARILLO') return 'Medio';
  return 'Bajo';
}

export function StudentDetailPage() {
  const { id } = useParams(); // número de control
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? '';

  const [activeTab, setActiveTab] = useState('tutorias'); // tutorias | canalizaciones | academico

  // 🔎 Datos base desde el mock de riesgos
  const riesgoInfo = mockRiesgosEstudiantes.find(
    (e) => e.estudianteId === id
  );

  const nombre =
    riesgoInfo?.nombre || 'Estudiante sin datos en panel de riesgo (demo)';
  const carrera = riesgoInfo?.carrera || '—';
  const division = riesgoInfo?.division || '—';
  const riesgo = riesgoInfo?.riesgo || 'VERDE';
  const motivoRiesgo = riesgoInfo?.motivo || 'Sin motivo registrado';
  const atendido = riesgoInfo?.atendido || false;

  // 🔗 Tutorías de este estudiante
  const tutorias = mockTutorias.filter(
    (t) => String(t.estudianteId) === String(id)
  );

  // 🔗 Canalizaciones de este estudiante
  const canalizaciones = mockCanalizaciones.filter(
    (c) => String(c.estudianteId) === String(id)
  );

  // 📚 Calificaciones
  const califs = mockCalificaciones.filter(
    (c) => String(c.estudianteId) === String(id)
  );

  // 📊 Asistencias
  const asistencias = mockAsistencias.filter(
    (a) => String(a.estudianteId) === String(id)
  );

  // ─── Acciones rápidas ──────────────────────────────────────────────
  const handleNuevaTutoria = () => {
    navigate('/tutorias/nueva', {
      state: { estudianteId: id, estudianteNombre: nombre, estudianteCarrera: carrera, },
    });
  };

  const handleNuevaCanalizacion = () => {
    navigate('/canalizaciones/nueva', {
      state: { estudianteId: id, estudianteNombre: nombre, estudianteCarrera: carrera, fromStudent: true },
    });
  };

  const handleVolver = () => {
    navigate(-1);
  };

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div className="card">
      {/* Barra superior con título y botón volver */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 className="card-title">Detalle del estudiante</h1>
          <p className="card-subtitle">
            Vista integrada de información académica y de tutorías.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-link"
          onClick={handleVolver}
        >
          ← Volver
        </button>
      </div>

      {/* Datos generales + resumen de riesgo siempre visibles */}
      <section style={{ marginTop: '1rem' }}>
        <h2 className="card-title" style={{ fontSize: '1rem' }}>
          Datos del estudiante
        </h2>
        <div
          className="form"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '0.75rem',
          }}
        >
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input className="form-input" value={nombre} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Número de control</label>
            <input className="form-input" value={id} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Carrera</label>
            <input className="form-input" value={carrera} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">División</label>
            <input className="form-input" value={division} disabled />
          </div>
        </div>
      </section>

      <section style={{ marginTop: '1.25rem' }}>
        <h2 className="card-title" style={{ fontSize: '1rem' }}>
          Resumen de riesgo
        </h2>
        <div
          className="form"
          style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
        >
          <div>
            <span className={getBadgeClass(riesgo)}>
              {getBadgeLabel(riesgo)}
            </span>
            {atendido && (
              <span
                style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#666',
                }}
              >
                (Caso marcado como atendido)
              </span>
            )}
          </div>
        </div>
        <p style={{ marginTop: '0.5rem', color: '#555' }}>
          <strong>Motivo principal:</strong> {motivoRiesgo}
        </p>
      </section>

      {/* ─── Tabs ─────────────────────────────────────────────────────── */}
      <div className="tabs">
        <button
          type="button"
          className={`tab ${activeTab === 'tutorias' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('tutorias')}
        >
          Tutorías
        </button>
        <button
          type="button"
          className={`tab ${
            activeTab === 'canalizaciones' ? 'tab-active' : ''
          }`}
          onClick={() => setActiveTab('canalizaciones')}
        >
          Canalizaciones
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'academico' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('academico')}
        >
          Académico
        </button>
      </div>

      {/* ─── Contenido de cada tab ───────────────────────────────────── */}

      {/* TAB: TUTORÍAS */}
      {activeTab === 'tutorias' && (
        <section style={{ marginTop: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <h2 className="card-title" style={{ fontSize: '1rem' }}>
              Historial de tutorías
            </h2>
            {(role === 'COORDINACION' || role === 'TUTOR') && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNuevaTutoria}
              >
                Registrar nueva tutoría
              </button>
            )}
          </div>

          {tutorias.length === 0 ? (
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              No hay tutorías registradas para este estudiante (demo).
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tutor</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Tema</th>
                  </tr>
                </thead>
                <tbody>
                  {tutorias.map((t) => (
                    <tr key={t.id}>
                      <td>{t.fecha}</td>
                      <td>{t.tutorNombre}</td>
                      <td>{t.tipo}</td>
                      <td>{t.estado}</td>
                      <td>{t.tema}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB: CANALIZACIONES */}
      {activeTab === 'canalizaciones' && (
        <section style={{ marginTop: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <h2 className="card-title" style={{ fontSize: '1rem' }}>
              Canalizaciones relacionadas
            </h2>
            {(role === 'COORDINACION' || role === 'TUTOR') && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNuevaCanalizacion}
              >
                Registrar canalización
              </button>
            )}
          </div>

          {canalizaciones.length === 0 ? (
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              No hay canalizaciones registradas para este estudiante (demo).
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tutor que canaliza</th>
                    <th>Tipo de atención</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {canalizaciones.map((c) => (
                    <tr key={c.id}>
                      <td>{c.fecha}</td>
                      <td>{c.tutorNombre}</td>
                      <td>{c.tipoAtencion}</td>
                      <td>{c.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB: ACADÉMICO */}
      {activeTab === 'academico' && (
        <section style={{ marginTop: '1.25rem' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>
            Calificaciones (trayectoria académica)
          </h2>

          {califs.length === 0 ? (
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              No hay calificaciones cargadas para este estudiante (demo).
            </p>
          ) : (
            <div className="table-responsive" style={{ marginBottom: '1.5rem' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Periodo</th>
                    <th>Materia</th>
                    <th>Promedio</th>
                    <th>Situación</th>
                  </tr>
                </thead>
                <tbody>
                  {califs.map((c) => (
                    <tr key={c.id}>
                      <td>{c.periodo}</td>
                      <td>{c.materia}</td>
                      <td>{c.promedio}</td>
                      <td>{c.reprobada ? 'Reprobada' : 'Acreditada'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className="card-title" style={{ fontSize: '1rem' }}>
            Asistencias
          </h2>

          {asistencias.length === 0 ? (
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              No hay información de asistencias registrada (demo).
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Periodo</th>
                    <th>Materia</th>
                    <th>% asistencia</th>
                    <th>Faltas totales</th>
                  </tr>
                </thead>
                <tbody>
                  {asistencias.map((a) => (
                    <tr key={a.id}>
                      <td>{a.periodo}</td>
                      <td>{a.materia}</td>
                      <td>{a.porcentajeAsistencia}%</td>
                      <td>{a.faltasTotales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
