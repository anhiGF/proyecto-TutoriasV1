// src/pages/Risk/AlertsConfigPage.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export function AlertsConfigPage() {
  const { user } = useAuth();
  const role = user?.role ?? '';

  // 👇 Hooks SIEMPRE al inicio, sin if antes
  const [config, setConfig] = useState({
    faltasConsecutivas: 3,
    umbralReprobaciones: 2,
    activarFaltas: true,
    activarReprobaciones: true,
    activarCanalizaciones: true,
    activarAlertaManual: true,
  });

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nueva configuración de alertas:', config);
    alert('Configuración de alertas actualizada (demo, sin guardar en servidor).');
  };

  // 👇 El return condicional puede ir DESPUÉS de los hooks
  if (role !== 'COORDINACION') {
    return (
      <div className="card">
        <h1 className="card-title">Acceso restringido</h1>
        <p className="card-subtitle">
          La configuración de alertas solo está disponible para la Coordinación.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1 className="card-title">Configuración de alertas</h1>
      <p className="card-subtitle">
        IU-18 · Parámetros para generar alertas automáticas de riesgo.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <h2
          className="card-title"
          style={{ fontSize: '1rem', marginTop: '0.5rem' }}
        >
          Parámetros numéricos
        </h2>

        <div className="form-group">
          <label className="form-label">
            Número de faltas consecutivas para generar alerta
          </label>
          <input
            type="number"
            className="form-input"
            min={1}
            value={config.faltasConsecutivas}
            onChange={(e) =>
              handleChange('faltasConsecutivas', Number(e.target.value))
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Umbral de reprobaciones por periodo
          </label>
          <input
            type="number"
            className="form-input"
            min={1}
            value={config.umbralReprobaciones}
            onChange={(e) =>
              handleChange('umbralReprobaciones', Number(e.target.value))
            }
          />
        </div>

        <h2
          className="card-title"
          style={{ fontSize: '1rem', marginTop: '1rem' }}
        >
          Tipos de alerta
        </h2>

        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              checked={config.activarFaltas}
              onChange={(e) => handleChange('activarFaltas', e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Activar alertas por faltas consecutivas
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              checked={config.activarReprobaciones}
              onChange={(e) =>
                handleChange('activarReprobaciones', e.target.checked)
              }
              style={{ marginRight: '0.5rem' }}
            />
            Activar alertas por reprobaciones
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              checked={config.activarCanalizaciones}
              onChange={(e) =>
                handleChange('activarCanalizaciones', e.target.checked)
              }
              style={{ marginRight: '0.5rem' }}
            />
            Activar alertas por canalizaciones abiertas
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              checked={config.activarAlertaManual}
              onChange={(e) =>
                handleChange('activarAlertaManual', e.target.checked)
              }
              style={{ marginRight: '0.5rem' }}
            />
            Permitir alertas manuales (creadas por tutores)
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button className="btn btn-primary" type="submit">
            Guardar configuración
          </button>
        </div>
      </form>
    </div>
  );
}
