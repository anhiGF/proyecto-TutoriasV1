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
export const mockTutors = [
  {
    id: 't1',
    email: 'tutor1@itsj.edu.mx',
    nombre: 'Tutor ISC 1',
    carrera: 'ISC',
    division: 'ISC',
  },
  {
    id: 't2',
    email: 'tutor2@itsj.edu.mx',
    nombre: 'Tutor ISC 2',
    carrera: 'ISC',
    division: 'ISC',
  },
  // agrega los tutores que necesites
];