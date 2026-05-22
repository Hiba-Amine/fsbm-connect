import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { USERS, PROJETS, SOUTENANCES } from "@/lib/mock-data";
import { Users, BookOpen, FolderOpen, Calendar } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDash });

const BLUES = ["#1B3A6B", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"];

function AdminDash() {
  const pie = [
    { name: "En cours", value: 89 },
    { name: "Soutenus", value: 34 },
    { name: "En attente", value: 12 },
  ];
  const bar = [
    { mois: "Jan", n: 5 }, { mois: "Fév", n: 8 }, { mois: "Mar", n: 12 },
    { mois: "Avr", n: 6 }, { mois: "Mai", n: 18 }, { mois: "Juin", n: 24 },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="Total Étudiants" v="127" />
        <Stat icon={BookOpen} label="Enseignants actifs" v="18" />
        <Stat icon={FolderOpen} label="Projets en cours" v="89" />
        <Stat icon={Calendar} label="Soutenances planifiées" v="34" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6 rounded-2xl shadow-md">
          <h3 className="font-bold mb-4">Projets par statut</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
                {pie.map((_, i) => <Cell key={i} fill={BLUES[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6 rounded-2xl shadow-md">
          <h3 className="font-bold mb-4">Soutenances par mois</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bar}>
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="n" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="p-6 rounded-2xl shadow-md">
        <h3 className="font-bold mb-4">Soutenances à venir</h3>
        <div className="space-y-2">
          {SOUTENANCES.slice(0, 5).map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-background">
              <div>
                <div className="font-semibold text-sm">{s.etudiantNom}</div>
                <div className="text-xs text-muted-foreground">{s.projetTitre}</div>
              </div>
              <div className="text-right text-xs">
                <div className="font-semibold text-primary">{s.date} • {s.heure}</div>
                <div className="text-muted-foreground">Salle {s.salle}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
function Stat({ icon: Icon, label, v }: any) {
  return (
    <Card className="p-5 rounded-2xl shadow-md">
      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
      <div className="text-xs text-muted-foreground mt-3">{label}</div>
      <div className="text-2xl font-bold mt-1">{v}</div>
    </Card>
  );
}
