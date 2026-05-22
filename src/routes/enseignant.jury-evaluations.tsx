import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/context";
import { SOUTENANCES } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/enseignant/jury-evaluations")({ component: JuryEval });

function mention(n: number) {
  if (n < 10) return { label: "Insuffisant", cls: "bg-destructive/15 text-destructive" };
  if (n < 12) return { label: "Passable", cls: "bg-muted text-muted-foreground" };
  if (n < 14) return { label: "Assez Bien", cls: "bg-accent text-primary" };
  if (n < 16) return { label: "Bien", cls: "bg-accent text-primary" };
  if (n < 18) return { label: "Très Bien", cls: "bg-primary-light/15 text-primary-light" };
  return { label: "Excellent", cls: "bg-primary text-primary-foreground" };
}

function JuryEval() {
  const { currentUser } = useAuth();
  const mySoutenances = SOUTENANCES.filter(s => s.juryIds.includes(currentUser?.id ?? ""));
  const [sid, setSid] = useState(mySoutenances[0]?.id ?? "");
  const selected = mySoutenances.find(s => s.id === sid);
  const isMine = currentUser?.encadrantFor?.includes(selected?.etudiantId ?? "");
  const [note, setNote] = useState([15]);
  const [comment, setComment] = useState("");
  const m = mention(note[0]);

  return (
    <Card className="p-6 rounded-2xl shadow-md max-w-2xl">
      <h2 className="text-xl font-bold mb-1">Mes évaluations en tant que jury</h2>
      <p className="text-sm text-muted-foreground mb-6">Évaluez les soutenances pour lesquelles vous êtes membre du jury.</p>
      <div className="space-y-5">
        <div>
          <Label>Soutenance</Label>
          <Select value={sid} onValueChange={setSid}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{mySoutenances.map(s => <SelectItem key={s.id} value={s.id}>{s.etudiantNom} — {s.date}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {isMine && (
          <div className="bg-destructive/10 text-destructive rounded-xl p-3 flex gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Vous ne pouvez pas évaluer cet étudiant : vous êtes son encadrant.</span>
          </div>
        )}

        <fieldset disabled={isMine} className="space-y-5 disabled:opacity-50">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Note sur 20</Label>
              <div className="flex items-center gap-2"><span className="text-2xl font-bold text-primary">{note[0]}</span><Badge className={m.cls + " hover:" + m.cls}>{m.label}</Badge></div>
            </div>
            <Slider value={note} onValueChange={setNote} min={0} max={20} step={0.5} />
          </div>
          <div><Label>Commentaire du jury</Label><Textarea className="mt-1.5" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Vos remarques sur la soutenance..." /></div>
          <Button className="w-full bg-primary hover:bg-[var(--primary-hover)]" onClick={() => toast.success("Évaluation de jury enregistrée !")}>Soumettre l'évaluation</Button>
        </fieldset>
      </div>
    </Card>
  );
}
