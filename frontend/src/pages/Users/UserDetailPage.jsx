// src/pages/Users/UserDetailPage.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UsersApi } from "../../api/usersApi.js";

export function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
         const response = await UsersApi.getById(id);
        setUser(response.data);  
      } catch (err) {
        console.error("Error cargando usuario", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  if (loading) {
    return (
      <div className="card">
        <h1 className="card-title">Cargando usuario...</h1>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="card">
        <h1 className="card-title">Usuario no encontrado</h1>
        <p className="card-subtitle">
          El usuario con ID {id} no existe en el sistema.
        </p>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => navigate("/usuarios")}
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h1 className="card-title">Detalle de usuario</h1>
      <p className="card-subtitle">
        IU-06 · Vista individual con información del usuario.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div>
          <strong>ID:</strong> {user.id}
        </div>
        <div>
          <strong>Nombre:</strong> {user.name}
        </div>
        <div>
          <strong>Correo:</strong> {user.email}
        </div>
        <div>
          <strong>Rol:</strong> {user.role}
        </div>
        <div>
          <strong>División / Programa:</strong> {user.division}
        </div>
        <div>
          <strong>Estado:</strong> {user.status}
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <Link to="/usuarios">
          <button className="btn btn-link" type="button">
            ← Volver a gestión de usuarios
          </button>
        </Link>
      </div>
    </div>
  );
}
