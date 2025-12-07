// src/mock/documentos.js

export const mockDocumentos = [
  {
    id: 1,
    nombre: 'Informe parcial de tutorías ENE-JUN 2025',
    tipo: 'REPORTE', // OFICIO | REPORTE | CONSTANCIA
    periodo: 'ENE-JUN 2025',
    division: 'ISC',
    fechaSubida: '2025-06-15',
    subidoPorNombre: 'Coordinación de Tutorías ISC',
    subidoPorEmail: 'coord.isc@itsj.edu.mx',
    leidoPor: ['tutor1@itsj.edu.mx'], // correos/ids de usuarios que ya lo leyeron
    validado: false,
    validadoPor: null,
    url: '#', // enlace de descarga (demo)
    mimeType: 'application/pdf',
  },
  {
    id: 2,
    nombre: 'Oficio de canalización a Psicología',
    tipo: 'OFICIO',
    periodo: 'ENE-JUN 2025',
    division: 'ISC',
    fechaSubida: '2025-05-20',
    subidoPorNombre: 'Jefe de División ISC',
    subidoPorEmail: 'jefe.isc@itsj.edu.mx',
    leidoPor: [],
    validado: true,
    validadoPor: 'jefe.isc@itsj.edu.mx',
    url: '#',
    mimeType: 'application/pdf',
  },
  {
    id: 3,
    nombre: 'Constancia de participación en programa de tutorías',
    tipo: 'CONSTANCIA',
    periodo: 'AGO-DIC 2024',
    division: 'INDUSTRIAL',
    fechaSubida: '2024-12-10',
    subidoPorNombre: 'Coordinación de Tutorías Industrial',
    subidoPorEmail: 'coord.ind@itsj.edu.mx',
    leidoPor: [],
    validado: false,
    validadoPor: null,
    url: '#',
    mimeType: 'application/pdf',
  },
];
