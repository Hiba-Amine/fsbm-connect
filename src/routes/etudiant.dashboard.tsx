import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/context";
import { PROJETS, RAPPORTS, SOUTENANCES } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, User, FileText, Award, CheckCircle2, Loader2, Circle, Upload, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/etudiant/dashboard")({ component: Dash });

function Dash() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  const projet = PROJETS.find((p) => p.etudiantId === currentUser.id);
  const rapports = RAPPORTS.filter((r) => r.projetId === projet?.id);
  const sout = SOUTENANCES.find((s) => s.etudiantId === currentUser.id);
  const days = sout ? Math.max(0, Math.ceil((new Date(sout.date).getTime() - Date.now()) / 86400000)) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-primary-gradient rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold">Bonjour, {currentUser.prenom}</h2>
        <p className="text-white/85 mt-1">Voici un aperçu de votre projet de fin d'études</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Statut du projet" value="En cours" />
        <StatCard icon={User} label="Encadrant" value={projet?.encadrantNom ?? "—"} />
        <StatCard icon={Upload} label="Rapport final" value={rapports.find(r => r.type === "FINAL") ? "Déposé" : "À déposer"} />
        <StatCard icon={Calendar} label="Soutenance" value={sout ? `Dans ${days} jours` : "Non planifiée"} />
      </div>

      <Card className="p-6 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">{projet?.titre}</h3>
            <p className="text-sm text-muted-foreground">Progression de votre projet</p>
          </div>
          <Badge className="bg-accent text-primary hover:bg-accent">{projet?.progress}%</Badge>
        </div>
        <Progress value={projet?.progress ?? 0} className="h-3" />
        <div className="mt-6 space-y-3">
          <TimelineItem done label="Sujet validé" date="Mar 2026" icon="check" />
          <TimelineItem done label="Rapport provisoire déposé" date="Avr 2026" icon="check" />
          <TimelineItem current label="Rapport final" date="Mai 2026" icon="loading" />
          <TimelineItem label="Soutenance" date="Jun 2026" icon="circle" />
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-3">
        <QuickAction icon={Upload} label="Déposer un rapport" />
        <QuickAction icon={MessageCircle} label="Contacter l'encadrant" />
        <QuickAction icon={Award} label="Voir mes évaluations" />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <Card className="p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{label}</div>
      <div className="font-bold text-base mt-0.5">{value}</div>
    </Card>
  );
}

function TimelineItem({ done, current, label, date, icon }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-success/10 text-success" : current ? "bg-accent text-primary" : "bg-border text-muted-foreground"}`}>
        {icon === "check" && <CheckCircle2 className="w-4 h-4" />}
        {icon === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
        {icon === "circle" && <Circle className="w-4 h-4" />}
      </div>
      <div className="flex-1">
        <div className={`text-sm font-medium ${done ? "" : current ? "" : "text-muted-foreground"}`}>{label}</div>
        <div className="text-xs text-muted-foreground">{date}</div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label }: any) {
  return (
    <Button variant="outline" className="h-auto py-4 rounded-xl border-primary text-primary hover:bg-accent justify-start">
      <Icon className="w-4 h-4 mr-2" />{label}
    </Button>
  );
}
