// src/pages/Canalizaciones/CanalizacionDetailPage.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockCanalizaciones } from '../../mock/canalizaciones.js';
import { useAuth } from '../../context/AuthContext.jsx';

export function CanalizacionDetailPage({ mode = 'view' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? '';

  const isCreate = mode === 'create';
  const isView = mode === 'view';

  // Estado inicial: si es create, se arma la base; si es ver/editar, se busca en los mocks
  const [data, setData] = useState(() => {
    if (isCreate) {
      const today = new Date().toISOString().slice(0, 10);
      return {
        id: null,
        fecha: today,
        estudianteId: '',
        estudianteNombre: '',
        carrera: '',
        semestre: '',
        edad: '',
        division: user?.division || 'ISC',

        tutorId: user?.email || '',
        tutorNombre: user?.name || 'Usuario actual',

        tipoAtencion: 'Apoyo psicológico',
        estado: 'ABIERTA',

        problematica: '',
        servicioSolicitado: '',
        observaciones: '',
        seguimiento: '',
        contrarreferencia: '',
      };
    }

    const found = mockCanalizaciones.find((c) => c.id === Number(id));
    return found ? { ...found } : null;
  });

  // Quién puede editar
  const canEdit = isCreate
    ? role === 'COORDINACION' || role === 'TUTOR'
    : !isView &&
      (role === 'COORDINACION' ||
        role === 'JEFE_DIVISION' ||
        role === 'TUTOR');

  if (!data) {
    return (
      <div className="card">
        <h1 className="card-title">Canalización</h1>
        <p className="card-subtitle">
          No se encontró la canalización solicitada.
        </p>
        <button
          className="btn btn-link"
          type="button"
          onClick={() => navigate('/canalizaciones')}
        >
          ← Volver a la lista
        </button>
      </div>
    );
  }

  const handleChange = (field, value) => {
    if (!canEdit) return;
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!canEdit) {
      navigate('/canalizaciones');
      return;
    }

    if (isCreate) {
      // demo: solo mensaje, no se guarda en servidor
      alert('Canalización registrada (demo, sin guardar en servidor).');
    } else {
      alert('Canalización actualizada (demo, sin guardar en servidor).');
    }

    navigate('/canalizaciones');
  };

  const title = isCreate
    ? 'Registrar canalización'
    : isView
    ? 'Detalle de canalización'
    : 'Edición de canalización';

  return (
    <div className="card">
      <h1 className="card-title">{title}</h1>
      <p className="card-subtitle">
        IU-16 · Datos completos del estudiante y de la canalización.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        {/* Datos del estudiante */}
        <h2
          className="card-title"
          style={{ fontSize: '1rem', marginTop: '0.5rem' }}
        >
          Datos del estudiante
        </h2>

        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input
            className="form-input"
            value={data.estudianteNombre}
            onChange={(e) =>
              handleChange('estudianteNombre', e.target.value)
            }
            disabled={!canEdit}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Número de control</label>
          <input
            className="form-input"
            value={data.estudianteId}
            onChange={(e) => handleChange('estudianteId', e.target.value)}
            disabled={!canEdit}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Carrera</label>
          <input
            className="form-input"
            value={data.carrera}
            onChange={(e) => handleChange('carrera', e.target.value)}
            disabled={!canEdit}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Semestre</label>
          <input
            className="form-input"
            value={data.semestre}
            onChange={(e) => handleChange('semestre', e.target.value)}
            disabled={!canEdit}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Edad</label>
          <input
            className="form-input"
            type="number"
            value={data.edad}
            onChange={(e) => handleChange('edad', e.target.value)}
            disabled={!canEdit}
          />
        </div>

        {/* Datos de canalización */}
        <h2
          className="card-title"
          style={{ fontSize: '1rem', marginTop: '1rem' }}
        >
          Datos de canalización
        </h2>

        <div className="form-group">
          <label className="form-label">Fecha</label>
          <input
            className="form-input"
            type="date"
            value={data.fecha}
            onChange={(e) => handleChange('fecha', e.target.value)}
            disabled={!canEdit}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tutor que canaliza</label>
          <input className="form-input" value={data.tutorNombre} disabled />
          <p
            style={{
              fontSize: '0.8rem',
              color: '#666',
              marginTop: '0.25rem',
            }}
          >
            Este campo se llena automáticamente con el usuario que registra la
            canalización.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de atención</label>
          <select
            className="form-input"
            value={data.tipoAtencion}
            onChange={(e) =>
              handleChange('tipoAtencion', e.target.value)
            }
            disabled={!canEdit}
          >
            <option value="Apoyo psicológico">Apoyo psicológico</option>
            <option value="Orientación educativa">Orientación educativa</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Problemática identificada / Nota de derivación
          </label>
          <textarea
            className="form-input"
            rows={3}
            value={data.problematica}
            onChange={(e) =>
              handleChange('problematica', e.target.value)
            }
            disabled={!canEdit}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Servicio solicitado</label>
          <textarea
            className="form-input"
            rows={3}
            value={data.servicioSolicitado}
            onChange={(e) =>
              handleChange('servicioSolicitado', e.target.value)
            }
            disabled={!canEdit}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Observaciones generales</label>
          <textarea
            className="form-input"
            rows={3}
            value={data.observaciones}
            onChange={(e) =>
              handleChange('observaciones', e.target.value)
            }
            disabled={!canEdit}
          />
        </div>

        {/* Seguimiento y contrarreferencia */}
        <h2
          className="card-title"
          style={{ fontSize: '1rem', marginTop: '1rem' }}
        >
          Seguimiento y contrarreferencia
        </h2>

        <div className="form-group">
          <label className="form-label">Estado</label>
          <select
            className="form-input"
            value={data.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            disabled={!canEdit}
          >
            <option value="ABIERTA">Abierta</option>
            <option value="EN_SEGUIMIENTO">En seguimiento</option>
            <option value="CERRADA">Cerrada</option>
          </select>
        </div>

        {/* Ocultamos seguimiento y contrarreferencia en modo crear */}
        {!isCreate && (
          <>
            <div className="form-group">
              <label className="form-label">Seguimiento realizado</label>
              <textarea
                className="form-input"
                rows={3}
                value={data.seguimiento}
                onChange={(e) =>
                  handleChange('seguimiento', e.target.value)
                }
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contrarreferencia</label>
              <textarea
                className="form-input"
                rows={3}
                value={data.contrarreferencia || ''}
                onChange={(e) =>
                  handleChange('contrarreferencia', e.target.value)
                }
                disabled={!canEdit}
              />
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          {canEdit && (
            <button className="btn btn-primary" type="submit">
              {isCreate ? 'Registrar canalización' : 'Guardar cambios'}
            </button>
          )}
          <button
            className="btn btn-link"
            type="button"
            onClick={() => navigate('/canalizaciones')}
          >
            {isView ? 'Volver a la lista' : 'Cancelar'}
          </button>
        </div>
      </form>
    </div>
  );
}
