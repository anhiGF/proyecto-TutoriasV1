// src/pages/Documentos/DocumentListPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDocumentos } from '../../mock/documentos.js';
import { useAuth } from '../../context/AuthContext.jsx';

function getEstadoLectura(doc, userEmail) {
  if (!userEmail) return 'NO_LEIDO';
  const leido = doc.leidoPor.includes(userEmail);
  if (doc.validado) return leido ? 'VALIDADO_Y_LEIDO' : 'VALIDADO';
  return leido ? 'LEIDO' : 'NO_LEIDO';
}

function estadoLecturaLabel(estado) {
  switch (estado) {
    case 'LEIDO':
      return 'Leído';
    case 'VALIDADO':
      return 'Validado';
    case 'VALIDADO_Y_LEIDO':
      return 'Validado y leído';
    default:
      return 'No leído';
  }
}

export function DocumentListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? '';
  const userEmail = user?.email ?? '';
  const userDivision = user?.division ?? '';

  const [docs, setDocs] = useState(mockDocumentos);
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroPeriodo, setFiltroPeriodo] = useState('TODOS');
  const [filtroDivision, setFiltroDivision] = useState('TODAS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  // estado modal subida
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadTipo, setUploadTipo] = useState('REPORTE');
  const [uploadPeriodo, setUploadPeriodo] = useState('ENE-JUN 2025');

  const tipos = Array.from(new Set(docs.map((d) => d.tipo)));
  const periodos = Array.from(new Set(docs.map((d) => d.periodo)));
  const divisiones = Array.from(new Set(docs.map((d) => d.division)));

  const divisionVisible =
    role === 'JEFE_DIVISION' || role === 'TUTOR'
      ? userDivision
      : filtroDivision;

  const filtrados = docs.filter((doc) => {
    if (filtroTipo !== 'TODOS' && doc.tipo !== filtroTipo) return false;
    if (filtroPeriodo !== 'TODOS' && doc.periodo !== filtroPeriodo)
      return false;
    if (divisionVisible && divisionVisible !== 'TODAS') {
      if (doc.division !== divisionVisible) return false;
    }

    const estado = getEstadoLectura(doc, userEmail);
    if (filtroEstado !== 'TODOS' && estado !== filtroEstado) return false;

    return true;
  });

  const puedeSubir =
    role === 'COORDINACION' || role === 'JEFE_DIVISION' || role === 'DIRECCION';

  const handleVerDetalle = (id) => {
    navigate(`/documentos/${id}`);
  };

  const handleDescargar = (doc) => {
    alert(`Descargando documento: ${doc.nombre} (demo)`);
  };

  // ⬆️ abrir/cerrar modal
  const abrirModalSubida = () => {
    if (!puedeSubir) return;
    setSelectedFile(null);
    setUploadTipo('REPORTE');
    setUploadPeriodo(periodos[0] || 'ENE-JUN 2025');
    setIsUploadOpen(true);
  };

  const cerrarModalSubida = () => {
    setSelectedFile(null);
    setIsUploadOpen(false);
  };

  // drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubirArchivo = () => {
    if (!selectedFile) return;

    const nuevoId =
      docs.length > 0 ? Math.max(...docs.map((d) => d.id)) + 1 : 1;

    const fileUrl = URL.createObjectURL(selectedFile);

    const nuevoDoc = {
      id: nuevoId,
      nombre: selectedFile.name,
      tipo: uploadTipo,                  // 👈 tipo seleccionado en el modal
      periodo: uploadPeriodo,            // 👈 periodo capturado
      division: userDivision || 'ISC',
      fechaSubida: new Date().toISOString().slice(0, 10),
      subidoPorNombre: user?.name || 'Usuario demo',
      subidoPorEmail: userEmail || 'demo@itsj.edu.mx',
      leidoPor: [],
      validado: false,
      validadoPor: null,
      url: fileUrl,
      mimeType: selectedFile.type || '',
    };

    mockDocumentos.push(nuevoDoc);
    setDocs((prev) => [...prev, nuevoDoc]);

    alert('Documento subido correctamente (demo).');
    cerrarModalSubida();
  };

  return (
    <div className="card">
      <h1 className="card-title">Repositorio de documentos</h1>
      <p className="card-subtitle">
        U19 · Documentos relacionados con tutorías, oficios y reportes.
      </p>

      {/* Filtros */}
      <div
        className="form"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <div className="form-group">
          <label className="form-label">Tipo de documento</label>
          <select
            className="form-input"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Periodo</label>
          <select
            className="form-input"
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            {periodos.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {role === 'COORDINACION' || role === 'DIRECCION' ? (
          <div className="form-group">
            <label className="form-label">División</label>
            <select
              className="form-input"
              value={filtroDivision}
              onChange={(e) => setFiltroDivision(e.target.value)}
            >
              <option value="TODAS">Todas</option>
              {divisiones.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">División</label>
            <input
              className="form-input"
              value={userDivision || 'No configurada'}
              disabled
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Estatus de lectura (para ti)</label>
          <select
            className="form-input"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="NO_LEIDO">No leído</option>
            <option value="LEIDO">Leído</option>
            <option value="VALIDADO">Validado</option>
            <option value="VALIDADO_Y_LEIDO">Validado y leído</option>
          </select>
        </div>
      </div>

      {/* Botón subir */}
      {puedeSubir && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '0.75rem',
          }}
        >
          <button
            className="btn btn-primary"
            type="button"
            onClick={abrirModalSubida}
          >
            Subir nuevo documento
          </button>
        </div>
      )}

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre del documento</th>
              <th>Tipo</th>
              <th>Periodo</th>
              <th>División</th>
              <th>Fecha de subida</th>
              <th>Quién lo subió</th>
              <th>Estatus lectura (para ti)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>
                  No hay documentos que coincidan con los filtros.
                </td>
              </tr>
            )}
            {filtrados.map((doc) => {
              const estado = getEstadoLectura(doc, userEmail);
              return (
                <tr key={doc.id}>
                  <td>{doc.nombre}</td>
                  <td>{doc.tipo}</td>
                  <td>{doc.periodo}</td>
                  <td>{doc.division}</td>
                  <td>{doc.fechaSubida}</td>
                  <td>{doc.subidoPorNombre}</td>
                  <td>{estadoLecturaLabel(estado)}</td>
                  <td>
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => handleVerDetalle(doc.id)}
                    >
                      Ver detalle
                    </button>
                    <span> · </span>
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => handleDescargar(doc)}
                    >
                      Descargar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de subida */}
      {isUploadOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="card-title" style={{ marginBottom: '0.5rem' }}>
              Subir nuevo documento
            </h2>
            <p className="card-subtitle" style={{ marginBottom: '1rem' }}>
              Arrastra un archivo a la zona o selecciónalo desde tu equipo.
            </p>

            <div
              className="upload-dropzone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {!selectedFile ? (
                <p>
                  Arrastra un archivo aquí o haz clic en{' '}
                  <label
                    htmlFor="file-input"
                    style={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    seleccionar archivo
                  </label>
                  .
                </p>
              ) : (
                <div>
                  <p style={{ marginBottom: '0.25rem' }}>
                    <strong>Archivo seleccionado:</strong> {selectedFile.name}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>
                    Tamaño aproximado: {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              )}

              <input
                id="file-input"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {/* Tipo y periodo dentro del modal */}
            <div
              className="form"
              style={{
                marginTop: '1rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '0.75rem',
              }}
            >
              <div className="form-group">
                <label className="form-label">Tipo de documento</label>
                <select
                  className="form-input"
                  value={uploadTipo}
                  onChange={(e) => setUploadTipo(e.target.value)}
                >
                  <option value="OFICIO">Oficio</option>
                  <option value="REPORTE">Reporte</option>
                  <option value="CONSTANCIA">Constancia</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Periodo</label>
                <input
                  className="form-input"
                  value={uploadPeriodo}
                  onChange={(e) => setUploadPeriodo(e.target.value)}
                  placeholder="Ej. ENE-JUN 2025"
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                marginTop: '1rem',
              }}
            >
              <button
                type="button"
                className="btn btn-link"
                onClick={cerrarModalSubida}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubirArchivo}
                disabled={!selectedFile || !uploadPeriodo}
              >
                Subir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
