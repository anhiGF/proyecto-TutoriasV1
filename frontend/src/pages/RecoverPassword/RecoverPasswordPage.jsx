// src/pages/RecoverPassword/RecoverPasswordPage.jsx
import { useState } from "react";
import { AuthApi } from "../../api/authApi";

export function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error"
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      const resp = await AuthApi.resetPassword(
        email,
        newPassword,
        confirmPassword
      );

      setStatus("success");
      setMessage(
        resp.message ||
          "Contraseña actualizada correctamente. Ya puedes iniciar sesión."
      );
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error al resetear contraseña", err);
      setStatus("error");

      const msg =
        err.response?.data?.message ||
        "No se pudo actualizar la contraseña. Verifica los datos.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="card-title">Recuperar / restablecer contraseña</h1>
      <p className="card-subtitle">
        Ingresa tu correo institucional y una nueva contraseña. Si tu cuenta
        está registrada, se actualizará y podrás usarla para iniciar sesión.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Correo institucional
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@itsj.edu.mx"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="newPassword">
            Nueva contraseña
          </label>
          <input
            id="newPassword"
            type="password"
            className="form-input"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
          <small style={{ fontSize: "0.8rem", color: "#555" }}>
            Mínimo 8 caracteres, al menos 2 números y sin 3 caracteres
            iguales seguidos.
          </small>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">
            Confirmar nueva contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="form-input"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repítela"
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Actualizar contraseña"}
        </button>
      </form>

      {status === "success" && (
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "green" }}>
          {message}
        </p>
      )}

      {status === "error" && (
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}
