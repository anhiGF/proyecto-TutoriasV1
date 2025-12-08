// src/pages/Users/UsersListPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/ui/Modal.jsx";
import { UsersApi } from "../../api/usersApi";

export function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("TODOS");
  const [filterStatus, setFilterStatus] = useState("TODOS");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // modal de crear/editar
  const [modalUser, setModalUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  // ---- Cargar desde el backend ----
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filterRole !== "TODOS") params.role = filterRole;
      if (filterStatus !== "TODOS") params.status = filterStatus;
      if (searchText.trim() !== "") params.search = searchText.trim();

      const { data } = await UsersApi.list(params);
      // Backend devuelve paginator { data: [...] }
      setUsers(data.data ?? []);
    } catch (err) {
      console.error("Error cargando usuarios", err);
      alert("Ocurrió un error al cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  // cargar al entrar y cuando cambien filtros
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRole, filterStatus]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // ---- Modal nuevo / editar ----
  const openNewUserModal = () => {
    setModalUser({
      id: null,
      name: "",
      email: "",
      role: "TUTOR",
      division: "",
      status: "ACTIVO",
      password: "",
      passwordConfirm: "",
    });
    setModalOpen(true);
  };

  const openEditUserModal = (user) => {
    setModalUser({ ...user,
    password: "",
    passwordConfirm: "", });
    setModalOpen(true);
  };

  const closeUserModal = () => {
    setModalOpen(false);
    setModalUser(null);
  };

  const handleInputChange = (field, value) => {
    setModalUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    if (!modalUser) return;

    if (!modalUser.name || !modalUser.email) {
      alert("Nombre y correo son obligatorios");
      return;
    }

    // Validación frontend del nombre
    const nameRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/;

    if (!nameRegex.test(modalUser.name)) {
      alert("El nombre solo puede contener letras y espacios.");
      return;
    }

    if (modalUser.password || modalUser.passwordConfirm) {
      if (modalUser.password !== modalUser.passwordConfirm) {
        alert("La contraseña y la confirmación no coinciden.");
        return;
      }
     }
    try {
      if (modalUser.id == null) {
        // crear
        const payload = {
          name: modalUser.name,
          email: modalUser.email,
          role: modalUser.role,
          division: modalUser.division,
          status: modalUser.status,
        password: modalUser.password,
        password_confirmation: modalUser.passwordConfirm,
        };

        await UsersApi.create(payload);
      } else {
        // actualizar
        const payload = {
          name: modalUser.name,
          email: modalUser.email,
          role: modalUser.role,
          division: modalUser.division,
          status: modalUser.status,
        };

        if (modalUser.password) {
        payload.password = modalUser.password;
        payload.password_confirmation = modalUser.passwordConfirm;
      }
        await UsersApi.updateUser(modalUser.id, payload);
      }

      closeUserModal();
      await fetchUsers();
    } catch (err) {
      console.error("Error guardando usuario", err);

      if (err.response?.status === 422) {
        const errors = err.response.data?.errors;
        const msg =
          errors && typeof errors === "object"
            ? Object.values(errors).flat().join("\n")
            : "Datos inválidos. Revisa el formulario.";
        alert(msg);
      } else {
        alert("Ocurrió un error al guardar el usuario.");
      }
    }
  };

  // ---- Reset pass ----
 {/* const handleResetPassword = async (user) => {
    if (!window.confirm(`¿Resetear contraseña de ${user.email}?`)) return;

    try {
      await UsersApi.resetPassword(user.id);
      alert("Contraseña reseteada. Se generó una nueva contraseña temporal.");
    } catch (err) {
      console.error("Error al resetear contraseña", err);
      alert("No se pudo resetear la contraseña.");
    }
  };*/}

  // ---- Soft delete ----
  const handleDeleteUser = async (user) => {
    if (
      !window.confirm(
        `¿Eliminar (lógicamente) al usuario ${user.name} (${user.email})?`
      )
    )
      return;

    try {
      await UsersApi.remove(user.id);
      await fetchUsers();
    } catch (err) {
      console.error("Error al eliminar usuario", err);
      alert("No se pudo eliminar el usuario.");
    }
  };

  return (
    <div className="card">
      <h1 className="card-title">Gestión de usuarios</h1>
      <p className="card-subtitle">
        IU-05 · Panel para administrar usuarios del sistema de tutorías.
      </p>

      {/* Filtros */}
      <form
        onSubmit={handleApplyFilters}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1rem",
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

        <div>
          <label className="form-label">Buscar</label>
          <input
            className="form-input"
            placeholder="Nombre o correo"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div style={{ marginLeft: "auto", alignSelf: "flex-end" }}>
          <button className="btn btn-secondary" type="submit">
            Aplicar filtros
          </button>
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={openNewUserModal}
          >
            Nuevo usuario
          </button>
        </div>
      </form>

      {/* Tabla */}
      <div style={{ overflowX: "auto" }}>
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Nombre</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Correo</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Rol</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>
                  División
                </th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>
                  Estado
                </th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "0.5rem" }}>
                    No se encontraron usuarios con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ padding: "0.5rem" }}>{u.name}</td>
                    <td style={{ padding: "0.5rem" }}>{u.email}</td>
                    <td style={{ padding: "0.5rem" }}>{u.role}</td>
                    <td style={{ padding: "0.5rem" }}>{u.division}</td>
                    <td style={{ padding: "0.5rem" }}>{u.status}</td>
                    <td style={{ padding: "0.5rem" }}>
                      <button
                        className="btn btn-link"
                        type="button"
                        onClick={() => navigate(`/usuarios/${u.id}`)}
                      >
                        Ver
                      </button>
                      {" · "}
                      <button
                        className="btn btn-link"
                        type="button"
                        onClick={() => openEditUserModal(u)}
                      >
                        Editar
                      </button>
                      {" · "}
                      
                    {/* <button
                        className="btn btn-link"
                        type="button"
                        onClick={() => handleResetPassword(u)}
                      >
                        Reset pass
                      </button>
                      {" · "}*/}
                      <button
                        className="btn btn-link text-danger"
                        type="button"
                        onClick={() => handleDeleteUser(u)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de formulario */}
      {modalOpen && modalUser && (
        <div className="modal-overlay">
          <div className="modal modal-info">
            <h2 className="modal-title">
              {modalUser.id ? "Editar usuario" : "Nuevo usuario"}
            </h2>

            <form className="form" onSubmit={handleUserFormSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  className="form-input"
                  value={modalUser.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo institucional</label>
                <input
                  className="form-input"
                  type="email"
                  value={modalUser.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  className="form-input"
                  type="password"
                  value={modalUser.password ?? ""}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder={
                    modalUser.id
                      ? "Deja en blanco para no cambiarla"
                      : "Mín. 8 caracteres, 2 números..."
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  className="form-input"
                  type="password"
                  value={modalUser.passwordConfirm ?? ""}
                  onChange={(e) =>
                    handleInputChange("passwordConfirm", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rol</label>
                <select
                  className="form-input"
                  value={modalUser.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
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
                  onChange={(e) =>
                    handleInputChange("division", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-input"
                  value={modalUser.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
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
