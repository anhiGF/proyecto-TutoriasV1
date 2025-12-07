// src/pages/Students/StudentsManagePage.jsx
import { useState, useMemo } from "react";

import StudentsTable from "../../components/Students/StudentsTable";
import StudentFilters from "../../components/Students/StudentFilters";
import StudentAssignModal from "../../components/Students/StudentAssignModal";
import StudentDeleteModal from "../../components/Students/StudentDeleteModal";
import StudentFormModal from "../../components/Students/StudentFormModal";

// 👉 Datos mock (después se conectarán a la BD)
import { mockStudents, mockTutors } from "../../mock/students";

export default function StudentsManagePage() {
  // 🔹 AHORA los estudiantes viven en estado, no sólo en el mock
  const [students, setStudents] = useState(mockStudents);

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

  // --------------------------
  // 🔧 Manejo de filtros
  // --------------------------
  const handleFiltersChange = (next) => {
    setPage(1);         // reset de página
    setSelectedIds([]); // limpiar selección

    setFilters((prev) => (typeof next === "function" ? next(prev) : next));
  };

  // --------------------------
  // 🔎 Filtrado de estudiantes
  // --------------------------
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (filters.carrera !== "TODAS" && s.carrera !== filters.carrera) return false;
      if (filters.estado !== "TODOS" && s.estado !== filters.estado) return false;
      if (filters.tutorId !== "TODOS" && s.tutorId !== filters.tutorId) return false;
      if (filters.periodo && s.periodo !== filters.periodo) return false;
      return true;
    });
  }, [students, filters]);

  // --------------------------
  // 📄 Paginación real
  // --------------------------
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, page]);

  // --------------------------
  // 🧩 Acciones
  // --------------------------
  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowFormModal(true);
  };

  const handleDelete = (student) => {
    setEditingStudent(student);
    setShowDeleteModal(true);
  };

  const handleAssignTutor = () => setShowAssignModal(true);

  // 💾 Guardar/crear estudiante desde el modal
  const handleSaveStudent = (data) => {
    setStudents((prev) => {
      if (data.id) {
        // editar
        return prev.map((s) => (s.id === data.id ? { ...s, ...data } : s));
      }
      // crear nuevo
      const nextId = prev.length ? Math.max(...prev.map((s) => s.id)) + 1 : 1;
      return [
        ...prev,
        {
          ...data,
          id: nextId,
        },
      ];
    });
  };

  // 🗑 Confirmar eliminación
  const handleConfirmDelete = () => {
    if (!editingStudent) return;

    setStudents((prev) => prev.filter((s) => s.id !== editingStudent.id));
    setSelectedIds((prev) => prev.filter((id) => id !== editingStudent.id));
    setEditingStudent(null);
    setShowDeleteModal(false);
  };

  // 👥 Asignar tutor en lote
  const handleAssignTutorConfirm = (tutorId) => {
    const tutor = mockTutors.find((t) => t.id === tutorId);

    setStudents((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id)
          ? {
              ...s,
              tutorId,
              tutorNombre: tutor ? tutor.nombre : "Tutor asignado",
            }
          : s
      )
    );

    setShowAssignModal(false);
    // podrías limpiar selección si quieres:
    // setSelectedIds([]);
  };

  return (
    <main className="page-container">
      <h1 className="page-title">Gestión de Estudiantes y Asignación de Tutores</h1>

      {/* ---------------- FILTROS ---------------- */}
      <StudentFilters
        filters={filters}
        onChange={handleFiltersChange}
        tutors={mockTutors}
      />

      {/* ---------- BOTONES SUPERIORES ----------- */}
      <div className="actions-row">
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingStudent(null); // nuevo estudiante
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

      {/* ---------------- TABLA ---------------- */}
      <StudentsTable
        data={paginatedStudents}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ---------------- PAGINACIÓN ---------------- */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ◀ Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Siguiente ▶
        </button>
      </div>

      {/* ---------------- MODALES ---------------- */}
      {showFormModal && (
        <StudentFormModal
          student={editingStudent}
          tutors={mockTutors}
          onSave={handleSaveStudent}
          onClose={() => {
            setEditingStudent(null);
            setShowFormModal(false);
          }}
        />
      )}

      {showDeleteModal && editingStudent && (
        <StudentDeleteModal
          student={editingStudent}
          onConfirm={handleConfirmDelete}
          onClose={() => {
            setEditingStudent(null);
            setShowDeleteModal(false);
          }}
        />
      )}

      {showAssignModal && (
        <StudentAssignModal
          tutorList={mockTutors}
          selectedIds={selectedIds}
          onAssign={handleAssignTutorConfirm}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </main>
  );
}
