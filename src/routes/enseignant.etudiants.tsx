import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context";
import { api, type AffectationDTO } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileText, Loader2, Users } from "lucide-react";

export const Route = createFileRoute("/enseignant/etudiants")({ component: EtudiantsTeacher });

function EtudiantsTeacher() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [affectations, setAffectations] = useState<AffectationDTO[]>([]);

  useEffect(() => {
    if (!currentUser?.email) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const ens = await api.enseignantMe(currentUser.email);
        if (!ens) { if (!cancelled) setAffectations([]); return; }
        const list = await api.enseignantAffectations(ens.id);
        if (!cancelled) setAffectations(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Erreur de chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [currentUser?.email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Chargement des étudiants...
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 rounded-2xl border-destructive/40 bg-destructive/5">
        <div className="font-semibold text-destructive mb-1">Impossible de charger les étudiants</div>
        <p className="text-sm text-muted-foreground">{error}</p>
      </Card>
    );
  }

  const allStudents = affectations.flatMap((a) =>
    a.etudiants.map((e) => ({ ...e, affectation: a }))
  );

  if (allStudents.length === 0) {
    return (
      <Card className="p-10 rounded-2xl shadow-md text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-3">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div className="font-semibold mb-1">Aucun étudiant encadré</div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Vous n'avez pas encore d'étudiants affectés. Dès qu'un admin créera une affectation pour vous, vos étudiants apparaîtront ici.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allStudents.map((s) => {
        const initials = (s.nom || "??").split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
        return (
          <Card key={`${s.affectation.id}-${s.id}`} className="p-5 rounded-2xl shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary-gradient text-primary-foreground flex items-center justify-center font-semibold">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-bold truncate">{s.nom}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {s.filiereNom ?? "—"} {s.niveau ? `• ${s.niveau}` : ""}
                </div>
                {s.matricule && <div className="text-[11px] text-muted-foreground">N° {s.matricule}</div>}
              </div>
            </div>
            <div className="text-sm line-clamp-2 mb-3 min-h-[2.5rem]">{s.affectation.projetTitre}</div>
            <Badge className="bg-accent text-primary hover:bg-accent">Affectation #{s.affectation.id}</Badge>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full mt-4 bg-primary hover:bg-[var(--primary-hover)]">
                  Voir détails
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader><SheetTitle>{s.nom}</SheetTitle></SheetHeader>
                <div className="mt-6 space-y-3 text-sm">
                  <div><span className="text-muted-foreground">Email :</span> {s.email}</div>
                  <div><span className="text-muted-foreground">Filière :</span> {s.filiereNom ?? "—"}</div>
                  <div><span className="text-muted-foreground">Niveau :</span> {s.niveau ?? "—"}</div>
                  <div><span className="text-muted-foreground">Matricule :</span> {s.matricule ?? "—"}</div>
                  <div className="pt-3 border-t">
                    <div className="font-semibold mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Projet</div>
                    <div className="text-sm">{s.affectation.projetTitre}</div>
                    <div className="text-xs text-muted-foreground mt-1">Affecté le {s.affectation.dateAffectation}</div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </Card>
        );
      })}
    </div>
  );
}
