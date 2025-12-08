// src/context/AuthContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { AuthApi } from "../api/authApi";
import { STORAGE_KEY } from "../api/http";

const AuthContext = createContext(null);
const SESSION_DURATION_MS = 15 * 60 * 1000; // 15 minutos

function loadInitialSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { user: null, token: null };

    const parsed = JSON.parse(saved);
    if (!parsed.expiresAt || parsed.expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return { user: null, token: null };
    }

    return {
      user: parsed.user || null,
      token: parsed.token || null,
    };
  } catch (err) {
    console.error("Error leyendo sesión almacenada", err);
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const initial = loadInitialSession();
  const [user, setUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);

  const login = async (email, password) => {
    try {

    const data = await AuthApi.login(email, password);

    const userFromApi = data.user ?? data;
    const tokenFromApi = data.token ?? null;

    const session = {
      user: userFromApi,
      token: tokenFromApi,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(userFromApi);
    setToken(tokenFromApi);

    return userFromApi;
    } catch (err) {
      console.error("Error en login", err);

      if (err.response?.status === 401) {
        throw new Error("Correo o contraseña incorrectos.");
      }

      throw new Error("No se pudo iniciar sesión. Intenta de nuevo.");
    }
  };

  const logout = async () => {
    try {
      await AuthApi.logout();
    } catch (e) {
      console.warn("Logout en backend falló (continuando de todos modos)", e);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return ctx;
}
