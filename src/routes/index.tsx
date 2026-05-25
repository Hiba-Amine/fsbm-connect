import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, BookOpen, Shield, ArrowRight, Check, Users, TrendingUp,
  Sparkles, Quote, Menu
} from "lucide-react";
import { useState } from "react";
import fsbmLogo from "@/assets/fsbm-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PFE Connect — Gérez vos PFE avec simplicité — FSBM" },
      { name: "description", content: "Plateforme moderne pour la gestion des Projets de Fin d'Études à la Faculté des Sciences Ben M'Sik, Université Hassan II Casablanca." },
      { property: "og:title", content: "PFE Connect — FSBM" },
      { property: "og:description", content: "Étudiants, enseignants, jury — tout le monde connecté." },
    ],
  }),
  component: Landing,
});

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img src={fsbmLogo} alt="FSBM" className="h-10 w-auto" />
      <span className="font-bold text-xl text-primary">PFE Connect</span>
    </Link>
  );
}

function Landing() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login"><Button variant="outline" className="border-primary text-primary hover:bg-accent">Se connecter</Button></Link>
            <Link to="/register"><Button className="bg-primary hover:bg-[var(--primary-hover)]">S'inscrire</Button></Link>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-accent" onClick={() => setMenu(o => !o)}><Menu className="w-5 h-5" /></button>
        </div>
        {menu && (
          <div className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-2 bg-white">
            <Link to="/login"><Button variant="outline" className="w-full border-primary text-primary">Se connecter</Button></Link>
            <Link to="/register"><Button className="w-full bg-primary">S'inscrire</Button></Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative dotted-blue-bg">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 min-h-[80vh] grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <Badge className="bg-accent text-primary hover:bg-accent border-0 mb-5 px-3 py-1 text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Faculté des Sciences Ben M'Sik
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Gérez vos PFE avec<br />
              <span className="text-gradient-blue">simplicité et efficacité</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Une plateforme complète pour centraliser la gestion des projets de fin d'études.
              Étudiants, enseignants, jury — tout le monde connecté.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-[var(--primary-hover)] w-full sm:w-auto">
                  Commencer maintenant <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-accent w-full sm:w-auto">
                  Découvrir la plateforme
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-success" />Gratuit pour les étudiants FSBM</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-success" />Sécurisé avec JWT</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-success" />Accessible 24h/24</span>
            </div>
          </div>

          {/* Right card */}
          <div className="relative animate-slide-up">
            <div className="bg-primary-gradient rounded-3xl shadow-2xl p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-sm text-white/80 ml-2">Tableau de bord</span>
              </div>
              <div className="space-y-3">
                <MiniStat icon={Users} label="Étudiants actifs" value="120" />
                <MiniStat icon={BookOpen} label="Projets en cours" value="45" />
                <MiniStat icon={TrendingUp} label="Taux de réussite" value="98%" />
              </div>
              <div className="mt-6 bg-white/10 rounded-xl p-4 backdrop-blur">
                <div className="flex justify-between text-sm mb-2">
                  <span>Soutenance — Juin 2026</span>
                  <span className="font-semibold">75%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: "75%" }} />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA"].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-sm text-white/90">Rejoignez la communauté FSBM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">Tout ce dont vous avez besoin</h2>
            <p className="mt-4 text-muted-foreground">Une solution complète pour chaque acteur de votre parcours PFE</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard icon={GraduationCap} iconColor="#1B3A6B" title="Espace Étudiant" badge="Pour les étudiants"
              text="Choisissez votre sujet, déposez vos rapports, suivez votre progression et consultez vos évaluations en temps réel." />
            <FeatureCard icon={BookOpen} iconColor="#2563EB" title="Espace Enseignant" badge="Pour les enseignants"
              text="Proposez des sujets, encadrez vos étudiants, participez aux jurys de soutenance et communiquez facilement via la messagerie intégrée."
              subBadges={["Encadrant", "Jury"]} />
            <FeatureCard icon={Shield} iconColor="#1B3A6B" title="Espace Administration" badge="Pour l'administration"
              text="Gérez les utilisateurs, planifiez les soutenances, affectez les enseignants et supervisez l'ensemble de la promotion." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-14">Comment ça fonctionne ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step num="1" color="#1B3A6B" title="Créez votre compte" text="Inscrivez-vous avec votre email universitaire" />
            <Step num="2" color="#2563EB" title="Accédez à votre espace" text="Tableau de bord personnalisé selon votre rôle" />
            <Step num="3" color="#3B82F6" title="Collaborez efficacement" text="Communiquez et suivez vos projets en temps réel" />
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat n="500+" l="Étudiants inscrits" />
          <Stat n="80+" l="Enseignants encadrants" />
          <Stat n="200+" l="Projets soutenus" />
          <Stat n="95%" l="Taux de satisfaction" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Ils nous font confiance</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Testimonial author="Youssef E." role="Étudiant Informatique"
              quote="PFE Connect m'a permis de suivre mon projet facilement et de communiquer avec mon encadrant." />
            <Testimonial author="Pr. Aharrane N." role="Enseignant & Jury"
              quote="Une plateforme remarquable qui simplifie la gestion des PFE et le suivi des étudiants." />
            <Testimonial author="Hafssa B." role="Étudiante Mathématiques"
              quote="L'interface est intuitive et le dépôt de rapports est vraiment pratique." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid md:grid-cols-3 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center p-1">
                <img src={fsbmLogo} alt="FSBM" className="h-full w-auto" />
              </div>
              <span className="font-bold text-lg">PFE Connect</span>
            </div>
            <p className="text-sm text-white/70">Développé pour la FSBM</p>
            <p className="text-sm text-white/70">Université Hassan II de Casablanca</p>
          </div>
          <nav className="flex justify-center gap-6 text-sm">
            <Link to="/" className="text-white/80 hover:text-white">Accueil</Link>
            <Link to="/login" className="text-white/80 hover:text-white">Se connecter</Link>
            <Link to="/register" className="text-white/80 hover:text-white">S'inscrire</Link>
          </nav>
          <div className="text-sm text-white/60 md:text-right">© 2025-2026 PFE Connect — FSBM.</div>
        </div>
      </footer>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white text-foreground rounded-xl p-3.5 flex items-center gap-3 shadow-md">
      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-bold text-lg">{value}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, iconColor, title, text, badge, subBadges }: { icon: any; iconColor: string; title: string; text: string; badge: string; subBadges?: string[] }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-md hover:shadow-xl transition-shadow">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#DBEAFE" }}>
        <Icon className="w-6 h-6" style={{ color: iconColor }} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
      {subBadges && (
        <div className="mt-3 flex gap-1.5">
          {subBadges.map((s) => <Badge key={s} className="bg-accent text-primary hover:bg-accent">{s}</Badge>)}
        </div>
      )}
      <div className="mt-5">
        <Badge className="bg-accent text-primary hover:bg-accent">{badge}</Badge>
      </div>
    </div>
  );
}

function Step({ num, color, title, text }: { num: string; color: string; title: string; text: string }) {
  return (
    <div>
      <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: color }}>{num}</div>
      <h3 className="font-bold text-lg mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{text}</p>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-extrabold">{n}</div>
      <div className="text-sm text-white/80 mt-1">{l}</div>
    </div>
  );
}

function Testimonial({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-border">
      <Quote className="w-6 h-6 text-primary-light mb-3" />
      <p className="text-sm leading-relaxed">"{quote}"</p>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="font-semibold text-sm">{author}</div>
        <div className="text-xs text-muted-foreground">{role}</div>
      </div>
    </div>
  );
}
