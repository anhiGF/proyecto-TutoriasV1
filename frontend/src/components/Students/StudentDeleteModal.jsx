// src/components/Students/StudentDeleteModal.jsx
import React from "react";

export default function StudentDeleteModal({ student, onConfirm, onClose }) {
  if (!student) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">¿Eliminar estudiante?</h2>
        <p>
          Vas a eliminar al estudiante: <br />
          <strong>
            {student.numControl} – {student.nombre}
          </strong>
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          Esta acción es sólo de demostración en frontend (mock). En producción
          debería pedir confirmación adicional y registrar la acción en la
          bitácora.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Sí, eliminar
          </button>
          <button type="button" className="btn btn-link" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
