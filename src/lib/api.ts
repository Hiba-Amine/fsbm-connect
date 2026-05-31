// API client pour le backend Spring Boot gestion-pfe
// Base URL configurable via VITE_API_URL (défaut: http://localhost:8080)

const BASE_URL =
  (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

const TOKEN_KEY = "pfe_token";

// Le backend utilise des rôles en minuscules (enum RoleName: admin|etudiant|enseignant)
export type BackendRole = "admin" | "etudiant" | "enseignant";
export type FrontRole = "admin" | "etudiant" | "enseignant";

export const roleToFront = (r: BackendRole): FrontRole => r;
export const roleToBack = (r: FrontRole): BackendRole => r;

export interface AuthResponse {
  token: string;
}

export interface RegisterPayload {
  nom: string;
  email: string;
  password: string;
  role: BackendRole; // etudiant | enseignant (admin interdit côté backend)
  // Spécifique enseignant
  grade?: string;
  specialite?: string;
  // Spécifique étudiant
  matricule?: string;
  niveau?: string;
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

/** Décode la payload d'un JWT (sans vérifier la signature) pour récupérer le sub (email) */
export function decodeJwt(token: string): { sub?: string; exp?: number; [k: string]: any } | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

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
    throw new Error(data?.message || data?.error || `Erreur ${res.status}`);
  }
  return data as T;
}

export interface MeResponse {
  id: number;
  nom: string;
  email: string;
  type: BackendRole | string;
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: RegisterPayload) =>
    request<AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => request<MeResponse>("/api/v1/users/me"),
  logout: () => request<string>("/api/v1/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) =>
    request<{ message?: string }>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, newPassword: string) =>
    request<{ message?: string }>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),
};

