// src/components/Students/StudentFormModal.jsx
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";           // ajusta la ruta si tu Modal está en otro lado
import { StudentsApi } from "../../api/studentsApi";

// Carreras que se imparten en el Tec de Jerez (ajusta si falta alguna)
const CAREERS = [
  { value: "ISC", label: "ISC - Ing. en Sistemas Computacionales" },
  { value: "II", label: "II - Ing. Industrial" },
  { value: "IGE", label: "IGE - Ing. en Gestión Empresarial" },
  { value: "IM", label: "IM - Ing. Mecatrónica" },
  { value: "IE", label: "IE - Ing. Electrónica" },
  { value: "IIAS", label: "IIAS - Ing. en Innovación Agrícola Sustentable" },
  { value: "IADM", label: "IADM - Ing. en Administración" },
];

const ESTADOS = ["REGULAR", "IRREGULAR", "RIESGO"];

const CONTROL_REGEX = /^[A-Za-z0-9]{8,9}$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

// Periodo actual (formato 2025-1 / 2025-2)
function getCurrentPeriod() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const ciclo = month <= 6 ? 1 : 2;
  return `${year}-${ciclo}`;
}

export default function StudentFormModal({ student, onClose, onSaved }) {
  // 👉 si viene un student con id, es edición
  const isEdit = Boolean(student && student.id);

  const [form, setForm] = useState({
    num_control: "",
    nombre: "",
    carrera: "",
    semestre: "1",
    periodo: getCurrentPeriod(),
    estado: "REGULAR",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Cargar datos cuando es edición
  useEffect(() => {
    if (isEdit) {
      setForm({
        num_control: student.num_control ?? "",
        nombre: student.nombre ?? "",
        carrera: student.carrera ?? "",
        semestre: String(student.semestre ?? "1"),
        periodo: student.periodo ?? getCurrentPeriod(),
        estado: student.estado ?? "REGULAR",
      });
    } else {
      // nuevo → limpia y pone periodo actual
      setForm({
        num_control: "",
        nombre: "",
        carrera: "",
        semestre: "1",
        periodo: getCurrentPeriod(),
        estado: "REGULAR",
      });
    }
  }, [isEdit, student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "num_control") {
      // Solo letras y números, max 9
      newValue = value.replace(/[^A-Za-z0-9]/g, "").slice(0, 9);
    }

    if (name === "nombre") {
      // Solo letras (con acentos) y espacios
      newValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    }

    if (name === "semestre") {
      newValue = value.replace(/\D/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!CONTROL_REGEX.test(form.num_control)) {
      newErrors.num_control =
        "El número de control debe tener entre 8 y 9 caracteres alfanuméricos.";
    }

    if (!form.nombre.trim() || !NAME_REGEX.test(form.nombre.trim())) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios.";
    }

    if (!form.carrera) {
      newErrors.carrera = "Selecciona una carrera.";
    }

    const sem = Number(form.semestre);
    if (!Number.isInteger(sem) || sem < 1 || sem > 15) {
      newErrors.semestre = "El semestre debe estar entre 1 y 15.";
    }

    if (!form.periodo) {
      newErrors.periodo = "El periodo es obligatorio.";
    }

    if (!form.estado) {
      newErrors.estado = "Selecciona un estado académico.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        num_control: form.num_control,
        nombre: form.nombre.trim(),
        carrera: form.carrera,
        semestre: Number(form.semestre),
        periodo: form.periodo,
        estado: form.estado,
      };

      if (isEdit) {
        await StudentsApi.update(student.id, payload);
      } else {
        await StudentsApi.create(payload);
      }

      // avisar al padre para recargar lista
      if (onSaved) await onSaved();
      onClose && onClose();
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        global: "Ocurrió un error al guardar. Intenta de nuevo.",
      }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={isEdit ? "Editar estudiante" : "Registrar estudiante"}>
      <div className="student-form-modal">
        {errors.global && (
          <div className="form-alert-error">{errors.global}</div>
        )}

        <form onSubmit={handleSubmit} className="student-form-grid">
          {/* Número de control */}
          <div className="form-field">
            <label htmlFor="num_control">Número de control</label>
            <input
              id="num_control"
              name="num_control"
              type="text"
              value={form.num_control}
              onChange={handleChange}
              minLength={8}
              maxLength={9}
              required
            />
            {errors.num_control && (
              <p className="field-error">{errors.num_control}</p>
            )}
          </div>

          {/* Nombre */}
          <div className="form-field">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            {errors.nombre && (
              <p className="field-error">{errors.nombre}</p>
            )}
          </div>

          {/* Carrera */}
          <div className="form-field">
            <label htmlFor="carrera">Carrera</label>
            <select
              id="carrera"
              name="carrera"
              value={form.carrera}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una carrera</option>
              {CAREERS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.carrera && (
              <p className="field-error">{errors.carrera}</p>
            )}
          </div>

          {/* Semestre */}
          <div className="form-field">
            <label htmlFor="semestre">Semestre</label>
            <select
              id="semestre"
              name="semestre"
              value={form.semestre}
              onChange={handleChange}
              required
            >
              {Array.from({ length: 15 }).map((_, i) => {
                const n = i + 1;
                return (
                  <option key={n} value={n}>
                    {n}
                  </option>
                );
              })}
            </select>
            {errors.semestre && (
              <p className="field-error">{errors.semestre}</p>
            )}
          </div>

          {/* Periodo (solo lectura) */}
          <div className="form-field">
            <label htmlFor="periodo">Periodo</label>
            <input
              id="periodo"
              name="periodo"
              type="text"
              value={form.periodo}
              readOnly
            />
            {errors.periodo && (
              <p className="field-error">{errors.periodo}</p>
            )}
            <p className="field-hint">
              Se genera automáticamente según la fecha actual.
            </p>
          </div>

          {/* Estado académico */}
          <div className="form-field">
            <label htmlFor="estado">Estado académico</label>
            <select
              id="estado"
              name="estado"
              value={form.estado}
              onChange={handleChange}
              required
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            {errors.estado && (
              <p className="field-error">{errors.estado}</p>
            )}
          </div>

          {/* Botones */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
