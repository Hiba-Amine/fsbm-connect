// API client for the Spring Boot backend (gestion-pfe)
// Base URL configurable via VITE_API_URL, fallback to localhost:8080.

const BASE_URL =
  (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

const TOKEN_KEY = "pfe_token";

export type BackendRole = "ADMIN" | "ETUDIANT" | "ENCADRANT";
export type FrontRole = "admin" | "etudiant" | "enseignant";

export const roleToFront = (r: BackendRole): FrontRole =>
  r === "ADMIN" ? "admin" : r === "ETUDIANT" ? "etudiant" : "enseignant";
export const roleToBack = (r: FrontRole): BackendRole =>
  r === "admin" ? "ADMIN" : r === "etudiant" ? "ETUDIANT" : "ENCADRANT";

export interface AuthResponse {
  token: string;
  id?: number;
  email: string;
  nom: string;
  role: BackendRole;
  message?: string;
}

export const tokenStore = {
  get: () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null),
  set: (t: string) => {
    if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, t);
  },
  clear: () => {
    if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
  },
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  const token = tokenStore.get();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new Error("Impossible de joindre le serveur. Vérifiez que le backend est démarré.");
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    throw new Error(data?.message || `Erreur ${res.status}`);
  }
  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: { nom: string; email: string; password: string; role: BackendRole }) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
