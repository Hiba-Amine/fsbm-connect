import { createFileRoute } from "@tanstack/react-router";
import { SALLES } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/salles")({ component: SallesPage });

function SallesPage() {
  return (
    <Card className="rounded-2xl shadow-md overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="font-bold">Salles ({SALLES.length})</h3>
        <Button className="bg-primary hover:bg-[var(--primary-hover)]"><Plus className="w-4 h-4 mr-2" />Ajouter une salle</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Salle</TableHead><TableHead>Bâtiment</TableHead><TableHead>Capacité</TableHead><TableHead>Équipement</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {SALLES.map(s => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.nom}</TableCell>
              <TableCell>{s.batiment}</TableCell>
              <TableCell>{s.capacite} places</TableCell>
              <TableCell><div className="flex gap-1 flex-wrap">{s.equipement.map(e => <Badge key={e} className="bg-accent text-primary hover:bg-accent text-[10px]">{e}</Badge>)}</div></TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
