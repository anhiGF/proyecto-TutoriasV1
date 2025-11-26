// src/pages/RecoverPassword/RecoverPasswordPage.jsx
import { useState } from 'react';

export function RecoverPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Solicitud de recuperación para:', email);
    // TODO: integrar con backend para enviar correo real
    setSent(true);
  };

  return (
    <div className="card">
      <h1 className="card-title">Recuperar contraseña</h1>
      <p className="card-subtitle">
        Ingresa tu correo institucional. Si tu cuenta está registrada, recibirás
        un enlace para restablecer tu contraseña.
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

        <button className="btn btn-primary" type="submit">
          Enviar enlace de recuperación
        </button>
      </form>

      {sent && (
        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Si el correo existe en el sistema, se ha enviado un enlace de recuperación.
          Revisa tu bandeja de entrada.
        </p>
      )}
    </div>
  );
}
