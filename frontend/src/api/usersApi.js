// src/api/usersApi.js
import http from "./http";

export const UsersApi = {
  // Lista con filtros (rol, status, search, division)
  list: (params = {}) => http.get("/users", { params }),

  // Crear usuario
  create: (data) => http.post("/users", data),

  // Detalle
  getById: (id) => http.get(`/users/${id}`),

  getUserById: (id) => http.get(`/users/${id}`).then((res) => res.data),

  // Actualizar usuario
  updateUser: (id, payload) =>
    http.put(`/users/${id}`, payload).then((res) => res.data),

    update: (id, payload) =>
    http.put(`/users/${id}`, payload).then((res) => res.data),
    
  // Soft delete
  remove: (id) => http.delete(`/users/${id}`),

  // Cambiar estado ACTIVO/INACTIVO
  updateStatus: (id, status) =>
    http.patch(`/users/${id}/status`, { status }),

  // Reset password
  resetPassword: (id) => http.post(`/users/${id}/reset-password`),
};
