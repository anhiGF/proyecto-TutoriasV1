// src/pages/ActivityLogPage.jsx
import React, { useMemo, useState } from 'react';
import { mockActivityLog } from '../mock/activityLog';
import { useAuth } from '../context/AuthContext';

const ACTION_LABELS = {
  CREAR: 'Creó',
  EDITAR: 'Editó',
  VER: 'Leyó / Consultó',
  DESCARGAR: 'Descargó',
};

export default function ActivityLogPage() {
  const { user } = useAuth();
  const role = user?.role;

  // 🔐 Quién puede ver la bitácora
  const canView = role === 'COORDINACION' || role === 'DIRECCION';

  // 🔍 Filtros (HOOKS SIEMPRE ARRIBA, NUNCA DESPUÉS DE UN return)
  const [filters, setFilters] = useState({
    textoUsuario: '',
    accion: 'TODAS',
    fechaDesde: '',
    fechaHasta: '',
  });

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 📊 Aplicar filtros (useMemo también siempre a nivel raíz del componente)
  const filteredLogs = useMemo(() => {
    return mockActivityLog
      .slice()
      .sort(
        (a, b) =>
          new Date(b.fechaHora).getTime() -
          new Date(a.fechaHora).getTime()
      )
      .filter((item) => {
        // Texto usuario (nombre o correo)
        if (filters.textoUsuario) {
          const text = filters.textoUsuario.toLowerCase();
          const matchUsuario =
            item.usuarioNombre.toLowerCase().includes(text) ||
            item.usuarioCorreo.toLowerCase().includes(text);
          if (!matchUsuario) return false;
        }

        // Tipo de acción
        if (filters.accion !== 'TODAS' && item.accion !== filters.accion) {
          return false;
        }

        // Rango de fechas
        const fechaItem = new Date(item.fechaHora);
        if (filters.fechaDesde) {
          const desde = new Date(filters.fechaDesde + 'T00:00:00');
          if (fechaItem < desde) return false;
        }
        if (filters.fechaHasta) {
          const hasta = new Date(filters.fechaHasta + 'T23:59:59');
          if (fechaItem > hasta) return false;
        }

        return true;
      });
  }, [filters]);

  // ⛔ return después de definir TODOS los hooks
  if (!canView) {
    return (
      <main className="app-main">
        <div className="card" style={{ maxWidth: '720px', margin: '2rem auto' }}>
          <h2 className="card-title">Acceso restringido</h2>
          <p>No cuentas con permisos para acceder a este módulo.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-main">
      <div className="card" style={{ maxWidth: '1100px', margin: '2rem auto' }}>
        <h1 className="card-title">Bitácora de actividad</h1>
        <p className="card-subtitle">
          IU-23 · Registro de acciones realizadas en el sistema (solo
          visible para Coordinación y Dirección).
        </p>

        {/* Filtros */}
        <form className="form" style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">
              Buscar por usuario (nombre o correo)
            </label>
            <input
              className="form-input"
              type="text"
              value={filters.textoUsuario}
              onChange={(e) =>
                handleChange('textoUsuario', e.target.value)
              }
              placeholder="Ej: coord@itsj.edu.mx o 'Coordinador'"
              autoComplete="off"
            />
          </div>

          <div
            className="form-row"
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label className="form-label">Tipo de acción</label>
              <select
                className="form-input"
                value={filters.accion}
                onChange={(e) =>
                  handleChange('accion', e.target.value)
                }
              >
                <option value="TODAS">Todas</option>
                <option value="CREAR">Creó</option>
                <option value="EDITAR">Editó</option>
                <option value="VER">Leyó / Consultó</option>
                <option value="DESCARGAR">Descargó</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: '1 1 160px' }}>
              <label className="form-label">Fecha desde</label>
              <input
                className="form-input"
                type="date"
                value={filters.fechaDesde}
                onChange={(e) =>
                  handleChange('fechaDesde', e.target.value)
                }
              />
            </div>

            <div className="form-group" style={{ flex: '1 1 160px' }}>
              <label className="form-label">Fecha hasta</label>
              <input
                className="form-input"
                type="date"
                value={filters.fechaHasta}
                onChange={(e) =>
                  handleChange('fechaHasta', e.target.value)
                }
              />
            </div>
          </div>
        </form>

        {/* Tabla */}
        <div
          className="card"
          style={{
            marginTop: '2rem',
            boxShadow: 'none',
            padding: 0,
          }}
        >
          <h2 className="card-title" style={{ fontSize: '1.1rem' }}>
            Resultados
          </h2>
          <p className="card-subtitle">
            {filteredLogs.length} registro
            {filteredLogs.length === 1 ? '' : 's'} encontrados.
          </p>

          <div className="table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha / hora</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Módulo</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>
                      No se encontraron registros con los filtros
                      seleccionados.
                    </td>
                  </tr>
                )}

                {filteredLogs.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {new Date(item.fechaHora).toLocaleString('es-MX', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td>
                      <div>{item.usuarioNombre}</div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#777',
                        }}
                      >
                        {item.usuarioCorreo}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          backgroundColor:
                            item.accion === 'CREAR'
                              ? '#A5D6A7'
                              : item.accion === 'EDITAR'
                              ? '#BBDEFB'
                              : item.accion === 'DESCARGAR'
                              ? '#FFE082'
                              : '#E0E0E0',
                        }}
                      >
                        {ACTION_LABELS[item.accion] || item.accion}
                      </span>
                    </td>
                    <td>{item.modulo}</td>
                    <td>{item.detalle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
