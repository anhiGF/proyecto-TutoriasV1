// src/components/Students/StudentDeleteModal.jsx
import { useState } from "react";
import { StudentsApi } from "../../api/studentsApi";

export default function StudentDeleteModal({ student, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!student) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await StudentsApi.remove(student.id);
      onDeleted && onDeleted();
    } catch (err) {
      console.error("Error eliminando estudiante", err);
      setError("No se pudo eliminar el estudiante.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Eliminar estudiante</h2>
        <p>
          ¿Seguro que deseas eliminar a <strong>{student.nombre}</strong> (
          {student.num_control})?
        </p>

        {error && <p className="text-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
