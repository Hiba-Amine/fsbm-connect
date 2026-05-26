import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { USERS, CONVERSATIONS, NOTIFICATIONS, type User, type Conversation, type Notification, type Message } from "./mock-data";
import { api, tokenStore, roleToBack, roleToFront } from "./api";

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

  const login = useCallback((email: string, _password: string) => {
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase()) ?? null;
    if (u) setCurrentUser(u);
    return u;
  }, [users]);

  const loginAs = useCallback((role: "etudiant" | "enseignant" | "admin") => {
    const u = role === "etudiant" ? users.find(x => x.id === "u1")! : role === "enseignant" ? users.find(x => x.id === "e1")! : users.find(x => x.id === "a1")!;
    setCurrentUser(u);
    return u;
  }, [users]);

  const register = useCallback((data: { prenom: string; nom: string; email: string; role: "etudiant" | "enseignant"; filiere?: string; niveau?: string; numeroEtudiant?: string; grade?: string; specialite?: string }) => {
    const prefix = data.role === "etudiant" ? "u" : "e";
    const newUser: User = {
      id: `${prefix}${Date.now()}`,
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
      role: data.role,
      ...(data.role === "etudiant"
        ? { filiere: data.filiere ?? "Informatique", niveau: data.niveau ?? "Licence 3", numeroEtudiant: data.numeroEtudiant ?? `FSBM-${new Date().getFullYear()}-NEW` }
        : { grade: data.grade ?? "Professeur Assistant", specialite: data.specialite ?? "—", isEncadrant: false, isJury: false, encadrantFor: [], juryFor: [] }),
    } as User;
    setUsers((p) => [...p, newUser]);
    setCurrentUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

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
