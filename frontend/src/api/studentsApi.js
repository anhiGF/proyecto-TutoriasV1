import http from "./http";

export const StudentsApi = {
  list: (params = {}) => http.get("/students", { params }),
  create: (data) => http.post("/students", data),
  update: (id, data) => http.put(`/students/${id}`, data),
  remove: (id) => http.delete(`/students/${id}`),
  assignTutor: (payload) => http.post("/students/assign-tutor", payload),
};
