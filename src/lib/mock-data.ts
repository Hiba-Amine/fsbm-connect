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
  encadrantFor?: string[];   // student ids
  juryFor?: string[];        // soutenance ids
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
  date: string;     // ISO
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

// ---------- USERS ----------
export const USERS: User[] = [
  { id: "u1", prenom: "Youssef", nom: "El Amrani", email: "youssef@fsbm.ma", role: "etudiant", filiere: "Informatique", niveau: "Licence 3", numeroEtudiant: "FSBM-2023-001" },
  { id: "u2", prenom: "Hafssa", nom: "Bouam", email: "hafssa@fsbm.ma", role: "etudiant", filiere: "Mathématiques", niveau: "Master 1", numeroEtudiant: "FSBM-2023-002" },
  { id: "u3", prenom: "Ahmed", nom: "Khalil", email: "ahmed@fsbm.ma", role: "etudiant", filiere: "Informatique", niveau: "Master 2", numeroEtudiant: "FSBM-2023-003" },
  { id: "u4", prenom: "Sara", nom: "Moussaoui", email: "sara@fsbm.ma", role: "etudiant", filiere: "Informatique", niveau: "Licence 3", numeroEtudiant: "FSBM-2023-004" },
  { id: "u5", prenom: "Omar", nom: "Bennani", email: "omar@fsbm.ma", role: "etudiant", filiere: "Mathématiques", niveau: "Licence 3", numeroEtudiant: "FSBM-2023-005" },

  { id: "e1", prenom: "Hassan", nom: "Alami", email: "h.alami@fsbm.ma", role: "enseignant", grade: "Professeur Habilité", specialite: "Génie Logiciel", isEncadrant: true, isJury: true, encadrantFor: ["u1", "u3"], juryFor: ["s2"] },
  { id: "e2", prenom: "Nabil", nom: "Aharrane", email: "n.aharrane@fsbm.ma", role: "enseignant", grade: "Professeur Enseignement Supérieur", specialite: "Intelligence Artificielle", isEncadrant: true, isJury: true, encadrantFor: ["u4"], juryFor: ["s1", "s5"] },
  { id: "e3", prenom: "Fatima", nom: "Benali", email: "f.benali@fsbm.ma", role: "enseignant", grade: "Professeur Habilité", specialite: "Mathématiques Appliquées", isEncadrant: true, isJury: true, encadrantFor: ["u2", "u5"], juryFor: ["s3", "s4"] },
  { id: "e4", prenom: "Karim", nom: "Rachidi", email: "k.rachidi@fsbm.ma", role: "enseignant", grade: "Professeur Assistant", specialite: "Cybersécurité", isEncadrant: false, isJury: true, encadrantFor: [], juryFor: ["s2", "s4"] },

  { id: "a1", prenom: "Admin", nom: "FSBM", email: "admin@fsbm.ma", role: "admin" },
];

// ---------- SUJETS ----------
export const SUJETS: Sujet[] = [
  { id: "sj1", titre: "Plateforme de gestion des PFE", description: "Concevoir une plateforme web moderne pour la gestion complète des projets de fin d'études.", enseignantId: "e1", enseignantNom: "Pr. Hassan Alami", filiere: "Informatique", niveau: "Licence 3", status: "EN_COURS", etudiantId: "u1" },
  { id: "sj2", titre: "Modélisation épidémique avancée", description: "Étude et simulation de modèles SIR appliqués à des données réelles.", enseignantId: "e3", enseignantNom: "Pr. Fatima Benali", filiere: "Mathématiques", niveau: "Master 1", status: "EN_COURS", etudiantId: "u2" },
  { id: "sj3", titre: "Système de détection d'intrusion par IA", description: "Détection automatique d'attaques réseau par apprentissage profond.", enseignantId: "e1", enseignantNom: "Pr. Hassan Alami", filiere: "Informatique", niveau: "Master 2", status: "EN_COURS", etudiantId: "u3" },
  { id: "sj4", titre: "Application mobile de suivi médical", description: "Développer une application mobile React Native pour le suivi patient.", enseignantId: "e2", enseignantNom: "Pr. Nabil Aharrane", filiere: "Informatique", niveau: "Licence 3", status: "DISPONIBLE" },
  { id: "sj5", titre: "Optimisation combinatoire par métaheuristiques", description: "Comparaison d'algorithmes génétiques et de recuit simulé.", enseignantId: "e3", enseignantNom: "Pr. Fatima Benali", filiere: "Mathématiques", niveau: "Licence 3", status: "DISPONIBLE" },
  { id: "sj6", titre: "Analyse de sentiments sur réseaux sociaux", description: "NLP appliqué aux tweets en arabe et français.", enseignantId: "e2", enseignantNom: "Pr. Nabil Aharrane", filiere: "Informatique", niveau: "Master 2", status: "DISPONIBLE" },
  { id: "sj7", titre: "Sécurisation des API REST", description: "Audit et amélioration de la sécurité d'API existantes.", enseignantId: "e4", enseignantNom: "Dr. Karim Rachidi", filiere: "Informatique", niveau: "Master 1", status: "PRIS" },
  { id: "sj8", titre: "Visualisation interactive de données géospatiales", description: "Cartographie avec D3 et Leaflet pour données régionales.", enseignantId: "e1", enseignantNom: "Pr. Hassan Alami", filiere: "Informatique", niveau: "Licence 3", status: "DISPONIBLE" },
];

