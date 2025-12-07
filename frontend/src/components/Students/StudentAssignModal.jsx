// src/components/Students/StudentAssignModal.jsx
import React, { useState } from "react";

export default function StudentAssignModal({
  tutorList = [],
  selectedIds = [],
  onAssign,
  onClose,
}) {
  const [tutorId, setTutorId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tutorId) return;
    if (onAssign) onAssign(tutorId);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Asignar tutor a seleccionados</h2>
        <p className="modal-subtitle">
          Estudiantes seleccionados: <strong>{selectedIds.length}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Selecciona un tutor</label>
            <select
              className="form-input"
              value={tutorId}
              onChange={(e) => setTutorId(e.target.value)}
              required
            >
              <option value="">-- Seleccionar --</option>
              {tutorList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} ({t.email})
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Asignar tutor
            </button>
            <button type="button" className="btn btn-link" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
