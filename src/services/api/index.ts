import axios, { AxiosResponse } from "axios";

// Centralized API client for auth + dashboard.
// This file exists because the app imports `./api` from `src/Login.tsx` & `src/Dashboard.tsx`.
const api = axios.create({
  // Default backend URL (sesuaikan dengan yang dipakai di Postman).
  // Override dengan `.env` menggunakan `REACT_APP_API_BASE_URL` jika diperlukan.
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000",
});

function resolveToken(explicitToken?: string): string | null {
  if (explicitToken) return explicitToken;

  return (
    window.localStorage.getItem("auth_token") ??
    window.sessionStorage.getItem("auth_token") ??
    window.localStorage.getItem("token")
  );
}

function withAuth(token?: string) {
  const resolved = resolveToken(token);
  return resolved ? { Authorization: `Bearer ${resolved}` } : {};
}

async function postWithFallback(
  paths: string[],
  payload?: unknown,
  headers?: Record<string, string>
): Promise<AxiosResponse<any>> {
  let lastError: unknown;

  for (const path of paths) {
    try {
      return await api.post(path, payload, {
        headers,
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new Error("Semua endpoint fallback gagal");
}

export function login(email: string, password: string): Promise<AxiosResponse<any>> {
  return postWithFallback(
    ["/api/auth/login"],
    { email, password }
  );
}

export function getUsers(token?: string): Promise<AxiosResponse<any>> {
  return api.get("/user", {
    headers: withAuth(token),
  });
}

export async function logout(token?: string): Promise<AxiosResponse<any>> {
  try {
    return await api.post("/logout", null, {
      headers: withAuth(token),
    });
  } catch {
    // Some backends don't expose logout endpoint; keep client flow working.
    return {
      data: null,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    } as AxiosResponse<any>;
  }
}

export function register(payload: {
  username: string;
  email: string;
  password: string;
}): Promise<AxiosResponse<any>> {
  return postWithFallback(
    ["/register", "/auth/register", "/api/register", "/api/auth/register"],
    payload
  );
}

export function forgotPassword(email: string): Promise<AxiosResponse<any>> {
  return postWithFallback(
    ["/forgot-password", "/auth/forgot-password", "/api/forgot-password", "/api/auth/forgot-password"],
    { email }
  );
}

export function resetPassword(payload: {
  email: string;
  password: string;
}): Promise<AxiosResponse<any>> {
  return postWithFallback(
    ["/reset-password", "/auth/reset-password", "/api/reset-password", "/api/auth/reset-password"],
    payload
  );
}

export function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
  token?: string;
}): Promise<AxiosResponse<any>> {
  const { token, currentPassword, newPassword } = payload;
  return postWithFallback(
    ["/change-password", "/auth/change-password", "/api/change-password", "/api/auth/change-password"],
    { currentPassword, newPassword },
    withAuth(token) as Record<string, string>
  );
}