// ---------- PROJETS ----------
export const PROJETS: Projet[] = [
  { id: "p1", etudiantId: "u1", sujetId: "sj1", titre: "Plateforme de gestion des PFE", encadrantId: "e1", encadrantNom: "Pr. Hassan Alami", progress: 65, status: "EN_COURS" },
  { id: "p2", etudiantId: "u2", sujetId: "sj2", titre: "Modélisation épidémique avancée", encadrantId: "e3", encadrantNom: "Pr. Fatima Benali", progress: 80, status: "EN_COURS" },
  { id: "p3", etudiantId: "u3", sujetId: "sj3", titre: "Système de détection d'intrusion par IA", encadrantId: "e1", encadrantNom: "Pr. Hassan Alami", progress: 55, status: "EN_COURS" },
  { id: "p4", etudiantId: "u4", sujetId: "sj4", titre: "Application mobile de suivi médical", encadrantId: "e2", encadrantNom: "Pr. Nabil Aharrane", progress: 40, status: "EN_COURS" },
  { id: "p5", etudiantId: "u5", sujetId: "sj5", titre: "Optimisation combinatoire", encadrantId: "e3", encadrantNom: "Pr. Fatima Benali", progress: 70, status: "EN_COURS" },
];

// ---------- RAPPORTS ----------
export const RAPPORTS: Rapport[] = [
  { id: "r1", projetId: "p1", type: "PROVISOIRE", filename: "rapport_provisoire_youssef.pdf", uploadedAt: "2026-04-10", status: "VALIDE", feedback: "Bonne structure, continuez ainsi." },
  { id: "r2", projetId: "p1", type: "FINAL", filename: "rapport_final_youssef.pdf", uploadedAt: "2026-05-20", status: "EN_ATTENTE" },
  { id: "r3", projetId: "p2", type: "PROVISOIRE", filename: "rapport_provisoire_hafssa.pdf", uploadedAt: "2026-04-12", status: "VALIDE" },
];

// ---------- SOUTENANCES ----------
export const SOUTENANCES: Soutenance[] = [
  { id: "s1", etudiantId: "u1", etudiantNom: "Youssef El Amrani", projetTitre: "Plateforme de gestion des PFE", date: "2026-06-15", heure: "09:00", salle: "A101", encadrantId: "e1", encadrantNom: "Pr. Hassan Alami", juryIds: ["e2", "e4"], juryNoms: ["Pr. Nabil Aharrane", "Dr. Karim Rachidi"], status: "A_VENIR" },
  { id: "s2", etudiantId: "u2", etudiantNom: "Hafssa Bouam", projetTitre: "Modélisation épidémique avancée", date: "2026-06-15", heure: "11:00", salle: "B205", encadrantId: "e3", encadrantNom: "Pr. Fatima Benali", juryIds: ["e1", "e4"], juryNoms: ["Pr. Hassan Alami", "Dr. Karim Rachidi"], status: "A_VENIR" },
  { id: "s3", etudiantId: "u3", etudiantNom: "Ahmed Khalil", projetTitre: "Détection d'intrusion par IA", date: "2026-06-16", heure: "10:00", salle: "A101", encadrantId: "e1", encadrantNom: "Pr. Hassan Alami", juryIds: ["e3", "e2"], juryNoms: ["Pr. Fatima Benali", "Pr. Nabil Aharrane"], status: "A_VENIR" },
  { id: "s4", etudiantId: "u4", etudiantNom: "Sara Moussaoui", projetTitre: "App mobile suivi médical", date: "2026-06-17", heure: "14:00", salle: "C310", encadrantId: "e2", encadrantNom: "Pr. Nabil Aharrane", juryIds: ["e4", "e3"], juryNoms: ["Dr. Karim Rachidi", "Pr. Fatima Benali"], status: "A_VENIR" },
  { id: "s5", etudiantId: "u5", etudiantNom: "Omar Bennani", projetTitre: "Optimisation combinatoire", date: "2026-06-18", heure: "09:30", salle: "B205", encadrantId: "e3", encadrantNom: "Pr. Fatima Benali", juryIds: ["e2", "e1"], juryNoms: ["Pr. Nabil Aharrane", "Pr. Hassan Alami"], status: "A_VENIR" },
];

