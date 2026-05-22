import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import { RAPPORTS } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/etudiant/rapport")({ component: RapportPage });

function RapportPage() {
  const [type, setType] = useState<"PROVISOIRE" | "FINAL">("PROVISOIRE");
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (e: React.DragEvent) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); };
  const upload = () => {
    if (!file) { toast.error("Veuillez sélectionner un fichier"); return; }
    toast.success(`Rapport ${type.toLowerCase()} déposé avec succès !`);
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <Tabs value={type} onValueChange={(v) => setType(v as any)}>
        <TabsList className="bg-accent">
          <TabsTrigger value="PROVISOIRE">Rapport provisoire</TabsTrigger>
          <TabsTrigger value="FINAL">Rapport final</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="p-6 rounded-2xl shadow-md">
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${drag ? "border-primary bg-accent" : "border-primary-light/50 bg-background"}`}
        >
          <div className="w-14 h-14 rounded-full bg-accent text-primary flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-semibold">Glissez votre fichier ici</p>
          <p className="text-xs text-muted-foreground mt-1">ou cliquez pour parcourir (PDF, DOCX — max 20MB)</p>
          <input type="file" id="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <label htmlFor="file">
            <Button asChild variant="outline" className="mt-4 border-primary text-primary hover:bg-accent">
              <span>Parcourir</span>
            </Button>
          </label>
          {file && <div className="mt-4 text-sm font-medium">📎 {file.name}</div>}
        </div>
        <div className="mt-4 flex justify-end">
          <Button className="bg-primary hover:bg-[var(--primary-hover)]" onClick={upload}>Déposer le rapport</Button>
        </div>
      </Card>

      <Card className="p-6 rounded-2xl shadow-md">
        <h3 className="font-bold mb-4">Mes documents déposés</h3>
        <div className="space-y-2">
          {RAPPORTS.filter(r => r.projetId === "p1").map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-background hover:bg-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{r.filename}</div>
                  <div className="text-xs text-muted-foreground">{r.type} • Déposé le {r.uploadedAt}</div>
                </div>
              </div>
              <StatusBadge s={r.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ s }: { s: string }) {
  if (s === "VALIDE") return <Badge className="bg-success/15 text-success hover:bg-success/15"><CheckCircle2 className="w-3 h-3 mr-1" />Validé</Badge>;
  if (s === "REFUSE") return <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/15"><XCircle className="w-3 h-3 mr-1" />Refusé</Badge>;
  return <Badge className="bg-accent text-primary hover:bg-accent"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
}
