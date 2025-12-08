// src/api/http.js
import axios from "axios";

export const STORAGE_KEY = "tutorias_auth_demo";

const http = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Interceptor: antes de cada request, agrega el Authorization si hay token válido
http.interceptors.request.use(
  (config) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const token = parsed.token;
        const expiresAt = parsed.expiresAt;

        if (token && (!expiresAt || expiresAt > Date.now())) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.error("Error leyendo token de sesión", e);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default http;
