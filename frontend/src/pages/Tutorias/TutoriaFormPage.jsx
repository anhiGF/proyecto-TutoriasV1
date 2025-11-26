// src/pages/Tutorias/TutoriaFormPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockTutorias } from '../../mock/tutorias.js';
import { mockCanalizaciones } from '../../mock/canalizaciones.js';

export function TutoriaFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? '';

  // Estado inicial de la tutoría
  const [formData, setFormData] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      estudianteId: '',
      estudianteNombre: '',
      carrera: '',
      semestre: '',
      // datos de tutor se toman del usuario actual
      tutorId: user?.email || '',
      tutorNombre: user?.name || 'Usuario Demo',
      fecha: today,
      hora: '10:00',
      duracion: 60,
      tipo: 'INDIVIDUAL', // INDIVIDUAL / GRUPAL
      tema: '',
      observaciones: '',
      requiereCanalizacion: false,
    };
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // 1) Registrar la tutoría en el mock
  const nuevoIdTut =
    mockTutorias.length > 0
      ? Math.max(...mockTutorias.map((t) => t.id)) + 1
      : 1;

  const nuevaTutoria = {
    id: nuevoIdTut,
    fecha: formData.fecha,
    hora: formData.hora,
    duracion: formData.duracion,
    tipo: formData.tipo,
    tema: formData.tema,
    observaciones: formData.observaciones,
    estudianteId: formData.estudianteId,
    estudianteNombre: formData.estudianteNombre,
    carrera: formData.carrera,
    semestre: formData.semestre,
    tutorId: formData.tutorId,
    tutorNombre: formData.tutorNombre,
    estado: 'PROGRAMADA',
    requiereCanalizacion: formData.requiereCanalizacion,
  };

  mockTutorias.push(nuevaTutoria);

  let nuevaCanalizacionId = null;

  // 2) Si requiere canalización, creamos también una canalización mock
  if (formData.requiereCanalizacion) {
    nuevaCanalizacionId =
      mockCanalizaciones.length > 0
        ? Math.max(...mockCanalizaciones.map((c) => c.id)) + 1
        : 1;

    const nuevaCanalizacion = {
      id: nuevaCanalizacionId,
      fecha: formData.fecha,
      estudianteId: formData.estudianteId,
      estudianteNombre: formData.estudianteNombre,
      carrera: formData.carrera || 'Por definir',
      semestre: formData.semestre || '',
      edad: '',
      division: user?.division || 'ISC',

      tutorId: user?.email || '',
      tutorNombre: user?.name || 'Usuario Demo',

      tipoAtencion: 'Orientación educativa',
      estado: 'ABIERTA',

      problematica:
        formData.tema ||
        'Derivado desde sesión de tutoría (tema no especificado).',
      servicioSolicitado:
        'Atención derivada desde sesión de tutoría académica.',
      observaciones: formData.observaciones || '',
      seguimiento: '',
      contrarreferencia: '',
    };

    mockCanalizaciones.push(nuevaCanalizacion);
  }

  if (nuevaCanalizacionId !== null) {
    alert('Tutoría registrada y canalización generada (demo).');
    // mandamos directo a editar la canalización
    navigate(`/canalizaciones/${nuevaCanalizacionId}/editar`);
  } else {
    alert('Tutoría registrada (demo).');
    navigate('/tutorias');
  }
};


  return (
    <div className="card">
      <h1 className="card-title">Registrar tutoría</h1>
      <p className="card-subtitle">
        IU-13 · Formulario de registro de tutoría (mock).
      </p>

      <form className="form" onSubmit={handleSubmit}>
        {/* Datos del estudiante */}
        <h2 className="card-title" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
          Datos del estudiante
        </h2>

        <div className="form-group">
          <label className="form-label">Número de control</label>
          <input
            className="form-input"
            value={formData.estudianteId}
            onChange={(e) => handleChange('estudianteId', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Nombre del estudiante</label>
          <input
            className="form-input"
            value={formData.estudianteNombre}
            onChange={(e) => handleChange('estudianteNombre', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Carrera</label>
          <input
            className="form-input"
            value={formData.carrera}
            onChange={(e) => handleChange('carrera', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Semestre</label>
          <input
            className="form-input"
            value={formData.semestre}
            onChange={(e) => handleChange('semestre', e.target.value)}
          />
        </div>

        {/* Datos de la sesión */}
        <h2 className="card-title" style={{ fontSize: '1rem', marginTop: '1rem' }}>
          Datos de la sesión
        </h2>

        <div className="form-group">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-input"
            value={formData.fecha}
            onChange={(e) => handleChange('fecha', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Hora</label>
          <input
            type="time"
            className="form-input"
            value={formData.hora}
            onChange={(e) => handleChange('hora', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Duración (minutos)</label>
          <input
            type="number"
            className="form-input"
            value={formData.duracion}
            onChange={(e) => handleChange('duracion', Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de tutoría</label>
          <select
            className="form-input"
            value={formData.tipo}
            onChange={(e) => handleChange('tipo', e.target.value)}
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="GRUPAL">Grupal</option>
          </select>
        </div>

        {/* Tutor */}
        <h2 className="card-title" style={{ fontSize: '1rem', marginTop: '1rem' }}>
          Tutor
        </h2>

        <div className="form-group">
          <label className="form-label">Tutor asignado</label>
          <input
            className="form-input"
            value={formData.tutorNombre}
            onChange={(e) => handleChange('tutorNombre', e.target.value)}
            disabled={role === 'TUTOR'}
          />
          {role === 'TUTOR' && (
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
              Como tutor, tu nombre se asigna automáticamente.
            </p>
          )}
        </div>

        {/* Contenido de la sesión */}
        <h2 className="card-title" style={{ fontSize: '1rem', marginTop: '1rem' }}>
          Contenido de la sesión
        </h2>

        <div className="form-group">
          <label className="form-label">Tema</label>
          <input
            className="form-input"
            value={formData.tema}
            onChange={(e) => handleChange('tema', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Observaciones</label>
          <textarea
            className="form-input"
            rows={3}
            value={formData.observaciones}
            onChange={(e) => handleChange('observaciones', e.target.value)}
          />
        </div>

        {/* Requiere canalización */}
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label className="form-label">
            <input
              type="checkbox"
              checked={formData.requiereCanalizacion}
              onChange={(e) =>
                handleChange('requiereCanalizacion', e.target.checked)
              }
              style={{ marginRight: '0.5rem' }}
            />
            Requiere canalización a servicios de apoyo
          </label>
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
            Marca esta opción si la situación detectada debe canalizarse a
            psicología, trabajo social u otros servicios institucionales.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button className="btn btn-primary" type="submit">
            Registrar tutoría
          </button>
          <button
            className="btn btn-link"
            type="button"
            onClick={() => navigate('/tutorias')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
