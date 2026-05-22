import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SOUTENANCES, USERS, SALLES, PROJETS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/soutenances")({ component: SoutenancesPage });

function SoutenancesPage() {
  const [studentId, setStudentId] = useState("");
  const [jury, setJury] = useState<string[]>([]);
  const etudiants = USERS.filter(u => u.role === "etudiant");
  const enseignants = USERS.filter(u => u.role === "enseignant");
  const proj = PROJETS.find(p => p.etudiantId === studentId);
  const encadrantId = proj?.encadrantId;
  const availableJury = enseignants.filter(e => e.id !== encadrantId);

  const toggle = (id: string) => setJury(j => j.includes(id) ? j.filter(x => x !== id) : [...j, id]);

  const save = () => {
    if (!studentId) return toast.error("Sélectionnez un étudiant");
    if (jury.length < 2) return toast.error("Minimum 2 membres de jury requis");
    toast.success("Soutenance planifiée ! Les jurys ont été notifiés.");
    setJury([]); setStudentId("");
  };

  return (
    <Tabs defaultValue="liste">
      <TabsList className="bg-accent">
        <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
        <TabsTrigger value="liste">Liste</TabsTrigger>
        <TabsTrigger value="planifier">Planifier</TabsTrigger>
      </TabsList>

      <TabsContent value="calendrier" className="mt-6">
        <Card className="p-10 text-center text-muted-foreground rounded-2xl shadow-md">Vue calendrier — Bientôt disponible</Card>
      </TabsContent>

      <TabsContent value="liste" className="mt-6 space-y-3">
        {SOUTENANCES.map(s => (
          <Card key={s.id} className="p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-bold">{s.etudiantNom}</div>
              <div className="text-sm text-muted-foreground">{s.projetTitre}</div>
              <div className="text-xs text-muted-foreground mt-1">📅 {s.date} • {s.heure} — Salle {s.salle}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Jury</div>
              <div className="flex flex-wrap gap-1 justify-end mt-1">{s.juryNoms.map(n => <Badge key={n} className="bg-accent text-primary hover:bg-accent text-[10px]">{n}</Badge>)}</div>
            </div>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="planifier" className="mt-6">
        <Card className="p-6 rounded-2xl shadow-md max-w-3xl">
          <h3 className="font-bold text-lg mb-5">Planifier une soutenance</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Étudiant</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>{etudiants.map(e => <SelectItem key={e.id} value={e.id}>{e.prenom} {e.nom}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Encadrant (auto)</Label>
              <Input className="mt-1.5" disabled value={proj?.encadrantNom ?? "—"} />
            </div>
            <div><Label>Date</Label><Input className="mt-1.5" type="date" /></div>
            <div><Label>Heure</Label><Input className="mt-1.5" type="time" /></div>
            <div className="md:col-span-2">
              <Label>Salle</Label>
              <Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Sélectionner une salle" /></SelectTrigger>
                <SelectContent>{SALLES.map(s => <SelectItem key={s.id} value={s.id}>Salle {s.nom} ({s.capacite} places)</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-1">Composition du jury</h4>
            <p className="text-xs text-muted-foreground mb-3">Sélectionnez les enseignants membres du jury. L'encadrant de l'étudiant ne peut pas être jury. (Min. 2)</p>
            <div className="bg-accent text-primary rounded-xl p-3 mb-3 flex gap-2 text-xs"><Info className="w-4 h-4 shrink-0" />Les enseignants sélectionnés verront cette soutenance dans leur onglet "Mes Jurys".</div>
            <div className="space-y-2">
              {availableJury.map(e => {
                const load = SOUTENANCES.filter(s => s.juryIds.includes(e.id)).length;
                const checked = jury.includes(e.id);
                return (
                  <button key={e.id} type="button" onClick={() => toggle(e.id)} className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-colors text-left ${checked ? "border-primary bg-accent" : "border-border hover:border-primary-light"}`}>
                    <div>
                      <div className="font-medium text-sm">{e.prenom} {e.nom}</div>
                      <div className="text-xs text-muted-foreground">{e.specialite}</div>
                    </div>
                    <Badge className="bg-accent text-primary hover:bg-accent">{load} jurys ce mois</Badge>
                  </button>
                );
              })}
              {studentId && encadrantId && (
                <div className="text-xs text-destructive flex items-center gap-1.5 mt-2"><AlertTriangle className="w-3.5 h-3.5" />L'encadrant ({proj?.encadrantNom}) ne peut pas être ajouté comme jury.</div>
              )}
            </div>
          </div>

          <Button className="w-full mt-6 bg-primary hover:bg-[var(--primary-hover)]" onClick={save}>Planifier la soutenance</Button>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
