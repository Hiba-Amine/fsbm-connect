import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/context";
import { PROJETS, SOUTENANCES } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Circle, Calendar, MapPin, User } from "lucide-react";

export const Route = createFileRoute("/etudiant/projet")({ component: ProjetPage });

function ProjetPage() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  const projet = PROJETS.find((p) => p.etudiantId === currentUser.id);
  const sout = SOUTENANCES.find((s) => s.etudiantId === currentUser.id);
  if (!projet) return <Card className="p-10 text-center text-muted-foreground">Aucun projet associé.</Card>;

  const radius = 70;
  const c = 2 * Math.PI * radius;
  const offset = c - (projet.progress / 100) * c;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 rounded-2xl shadow-md lg:col-span-2">
          <h2 className="text-xl font-bold">{projet.titre}</h2>
          <p className="text-sm text-muted-foreground mt-1">Encadré par {projet.encadrantNom}</p>
          <div className="mt-6 space-y-4">
            <Step done label="Sujet validé" date="15 Mars 2026" />
            <Step done label="Dépôt rapport provisoire" date="10 Avril 2026" />
            <Step current label="Rédaction rapport final" date="En cours" />
            <Step label="Soutenance" date={sout ? `${sout.date} à ${sout.heure}` : "À planifier"} />
          </div>
        </Card>
        <Card className="p-6 rounded-2xl shadow-md flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground mb-2">Avancement</div>
          <svg width="170" height="170" viewBox="0 0 170 170" className="-rotate-90">
            <circle cx="85" cy="85" r={radius} stroke="#E5E7EB" strokeWidth="12" fill="none" />
            <circle cx="85" cy="85" r={radius} stroke="#2563EB" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} className="transition-all" />
          </svg>
          <div className="-mt-[112px] text-3xl font-bold text-primary">{projet.progress}%</div>
          <div className="mt-[80px]" />
          <Badge className="bg-accent text-primary hover:bg-accent">{projet.status}</Badge>
        </Card>
      </div>

      {sout && (
        <Card className="p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-lg mb-4">Soutenance planifiée</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Info icon={Calendar} label="Date" value={`${sout.date} • ${sout.heure}`} />
            <Info icon={MapPin} label="Salle" value={sout.salle} />
            <Info icon={User} label="Jury" value={sout.juryNoms.join(", ")} />
          </div>
        </Card>
      )}
    </div>
  );
}

function Step({ done, current, label, date }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-success/15 text-success" : current ? "bg-accent text-primary" : "bg-border text-muted-foreground"}`}>
        {done ? <CheckCircle2 className="w-4 h-4" /> : current ? <Loader2 className="w-4 h-4 animate-spin" /> : <Circle className="w-4 h-4" />}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{date}</div>
      </div>
    </div>
  );
}
function Info({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-background">
      <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center"><Icon className="w-4 h-4 text-primary" /></div>
      <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-semibold text-sm">{value}</div></div>
    </div>
  );
}
