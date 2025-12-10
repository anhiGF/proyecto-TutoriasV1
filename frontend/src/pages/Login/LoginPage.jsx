// src/pages/Login/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import  Modal  from '../../components/ui/Modal.jsx';

function defaultRouteByRole(role) {
  switch (role) {
    case 'COORDINACION':
      return '/dashboard-coordinacion';
    case 'JEFE_DIVISION':
      return '/dashboard-division';
    case 'TUTOR':
      return '/dashboard-tutor';
    case 'DIRECCION':
      return '/dashboard-direccion';
    default:
      return '/perfil';
  }
}

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info',
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const closeModal = () =>
    setModal((m) => ({
      ...m,
      open: false,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);

      const target = defaultRouteByRole(user.role);

      setModal({
        open: true,
        title: 'Inicio de sesión exitoso',
        message: `Bienvenido(a) ${user.name} (${user.role}).`,
        type: 'success',
      });

      setTimeout(() => {
        closeModal();
        navigate(target, { replace: true });
      }, 900);
    } catch (err) {
      setModal({
        open: true,
        title: 'No se pudo iniciar sesión',
        message: err.message || 'Verifica tus datos e inténtalo de nuevo.',
        type: 'error',
      });
    }
  };

  return (
    <>
      <div className="card">
        <h1 className="card-title">Iniciar sesión</h1>
        <p className="card-subtitle">
          Usa tu correo institucional y contraseña asignada por el área de Tutorías.
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
              placeholder="coord@itsj.edu.mx"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Ingresar
          </button>
        </form>

        <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>

      <Modal
        isOpen={modal.open}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />
    </>
  );
}