// src/mock/canalizaciones.js

export const mockCanalizaciones = [
  {
    id: 1,
    fecha: '2025-09-29',
    estudianteId: '24070987',
    estudianteNombre: 'Nombre del Alumno',
    carrera: 'Ingeniería en Sistemas Computacionales',
    semestre: '3°',
    edad: 19,
    division: 'ISC',

    tutorId: 'tutor1.isc@itsj.edu.mx',
    tutorNombre: 'Tutor ISC 1',

    tipoAtencion: 'Apoyo psicológico', // psicológico, médico, académico, social, etc.
    estado: 'ABIERTA', // ABIERTA | EN_SEGUIMIENTO | CERRADA

    problematica: 'Probable problema de dislexia.',
    servicioSolicitado:
      'Diagnóstico por experto, retroalimentación a docentes y apoyo psicológico.',
    observaciones:
      'Docentes observan dificultades en productos de trabajo y en la forma de expresarse.',

    seguimiento: '',
    contrarreferencia: '',
  },
  {
    id: 2,
    fecha: '2025-10-10',
    estudianteId: '240700877',
    estudianteNombre: 'María López',
    carrera: 'Ingeniería en Sistemas Computacionales',
    semestre: '5°',
    edad: 21,
    division: 'ISC',

    tutorId: 'tutor1.isc@itsj.edu.mx',
    tutorNombre: 'Tutor ISC 1',

    tipoAtencion: 'Orientación educativa',
    estado: 'EN_SEGUIMIENTO',

    problematica: 'Bajo rendimiento en varias materias y ausencias recurrentes.',
    servicioSolicitado:
      'Evaluación de situación académica y plan de regularización.',
    observaciones: 'La estudiante refiere problemas organizando sus tiempos.',

    seguimiento:
      'Se programaron sesiones de seguimiento quincenal con el área de orientación.',
    contrarreferencia: '',
  },
  {
    id: 3,
    fecha: '2025-10-05',
    estudianteId: '240700500',
    estudianteNombre: 'Luis Hernández',
    carrera: 'Ingeniería en Sistemas Computacionales',
    semestre: '1°',
    edad: 18,
    division: 'ISC',

    tutorId: 'coord@itsj.edu.mx',
    tutorNombre: 'Coordinador General',

    tipoAtencion: 'Apoyo psicológico',
    estado: 'CERRADA',

    problematica: 'Ansiedad relacionada con adaptación al entorno universitario.',
    servicioSolicitado: 'Atención psicológica breve y talleres de habilidades.',
    observaciones: 'Mostró mejoría después de varias sesiones.',

    seguimiento:
      '3 sesiones individuales con psicología. Se registró disminución de síntomas.',
    contrarreferencia:
      'Caso cerrado, se sugiere seguimiento desde tutoría académica de forma preventiva.',
  },
];
