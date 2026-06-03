// API client pour le backend Spring Boot gestion-pfe
// Base URL configurable via VITE_API_URL (défaut: http://localhost:8080)

const BASE_URL =
  (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

const TOKEN_KEY = "pfe_token";

export type BackendRole = "admin" | "etudiant" | "enseignant" | "ADMIN" | "ETUDIANT" | "ENSEIGNANT";
export type FrontRole = "admin" | "etudiant" | "enseignant";

export const roleToFront = (r: BackendRole): FrontRole =>
  (typeof r === "string" ? r.toLowerCase() : r) as FrontRole;

export interface AuthResponse { token: string; }

export interface RegisterPayload {
  nom: string;
  email: string;
  password: string;
  role: "etudiant" | "enseignant";
  grade?: string;
  specialite?: string;
  matricule?: string;
  niveau?: string;
}

export const tokenStore = {
  get: () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null),
  set: (t: string) => { if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, t); },
  clear: () => { if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY); },
};

export function decodeJwt(token: string): { sub?: string; exp?: number; [k: string]: any } | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch { return null; }
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
    throw new Error("Impossible de joindre le serveur (CORS ou backend arrêté ?).");
  }

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { message: text }; }
  if (!res.ok) throw new Error(data?.message || data?.error || `Erreur ${res.status}`);
  return data as T;
}

// ---------- Types ----------
export interface MeResponse { id: number; nom: string; email: string; type: string; }
export interface EnseignantDTO { id: number; nom: string; email: string; grade?: string; specialite?: string; }
export interface EtudiantDTO { id: number; nom: string; email: string; matricule?: string; niveau?: string; filiereId?: number; filiereNom?: string; }
export interface ProjetDTO { id: number; titre: string; description?: string; filiereId?: number; filiereNom?: string; enseignantId?: number; enseignantNom?: string; statut?: string; }
export interface AffectationDTO {
  id: number;
  dateAffectation: string;
  projetId: number;
  projetTitre: string;
  encadrantId: number;
  encadrantNom: string;
  etudiants: EtudiantDTO[];
  coEncadrants: EnseignantDTO[];
}
export interface MessageDTO { id: number; contenu: string; dateEnvoi: string; affectationId: number; auteurId: number; auteurNom: string; }
export interface SoutenanceDTO { id: number; date: string; heure?: string; salle?: string; affectationId?: number; }

// Spring Page wrapper
export interface Page<T> { content: T[]; totalElements: number; totalPages: number; number: number; size: number; }

// ---------- API ----------
export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (payload: RegisterPayload) =>
    request<AuthResponse>("/api/v1/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request<string>("/api/v1/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) =>
    request<string>(`/api/v1/auth/forgot-password?email=${encodeURIComponent(email)}`, { method: "POST" }),
  resetPassword: (token: string, newPassword: string) =>
    request<string>(`/api/v1/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`, { method: "POST" }),

  // Users
  me: () => request<MeResponse>("/api/v1/users/me"),
  users: (role?: string) => request<Page<MeResponse>>(`/api/v1/users${role ? `?role=${role}` : ""}`),

  // Étudiants
  etudiantMe: () => request<EtudiantDTO>("/api/v1/etudiants/me"),
  etudiants: () => request<Page<EtudiantDTO>>("/api/v1/etudiants?size=200"),
  etudiantAffectation: (id: number) => request<AffectationDTO>(`/api/v1/etudiants/${id}/affectation`),
  etudiantDocuments: (id: number) => request<any[]>(`/api/v1/etudiants/${id}/documents`),
  etudiantSoutenance: (id: number) => request<SoutenanceDTO>(`/api/v1/etudiants/${id}/soutenance`),

  // Enseignants
  // ⚠️ /enseignants/me n'existe pas dans le backend actuel — workaround via /search?q=<email>
  enseignantMe: async (email: string): Promise<EnseignantDTO | null> => {
    const list = await request<EnseignantDTO[]>(`/api/v1/enseignants/search?q=${encodeURIComponent(email)}`);
    return list.find((e) => e.email?.toLowerCase() === email.toLowerCase()) ?? list[0] ?? null;
  },
  enseignants: () => request<Page<EnseignantDTO>>("/api/v1/enseignants?size=200"),
  enseignantAffectations: (id: number) => request<AffectationDTO[]>(`/api/v1/enseignants/${id}/affectations`),
  enseignantProjets: (id: number) => request<ProjetDTO[]>(`/api/v1/enseignants/${id}/projets`),
  enseignantEvaluations: (id: number) => request<any[]>(`/api/v1/enseignants/${id}/evaluations`),

  // Projets
  projets: () => request<Page<ProjetDTO>>("/api/v1/projets?size=200"),
  projetMessages: (id: number) => request<MessageDTO[]>(`/api/v1/projets/${id}/messages`),
  projetDocuments: (id: number) => request<any[]>(`/api/v1/projets/${id}/documents`),

  // Affectations
  affectations: () => request<Page<AffectationDTO>>("/api/v1/affectations?size=200"),

  // Messages (par affectation)
  messagesByAffectation: (affectationId: number) =>
    request<MessageDTO[]>(`/api/v1/messages/affectation/${affectationId}`),
  sendMessage: (affectationId: number, contenu: string) =>
    request<MessageDTO>("/api/v1/messages", {
      method: "POST",
      body: JSON.stringify({ affectationId, contenu }),
    }),

  // Soutenances
  soutenances: () => request<Page<SoutenanceDTO>>("/api/v1/soutenances?size=200"),
  soutenanceCalendrier: () => request<SoutenanceDTO[]>("/api/v1/soutenances/calendrier"),

  // Dashboards
  dashboardAdmin: () => request<any>("/api/v1/dashboard/admin"),
  dashboardEnseignant: (id: number) => request<any>(`/api/v1/dashboard/enseignant/${id}`),
  dashboardEtudiant: (id: number) => request<any>(`/api/v1/dashboard/etudiant/${id}`),
};
