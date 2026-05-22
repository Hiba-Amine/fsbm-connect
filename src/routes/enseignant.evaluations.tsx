import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/context";
import { USERS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/enseignant/evaluations")({ component: EvalEns });

function mention(n: number): { label: string; cls: string } {
  if (n < 10) return { label: "Insuffisant", cls: "bg-destructive/15 text-destructive" };
  if (n < 12) return { label: "Passable", cls: "bg-muted text-muted-foreground" };
  if (n < 14) return { label: "Assez Bien", cls: "bg-accent text-primary" };
  if (n < 16) return { label: "Bien", cls: "bg-accent text-primary" };
  if (n < 18) return { label: "Très Bien", cls: "bg-primary-light/15 text-primary-light" };
  return { label: "Excellent", cls: "bg-primary text-primary-foreground" };
}

function EvalEns() {
  const { currentUser } = useAuth();
  const mine = USERS.filter(u => currentUser?.encadrantFor?.includes(u.id));
  const [studentId, setStudentId] = useState(mine[0]?.id ?? "");
  const [note, setNote] = useState([14]);
  const [comment, setComment] = useState("");
  const m = mention(note[0]);

  return (
    <Card className="p-6 rounded-2xl shadow-md max-w-2xl">
      <h2 className="text-xl font-bold mb-1">Évaluer mes étudiants encadrés</h2>
      <p className="text-sm text-muted-foreground mb-6">Saisissez la note d'encadrement pour chaque étudiant.</p>
      <div className="space-y-5">
        <div>
          <Label>Étudiant</Label>
          <Select value={studentId} onValueChange={setStudentId}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{mine.map(s => <SelectItem key={s.id} value={s.id}>{s.prenom} {s.nom}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Note sur 20</Label>
            <div className="flex items-center gap-2"><span className="text-2xl font-bold text-primary">{note[0]}</span><Badge className={m.cls + " hover:" + m.cls}>{m.label}</Badge></div>
          </div>
          <Slider value={note} onValueChange={setNote} min={0} max={20} step={0.5} />
        </div>
        <div><Label>Commentaire</Label><Textarea className="mt-1.5" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Vos remarques sur l'encadrement..." /></div>
        <Button className="w-full bg-primary hover:bg-[var(--primary-hover)]" onClick={() => toast.success("Évaluation enregistrée !")}>Enregistrer l'évaluation</Button>
      </div>
    </Card>
  );
}
