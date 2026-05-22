import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/context";
import { SOUTENANCES } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

export const Route = createFileRoute("/etudiant/evaluations")({ component: EvalPage });

function EvalPage() {
  const { currentUser } = useAuth();
  const sout = SOUTENANCES.find((s) => s.etudiantId === currentUser?.id);
  const done = sout?.status === "REALISEE";

  if (done && sout?.note) {
    const radius = 70, c = 2 * Math.PI * radius, off = c - (sout.note / 20) * c;
    return (
      <Card className="p-8 rounded-2xl shadow-md max-w-xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-6">Résultat de votre soutenance</h2>
        <svg width="170" height="170" viewBox="0 0 170 170" className="-rotate-90 mx-auto">
          <circle cx="85" cy="85" r={radius} stroke="#E5E7EB" strokeWidth="12" fill="none" />
          <circle cx="85" cy="85" r={radius} stroke="#1B3A6B" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
        </svg>
        <div className="-mt-[110px] text-4xl font-bold text-primary">{sout.note}/20</div>
        <div className="mt-[80px]" />
        <Badge className="bg-accent text-primary hover:bg-accent text-base px-4 py-1">{sout.mention}</Badge>
      </Card>
    );
  }

  const days = sout ? Math.ceil((new Date(sout.date).getTime() - Date.now()) / 86400000) : 0;
  return (
    <Card className="p-8 rounded-2xl shadow-md max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center"><Calendar className="w-6 h-6 text-primary" /></div>
        <div><h3 className="font-bold">Soutenance à venir</h3><p className="text-sm text-muted-foreground">Vos évaluations seront disponibles après votre soutenance</p></div>
      </div>
      {sout && (
        <div className="mt-4 p-4 bg-accent rounded-xl">
          <div className="font-semibold text-primary">{sout.date} à {sout.heure}</div>
          <div className="text-sm text-primary/80 mt-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Dans {days} jours — Salle {sout.salle}</div>
        </div>
      )}
    </Card>
  );
}
