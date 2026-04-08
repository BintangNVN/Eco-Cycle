import api from "./axios";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  // ambil token dari response
  const token = response.data.data.token;

  // simpan ke localStorage
  localStorage.setItem("token", token);

  return response.data;
};