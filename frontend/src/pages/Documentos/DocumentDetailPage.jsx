// src/pages/Documentos/DocumentDetailPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { mockDocumentos } from '../../mock/documentos.js';
import { useAuth } from '../../context/AuthContext.jsx';

export function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? '';
  const userEmail = user?.email ?? '';
  const userName = user?.name ?? '';

  const original = mockDocumentos.find((d) => d.id === Number(id)) || null;
  const [doc, setDoc] = useState(original);

  const puedeValidar =
    role === 'COORDINACION' || role === 'JEFE_DIVISION' || role === 'DIRECCION';

  // Limpieza de blob URL si fuera necesario (solo por buenas prácticas)
  useEffect(() => {
    return () => {
      // si quisieras revocar URL.createObjectURL aquí necesitarías guardar
      // cuál viene del blob y cuál es una URL real, lo dejamos simple.
    };
  }, []);

  if (!doc) {
    return (
      <div className="card">
        <h1 className="card-title">Documento no encontrado</h1>
        <button
          className="btn btn-link"
          type="button"
          onClick={() => navigate('/documentos')}
        >
          ← Volver al repositorio
        </button>
      </div>
    );
  }

  const haLeido = doc.leidoPor.includes(userEmail);

  const handleMarcarLeido = () => {
    if (!userEmail) {
      alert('Debes iniciar sesión para marcar como leído.');
      return;
    }

    if (haLeido) {
      alert('Ya habías marcado este documento como leído.');
      return;
    }

    const actualizado = {
      ...doc,
      leidoPor: [...doc.leidoPor, userEmail],
    };

    setDoc(actualizado);

    // Actualizar mock global (demo)
    const idx = mockDocumentos.findIndex((d) => d.id === doc.id);
    if (idx !== -1) {
      mockDocumentos[idx] = actualizado;
    }

    alert('Documento marcado como leído (demo).');
  };

  const handleValidar = () => {
    if (!puedeValidar) return;

    const actualizado = {
      ...doc,
      validado: true,
      validadoPor: userEmail,
    };

    setDoc(actualizado);

    const idx = mockDocumentos.findIndex((d) => d.id === doc.id);
    if (idx !== -1) {
      mockDocumentos[idx] = actualizado;
    }

    alert('Documento validado (demo).');
  };

  const handleDescargar = () => {
    if (!doc.url || doc.url === '#') {
      alert('Este documento de demo no tiene archivo adjunto.');
      return;
    }

    const link = document.createElement('a');
    link.href = doc.url;
    // si es pdf o no, igual descargamos con el nombre
    link.download = doc.nombre || 'documento.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVolver = () => {
    navigate(-1);
  };

  const esPDF =
    doc.mimeType?.includes('pdf') ||
    doc.nombre?.toLowerCase().endsWith('.pdf');

  return (
    <div className="card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 className="card-title">Detalle del documento</h1>
          <p className="card-subtitle">
            U20 · Metadatos y acciones sobre el documento seleccionado.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-link"
          onClick={handleVolver}
        >
          ← Volver
        </button>
      </div>

      {/* Previsualización / visor PDF */}
      <section style={{ marginTop: '1rem' }}>
        <h2 className="card-title" style={{ fontSize: '1rem' }}>
          Previsualización
        </h2>

        {!doc.url || doc.url === '#' ? (
          <div className="doc-preview-placeholder">
            <div className={`doc-preview-sheet doc-preview-${doc.tipo.toLowerCase()}`}>
              <div className="doc-preview-header">
                <span className="doc-type-pill">
                  {doc.tipo === 'OFICIO' && 'Oficio oficial'}
                  {doc.tipo === 'REPORTE' && 'Reporte institucional'}
                  {doc.tipo === 'CONSTANCIA' && 'Constancia'}
                  {!['OFICIO', 'REPORTE', 'CONSTANCIA'].includes(doc.tipo) &&
                    doc.tipo}
                </span>
              </div>
              <div className="doc-preview-body">
                <p className="doc-preview-title">{doc.nombre}</p>
                <p className="doc-preview-meta">
                  {doc.periodo} · {doc.division}
                </p>
                <p className="doc-preview-text">
                  Vista previa no disponible (sin archivo adjunto), pero este panel
                  representa el formato de un {doc.tipo.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        ) : esPDF ? (
          <div className="doc-preview-pdf-wrapper">
            <iframe
              title={doc.nombre}
              src={doc.url}
              className="doc-preview-pdf"
            />
          </div>
        ) : (
          <div className="doc-preview-placeholder">
            <div className={`doc-preview-sheet doc-preview-${doc.tipo.toLowerCase()}`}>
              <div className="doc-preview-header">
                <span className="doc-type-pill">
                  {doc.tipo === 'OFICIO' && 'Oficio'}
                  {doc.tipo === 'REPORTE' && 'Reporte'}
                  {doc.tipo === 'CONSTANCIA' && 'Constancia'}
                  {!['OFICIO', 'REPORTE', 'CONSTANCIA'].includes(doc.tipo) &&
                    doc.tipo}
                </span>
                <span className="doc-file-type">
                  {doc.mimeType || 'archivo'}
                </span>
              </div>
              <div className="doc-preview-body">
                <p className="doc-preview-title">{doc.nombre}</p>
                <p className="doc-preview-meta">
                  {doc.periodo} · {doc.division}
                </p>
                <p className="doc-preview-text">
                  Este archivo no es PDF. Puedes descargarlo para verlo con la
                  aplicación correspondiente.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          type="button"
          onClick={handleDescargar}
          style={{ marginTop: '0.75rem' }}
        >
          Descargar documento
        </button>
      </section>


      {/* Metadatos */}
      <section style={{ marginTop: '1.5rem' }}>
        <h2 className="card-title" style={{ fontSize: '1rem' }}>
          Metadatos
        </h2>
        <div
          className="form"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '0.75rem',
          }}
        >
          <div className="form-group">
            <label className="form-label">Nombre del documento</label>
            <input className="form-input" value={doc.nombre} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <input className="form-input" value={doc.tipo} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Periodo</label>
            <input className="form-input" value={doc.periodo} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">División</label>
            <input className="form-input" value={doc.division} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Subido por</label>
            <input
              className="form-input"
              value={`${doc.subidoPorNombre} (${doc.subidoPorEmail})`}
              disabled
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fecha de subida</label>
            <input className="form-input" value={doc.fechaSubida} disabled />
          </div>
        </div>
      </section>

      {/* Quién lo ha leído */}
      <section style={{ marginTop: '1.5rem' }}>
        <h2 className="card-title" style={{ fontSize: '1rem' }}>
          Lecturas registradas
        </h2>
        {doc.leidoPor.length === 0 ? (
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Nadie ha marcado este documento como leído todavía (demo).
          </p>
        ) : (
          <ul style={{ marginTop: '0.5rem', color: '#555' }}>
            {doc.leidoPor.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        )}
        <p style={{ marginTop: '0.75rem', color: '#555' }}>
          Tú actualmente:{' '}
          <strong>{haLeido ? 'ya marcaste como leído' : 'no has leído'}</strong>
          .
        </p>
      </section>

      {/* Validación */}
      <section style={{ marginTop: '1.5rem' }}>
        <h2 className="card-title" style={{ fontSize: '1rem' }}>
          Validación
        </h2>
        <p style={{ marginTop: '0.5rem', color: '#555' }}>
          Estado:{' '}
          <strong>{doc.validado ? 'Validado' : 'Pendiente de validación'}</strong>
        </p>
        {doc.validado && doc.validadoPor && (
          <p style={{ marginTop: '0.25rem', color: '#555' }}>
            Validado por: <strong>{doc.validadoPor}</strong>
          </p>
        )}
      </section>

      {/* Botones de acción */}
      <section style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleMarcarLeido}
          >
            Marcar como leído
          </button>

          {puedeValidar && !doc.validado && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleValidar}
            >
              Validar documento
            </button>
          )}
        </div>
        {userName && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
            Estás autenticado como <strong>{userName}</strong> ({userEmail}).
          </p>
        )}
      </section>
    </div>
  );
}
