// src/components/ui/Modal.jsx
import React from 'react';

export default function Modal({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
  actions,
  children,
}) {
  if (!isOpen) return null;

  const typeClass = {
    success: 'modal-success',
    error: 'modal-error',
    info: 'modal-info',
    warning: 'modal-warning',
  }[type] || 'modal-info';

  return (
    <div className="modal-overlay">
      <div className={`modal ${typeClass}`}>
        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-body">
          {/* Si hay children, los mostramos. Si no, mostramos el mensaje simple */}
          {children ? (
            children
          ) : (
            message && <p className="modal-message">{message}</p>
          )}
        </div>

        <div className="modal-actions">
          {actions ? (
            actions
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
            >
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
