import axios, { AxiosResponse } from "axios";

// 🔥 BASE URL API
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://service-capstone-project-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Ambil token dari storage
function getToken(): string | null {
  return (
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token")
  );
}

// 🔐 Header Authorization
function withAuth(token?: string) {
  const t = token || getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

//
// ================= AUTH =================
//

// ✅ LOGIN
export async function login(
  email: string,
  password: string
): Promise<AxiosResponse<any>> {
  return api.post("/auth/login", { email, password });
}

// ✅ REGISTER
export async function register(payload: {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}): Promise<AxiosResponse<any>> {
  return api.post("/auth/register", payload);
}

// ✅ LOGOUT
export async function logout(token?: string): Promise<AxiosResponse<any>> {
  return api.post("/auth/logout", null, {
    headers: withAuth(token),
  });
}

//
// ================= USER =================
//

// ✅ GET ALL USERS
export async function getUsers(token?: string): Promise<AxiosResponse<any>> {
  return api.get("/user", {
    headers: withAuth(token),
  });
}

// ✅ GET USER BY ID
export async function getUserById(
  id: string,
  token?: string
): Promise<AxiosResponse<any>> {
  return api.get(`/user/${id}`, {
    headers: withAuth(token),
  });
}

// ✅ CREATE USER
export async function createUser(
  data: {
    name: string;
    email: string;
    password: string;
    role: string;
  },
  token?: string
): Promise<AxiosResponse<any>> {
  return api.post("/user", data, {
    headers: withAuth(token),
  });
}

// ✅ UPDATE USER
export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    role?: string;
  },
  token?: string
): Promise<AxiosResponse<any>> {
  return api.patch(`/user/${id}`, data, {
    headers: withAuth(token),
  });
}

// ✅ DELETE USER
export async function deleteUser(
  id: string,
  token?: string
): Promise<AxiosResponse<any>> {
  return api.delete(`/user/${id}`, {
    headers: withAuth(token),
  });
}

//
// ================= PASSWORD =================
//

// ✅ FORGOT PASSWORD
export async function forgotPassword(
  email: string
): Promise<AxiosResponse<any>> {
  return api.post("/auth/forgot-password", { email });
}

// ✅ RESET PASSWORD
export async function resetPassword(payload: {
  email: string;
  password: string;
}): Promise<AxiosResponse<any>> {
  return api.post("/auth/reset-password", payload);
}

// ✅ CHANGE PASSWORD (BUTUH TOKEN)
export async function changePassword(
  payload: {
    currentPassword: string;
    newPassword: string;
  },
  token?: string
): Promise<AxiosResponse<any>> {
  return api.post("/auth/change-password", payload, {
    headers: withAuth(token),
  });
}