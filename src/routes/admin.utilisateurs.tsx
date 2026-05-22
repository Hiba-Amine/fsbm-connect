import { createFileRoute } from "@tanstack/react-router";
import { USERS, SOUTENANCES } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/utilisateurs")({ component: UsersPage });

function UsersPage() {
  return (
    <Card className="rounded-2xl shadow-md overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="font-bold">Tous les utilisateurs ({USERS.length})</h3>
        <Button className="bg-primary hover:bg-[var(--primary-hover)]"><Plus className="w-4 h-4 mr-2" />Ajouter</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Utilisateur</TableHead><TableHead>Email</TableHead><TableHead>Rôle</TableHead><TableHead>Filière/Spécialité</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {USERS.map(u => {
            const isJury = SOUTENANCES.some(s => s.juryIds.includes(u.id));
            return (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-primary-gradient text-primary-foreground flex items-center justify-center text-xs font-semibold">{u.prenom[0]}{u.nom[0]}</div>
                    <span className="font-medium">{u.prenom} {u.nom}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <div className="flex gap-1.5 flex-wrap">
                    {u.role === "etudiant" && <Badge className="bg-accent text-primary hover:bg-accent">Étudiant</Badge>}
                    {u.role === "admin" && <Badge className="bg-accent text-primary hover:bg-accent">Administrateur</Badge>}
                    {u.role === "enseignant" && <>
                      {u.isEncadrant && <Badge className="bg-accent text-primary hover:bg-accent">Encadrant</Badge>}
                      {isJury && <Badge className="bg-accent text-primary hover:bg-accent">Jury</Badge>}
                    </>}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.filiere ?? u.specialite ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
