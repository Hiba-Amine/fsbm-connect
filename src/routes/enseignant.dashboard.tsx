import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/context";
import { SOUTENANCES, USERS, PROJETS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, BookOpen, FileText, MessageCircle, Info, FileSearch, Edit, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/enseignant/dashboard")({ component: EnsDash });

function EnsDash() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  if (!currentUser) return null;

  const juryAssignments = SOUTENANCES.filter((s) => s.juryIds.includes(currentUser.id));
  const myStudents = USERS.filter((u) => currentUser.encadrantFor?.includes(u.id));
  const hasJury = juryAssignments.length > 0;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="encadrement">
        <TabsList className="bg-accent">
          <TabsTrigger value="encadrement">Mon Encadrement</TabsTrigger>
          {hasJury && (
            <TabsTrigger value="jury" className="relative">
              Mes Jurys
              <span className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold inline-flex items-center justify-center">{juryAssignments.length}</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="encadrement" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Étudiants encadrés" value={String(myStudents.length)} />
            <StatCard icon={BookOpen} label="Sujets proposés" value="5" />
            <StatCard icon={FileText} label="Rapports en attente" value="2" />
            <StatCard icon={MessageCircle} label="Messages non lus" value="4" />
          </div>

          <Card className="p-6 rounded-2xl shadow-md">
            <h3 className="font-bold mb-4">Mes étudiants — Progression</h3>
            <div className="space-y-3">
              {myStudents.map((s) => {
                const p = PROJETS.find(x => x.etudiantId === s.id);
                return (
                  <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl bg-background">
                    <div className="w-10 h-10 rounded-full bg-primary-gradient text-primary-foreground flex items-center justify-center text-sm font-semibold">{s.prenom[0]}{s.nom[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{s.prenom} {s.nom}</div>
                      <div className="text-xs text-muted-foreground truncate">{p?.titre}</div>
                    </div>
                    <div className="w-32 hidden md:block"><Progress value={p?.progress ?? 0} className="h-2" /></div>
                    <span className="text-xs text-muted-foreground hidden sm:block">{p?.progress}%</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {hasJury && (
          <TabsContent value="jury" className="mt-6 space-y-5">
            <div className="bg-accent text-primary rounded-2xl p-4 flex gap-2.5">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm"><span className="font-semibold">Vous êtes membre du jury pour {juryAssignments.length} soutenances.</span> Consultez les rapports et saisissez vos évaluations après chaque soutenance.</div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {juryAssignments.map((s) => {
                const isMyStudent = currentUser.encadrantFor?.includes(s.etudiantId);
                return (
                  <Card key={s.id} className="p-5 rounded-2xl shadow-md">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold">{s.etudiantNom}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">{s.projetTitre}</p>
                      </div>
                      <Badge className={s.status === "A_VENIR" ? "bg-accent text-primary" : "bg-success/15 text-success"}>{s.status === "A_VENIR" ? "À VENIR" : "RÉALISÉE"}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>📅 {s.date} à {s.heure}</div>
                      <div>📍 Salle {s.salle}</div>
                      <div>👤 Votre rôle : <span className="text-primary font-medium">Membre du jury</span></div>
                    </div>
                    {isMyStudent && (
                      <div className="mt-3 bg-destructive/10 text-destructive rounded-xl p-2.5 text-xs flex gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Votre étudiant — Vous ne pouvez pas l'évaluer en tant que jury.</span>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-primary text-primary hover:bg-accent"><FileSearch className="w-3.5 h-3.5 mr-1.5" />Consulter rapport</Button>
                      <Button size="sm" disabled={isMyStudent} className="flex-1 bg-primary hover:bg-[var(--primary-hover)] disabled:opacity-50" onClick={() => navigate({ to: "/enseignant/jury-evaluations" })}>
                        <Edit className="w-3.5 h-3.5 mr-1.5" />Évaluer
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <Card className="p-5 rounded-2xl shadow-md">
      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
      <div className="text-xs text-muted-foreground mt-3">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </Card>
  );
}
