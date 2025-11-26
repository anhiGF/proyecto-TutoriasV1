// src/pages/Canalizaciones/CanalizacionesListPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCanalizaciones as initialData } from '../../mock/canalizaciones.js';
import { useAuth } from '../../context/AuthContext.jsx';

export function CanalizacionesListPage() {
  const [canalizaciones] = useState(initialData);
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');
  const [divisionFiltro, setDivisionFiltro] = useState('TODAS');
  const [fechaFiltro, setFechaFiltro] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? '';

    const visibles = canalizaciones.filter((c) => {
    // TUTOR: solo ve canalizaciones que él mismo canalizó
    if (role === 'TUTOR' && c.tutorId !== user.email) return false;

    // JEFE_DE_DIVISION: solo ve canalizaciones de su división
    if (role === 'JEFE_DIVISION') {
      if (user.division && c.division !== user.division) return false;
    }

    const byTipo =
      tipoFiltro === 'TODOS' || c.tipoAtencion === tipoFiltro;
    const byEstado =
      estadoFiltro === 'TODOS' || c.estado === estadoFiltro;
    const byDivision =
      divisionFiltro === 'TODAS' || c.division === divisionFiltro;
    const byFecha = !fechaFiltro || c.fecha === fechaFiltro;

    return byTipo && byEstado && byDivision && byFecha;
  });

  const irDetalle = (id) => navigate(`/canalizaciones/${id}`);
  const irEditar = (id) => navigate(`/canalizaciones/${id}/editar`);
  const irContrarreferencia = (id) => navigate(`/canalizaciones/${id}/editar`);

  return (
    <div className="card">
      <h1 className="card-title">Gestión de canalizaciones</h1>
      <p className="card-subtitle">
        IU-15 · Lista de canalizaciones registradas en el sistema (mock).
      </p>

      {/* Filtros */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))',
          gap: '1rem',
          marginBottom: '1rem',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <label className="form-label">Tipo de atención</label>
          <select
            className="form-input"
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="Apoyo psicológico">Apoyo psicológico</option>
            <option value="Orientación educativa">Orientación educativa</option>
          </select>
        </div>

        <div>
          <label className="form-label">Estado</label>
          <select
            className="form-input"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="ABIERTA">Abierta</option>
            <option value="EN_SEGUIMIENTO">En seguimiento</option>
            <option value="CERRADA">Cerrada</option>
          </select>
        </div>

        <div>
          <label className="form-label">División</label>
          <select
            className="form-input"
            value={divisionFiltro}
            onChange={(e) => setDivisionFiltro(e.target.value)}
          >
            <option value="TODAS">Todas</option>
            <option value="ISC">ISC – Sistemas Computacionales</option>
          </select>
        </div>
         <hr></hr>
        <div>
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-input"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>
      </div>
              {/* Botón para registrar nueva canalización */}
      {(role === 'COORDINACION' || role === 'TUTOR') && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1rem',
          }}
        >
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => navigate('/canalizaciones/nueva')}
          >
            Registrar nueva canalización
          </button>
        </div>
      )}

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
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Estudiante</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Fecha</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                Tutor que canaliza
              </th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                Tipo de atención
              </th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Estado</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '0.75rem' }}>
                  No se encontraron canalizaciones con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              visibles.map((c) => (
                <tr key={c.id}>
                  <td style={{ padding: '0.5rem' }}>
                    {c.estudianteNombre} ({c.estudianteId})
                  </td>
                  <td style={{ padding: '0.5rem' }}>{c.fecha}</td>
                  <td style={{ padding: '0.5rem' }}>{c.tutorNombre}</td>
                  <td style={{ padding: '0.5rem' }}>{c.tipoAtencion}</td>
                  <td style={{ padding: '0.5rem' }}>{c.estado}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => irDetalle(c.id)}
                    >
                      Ver detalle
                    </button>
                    {' · '}
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => irEditar(c.id)}
                    >
                      Actualizar estatus
                    </button>
                    {' · '}
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => irContrarreferencia(c.id)}
                    >
                      Registrar contrarreferencia
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
