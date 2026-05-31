import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import fsbmLogo from "@/assets/fsbm-logo.png";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Mot de passe oublié — PFE Connect" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
      toast.success("Si un compte existe, un email a été envoyé.");
    } catch (err: any) {
      // Pour éviter d'exposer l'existence d'un compte, on affiche un message neutre
      setSent(true);
      toast.success("Si un compte existe, un email a été envoyé.");
      console.warn(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-slide-up">
        <Link to="/" className="flex flex-col items-center mb-6">
          <img src={fsbmLogo} alt="FSBM" className="h-16 w-auto mb-3" />
          <span className="font-bold text-xl text-primary">PFE Connect</span>
          <span className="text-xs text-muted-foreground">Faculté des Sciences Ben M'Sik</span>
        </Link>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-accent text-primary flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold">Vérifiez votre boîte mail</h2>
            <p className="text-sm text-muted-foreground">
              Si l'adresse <strong>{email}</strong> correspond à un compte, vous recevrez un lien
              de réinitialisation dans quelques instants.
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              <ArrowLeft className="w-4 h-4" /> Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">Mot de passe oublié ?</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Entrez votre email pour recevoir un lien de réinitialisation.
            </p>
            <form onSubmit={handle} className="space-y-4">
              <div>
                <Label>Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-10" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-[var(--primary-hover)]" size="lg">
                {loading ? "Envoi..." : "Envoyer le lien"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/login" className="inline-flex items-center gap-1 text-primary-light font-semibold hover:underline">
                <ArrowLeft className="w-4 h-4" /> Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
