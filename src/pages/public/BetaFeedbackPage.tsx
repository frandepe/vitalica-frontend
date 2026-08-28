import { BetaFeedbackForm } from "@/components/beta/BetaFeedbackForm";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

const getSafeOriginPath = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return undefined;
  }

  return value.slice(0, 500);
};

const BetaFeedbackPage = () => {
  const [searchParams] = useSearchParams();
  const originPath = useMemo(
    () => getSafeOriginPath(searchParams.get("from")),
    [searchParams],
  );

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f5fffc_0%,#ffffff_26%,#ffffff_100%)]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-7rem] top-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto container max-w-4xl px-4 pb-24 pt-16 md:px-0">
        <header className="pb-10 pt-10">
          <Link
            to="/beta"
            className="text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Volver a la Beta
          </Link>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Ayudanos a mejorar Vitalica
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            ¿Encontraste algo que no funciona o no sabés cómo hacer algo?
            Contanos. Tu experiencia nos ayuda a mejorar Vitalica antes del
            lanzamiento.
          </p>
        </header>

        <BetaFeedbackForm originPath={originPath} />
      </div>
    </section>
  );
};

export default BetaFeedbackPage;
