// src/components/Students/StudentFilters.jsx
import React from "react";

const CARRERAS = ["TODAS", "ISC", "II", "IGE", "CP"]; // ajusta a tus carreras reales
const ESTADOS = ["TODOS", "REGULAR", "IRREGULAR"];

export default function StudentFilters({ filters, onChange, tutors = [] }) {
  const handleChange = (field, value) => {
    // onChange ya resetea página y selección en StudentsManagePage
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    onChange({
      periodo: "",
      carrera: "TODAS",
      estado: "TODOS",
      tutorId: "TODOS",
    });
  };

  return (
    <div className="card" style={{ marginBottom: "1.5rem" }}>
      <h2 className="card-title">Filtros de búsqueda</h2>
      <p className="card-subtitle">
        Filtra los estudiantes por periodo, carrera, estado académico o tutor asignado.
      </p>

      <div className="form-grid">
        {/* Periodo */}
        <div className="form-group">
          <label className="form-label">Periodo</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej. 2025-1"
            value={filters.periodo || ""}
            onChange={(e) => handleChange("periodo", e.target.value)}
          />
        </div>

        {/* Carrera */}
        <div className="form-group">
          <label className="form-label">Carrera</label>
          <select
            className="form-input"
            value={filters.carrera || "TODAS"}
            onChange={(e) => handleChange("carrera", e.target.value)}
          >
            {CARRERAS.map((carrera) => (
              <option key={carrera} value={carrera}>
                {carrera === "TODAS" ? "Todas" : carrera}
              </option>
            ))}
          </select>
        </div>

        {/* Estado académico */}
        <div className="form-group">
          <label className="form-label">Estado académico</label>
          <select
            className="form-input"
            value={filters.estado || "TODOS"}
            onChange={(e) => handleChange("estado", e.target.value)}
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado === "TODOS" ? "Todos" : estado}
              </option>
            ))}
          </select>
        </div>

        {/* Tutor asignado */}
        <div className="form-group">
          <label className="form-label">Tutor asignado</label>
          <select
            className="form-input"
            value={filters.tutorId || "TODOS"}
            onChange={(e) => handleChange("tutorId", e.target.value)}
          >
            <option value="TODOS">Todos</option>
            {(tutors || []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre} ({t.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
