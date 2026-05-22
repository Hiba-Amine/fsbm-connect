import { createFileRoute } from "@tanstack/react-router";
import { USERS, PROJETS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "lucide-react";

export const Route = createFileRoute("/admin/affectations")({ component: Affect });

function Affect() {
  const etudiants = USERS.filter(u => u.role === "etudiant");
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="p-5 rounded-2xl shadow-md">
        <h3 className="font-bold mb-3">Étudiants sans encadrant</h3>
        <div className="space-y-2">
          {etudiants.filter(s => !PROJETS.find(p => p.etudiantId === s.id)).map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-background">
              <div className="font-medium text-sm">{s.prenom} {s.nom}</div>
              <Button size="sm" className="bg-primary hover:bg-[var(--primary-hover)]"><Link className="w-3.5 h-3.5 mr-1" />Affecter</Button>
            </div>
          ))}
          {etudiants.filter(s => !PROJETS.find(p => p.etudiantId === s.id)).length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-6">Tous les étudiants sont affectés.</div>
          )}
        </div>
      </Card>
      <Card className="p-5 rounded-2xl shadow-md">
        <h3 className="font-bold mb-3">Affectations actuelles</h3>
        <div className="space-y-2">
          {PROJETS.map(p => {
            const e = USERS.find(u => u.id === p.etudiantId);
            return (
              <div key={p.id} className="p-3 rounded-xl bg-background">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{e?.prenom} {e?.nom}</div>
                  <Badge className="bg-accent text-primary hover:bg-accent">{p.encadrantNom}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{p.titre}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
