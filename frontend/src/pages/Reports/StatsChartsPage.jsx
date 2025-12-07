// src/pages/Reports/StatsChartsPage.jsx
import { useMemo, useState } from 'react';
import { useScopedReportData } from '../../hooks/useScopedReportData.js';
import { useAuth } from '../../context/AuthContext.jsx';

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const PIE_COLORS = ['#E57373', '#A5D6A7', '#BBDEFB', '#CE93D8', '#FFB74D'];

export default function StatsChartsPage() {
  // ⬇️ Ahora tomamos scopedData del hook (ya filtrado por rol)
  const { scopedData } = useScopedReportData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tutorias = scopedData?.tutorias ?? [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const canalizaciones = scopedData?.canalizaciones ?? [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const riesgos = scopedData?.riesgos ?? [];

  const { user } = useAuth();

  // Filtros
  const [periodo, setPeriodo] = useState('TODOS');
  const [division, setDivision] = useState('TODAS');
  const [tutor, setTutor] = useState('TODOS');
  const [tipoRiesgo, setTipoRiesgo] = useState('TODOS');

  // Qué gráficos mostrar
  const [showTutoriasPeriodo, setShowTutoriasPeriodo] = useState(true);
  const [showCanalizacionesTipo, setShowCanalizacionesTipo] = useState(true);
  const [showRiesgosFactor, setShowRiesgosFactor] = useState(true);

  // Opciones dinámicas
  const periodosDisponibles = useMemo(
    () => ['TODOS', ...new Set(tutorias.map((t) => t.periodo))],
    [tutorias]
  );

  const divisionesDisponibles = useMemo(
    () => ['TODAS', ...new Set(tutorias.map((t) => t.division))],
    [tutorias]
  );

  const tutoresDisponibles = useMemo(() => {
    const set = new Set(tutorias.map((t) => t.tutorNombre));
    return ['TODOS', ...set];
  }, [tutorias]);

  const tiposRiesgoDisponibles = useMemo(() => {
    const set = new Set(riesgos.map((r) => r.factorPrincipal));
    return ['TODOS', ...set];
  }, [riesgos]);

  // Aplicar filtros a los datos ya limitados por rol
  const { tutoriasFiltradas, canalizacionesFiltradas, riesgosFiltrados } =
    useMemo(() => {
      let t = [...tutorias];
      let c = [...canalizaciones];
      let r = [...riesgos];

      if (periodo !== 'TODOS') {
        t = t.filter((x) => x.periodo === periodo);
        c = c.filter((x) => x.periodo === periodo);
        r = r.filter((x) => x.periodo === periodo);
      }

      if (division !== 'TODAS') {
        t = t.filter((x) => x.division === division);
        c = c.filter((x) => x.division === division);
        r = r.filter((x) => x.division === division);
      }

      if (tutor !== 'TODOS') {
        t = t.filter((x) => x.tutorNombre === tutor);
        c = c.filter(
          (x) => x.tutorNombre === tutor || x.tutorQueCanaliza === tutor
        );
        r = r.filter((x) => x.tutorNombre === tutor);
      }

      if (tipoRiesgo !== 'TODOS') {
        r = r.filter((x) => x.factorPrincipal === tipoRiesgo);
      }

      return {
        tutoriasFiltradas: t,
        canalizacionesFiltradas: c,
        riesgosFiltrados: r,
      };
    }, [tutorias, canalizaciones, riesgos, periodo, division, tutor, tipoRiesgo]);

  // Datos agregados para las gráficas
  const tutoriasPorPeriodo = useMemo(() => {
    const map = new Map();
    for (const t of tutoriasFiltradas) {
      const key = t.periodo || 'Sin periodo';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [tutoriasFiltradas]);

  const canalizacionesPorTipo = useMemo(() => {
    const map = new Map();
    for (const c of canalizacionesFiltradas) {
      const key = c.tipoAtencion || 'Sin tipo';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [canalizacionesFiltradas]);

  const riesgosPorFactor = useMemo(() => {
    const map = new Map();
    for (const r of riesgosFiltrados) {
      const key = r.factorPrincipal || 'Otro';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [riesgosFiltrados]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Reportes y estadísticas</h1>
        <p className="page-subtitle">
          Filtra la información y visualiza estadísticas en gráficas.
          <br />
          <strong>Rol actual:</strong> {user?.role}
        </p>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="card-title">Filtros</h2>
        <div className="filters-row">
          <div className="form-group">
            <label>Periodo</label>
            <select
              className="form-input"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            >
              {periodosDisponibles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>División</label>
            <select
              className="form-input"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
            >
              {divisionesDisponibles.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tutor</label>
            <select
              className="form-input"
              value={tutor}
              onChange={(e) => setTutor(e.target.value)}
              disabled={user?.role === 'TUTOR'}
            >
              {tutoresDisponibles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {user?.role === 'TUTOR' && (
              <small style={{ color: '#777' }}>
                * Como tutor solo ves datos de tus estudiantes.
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Tipo de riesgo</label>
            <select
              className="form-input"
              value={tipoRiesgo}
              onChange={(e) => setTipoRiesgo(e.target.value)}
            >
              {tiposRiesgoDisponibles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selección de estadísticas */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="card-title">Estadísticas a mostrar</h2>
        <div className="filters-row">
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={showTutoriasPeriodo}
              onChange={(e) => setShowTutoriasPeriodo(e.target.checked)}
            />
            Tutorías por periodo (barras)
          </label>
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={showCanalizacionesTipo}
              onChange={(e) => setShowCanalizacionesTipo(e.target.checked)}
            />
            Canalizaciones por tipo (pastel)
          </label>
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={showRiesgosFactor}
              onChange={(e) => setShowRiesgosFactor(e.target.checked)}
            />
            Estudiantes en riesgo por factor (barras)
          </label>
        </div>
      </div>

      {/* Gráfica: Tutorías por periodo (barras) */}
      {showTutoriasPeriodo && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="card-title">Tutorías por periodo</h2>
          {tutoriasPorPeriodo.length === 0 ? (
            <p>No hay datos con los filtros seleccionados.</p>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={tutoriasPorPeriodo}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Tutorías"
                    fill="#E57373"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Gráfica: Canalizaciones por tipo (pie) */}
      {showCanalizacionesTipo && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="card-title">Canalizaciones por tipo de atención</h2>
          {canalizacionesPorTipo.length === 0 ? (
            <p>No hay datos con los filtros seleccionados.</p>
          ) : (
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={canalizacionesPorTipo}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {canalizacionesPorTipo.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Gráfica: Riesgos por factor (barras) */}
      {showRiesgosFactor && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="card-title">Estudiantes en riesgo por factor</h2>
          {riesgosPorFactor.length === 0 ? (
            <p>No hay datos con los filtros seleccionados.</p>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={riesgosPorFactor}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Estudiantes"
                    fill="#BBDEFB"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
