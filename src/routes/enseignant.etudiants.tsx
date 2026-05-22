import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/context";
import { USERS, PROJETS, RAPPORTS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileText, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/enseignant/etudiants")({ component: EtudiantsTeacher });

function EtudiantsTeacher() {
  const { currentUser } = useAuth();
  const mine = USERS.filter((u) => currentUser?.encadrantFor?.includes(u.id));
  const [selected, setSelected] = useState<string | null>(null);
  const sel = USERS.find(u => u.id === selected);
  const selProj = PROJETS.find(p => p.etudiantId === selected);
  const selRap = RAPPORTS.filter(r => r.projetId === selProj?.id);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mine.map((s) => {
        const p = PROJETS.find(x => x.etudiantId === s.id);
        return (
          <Card key={s.id} className="p-5 rounded-2xl shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary-gradient text-primary-foreground flex items-center justify-center font-semibold">{s.prenom[0]}{s.nom[0]}</div>
              <div className="min-w-0">
                <div className="font-bold">{s.prenom} {s.nom}</div>
                <div className="text-xs text-muted-foreground">{s.filiere} • {s.niveau}</div>
              </div>
            </div>
            <div className="text-sm line-clamp-2 mb-3">{p?.titre}</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Progression</span><span className="font-semibold">{p?.progress}%</span></div>
              <Progress value={p?.progress ?? 0} className="h-2" />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full mt-4 bg-primary hover:bg-[var(--primary-hover)]" onClick={() => setSelected(s.id)}>Voir rapport</Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader><SheetTitle>{sel?.prenom} {sel?.nom}</SheetTitle></SheetHeader>
                <div className="mt-6 space-y-3">
                  {selRap.length === 0 && <div className="text-sm text-muted-foreground">Aucun rapport déposé.</div>}
                  {selRap.map((r) => (
                    <Card key={r.id} className="p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <div className="text-sm font-medium flex-1">{r.filename}</div>
                        <Badge className="bg-accent text-primary hover:bg-accent">{r.type}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">Déposé le {r.uploadedAt}</div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" className="flex-1 bg-success hover:bg-success/90" onClick={() => toast.success("Rapport validé")}><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Valider</Button>
                        <Button size="sm" variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10" onClick={() => toast.error("Rapport refusé")}><XCircle className="w-3.5 h-3.5 mr-1" />Refuser</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </Card>
        );
      })}
    </div>
  );
}
