// src/api/authApi.js
import http from "./http";


export const AuthApi = {
  login: (email, password) =>
    http.post("/auth/login", { email, password }).then((res) => res.data),

  logout: () => http.post("/auth/logout"),

  me: () => http.get("/auth/me").then((res) => res.data),

  resetPassword: (email, new_password, new_password_confirmation) =>
    http
      .post("/auth/reset-password", {
        email,
        new_password,
        new_password_confirmation,
      })
      .then((res) => res.data),
};
