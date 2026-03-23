const BASE_URL = process.env.REACT_APP_BASE_URL ?? process.env.REACT_APP_PROD_URL ?? "";

function buildUrl(path: string) {
  return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.message ?? res.statusText;
    throw new Error(message);
  }

  return data as T;
}

export type AuthResponse = {
  data: {
    token: string;
    [key: string]: any;
  };
};

export type UserPayload = {
  name: string;
  email: string;
  role: string;
  password: string;
  [key: string]: any;
};

export async function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(token: string) {
  return request<unknown>("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getUsers(token: string) {
  return request<{ data: any[] }>("/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createUser(payload: UserPayload, token?: string) {
  return request<{ data: any }>("/user", {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
}

export async function getUserDetail(token: string, userId: string) {
  return request<{ data: any }>(`/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateUser(token: string, userId: string, payload: Partial<UserPayload>) {
  return request<{ data: any }>(`/user/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(token: string, userId: string) {
  return request<unknown>(`/user/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
