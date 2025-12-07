// src/components/Students/StudentFormModal.jsx
import React, { useState, useEffect } from "react";

export default function StudentFormModal({ student, tutors = [], onSave, onClose }) {
  const isEdit = Boolean(student);

  const [form, setForm] = useState({
    id: student?.id || null,
    numControl: student?.numControl || "",
    nombre: student?.nombre || "",
    carrera: student?.carrera || "ISC",
    semestre: student?.semestre || 1,
    periodo: student?.periodo || "",
    estado: student?.estado || "REGULAR",
    tutorId: student?.tutorId || "",
    tutorNombre: student?.tutorNombre || "",
  });

  useEffect(() => {
    if (student) {
      setForm({
        id: student.id,
        numControl: student.numControl || "",
        nombre: student.nombre || "",
        carrera: student.carrera || "ISC",
        semestre: student.semestre || 1,
        periodo: student.periodo || "",
        estado: student.estado || "REGULAR",
        tutorId: student.tutorId || "",
        tutorNombre: student.tutorNombre || "",
      });
    }
  }, [student]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedTutor = tutors.find((t) => t.id === form.tutorId);

    const payload = {
      ...form,
      semestre: Number(form.semestre),
      tutorNombre: selectedTutor ? selectedTutor.nombre : form.tutorNombre,
    };

    if (onSave) onSave(payload);
    if (onClose) onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">
          {isEdit ? "Editar estudiante" : "Registrar estudiante"}
        </h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Número de control</label>
            <input
              className="form-input"
              value={form.numControl}
              onChange={(e) => handleChange("numControl", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              className="form-input"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Carrera</label>
            <select
              className="form-input"
              value={form.carrera}
              onChange={(e) => handleChange("carrera", e.target.value)}
            >
              <option value="ISC">ISC</option>
              <option value="II">II</option>
              <option value="IGE">IGE</option>
              <option value="CP">CP</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Semestre</label>
            <input
              type="number"
              min={1}
              max={12}
              className="form-input"
              value={form.semestre}
              onChange={(e) => handleChange("semestre", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Periodo</label>
            <input
              className="form-input"
              placeholder="2025-1, 2025-2…"
              value={form.periodo}
              onChange={(e) => handleChange("periodo", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estado académico</label>
            <select
              className="form-input"
              value={form.estado}
              onChange={(e) => handleChange("estado", e.target.value)}
            >
              <option value="REGULAR">REGULAR</option>
              <option value="IRREGULAR">IRREGULAR</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tutor asignado (opcional)</label>
            <select
              className="form-input"
              value={form.tutorId || ""}
              onChange={(e) => handleChange("tutorId", e.target.value)}
            >
              <option value="">Sin asignar</option>
              {tutors.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} ({t.email})
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Guardar cambios" : "Registrar estudiante"}
            </button>
            <button
              type="button"
              className="btn btn-link"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
