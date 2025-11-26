// src/mock/riesgosEstudiantes.js

// Semáforo: 'VERDE' | 'AMARILLO' | 'ROJO'
export const mockRiesgosEstudiantes = [
  {
    id: 1,
    estudianteId: '24070897',
    nombre: 'Nombre del Alumno',
    carrera: 'Ingeniería en Sistemas Computacionales',
    division: 'ISC',
    riesgo: 'ROJO',
    motivo: 'Faltas consecutivas y reprobaciones',
    atendido: false,
    ultimoSeguimiento: '2025-11-10',
  },
  {
    id: 2,
    estudianteId: '24070088',
    nombre: 'María López',
    carrera: 'Ingeniería en Sistemas Computacionales',
    division: 'ISC',
    riesgo: 'AMARILLO',
    motivo: 'Faltas consecutivas',
    atendido: false,
    ultimoSeguimiento: '2025-11-15',
  },
  {
    id: 3,
    estudianteId: '24070050',
    nombre: 'Luis Hernández',
    carrera: 'Ingeniería Industrial',
    division: 'INDUSTRIAL',
    riesgo: 'VERDE',
    motivo: 'Alerta manual',
    atendido: true,
    ultimoSeguimiento: '2025-10-30',
  },
];
