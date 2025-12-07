// src/pages/Reports/ReportGeneratorPage.jsx
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useScopedReportData } from '../../hooks/useScopedReportData.js';

// Columnas por tipo de reporte (para pantalla / PDF / Excel)
const COLUMNS_BY_TYPE = {
  tutorias: [
    { key: 'fecha', label: 'Fecha' },
    { key: 'periodo', label: 'Periodo' },
    { key: 'estudiante', label: 'Estudiante' },
    { key: 'tutorNombre', label: 'Tutor' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'estado', label: 'Estado' },
  ],
  canalizaciones: [
    { key: 'fecha', label: 'Fecha' },
    { key: 'periodo', label: 'Periodo' },
    { key: 'estudiante', label: 'Estudiante' },
    { key: 'tutorNombre', label: 'Tutor que canaliza' },
    { key: 'tipoAtencion', label: 'Tipo de atención' },
    { key: 'estado', label: 'Estado' },
  ],
  riesgos: [
    { key: 'estudiante', label: 'Estudiante' },
    { key: 'division', label: 'División' },
    { key: 'tipoRiesgo', label: 'Tipo de riesgo' },
    { key: 'factorPrincipal', label: 'Factor principal' },
    { key: 'nivel', label: 'Nivel' },
    { key: 'estado', label: 'Estado' },
  ],
};

const TITLE_BY_TYPE = {
  tutorias: 'Reporte de tutorías',
  canalizaciones: 'Reporte de canalizaciones',
  riesgos: 'Reporte de estudiantes en riesgo',
};

