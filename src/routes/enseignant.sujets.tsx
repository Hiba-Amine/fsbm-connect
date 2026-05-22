import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/context";
import { SUJETS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/enseignant/sujets")({ component: SujetsTeacher });

function SujetsTeacher() {
  const { currentUser } = useAuth();
  const mySujets = SUJETS.filter((s) => s.enseignantId === currentUser?.id);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-primary hover:bg-[var(--primary-hover)]"><Plus className="w-4 h-4 mr-2" />Proposer un sujet</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Proposer un nouveau sujet</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Titre</Label><Input className="mt-1.5" placeholder="Titre du sujet" /></div>
              <div><Label>Description</Label><Textarea className="mt-1.5" rows={4} placeholder="Description détaillée" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Filière</Label><Input className="mt-1.5" placeholder="Informatique" /></div>
                <div><Label>Niveau</Label><Input className="mt-1.5" placeholder="Master 1" /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button className="bg-primary hover:bg-[var(--primary-hover)]" onClick={() => { toast.success("Sujet créé !"); setOpen(false); }}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-2xl shadow-md overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Titre</TableHead><TableHead>Filière</TableHead><TableHead>Niveau</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {mySujets.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">Vous n'avez proposé aucun sujet.</TableCell></TableRow>}
            {mySujets.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.titre}</TableCell>
                <TableCell>{s.filiere}</TableCell>
                <TableCell>{s.niveau}</TableCell>
                <TableCell><Badge className="bg-accent text-primary hover:bg-accent">{s.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
