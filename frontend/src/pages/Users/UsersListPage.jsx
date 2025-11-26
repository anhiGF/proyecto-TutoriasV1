// src/pages/Users/UsersListPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../../mock/users.js';
import { Modal } from '../../components/ui/Modal.jsx';

export function UsersListPage() {
  const [users, setUsers] = useState(mockUsers);
  const [filterRole, setFilterRole] = useState('TODOS');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [modalUser, setModalUser] = useState(null); // para nuevo/editar
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const filteredUsers = users.filter((u) => {
    const byRole = filterRole === 'TODOS' || u.role === filterRole;
    const byStatus = filterStatus === 'TODOS' || u.status === filterStatus;
    return byRole && byStatus;
  });

  const openNewUserModal = () => {
    setModalUser({
      id: null,
      name: '',
      email: '',
      role: 'TUTOR',
      division: '',
      status: 'ACTIVO',
    });
    setModalOpen(true);
  };

  const openEditUserModal = (user) => {
    setModalUser({ ...user });
    setModalOpen(true);
  };

  const closeUserModal = () => {
    setModalOpen(false);
    setModalUser(null);
  };

  const handleUserFormSubmit = (e) => {
    e.preventDefault();
    if (!modalUser) return;

    if (!modalUser.name || !modalUser.email) {
      alert('Nombre y correo son obligatorios');
      return;
    }

    if (modalUser.id == null) {
      // nuevo
      const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers((prev) => [...prev, { ...modalUser, id: newId }]);
    } else {
      // editar
      setUsers((prev) =>
        prev.map((u) => (u.id === modalUser.id ? modalUser : u))
      );
    }

    closeUserModal();
  };

  const handleInputChange = (field, value) => {
    setModalUser((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="card">
      <h1 className="card-title">Gestión de usuarios</h1>
      <p className="card-subtitle">
        IU-05 · Panel para administrar usuarios del sistema de tutorías.
      </p>

      {/* Filtros */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <label className="form-label">Rol</label>
          <select
            className="form-input"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="COORDINACION">Coordinación</option>
            <option value="JEFE_DIVISION">Jefes de División</option>
            <option value="TUTOR">Tutores</option>
            <option value="DIRECCION">Dirección</option>
          </select>
        </div>

        <div>
          <label className="form-label">Estado</label>
          <select
            className="form-input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
          <button className="btn btn-primary" type="button" onClick={openNewUserModal}>
            Nuevo usuario
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nombre</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Correo</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Rol</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>División</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Estado</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '0.5rem' }}>
                  No se encontraron usuarios con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td style={{ padding: '0.5rem' }}>{u.name}</td>
                  <td style={{ padding: '0.5rem' }}>{u.email}</td>
                  <td style={{ padding: '0.5rem' }}>{u.role}</td>
                  <td style={{ padding: '0.5rem' }}>{u.division}</td>
                  <td style={{ padding: '0.5rem' }}>{u.status}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => navigate(`/usuarios/${u.id}`)}
                    >
                      Ver
                    </button>
                    {' · '}
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => openEditUserModal(u)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para alta/edición de usuario */}
      <Modal
        isOpen={modalOpen}
        title={modalUser?.id ? 'Editar usuario' : 'Nuevo usuario'}
        type="info"
        onClose={closeUserModal}
        actions={
          <>
            <button className="btn btn-link" type="button" onClick={closeUserModal}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleUserFormSubmit}
            >
              Guardar
            </button>
          </>
        }
        message={null} // usamos contenido personalizado abajo
      >
        {/* OJO: nuestro Modal actual no admite children; si quisieras contenido dentro, habría que adaptarlo.
            Para no complicar, metimos el formulario abajo usando otra técnica.
        */}
      </Modal>

      {/* Como nuestro Modal actual solo muestra title/message, 
          la forma sencilla es hacer un "modal" propio para el formulario.
          Si prefieres que el formulario esté dentro del popup de arriba,
          luego adaptamos el componente Modal para que acepte children. */}
      {modalOpen && modalUser && (
        <div className="modal-overlay">
          <div className="modal modal-info">
            <h2 className="modal-title">
              {modalUser.id ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>

            <form className="form" onSubmit={handleUserFormSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  className="form-input"
                  value={modalUser.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo institucional</label>
                <input
                  className="form-input"
                  type="email"
                  value={modalUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rol</label>
                <select
                  className="form-input"
                  value={modalUser.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  <option value="COORDINACION">Coordinación</option>
                  <option value="JEFE_DIVISION">Jefe de División</option>
                  <option value="TUTOR">Tutor</option>
                  <option value="DIRECCION">Dirección</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">División / Programa</label>
                <input
                  className="form-input"
                  value={modalUser.division}
                  onChange={(e) => handleInputChange('division', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-input"
                  value={modalUser.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-link"
                  type="button"
                  onClick={closeUserModal}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" type="submit">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
