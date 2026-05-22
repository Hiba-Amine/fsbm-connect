import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SUJETS, type Sujet } from "@/lib/mock-data";
import { Search, User, BookOpen } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/etudiant/sujets")({ component: SujetsPage });

const STATUS_STYLES: Record<string, string> = {
  DISPONIBLE: "bg-success/15 text-success hover:bg-success/15",
  PRIS: "bg-destructive/15 text-destructive hover:bg-destructive/15",
  EN_COURS: "bg-accent text-primary hover:bg-accent",
};

function SujetsPage() {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Sujet | null>(null);
  const filtered = SUJETS.filter(s => s.titre.toLowerCase().includes(q.toLowerCase()) || s.filiere.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-10" placeholder="Rechercher un sujet..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Card key={s.id} className="p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><BookOpen className="w-5 h-5 text-primary" /></div>
              <Badge className={STATUS_STYLES[s.status]}>{s.status}</Badge>
            </div>
            <h3 className="font-bold text-base mt-2 line-clamp-2">{s.titre}</h3>
            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-3 flex-1">{s.description}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3.5 h-3.5" /> {s.enseignantNom}
            </div>
            <div className="mt-1 flex gap-1.5">
              <Badge variant="outline" className="text-[10px]">{s.filiere}</Badge>
              <Badge variant="outline" className="text-[10px]">{s.niveau}</Badge>
            </div>
            <Button
              className="mt-4 w-full bg-primary hover:bg-[var(--primary-hover)] disabled:opacity-50"
              disabled={s.status !== "DISPONIBLE"}
              onClick={() => setPicked(s)}
            >
              {s.status === "DISPONIBLE" ? "Choisir ce sujet" : s.status === "PRIS" ? "Déjà pris" : "En cours"}
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={!!picked} onOpenChange={(o) => !o && setPicked(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirmer le choix du sujet</DialogTitle></DialogHeader>
          <div className="text-sm text-muted-foreground">
            Vous êtes sur le point de choisir : <span className="font-semibold text-foreground">{picked?.titre}</span>.
            Une fois validé, vous ne pourrez plus changer sans accord de l'administration.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPicked(null)}>Annuler</Button>
            <Button className="bg-primary hover:bg-[var(--primary-hover)]" onClick={() => { toast.success("Sujet sélectionné avec succès !"); setPicked(null); }}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
