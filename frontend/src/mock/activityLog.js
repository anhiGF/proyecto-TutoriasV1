// src/mock/activityLog.js

// Acciones típicas de la bitácora:
// - CREAR  (creó)
// - EDITAR (editó)
// - VER    (leyó / consultó)
// - DESCARGAR (descargó)

export const mockActivityLog = [
  {
    id: 1,
    fechaHora: '2025-03-10T09:15:00',
    usuarioNombre: 'Coordinador General',
    usuarioCorreo: 'coord@itsj.edu.mx',
    accion: 'CREAR',
    modulo: 'Tutorías',
    detalle: 'Registró una nueva tutoría para Juan Pérez.',
  },
  {
    id: 2,
    fechaHora: '2025-03-10T09:45:00',
    usuarioNombre: 'Coordinador General',
    usuarioCorreo: 'coord@itsj.edu.mx',
    accion: 'EDITAR',
    modulo: 'Canalizaciones',
    detalle: 'Actualizó el estatus de canalización de María López a EN_SEGUIMIENTO.',
  },
  {
    id: 3,
    fechaHora: '2025-03-11T11:05:00',
    usuarioNombre: 'Jefa de División ISC',
    usuarioCorreo: 'jefe.isc@itsj.edu.mx',
    accion: 'VER',
    modulo: 'Reportes',
    detalle: 'Consultó el reporte de tutorías del periodo 2025-1.',
  },
  {
    id: 4,
    fechaHora: '2025-03-11T11:30:00',
    usuarioNombre: 'Dirección Académica',
    usuarioCorreo: 'dir.acad@itsj.edu.mx',
    accion: 'DESCARGAR',
    modulo: 'Documentos',
    detalle: 'Descargó el informe consolidado de canalizaciones.',
  },
  {
    id: 5,
    fechaHora: '2025-03-12T08:20:00',
    usuarioNombre: 'Coordinador General',
    usuarioCorreo: 'coord@itsj.edu.mx',
    accion: 'VER',
    modulo: 'Estudiantes en riesgo',
    detalle: 'Revisó el panel de estudiantes en riesgo de ISC.',
  },
];
