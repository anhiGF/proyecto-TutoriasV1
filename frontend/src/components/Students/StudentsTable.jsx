// src/components/Students/StudentsTable.jsx
import React from "react";

export default function StudentsTable({
  data = [],                // 👈 viene de paginatedStudents
  selectedIds = [],
  setSelectedIds,
  onEdit,
  onDelete,
}) {
  const students = Array.isArray(data) ? data : [];

  const handleToggleOne = (id) => {
    if (!setSelectedIds) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleAll = (checked) => {
    if (!setSelectedIds) return;
    if (checked) {
      const pageIds = students.map((s) => s.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = students.map((s) => s.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const allChecked =
    students.length > 0 &&
    students.every((s) => selectedIds.includes(s.id));

  return (
    <div className="card" style={{ marginTop: "1.5rem" }}>
      <h2 className="card-title">Listado de estudiantes</h2>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => handleToggleAll(e.target.checked)}
                />
              </th>
              <th>N.º control</th>
              <th>Nombre</th>
              <th>Carrera</th>
              <th>Semestre</th>
              <th>Periodo</th>
              <th>Tutor asignado</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "1rem" }}>
                  No hay estudiantes que coincidan con los filtros.
                </td>
              </tr>
            )}

            {students.map((st) => (
              <tr key={st.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(st.id)}
                    onChange={() => handleToggleOne(st.id)}
                  />
                </td>
                <td>{st.numControl}</td>
                <td>{st.nombre}</td>
                <td>{st.carrera}</td>
                <td>{st.semestre}</td>
                <td>{st.periodo}</td>
                <td>{st.tutorNombre || "Sin asignar"}</td>
                <td style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => onEdit && onEdit(st)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-link text-danger"
                    onClick={() => onDelete && onDelete(st)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
