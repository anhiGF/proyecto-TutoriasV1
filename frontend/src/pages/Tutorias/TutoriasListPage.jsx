// src/pages/Tutorias/TutoriasListPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTutorias as initialTutorias } from '../../mock/tutorias.js';

export function TutoriasListPage() {
  const [tutorias, setTutorias] = useState(initialTutorias);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroEstudiante, setFiltroEstudiante] = useState('');
  const [filtroTutor, setFiltroTutor] = useState('');
  const navigate = useNavigate();

  const tutoriasFiltradas = tutorias.filter((t) => {
    const byEstado = filtroEstado === 'TODOS' || t.estado === filtroEstado;
    const byTipo = filtroTipo === 'TODOS' || t.tipo === filtroTipo;
    const byEstudiante =
      !filtroEstudiante ||
      t.estudianteNombre.toLowerCase().includes(filtroEstudiante.toLowerCase()) ||
      t.estudianteId.toLowerCase().includes(filtroEstudiante.toLowerCase());
    const byTutor =
      !filtroTutor ||
      t.tutorNombre.toLowerCase().includes(filtroTutor.toLowerCase());

    return byEstado && byTipo && byEstudiante && byTutor;
  });

  const handleEliminar = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta tutoría? (mock)')) return;
    setTutorias((prev) => prev.filter((t) => t.id !== id));
  };

  const irNuevaTutoria = () => {
    navigate('/tutorias/nueva');
  };

  const irEditarTutoria = (id) => {
    navigate(`/tutorias/${id}/editar`);
  };

  const irHistorialEstudiante = (estudianteId) => {
    navigate(`/tutorias/estudiante/${estudianteId}`);
  };

  return (
    <div className="card">
      <h1 className="card-title">Gestión de tutorías</h1>
      <p className="card-subtitle">
        IU-12 · Lista de tutorías registradas. Vista demo con datos mock.
      </p>

      {/* Filtros */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: '1rem',
          marginBottom: '1rem',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <label className="form-label">Estado</label>
          <select
            className="form-input"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="PROGRAMADA">Programadas</option>
            <option value="REALIZADA">Realizadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>

        <div>
          <label className="form-label">Tipo</label>
          <select
            className="form-input"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="GRUPAL">Grupal</option>
          </select>
        </div>

        <div>
          <label className="form-label">Estudiante</label>
          <input
            className="form-input"
            placeholder="Nombre o No. control"
            value={filtroEstudiante}
            onChange={(e) => setFiltroEstudiante(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">Tutor</label>
          <input
            className="form-input"
            placeholder="Nombre del tutor"
            value={filtroTutor}
            onChange={(e) => setFiltroTutor(e.target.value)}
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={irNuevaTutoria}
          >
            Registrar nueva tutoría
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Fecha</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Hora</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Estudiante</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Tutor</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Tipo</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Estado</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tutoriasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '0.75rem' }}>
                  No se encontraron tutorías con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              tutoriasFiltradas.map((t) => (
                <tr key={t.id}>
                  <td style={{ padding: '0.5rem' }}>{t.fecha}</td>
                  <td style={{ padding: '0.5rem' }}>{t.hora}</td>
                  <td style={{ padding: '0.5rem' }}>
                    {t.estudianteNombre} ({t.estudianteId})
                  </td>
                  <td style={{ padding: '0.5rem' }}>{t.tutorNombre}</td>
                  <td style={{ padding: '0.5rem' }}>{t.tipo}</td>
                  <td style={{ padding: '0.5rem' }}>{t.estado}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => navigate(`/tutorias/${t.id}`)}
                    >
                      Ver
                    </button>
                    {' · '}
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => irEditarTutoria(t.id)}
                    >
                      Editar
                    </button>
                    {' · '}
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => irHistorialEstudiante(t.estudianteId)}
                    >
                      Historial
                    </button>
                    {' · '}
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => handleEliminar(t.id)}
                    >
                      Eliminar
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