// ---------- SALLES ----------
export const SALLES: Salle[] = [
  { id: "sa1", nom: "A101", capacite: 40, batiment: "A", equipement: ["Vidéoprojecteur", "Tableau blanc"] },
  { id: "sa2", nom: "B205", capacite: 30, batiment: "B", equipement: ["Vidéoprojecteur", "Wifi"] },
  { id: "sa3", nom: "C310", capacite: 50, batiment: "C", equipement: ["Vidéoprojecteur", "Climatisation", "Microphone"] },
  { id: "sa4", nom: "D102", capacite: 25, batiment: "D", equipement: ["Tableau blanc"] },
];

// ---------- CONVERSATIONS ----------
export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1", contactId: "e1", contactName: "Pr. Hassan Alami", avatarColor: "#1B3A6B",
    lastMessage: "C'est bien mieux maintenant, merci !", lastAt: "14:30", unread: 2,
    messages: [
      { id: "m1", from: "Pr. Hassan Alami", text: "Bonjour Youssef, j'ai bien reçu votre rapport.", at: "Hier 09:15" },
      { id: "m2", from: "Pr. Hassan Alami", text: "Il y a quelques points à améliorer dans la partie conception.", at: "Hier 09:20" },
      { id: "m3", from: "Vous", text: "Bonjour Professeur, merci. Quels points exactement ?", at: "Hier 10:05", mine: true },
      { id: "m4", from: "Pr. Hassan Alami", text: "Principalement le diagramme de séquence.", at: "Hier 10:30" },
      { id: "m5", from: "Vous", text: "J'ai effectué les corrections.", at: "Aujourd'hui 08:00", mine: true },
      { id: "m6", from: "Pr. Hassan Alami", text: "C'est bien mieux maintenant, merci !", at: "Aujourd'hui 14:30" },
    ],
  },
  {
    id: "c2", contactId: "a1", contactName: "Admin FSBM", avatarColor: "#2563EB",
    lastMessage: "Votre soutenance est confirmée...", lastAt: "Hier", unread: 1,
    messages: [
      { id: "m1", from: "Admin FSBM", text: "Bonjour, votre soutenance est confirmée le 15 juin à 09h00 en salle A101.", at: "Hier 16:00" },
    ],
  },
  {
    id: "c3", contactId: "e3", contactName: "Pr. Fatima Benali", avatarColor: "#3B82F6",
    lastMessage: "N'oubliez pas de corriger...", lastAt: "Lun", unread: 0,
    messages: [
      { id: "m1", from: "Pr. Fatima Benali", text: "N'oubliez pas de corriger la section méthodologie.", at: "Lun 10:00" },
    ],
  },
  {
    id: "c4", contactId: "u2", contactName: "Hafssa Bouam", avatarColor: "#152D56",
    lastMessage: "Est-ce que tu as terminé...", lastAt: "Mar", unread: 0,
    messages: [
      { id: "m1", from: "Hafssa Bouam", text: "Est-ce que tu as terminé la partie back-end ?", at: "Mar 14:00" },
    ],
  },
  {
    id: "c5", contactId: "u1", contactName: "Youssef El Amrani", avatarColor: "#1E40AF",
    lastMessage: "Bonjour, j'ai une question...", lastAt: "12 Avr", unread: 0,
    messages: [
      { id: "m1", from: "Youssef El Amrani", text: "Bonjour, j'ai une question concernant le rendu final.", at: "12 Avr 09:00" },
    ],
  },
];

// ---------- NOTIFICATIONS ----------
export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "rapport", text: "Youssef a déposé son rapport final", at: "Il y a 2h", read: false },
  { id: "n2", type: "soutenance", text: "Soutenance planifiée le 15 juin en salle A101", at: "Hier", read: false },
  { id: "n3", type: "jury", text: "Vous êtes désigné jury pour Hafssa Bouam", at: "Hier", read: false },
  { id: "n4", type: "validation", text: "Votre rapport provisoire a été validé", at: "Il y a 3 jours", read: true },
  { id: "n5", type: "message", text: "Pr. Hassan Alami vous a envoyé un message", at: "Aujourd'hui 14:30", read: false },
];
