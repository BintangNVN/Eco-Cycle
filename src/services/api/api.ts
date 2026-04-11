import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://service-capstone-project-production.up.railway.app/api/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// KUMPULAN FUNGSI API
// ==========================================

export const login = async (email: string, password: string) => {
  return await api.post("/auth/login", { email, password });
};

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}) => {
  return await api.post("/auth/register", {
    name: payload.name, 
    email: payload.email,
    password: payload.password,
    password_confirmation: payload.password, 
    phoneNumber: payload.phoneNumber
  });
};
export const logout = async () => {
  return await api.post("/auth/logout");
};

export const getUsers = async () => {
  return await api.get("/user");
};

export const forgotPassword = async (email: string) => {
  return await api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (payload: { email: string; password: string }) => {
  return await api.post("/auth/reset-password", payload);
};

export const changePassword = async (payload: { currentPassword: string; newPassword: string }) => {
  return await api.post("/auth/change-password", {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword
  });
};

export const getMyPosts = async () => {
  return await api.get("/post");
};


export const createPost = async (formData: FormData) => {
  return await api.post("/post", formData); 
};

export const getCategories = async () => {
  return await api.get("/category");
};

export const deletePost = async (id: string) => {
  return await api.delete(`/post/${id}`);
};


export const updatePost = async (id: string, formData: FormData) => {
  formData.append("_method", "PATCH"); 
  return await api.post(`/post/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const getPostDetail = async (id: string) => {
  return await api.get(`/post/${id}`);
};
export default api;