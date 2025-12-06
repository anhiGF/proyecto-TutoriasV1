// src/pages/Risk/RiskPanelPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockRiesgosEstudiantes } from '../../mock/riesgosEstudiantes.js';
import { useAuth } from '../../context/AuthContext.jsx';

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

export function RiskPanelPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = user?.role ?? '';
  const userDivision = user?.division ?? '';

  // 👇 Hooks SIEMPRE primero
  const [items, setItems] = useState(mockRiesgosEstudiantes);
  const [filtroCarrera, setFiltroCarrera] = useState('TODAS');
  const [filtroDivision, setFiltroDivision] = useState('TODAS');
  const [filtroRiesgo, setFiltroRiesgo] = useState('TODOS');

  const isAllowed = role === 'COORDINACION' || role === 'JEFE_DIVISION';

  // 👇 Después de los hooks ya podemos hacer early return sin problema
  if (!isAllowed) {
    return (
      <div className="card">
        <h1 className="card-title">Acceso restringido</h1>
        <p className="card-subtitle">
          Este panel solo está disponible para Coordinación y Jefes de División.
        </p>
      </div>
    );
  }

  // Filtros y cálculos
  const divisionVisible =
    role === 'JEFE_DIVISION' ? userDivision : filtroDivision;

  const filtrados = items.filter((item) => {
    if (role === 'JEFE_DIVISION' && item.division !== userDivision) {
      return false;
    }
    if (filtroCarrera !== 'TODAS' && item.carrera !== filtroCarrera) {
      return false;
    }
    if (divisionVisible !== 'TODAS' && item.division !== divisionVisible) {
      return false;
    }
    if (filtroRiesgo !== 'TODOS' && item.riesgo !== filtroRiesgo) {
      return false;
    }
    return true;
  });

  const carreras = Array.from(new Set(items.map((i) => i.carrera)));
  const divisiones = Array.from(new Set(items.map((i) => i.division)));

  const marcarAtendido = (id) => {
    // 1. Actualizamos el estado local (para que la tabla se refresque)
    setItems((prev) =>
        prev.map((item) =>
        item.id === id ? { ...item, atendido: true } : item
        )
    );

    // 2. Actualizamos también el mock global para que el header lo vea
    const found = mockRiesgosEstudiantes.find((i) => i.id === id);
    if (found) {
        found.atendido = true;
    }
    };


    const verDetalleEstudiante = (estudianteId) => {
    navigate(`/estudiantes/${estudianteId}`);
    };

  return (
    <div className="card">
      <h1 className="card-title">Panel de estudiantes en riesgo</h1>
      <p className="card-subtitle">
        IU-17 · Lista priorizada de estudiantes con indicadores de riesgo.
      </p>

      {/* Filtros */}
      <div
        className="form"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <div className="form-group">
          <label className="form-label">Carrera</label>
          <select
            className="form-input"
            value={filtroCarrera}
            onChange={(e) => setFiltroCarrera(e.target.value)}
          >
            <option value="TODAS">Todas</option>
            {carreras.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {role === 'COORDINACION' && (
          <div className="form-group">
            <label className="form-label">División</label>
            <select
              className="form-input"
              value={filtroDivision}
              onChange={(e) => setFiltroDivision(e.target.value)}
            >
              <option value="TODAS">Todas</option>
              {divisiones.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        {role === 'JEFE_DIVISION' && (
          <div className="form-group">
            <label className="form-label">División</label>
            <input
              className="form-input"
              value={userDivision || 'No configurada'}
              disabled
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Tipo de riesgo</label>
          <select
            className="form-input"
            value={filtroRiesgo}
            onChange={(e) => setFiltroRiesgo(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="ROJO">Rojo (alto)</option>
            <option value="AMARILLO">Amarillo (medio)</option>
            <option value="VERDE">Verde (bajo)</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Número de control</th>
              <th>Carrera</th>
              <th>División</th>
              <th>Riesgo</th>
              <th>Motivo principal</th>
              <th>Atendido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>
                  No hay estudiantes que coincidan con los filtros.
                </td>
              </tr>
            )}
            {filtrados.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.estudianteId}</td>
                <td>{item.carrera}</td>
                <td>{item.division}</td>
                <td>
                  <span className={getBadgeClass(item.riesgo)}>
                    {getBadgeLabel(item.riesgo)}
                  </span>
                </td>
                <td>{item.motivo}</td>
                <td>{item.atendido ? 'Sí' : 'No'}</td>
                <td>
                 <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => verDetalleEstudiante(item.estudianteId)}
                    >
                    Ver detalle
                    </button>

                  {!item.atendido && (
                    <>
                      <span> · </span>
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => marcarAtendido(item.id)}
                      >
                        Marcar atendido
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
