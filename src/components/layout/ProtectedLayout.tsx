import { Link, useNavigate, useRouterState, Outlet, Navigate } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { useAuth, useNotifications } from "@/lib/context";
import {
  GraduationCap, Home, Search, FolderOpen, Upload, Star, BookOpen, Users,
  Link as LinkIcon, Calendar, DoorOpen, FileText, Shield, Bell, LogOut, Menu, X, ChevronDown
} from "lucide-react";
import { ChatWidget } from "./ChatWidget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type NavItem = { to: string; label: string; icon: any };

const STUDENT_NAV: NavItem[] = [
  { to: "/etudiant/dashboard", label: "Tableau de bord", icon: Home },
  { to: "/etudiant/sujets", label: "Sujets disponibles", icon: Search },
  { to: "/etudiant/projet", label: "Mon projet", icon: FolderOpen },
  { to: "/etudiant/rapport", label: "Déposer rapport", icon: Upload },
  { to: "/etudiant/evaluations", label: "Mes évaluations", icon: Star },
];
const TEACHER_NAV: NavItem[] = [
  { to: "/enseignant/dashboard", label: "Tableau de bord", icon: Home },
  { to: "/enseignant/sujets", label: "Mes sujets", icon: BookOpen },
  { to: "/enseignant/etudiants", label: "Mes étudiants", icon: Users },
  { to: "/enseignant/evaluations", label: "Évaluations encadrement", icon: Star },
];
const ADMIN_NAV: NavItem[] = [
  { to: "/admin/dashboard", label: "Tableau de bord", icon: Home },
  { to: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { to: "/admin/affectations", label: "Affectations", icon: LinkIcon },
  { to: "/admin/soutenances", label: "Soutenances", icon: Calendar },
  { to: "/admin/salles", label: "Salles", icon: DoorOpen },
  { to: "/admin/documents", label: "Documents", icon: FileText },
];

function initials(p: string, n: string) { return (p[0] ?? "") + (n[0] ?? ""); }

export function ProtectedLayout({ role }: { role: "etudiant" | "enseignant" | "admin" }) {
  const { currentUser, isAuthenticated } = useAuth();
  if (!isAuthenticated || !currentUser) return <Navigate to="/login" />;
  if (currentUser.role !== role) return <Navigate to="/login" />;
  const nav = role === "etudiant" ? STUDENT_NAV : role === "enseignant" ? TEACHER_NAV : ADMIN_NAV;
  return (
    <Shell nav={nav}>
      <Outlet />
    </Shell>
  );
}

function Shell({ nav, children }: { nav: NavItem[]; children: ReactNode }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = nav.find((n) => path.startsWith(n.to))?.label ?? "PFE Connect";

  const roleBadges = () => {
    if (!currentUser) return null;
    if (currentUser.role === "etudiant") return <Badge className="bg-accent text-primary hover:bg-accent">Étudiant</Badge>;
    if (currentUser.role === "admin") return <Badge className="bg-accent text-primary hover:bg-accent">Administrateur</Badge>;
    return (
      <div className="flex gap-1.5 flex-wrap">
        {currentUser.isEncadrant && <Badge className="bg-accent text-primary hover:bg-accent">Encadrant</Badge>}
        {currentUser.isJury && <Badge className="bg-accent text-primary hover:bg-accent">Jury</Badge>}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 w-[260px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-primary">PFE Connect</span>
          </Link>
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-accent" onClick={() => setMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {nav.map((item) => {
            const active = path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}
              >
                <Icon className="w-4.5 h-4.5" size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {currentUser && (
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-gradient text-primary-foreground flex items-center justify-center text-sm font-semibold">
                {initials(currentUser.prenom, currentUser.nom)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{currentUser.prenom} {currentUser.nom}</div>
                <div className="mt-1">{roleBadges()}</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => { logout(); navigate({ to: "/login" }); }}>
              <LogOut className="w-4 h-4 mr-2" /> Déconnexion
            </Button>
          </div>
        )}
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-border flex items-center px-4 lg:px-8 justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-accent" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-accent">
                    <div className="w-8 h-8 rounded-full bg-primary-gradient text-primary-foreground flex items-center justify-center text-xs font-semibold">
                      {initials(currentUser.prenom, currentUser.nom)}
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Mon profil</DropdownMenuItem>
                  <DropdownMenuItem>Paramètres</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/login" }); }}>
                    <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 animate-fade-in">{children}</main>
      </div>

      <ChatWidget />
    </div>
  );
}

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const iconFor = (t: string) => {
    const map: Record<string, string> = { rapport: "📄", soutenance: "📅", jury: "⚖️", validation: "✅", message: "💬" };
    return map[t] ?? "🔔";
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-xl hover:bg-accent">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <button className="text-xs text-primary-light hover:underline" onClick={markAllRead}>Tout marquer comme lu</button>
        </div>
        <div className="max-h-[380px] overflow-y-auto">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`w-full text-left flex gap-3 px-4 py-3 border-b last:border-0 hover:bg-accent/50 transition-colors ${!n.read ? "bg-accent/30" : ""}`}
            >
              <div className="w-9 h-9 rounded-full bg-accent text-primary flex items-center justify-center text-base">{iconFor(n.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">{n.text}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{n.at}</div>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-primary-light mt-2" />}
            </button>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t text-center">
          <a className="text-xs text-primary-light hover:underline">Voir toutes les notifications</a>
        </div>
      </PopoverContent>
    </Popover>
  );
}
