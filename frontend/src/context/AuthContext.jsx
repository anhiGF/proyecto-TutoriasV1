/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'tutorias_auth_demo';
const SESSION_DURATION_MS = 60 * 1000; // 1 minuto

// Esta función se ejecuta una sola vez al montar el contexto
function loadInitialUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);

    // si no hay expiración o ya caducó, borramos y regresamos null
    if (!parsed.expiresAt || parsed.expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed.user || null;
  } catch (err) {
    console.error('Error leyendo sesión almacenada', err);
    return null;
  }
}

export function AuthProvider({ children }) {
  // user se inicializa leyendo localStorage UNA sola vez
  const [user, setUser] = useState(loadInitialUser);

  const login = async (email, password) => {
    if (!email.endsWith('@itsj.edu.mx')) {
      throw new Error('El correo debe ser institucional (@itsj.edu.mx).');
    }
    if (password.length < 4) {
      throw new Error('La contraseña es demasiado corta.');
    }

    let role = 'TUTOR';
    if (email.startsWith('coord')) role = 'COORDINACION';
    if (email.startsWith('jefe')) role = 'JEFE_DIVISION';
    if (email.startsWith('dir')) role = 'DIRECCION';

    const fakeUser = {
      name: 'Usuario Demo',
      email,
      role,
      division: 'Ingeniería en Sistemas Computacionales',
    };

    // simulamos delay de red
    await new Promise((res) => setTimeout(res, 300));

    const session = {
      user: fakeUser,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(fakeUser);

    return fakeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return ctx;
}
