import api from "./axios";

// GET semua user
export const getUsers = async () => {
  const res = await api.get("/user");
  return res.data;
};

// GET detail user
export const getUserById = async (id) => {
  const res = await api.get(`/user/${id}`);
  return res.data;
};

// CREATE user
export const createUser = async (data) => {
  const res = await api.post("/user", data);
  return res.data;
};

// UPDATE user
export const updateUser = async (id, data) => {
  const res = await api.patch(`/user/${id}`, data);
  return res.data;
};

// DELETE user
export const deleteUser = async (id) => {
  const res = await api.delete(`/user/${id}`);
  return res.data;
};