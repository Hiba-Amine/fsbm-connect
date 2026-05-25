import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import fsbmLogo from "@/assets/fsbm-logo.png";
import { useState } from "react";
import { useAuth } from "@/lib/context";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — PFE Connect" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login, loginAs } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const doLogin = (u: { role: string } | null) => {
    if (!u) { toast.error("Identifiants invalides"); return; }
    toast.success("Connexion réussie");
    navigate({ to: u.role === "etudiant" ? "/etudiant/dashboard" : u.role === "enseignant" ? "/enseignant/dashboard" : "/admin/dashboard" });
  };

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin(login(email, password));
  };

  const quick = (role: "etudiant" | "enseignant" | "admin") => {
    const u = loginAs(role);
    doLogin(u);
  };

  return (
    <div className="min-h-screen bg-primary-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-slide-up">
        <Link to="/" className="flex flex-col items-center mb-6">
          <img src={fsbmLogo} alt="FSBM" className="h-16 w-auto mb-3" />
          <span className="font-bold text-xl text-primary">PFE Connect</span>
          <span className="text-xs text-muted-foreground">Faculté des Sciences Ben M'Sik</span>
        </Link>
        <h2 className="text-2xl font-bold text-center mb-6">Bon retour</h2>
        <form onSubmit={handle} className="space-y-4">
          <div>
            <Label>Email</Label>
            <div className="relative mt-1.5">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-10" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label>Mot de passe</Label>
            <div className="relative mt-1.5">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-10 pr-10" type={show ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-[var(--primary-hover)]" size="lg">Se connecter</Button>
        </form>
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">ou accès rapide</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => quick("etudiant")} className="text-xs px-3 py-2 rounded-full bg-accent text-primary font-medium hover:bg-[var(--primary)] hover:text-primary-foreground transition-colors">Étudiant</button>
          <button onClick={() => quick("enseignant")} className="text-xs px-3 py-2 rounded-full bg-accent text-primary font-medium hover:bg-[var(--primary)] hover:text-primary-foreground transition-colors">Enseignant</button>
          <button onClick={() => quick("admin")} className="text-xs px-3 py-2 rounded-full bg-accent text-primary font-medium hover:bg-[var(--primary)] hover:text-primary-foreground transition-colors">Admin</button>
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Pas encore de compte ? <Link to="/register" className="text-primary-light font-semibold hover:underline">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
}
