import { BetaExplainerVideo } from "@/components/beta/BetaExplainerVideo";
import { BetaExperienceSections } from "@/components/beta/BetaExperienceSections";
import { BetaFAQ } from "@/components/beta/BetaFAQ";
import { BetaFeedbackLink } from "@/components/beta/BetaFeedbackLink";
import { BetaPageCta } from "@/components/beta/BetaPageCta";
import {
  BadgeCheck,
  DatabaseZap,
  ShieldAlert,
  WalletCards,
} from "lucide-react";

const betaSignals = [
  {
    label: "Entorno de prueba",
    icon: ShieldAlert,
  },
  {
    label: "Sin pagos durante septiembre",
    icon: WalletCards,
  },
  {
    label: "Datos no permanentes",
    icon: DatabaseZap,
  },
  {
    label: "Usar contenido ficticio",
    icon: BadgeCheck,
  },
];

const BetaPage = () => {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f5fffc_0%,#ffffff_26%,#ffffff_100%)]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-7rem] top-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto container px-4 pb-24 pt-16 md:px-0">
        <header className="border-b border-border/60 pb-16 pt-10">
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(19rem,0.88fr)] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Estás probando Vitalica antes de su lanzamiento
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                Durante septiembre abrimos la plataforma para que puedas
                explorar la plataforma, probar la experiencia como alumno e
                instructor y ayudarnos a mejorarla antes del lanzamiento oficial
                de octubre.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Algunos cursos y perfiles son ficticios y se utilizan
                exclusivamente para probar la web. Su contenido puede no estar
                validado y no debe utilizarse como material de formación ni como
                guía de actuación ante una emergencia.
              </p>
              <div className="mt-8">
                <BetaFeedbackLink>Enviar comentario</BetaFeedbackLink>
              </div>
            </div>

            <div className="rounded-lg border-l border-primary bg-background/90 p-6 shadow-[0_24px_80px_-44px_rgba(34,80,69,0.35)]">
              <p className="text-sm font-semibold text-foreground">
                Lo importante antes de empezar
              </p>
              <div className="mt-5 grid gap-3">
                {betaSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/8 text-primary">
                      <signal.icon className="h-4 w-4" />
                    </span>
                    <span>{signal.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <BetaExplainerVideo />
        <BetaExperienceSections />

        <section className="border-t border-border/60 py-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Preguntas frecuentes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Todo lo que conviene saber durante la Beta.
            </h2>
          </div>
          <BetaFAQ />
        </section>

        <BetaPageCta />
      </div>
    </section>
  );
};

export default BetaPage;
