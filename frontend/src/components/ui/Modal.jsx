// src/components/ui/Modal.jsx
export function Modal({ isOpen, title, message, type = 'info', onClose, actions }) {
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
        {message && <p className="modal-message">{message}</p>}

        <div className="modal-actions">
          {actions ? (
            actions
          ) : (
            <button className="btn btn-primary" type="button" onClick={onClose}>
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
