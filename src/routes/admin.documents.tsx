import { createFileRoute } from "@tanstack/react-router";
import { RAPPORTS, PROJETS, USERS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/documents")({ component: DocsPage });

const STATUS: Record<string, string> = {
  EN_ATTENTE: "bg-accent text-primary hover:bg-accent",
  VALIDE: "bg-success/15 text-success hover:bg-success/15",
  REFUSE: "bg-destructive/15 text-destructive hover:bg-destructive/15",
};

function DocsPage() {
  return (
    <Card className="rounded-2xl shadow-md overflow-hidden">
      <div className="p-4 border-b"><h3 className="font-bold">Tous les rapports déposés ({RAPPORTS.length})</h3></div>
      <Table>
        <TableHeader><TableRow><TableHead>Fichier</TableHead><TableHead>Étudiant</TableHead><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {RAPPORTS.map(r => {
            const proj = PROJETS.find(p => p.id === r.projetId);
            const etu = USERS.find(u => u.id === proj?.etudiantId);
            return (
              <TableRow key={r.id}>
                <TableCell><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /><span className="font-medium text-sm">{r.filename}</span></div></TableCell>
                <TableCell>{etu?.prenom} {etu?.nom}</TableCell>
                <TableCell><Badge className="bg-accent text-primary hover:bg-accent">{r.type}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-sm">{r.uploadedAt}</TableCell>
                <TableCell><Badge className={STATUS[r.status]}>{r.status}</Badge></TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
