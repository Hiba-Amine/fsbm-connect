import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, BookOpen, Info, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import fsbmLogo from "@/assets/fsbm-logo.png";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/context";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Inscription — PFE Connect" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"etudiant" | "enseignant" | null>(null);
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", password: "", confirm: "" });
  const [extra, setExtra] = useState({ filiere: "", niveau: "", numeroEtudiant: "", grade: "", specialite: "" });

  const next = () => {
    if (!form.prenom || !form.nom || !form.email || !form.password) { toast.error("Veuillez remplir tous les champs"); return; }
    if (form.password !== form.confirm) { toast.error("Les mots de passe ne correspondent pas"); return; }
    setStep(2);
  };
  const submit = () => {
    if (!role) { toast.error("Veuillez sélectionner un rôle"); return; }
    const u = register({ prenom: form.prenom, nom: form.nom, email: form.email, role, ...extra });
    toast.success("Compte créé avec succès");
    navigate({ to: u.role === "etudiant" ? "/etudiant/dashboard" : "/enseignant/dashboard" });
  };

  return (
    <div className="min-h-screen bg-primary-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg animate-slide-up">
        <Link to="/" className="flex flex-col items-center mb-5">
          <img src={fsbmLogo} alt="FSBM" className="h-12 w-auto mb-2" />
          <span className="font-bold text-lg text-primary">PFE Connect</span>
        </Link>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-accent text-primary"}`}>1</div>
          <div className={`h-0.5 w-12 ${step >= 2 ? "bg-primary" : "bg-border"}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-accent text-primary"}`}>2</div>
        </div>

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-1">Créer votre compte</h2>
            <p className="text-sm text-muted-foreground mb-5">Étape 1 — Informations personnelles</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Prénom</Label><Input className="mt-1.5" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
                <div><Label>Nom</Label><Input className="mt-1.5" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
              </div>
              <div><Label>Email universitaire</Label><Input className="mt-1.5" type="email" placeholder="nom@fsbm.ma" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Mot de passe</Label><Input className="mt-1.5" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
              <div><Label>Confirmer mot de passe</Label><Input className="mt-1.5" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></div>
            </div>
            <Button onClick={next} className="w-full mt-5 bg-primary hover:bg-[var(--primary-hover)]" size="lg">
              Continuer <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-1">Votre rôle</h2>
            <p className="text-sm text-muted-foreground mb-5">Étape 2 — Sélectionnez votre profil</p>
            <div className="grid grid-cols-2 gap-3">
              <RoleCard active={role === "etudiant"} onClick={() => setRole("etudiant")} icon={GraduationCap} title="Étudiant" desc="Je suis un étudiant FSBM" />
              <RoleCard active={role === "enseignant"} onClick={() => setRole("enseignant")} icon={BookOpen} title="Enseignant" desc="Je supervise des projets" />
            </div>

            {role === "etudiant" && (
              <div className="mt-5 space-y-3 animate-fade-in">
                <div>
                  <Label>Filière</Label>
                  <Select value={extra.filiere} onValueChange={(v) => setExtra({ ...extra, filiere: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{["Informatique","Mathématiques","Physique","Chimie","Biologie","Géologie"].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Niveau</Label>
                  <Select value={extra.niveau} onValueChange={(v) => setExtra({ ...extra, niveau: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{["Licence 1","Licence 2","Licence 3","Master 1","Master 2"].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Numéro étudiant</Label><Input className="mt-1.5" placeholder="FSBM-2025-XXX" value={extra.numeroEtudiant} onChange={(e) => setExtra({ ...extra, numeroEtudiant: e.target.value })} /></div>
              </div>
            )}

            {role === "enseignant" && (
              <div className="mt-5 space-y-3 animate-fade-in">
                <div>
                  <Label>Grade</Label>
                  <Select value={extra.grade} onValueChange={(v) => setExtra({ ...extra, grade: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{["Professeur Habilité","Professeur Assistant","Professeur Enseignement Supérieur","Professeur Agrégé"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Spécialité</Label><Input className="mt-1.5" placeholder="Ex: Génie Logiciel" value={extra.specialite} onChange={(e) => setExtra({ ...extra, specialite: e.target.value })} /></div>
                <div className="bg-accent text-primary text-sm rounded-xl p-3 flex gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>En tant qu'enseignant, vous pourrez être désigné comme encadrant de projets ET/OU comme membre de jury par l'administration.</span>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Button>
              <Button onClick={submit} className="flex-1 bg-primary hover:bg-[var(--primary-hover)]"><CheckCircle2 className="w-4 h-4 mr-2" />Créer mon compte</Button>
            </div>
          </>
        )}

        <div className="mt-5 text-center text-sm text-muted-foreground">
          Déjà un compte ? <Link to="/login" className="text-primary-light font-semibold hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ active, onClick, icon: Icon, title, desc }: { active: boolean; onClick: () => void; icon: any; title: string; desc: string }) {
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl border-2 text-left transition-all ${active ? "border-primary bg-accent" : "border-border hover:border-primary-light"}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${active ? "bg-primary text-primary-foreground" : "bg-accent text-primary"}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-bold">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}
