import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/lib/context";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-[var(--primary-hover)]">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-[var(--primary-hover)]">
          Réessayer
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PFE Connect — FSBM" },
      { name: "description", content: "Plateforme de gestion des Projets de Fin d'Études — Faculté des Sciences Ben M'Sik, Université Hassan II Casablanca." },
      { property: "og:title", content: "PFE Connect — FSBM" },
      { name: "twitter:title", content: "PFE Connect — FSBM" },
      { property: "og:description", content: "Plateforme de gestion des Projets de Fin d'Études — Faculté des Sciences Ben M'Sik, Université Hassan II Casablanca." },
      { name: "twitter:description", content: "Plateforme de gestion des Projets de Fin d'Études — Faculté des Sciences Ben M'Sik, Université Hassan II Casablanca." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d8f805bd-5226-492b-92f3-117ce4403dd1/id-preview-9709a414--3df9d371-fa20-411a-aa9b-e1fc7a6833cd.lovable.app-1779709271883.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d8f805bd-5226-492b-92f3-117ce4403dd1/id-preview-9709a414--3df9d371-fa20-411a-aa9b-e1fc7a6833cd.lovable.app-1779709271883.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <Outlet />
        <Toaster position="top-right" richColors />
      </AppProviders>
    </QueryClientProvider>
  );
}