export default function ReportGeneratorPage() {
  const { getReport } = useScopedReportData();

  // Qué tipo de información quiero: tutorías / canalizaciones / riesgos
  const [reportType, setReportType] = useState('tutorias');

  // Filtros comunes + específicos
  const [filters, setFilters] = useState({
    periodo: '',
    division: 'TODAS',
    estado: 'TODOS',

    // Tutorías
    tutorEmail: '',

    // Canalizaciones
    tipoAtencion: 'TODOS',

    // Riesgos
    tipoRiesgo: 'TODOS',
    nivelRiesgo: 'TODOS',
  });

  const [results, setResults] = useState([]);

  // ---- Handlers de filtros ------------------------------------------------

  function handleChangeFilter(field, value) {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleChangeReportType(value) {
    setReportType(value);
    // Opcional: reset de filtros específicos al cambiar el tipo
    setFilters((prev) => ({
      ...prev,
      estado: 'TODOS',
      tutorEmail: '',
      tipoAtencion: 'TODOS',
      tipoRiesgo: 'TODOS',
      nivelRiesgo: 'TODOS',
    }));
    setResults([]);
  }

  // ---- Obtener datos ------------------------------------------------------

  function handleRunReport() {
    const data = getReport({ reportType, filters });
    setResults(data);
  }

  // ---- Exportar a PDF -----------------------------------------------------

  function handleExportPDF() {
  if (!results || results.length === 0) {
    alert('No hay datos para exportar.');
    return;
  }

  const doc = new jsPDF();

  // Columnas y filas según el tipo de reporte
  const columns = COLUMNS_BY_TYPE[reportType] || [];
  const headers = columns.map((c) => c.label);
  const body = results.map((row) =>
    columns.map((c) => row[c.key] ?? '')
  );

  // Título dinámico
  const title = TITLE_BY_TYPE[reportType] || 'Reporte';
  doc.setFontSize(14);
  doc.text(title, 14, 18);

  // Tabla con jspdf-autotable (v3+)
  autoTable(doc, {
    startY: 24,
    head: [headers],
    body,
  });

  doc.save(`reporte_${reportType}.pdf`);
}

  // ---- Exportar a Excel ---------------------------------------------------

  function handleExportExcel() {
    if (!results || results.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const columns = COLUMNS_BY_TYPE[reportType] || [];
    const rowsForExcel = results.map((row) => {
      const obj = {};
      columns.forEach((c) => {
        obj[c.label] = row[c.key] ?? '';
      });
      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(rowsForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

    XLSX.writeFile(workbook, `reporte_${reportType}.xlsx`);
  }

  // ---- Helpers de UI ------------------------------------------------------

  const currentColumns = COLUMNS_BY_TYPE[reportType] || [];

  // Filtros específicos según el tipo
  const isTutorias = reportType === 'tutorias';
  const isCanalizaciones = reportType === 'canalizaciones';
  const isRiesgos = reportType === 'riesgos';

  // -------------------------------------------------------------------------

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="card-title">IU-21 · Generador de reportes</h1>
        <p className="card-subtitle">
          Selecciona el tipo de información y los filtros para generar un
          reporte. El alcance de los datos depende de tu rol (coordinación,
          dirección, jefes de división, tutores).
        </p>

        {/* Tipo de reporte */}
        <div className="form-group">
          <label className="form-label">Tipo de reporte</label>
          <select
            className="form-input"
            value={reportType}
            onChange={(e) => handleChangeReportType(e.target.value)}
          >
            <option value="tutorias">Tutorías</option>
            <option value="canalizaciones">Canalizaciones</option>
            <option value="riesgos">Estudiantes en riesgo</option>
          </select>
        </div>

        {/* Filtros comunes */}
        <div className="form-group">
          <label className="form-label">Periodo</label>
          <input
            className="form-input"
            placeholder="Ej. 2025-1, 2025-2, etc."
            value={filters.periodo}
            onChange={(e) => handleChangeFilter('periodo', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">División</label>
          <select
            className="form-input"
            value={filters.division}
            onChange={(e) => handleChangeFilter('division', e.target.value)}
          >
            <option value="TODAS">Todas</option>
            <option value="ISC">Ingeniería en Sistemas Computacionales</option>
            <option value="II">Ingeniería Industrial</option>
            <option value="IGE">Ingeniería en Gestión Empresarial</option>
            {/* Agrega más divisiones reales aquí */}
          </select>
        </div>

        {/* Estado (reutilizado) */}
        <div className="form-group">
          <label className="form-label">
            {isRiesgos ? 'Estado del caso' : 'Estado'}
          </label>
          <select
            className="form-input"
            value={filters.estado}
            onChange={(e) => handleChangeFilter('estado', e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="PROGRAMADA">Programada</option>
            <option value="REALIZADA">Realizada</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="ABIERTA">Abierta</option>
            <option value="EN_SEGUIMIENTO">En seguimiento</option>
            <option value="CERRADA">Cerrada</option>
            <option value="ATENDIDO">Atendido</option>
          </select>
        </div>

        {/* Filtros ESPECÍFICOS por tipo */}

        {isTutorias && (
          <>
            <div className="form-group">
              <label className="form-label">Estado de la tutoría</label>
              <select
                className="form-input"
                value={filters.estado}
                onChange={(e) => handleChangeFilter('estado', e.target.value)}
              >
                <option value="TODOS">Todos</option>
                <option value="PROGRAMADA">Programada</option>
                <option value="REALIZADA">Realizada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Buscar por tutor (correo)</label>
              <input
                className="form-input"
                placeholder="tutor1@itsj.edu.mx"
                value={filters.tutorEmail}
                onChange={(e) =>
                  handleChangeFilter('tutorEmail', e.target.value)
                }
              />
            </div>
          </>
        )}

        {isCanalizaciones && (
          <>
            <div className="form-group">
              <label className="form-label">Tipo de atención</label>
              <select
                className="form-input"
                value={filters.tipoAtencion}
                onChange={(e) =>
                  handleChangeFilter('tipoAtencion', e.target.value)
                }
              >
                <option value="TODOS">Todos</option>
                <option value="PSICOLOGICA">Apoyo psicológico</option>
                <option value="ACADEMICA">Orientación académica</option>
                <option value="SOCIAL">Trabajo social</option>
              </select>
            </div>
          </>
        )}

        {isRiesgos && (
          <>
            <div className="form-group">
              <label className="form-label">Tipo de riesgo</label>
              <select
                className="form-input"
                value={filters.tipoRiesgo}
                onChange={(e) =>
                  handleChangeFilter('tipoRiesgo', e.target.value)
                }
              >
                <option value="TODOS">Todos</option>
                <option value="ACADEMICO">Académico</option>
                <option value="ASISTENCIA">Asistencia</option>
                <option value="CONDUCTA">Conducta</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nivel de riesgo</label>
              <select
                className="form-input"
                value={filters.nivelRiesgo}
                onChange={(e) =>
                  handleChangeFilter('nivelRiesgo', e.target.value)
                }
              >
                <option value="TODOS">Todos</option>
                <option value="VERDE">Verde</option>
                <option value="AMARILLO">Amarillo</option>
                <option value="ROJO">Rojo</option>
              </select>
            </div>
          </>
        )}

        {/* Botones de acción */}
        <div
          className="form-group"
          style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}
        >
          <button className="btn btn-primary" type="button" onClick={handleRunReport}>
            Ver en pantalla
          </button>
          <button className="btn btn-outline" type="button" onClick={handleExportPDF}>
            Exportar a PDF
          </button>
          <button className="btn btn-outline" type="button" onClick={handleExportExcel}>
            Exportar a Excel
          </button>
        </div>
      </div>

      {/* RESULTADOS EN PANTALLA */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 className="card-title">Resultados</h2>

        {(!results || results.length === 0) && (
          <p style={{ marginTop: '0.75rem' }}>
            No hay resultados. Ajusta los filtros y haz clic en <b>Ver en pantalla</b>.
          </p>
        )}

        {results && results.length > 0 && (
          <div className="table-responsive" style={{ marginTop: '1rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {currentColumns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.id || `${row.estudiante}-${row.fecha}-${row.tipo}`}>
                    {currentColumns.map((col) => (
                      <td key={col.key}>{row[col.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
