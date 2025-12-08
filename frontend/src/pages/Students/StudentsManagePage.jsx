// src/pages/Students/StudentsManagePage.jsx
import { useState, useMemo, useEffect } from "react";

import StudentsTable from "../../components/Students/StudentsTable";
import StudentFilters from "../../components/Students/StudentFilters";
import StudentAssignModal from "../../components/Students/StudentAssignModal";
import StudentDeleteModal from "../../components/Students/StudentDeleteModal";
import StudentFormModal from "../../components/Students/StudentFormModal";

import { StudentsApi } from "../../api/studentsApi";
import { mockTutors } from "../../mock/students";

export default function StudentsManagePage() {
  // ---------------- ESTADO PRINCIPAL ----------------
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    periodo: "",
    carrera: "TODAS",
    estado: "TODOS",
    tutorId: "TODOS",
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);

  // Modales
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // ---------------- CARGAR LISTA DESDE API ----------------
  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await StudentsApi.list();
      // Laravel puede regresar varias formas, cubrimos las típicas:
      const rows =
        res.data?.data || 
        res.data?.students || 
        res.data || 
        [];

      setStudents(rows);
    } catch (err) {
      console.error("Error cargando estudiantes", err);
      setError("No se pudieron cargar los estudiantes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);
// Recargar estudiantes cada 15 segundos
useEffect(() => {
  const interval = setInterval(() => {
    loadStudents();  
  }, 15000); // 15000 ms = 15 segundos

  return () => clearInterval(interval); // limpiar intervalo al salir
}, []);

  // ---------------- CAMBIO DE FILTROS ----------------
  const handleFiltersChange = (next) => {
    // resetear paginación y selección
    setPage(1);
    setSelectedIds([]);

    setFilters((prev) => (typeof next === "function" ? next(prev) : next));
  };

  // ---------------- FILTRADO EN MEMORIA ----------------
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (filters.carrera !== "TODAS" && s.carrera !== filters.carrera) return false;
      if (filters.estado !== "TODOS" && s.estado !== filters.estado) return false;
      if (filters.tutorId !== "TODOS" && String(s.tutor_id) !== String(filters.tutorId))
        return false;
      if (filters.periodo && s.periodo !== filters.periodo) return false;
      return true;
    });
  }, [students, filters]);

  // ---------------- PAGINACIÓN ----------------
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, page]);

  // ---------------- ACCIONES ----------------

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowFormModal(true);
  };

  const handleDelete = (student) => {
    setEditingStudent(student);
    setShowDeleteModal(true);
  };

  const handleAssignTutor = () => {
    if (selectedIds.length === 0) return;
    setShowAssignModal(true);
  };

  const handleAfterSave = () => {
    setEditingStudent(null);
    setShowFormModal(false);
    loadStudents();
  };

  const handleAfterDelete = () => {
    setShowDeleteModal(false);
    setEditingStudent(null);
    setSelectedIds([]);
    loadStudents();
  };

  const handleAfterAssign = () => {
    setShowAssignModal(false);
    setSelectedIds([]);
    loadStudents();
  };

  // ---------------- RENDER ----------------
  return (
    <main className="page-container">
      <h1 className="page-title">Gestión de Estudiantes y Asignación de Tutores</h1>

      {/* FILTROS */}
      <StudentFilters
        filters={filters}
        onChange={handleFiltersChange}
        tutors={mockTutors}
      />

      {/* MENSAJES DE ESTADO */}
      {loading && <p>Cargando estudiantes...</p>}
      {error && <p className="text-error">{error}</p>}

      {/* ACCIONES SUPERIORES */}
      <div className="actions-row">
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingStudent(null);
            setShowFormModal(true);
          }}
        >
          Registrar estudiante
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleAssignTutor}
          disabled={selectedIds.length === 0}
        >
          Asignar tutor a seleccionados
        </button>
      </div>

      {/* TABLA */}
      <StudentsTable
        data={paginatedStudents}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* PAGINACIÓN */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          ◀ Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente ▶
        </button>
      </div>

      {/* MODAL ALTA / EDICIÓN */}
      {showFormModal && (
        <StudentFormModal
          student={editingStudent}
          onClose={() => {
            setEditingStudent(null);
            setShowFormModal(false);
          }}
          onSaved={handleAfterSave}
        />
      )}

      {/* MODAL ELIMINAR */}
      {showDeleteModal && editingStudent && (
        <StudentDeleteModal
          student={editingStudent}
          onClose={() => {
            setShowDeleteModal(false);
            setEditingStudent(null);
          }}
          onDeleted={handleAfterDelete}
        />
      )}

      {/* MODAL ASIGNAR TUTOR */}
      {showAssignModal && (
        <StudentAssignModal
          tutorList={mockTutors}
          selectedIds={selectedIds}
          onClose={() => setShowAssignModal(false)}
          onAssigned={handleAfterAssign}
        />
      )}
    </main>
  );
}
