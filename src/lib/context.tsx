import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { USERS, CONVERSATIONS, NOTIFICATIONS, type User, type Conversation, type Notification, type Message } from "./mock-data";
import { api, tokenStore, decodeJwt, type BackendRole } from "./api";

// ----- Auth -----
interface AuthContextValue {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  loginAs: (role: "etudiant" | "enseignant" | "admin") => User;
  register: (data: { prenom: string; nom: string; email: string; password: string; role: "etudiant" | "enseignant"; filiere?: string; niveau?: string; numeroEtudiant?: string; grade?: string; specialite?: string }) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextValue | null>(null);

// ----- Chat -----
interface ChatContextValue {
  conversations: Conversation[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
  sendMessage: (conversationId: string, text: string) => void;
  unreadCount: number;
  markRead: (id: string) => void;
}
const ChatContext = createContext<ChatContextValue | null>(null);

// ----- Notifications -----
interface NotifContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
}
const NotifContext = createContext<NotifContextValue | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  // Construit un objet User local à partir des infos disponibles (token + formulaire)
  const buildUser = useCallback((args: { token: string; email: string; nom: string; role: BackendRole; extra?: { filiere?: string; niveau?: string; numeroEtudiant?: string; grade?: string; specialite?: string } }) => {
    const parts = (args.nom || "").trim().split(/\s+/);
    const prenom = parts[0] ?? "";
    const nom = parts.slice(1).join(" ") || parts[0] || "";
    const u: User = {
      id: `${args.role[0]}${Date.now()}`,
      prenom,
      nom,
      email: args.email,
      role: args.role,
      ...(args.role === "etudiant"
        ? { filiere: args.extra?.filiere ?? "Informatique", niveau: args.extra?.niveau ?? "Licence 3", numeroEtudiant: args.extra?.numeroEtudiant ?? `FSBM-${new Date().getFullYear()}-NEW` }
        : args.role === "enseignant"
          ? { grade: args.extra?.grade ?? "Professeur Assistant", specialite: args.extra?.specialite ?? "—", isEncadrant: false, isJury: false, encadrantFor: [], juryFor: [] }
          : {}),
    } as User;
    return u;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const resp = await api.login(email, password);
    tokenStore.set(resp.token);
    // Le token ne contient que l'email. On récupère le profil via /users/me pour avoir le rôle réel.
    let role: BackendRole = "etudiant";
    let nom = email.split("@")[0];
    let realEmail = email;
    try {
      const me = await api.me();
      role = (me.type as BackendRole) || "etudiant";
      nom = me.nom || nom;
      realEmail = me.email || email;
    } catch {
      const claims = decodeJwt(resp.token) || {};
      realEmail = claims.sub || email;
    }
    const u = buildUser({ token: resp.token, email: realEmail, nom, role });
    setUsers((p) => (p.some((x) => x.email.toLowerCase() === u.email.toLowerCase()) ? p : [...p, u]));
    setCurrentUser(u);
    return u;
  }, [buildUser]);

  const loginAs = useCallback((role: "etudiant" | "enseignant" | "admin") => {
    const u = role === "etudiant" ? users.find(x => x.id === "u1")! : role === "enseignant" ? users.find(x => x.id === "e1")! : users.find(x => x.id === "a1")!;
    setCurrentUser(u);
    return u;
  }, [users]);

  const register = useCallback(async (data: { prenom: string; nom: string; email: string; password: string; role: "etudiant" | "enseignant"; filiere?: string; niveau?: string; numeroEtudiant?: string; grade?: string; specialite?: string }) => {
    const fullNom = `${data.prenom} ${data.nom}`.trim();
    const resp = await api.register({
      nom: fullNom,
      email: data.email,
      password: data.password,
      role: data.role,
      ...(data.role === "enseignant"
        ? { grade: data.grade, specialite: data.specialite }
        : { matricule: data.numeroEtudiant, niveau: data.niveau }),
    });
    tokenStore.set(resp.token);
    const u = buildUser({ token: resp.token, email: data.email, nom: fullNom, role: data.role, extra: data });
    setUsers((p) => [...p, u]);
    setCurrentUser(u);
    return u;
  }, [buildUser]);

  const logout = useCallback(() => {
    tokenStore.clear();
    setCurrentUser(null);
  }, []);


  const sendMessage = useCallback((conversationId: string, text: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const msg: Message = { id: `m${Date.now()}`, from: "Vous", text, at: "À l'instant", mine: true };
        return { ...c, messages: [...c.messages, msg], lastMessage: text, lastAt: "À l'instant" };
      })
    );
  }, []);

  const markRead = useCallback((id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }, []);

  const unreadCount = conversations.reduce((a, c) => a + c.unread, 0);
  const notifUnread = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);
  const markAllRead = useCallback(() => setNotifications((p) => p.map((n) => ({ ...n, read: true }))), []);

  return (
    <AuthContext.Provider value={{ currentUser, login, loginAs, register, logout, isAuthenticated: !!currentUser }}>
      <ChatContext.Provider value={{ conversations, activeId, setActiveId, isOpen, toggle: () => setIsOpen(o => !o), close: () => setIsOpen(false), open: () => setIsOpen(true), sendMessage, unreadCount, markRead }}>
        <NotifContext.Provider value={{ notifications, unreadCount: notifUnread, markAsRead, markAllRead }}>
          {children}
        </NotifContext.Provider>
      </ChatContext.Provider>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const v = useContext(AuthContext);
  if (!v) throw new Error("AuthContext missing");
  return v;
};
export const useChat = () => {
  const v = useContext(ChatContext);
  if (!v) throw new Error("ChatContext missing");
  return v;
};
export const useNotifications = () => {
  const v = useContext(NotifContext);
  if (!v) throw new Error("NotifContext missing");
  return v;
};
