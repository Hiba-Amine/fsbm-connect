// Mock data + types for PFE Connect
export type Role = "etudiant" | "enseignant" | "admin";

export interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  role: Role;
  // étudiant
  filiere?: string;
  niveau?: string;
  numeroEtudiant?: string;
  // enseignant
  grade?: string;
  specialite?: string;
  isEncadrant?: boolean;
  isJury?: boolean;
  encadrantFor?: string[];
  juryFor?: string[];
}

export interface Sujet {
  id: string;
  titre: string;
  description: string;
  enseignantId: string;
  enseignantNom: string;
  filiere: string;
  niveau: string;
  status: "DISPONIBLE" | "PRIS" | "EN_COURS";
  etudiantId?: string;
}

export interface Projet {
  id: string;
  etudiantId: string;
  sujetId: string;
  titre: string;
  encadrantId: string;
  encadrantNom: string;
  progress: number;
  status: "EN_COURS" | "SOUTENU";
}

export interface Rapport {
  id: string;
  projetId: string;
  type: "PROVISOIRE" | "FINAL";
  filename: string;
  uploadedAt: string;
  status: "EN_ATTENTE" | "VALIDE" | "REFUSE";
  feedback?: string;
}

export interface Soutenance {
  id: string;
  etudiantId: string;
  etudiantNom: string;
  projetTitre: string;
  date: string;
  heure: string;
  salle: string;
  encadrantId: string;
  encadrantNom: string;
  juryIds: string[];
  juryNoms: string[];
  status: "A_VENIR" | "REALISEE";
  note?: number;
  mention?: string;
}

export interface Salle {
  id: string;
  nom: string;
  capacite: number;
  batiment: string;
  equipement: string[];
}

export interface Message {
  id: string;
  from: string;
  text: string;
  at: string;
  mine?: boolean;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  avatarColor: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  messages: Message[];
}

export interface Notification {
  id: string;
  type: "rapport" | "soutenance" | "jury" | "validation" | "message";
  text: string;
  at: string;
  read: boolean;
}

// ---------- DONNÉES INITIALES VIDES ----------
// Les données proviennent du backend. Aucune donnée mock pré-remplie.
export const USERS: User[] = [];
export const SUJETS: Sujet[] = [];
export const PROJETS: Projet[] = [];
export const RAPPORTS: Rapport[] = [];
export const SOUTENANCES: Soutenance[] = [];
export const SALLES: Salle[] = [];
export const CONVERSATIONS: Conversation[] = [];
export const NOTIFICATIONS: Notification[] = [];
