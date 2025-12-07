// src/mock/riesgos.js

// Semáforo: 'VERDE' | 'AMARILLO' | 'ROJO'
// factorPrincipal: motivo de riesgo principal

export const mockRiesgos = [
  {
    id: 1,
    studentId: '24070087',
    studentName: 'María López',
    division: 'ISC',
    carrera: 'Ingeniería en Sistemas Computacionales',
    periodo: '2025-1',
    factorPrincipal: 'Faltas',
    semaforo: 'ROJO',
    tutorNombre: 'Tutor ISC 1',
    tutorEmail: 'tutor1.isc@itsj.edu.mx',
  },
  {
    id: 2,
    studentId: '24070987',
    studentName: 'Luis Hernández',
    division: 'ISC',
    carrera: 'Ingeniería en Sistemas Computacionales',
    periodo: '2025-1',
    factorPrincipal: 'Reprobaciones',
    semaforo: 'AMARILLO',
    tutorNombre: 'Tutor ISC 1',
    tutorEmail: 'tutor1.isc@itsj.edu.mx',
  },
  {
    id: 3,
    studentId: '24070050',
    studentName: 'Nombre del Alumno',
    division: 'ADM',
    carrera: 'Administración',
    periodo: '2025-1',
    factorPrincipal: 'Alerta manual',
    semaforo: 'VERDE',
    tutorNombre: 'Tutor ADM 1',
    tutorEmail: 'tutor1.adm@itsj.edu.mx',
  },
];
