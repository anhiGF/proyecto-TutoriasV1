// src/mock/students.js
export const mockStudents = [
  {
    id: 1,
    numControl: '24070087',
    nombre: 'Juan Pérez',
    carrera: 'ISC',
    division: 'ISC',        // para que JEFE_DIVISION filtre
    semestre: 3,
    periodoActual: '2025-1',
    estado: 'ACTIVO',       // ACTIVO / INACTIVO
    tutorEmail: 'tutor1@itsj.edu.mx', // o null / ''
  },
  // ...
];

// frontend/src/mock/students.js

export const mockTutors = [
  {
    id: 1,
    nombre: "Tutor ISC 1",
    carrera: "ISC",
    email: "tutor1@itsj.edu.mx",
  },
  {
    id: 2,
    nombre: "Tutor ISC 2",
    carrera: "ISC",
    email: "tutor2@itsj.edu.mx",
  },
  {
    id: 3,
    nombre: "Tutor II 1",
    carrera: "II",
    email: "tutor3@itsj.edu.mx",
  },
  {
    id: 4,
    nombre: "Tutor CP 1",
    carrera: "CP",
    email: "tutor4@itsj.edu.mx",
  },
];
