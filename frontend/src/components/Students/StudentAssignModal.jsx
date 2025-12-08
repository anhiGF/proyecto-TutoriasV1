// src/components/Students/StudentAssignModal.jsx
import { useState } from "react";
import { StudentsApi } from "../../api/studentsApi";

export default function StudentAssignModal({
  selectedIds,
  tutorList,
  onClose,
  onAssigned,  // ⬅️ OPCIONAL: callback para refrescar lista
}) {
  const [tutorEmail, setTutorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAssign = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!tutorEmail) {
      setErrorMsg("Selecciona un tutor.");
      return;
    }

    if (!selectedIds.length) {
      setErrorMsg("No hay estudiantes seleccionados.");
      return;
    }

    try {
      setLoading(true);

      await StudentsApi.assignTutor({
        tutor_email: tutorEmail,
        student_ids: selectedIds,
      });

      setSuccessMsg("Tutor asignado correctamente.");

      // ⬅️ Si mandas un callback para refrescar, se ejecuta aquí
      if (onAssigned) onAssigned();

    } catch (err) {
      console.error("Error asignando tutor", err);
      setErrorMsg("No se pudo asignar el tutor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">

        <h2>Asignar tutor a {selectedIds.length} estudiante(s)</h2>

        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {/* ⬅️ Bloquear inputs si ya se asignó */}
        <div className="form-group">
          <label>Selecciona un tutor</label>
          <select
            value={tutorEmail}
            disabled={!!successMsg}
            onChange={(e) => setTutorEmail(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            {tutorList.map((t) => (
              <option key={t.id} value={t.email}>
                {t.nombre} ({t.email})
              </option>
            ))}
          </select>
        </div>

        <p className="modal-hint">
          Se asignará este tutor a todos los estudiantes seleccionados.
        </p>

        <div className="modal-actions">

          {/* BOTÓN CANCELAR (solo visible si NO hay éxito) */}
          {!successMsg && (
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          )}

          {/* BOTÓN ASIGNAR (solo si NO hay éxito) */}
          {!successMsg && (
            <button
              className="btn btn-primary"
              onClick={handleAssign}
              disabled={loading}
            >
              {loading ? "Asignando..." : "Asignar"}
            </button>
          )}

          {/* ✔ BOTÓN ACEPTAR (solo si hay éxito) */}
          {successMsg && (
            <button
              className="btn btn-success"
              onClick={onClose}
            >
              Aceptar
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
