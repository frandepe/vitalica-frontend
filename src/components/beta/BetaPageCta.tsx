import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function BetaPageCta() {
  return (
    <section className="border-t border-border/60 py-16">
      <div className="grid gap-8 rounded-lg border-l border-primary bg-background/90 p-6 shadow-[0_24px_80px_-48px_rgba(34,80,69,0.4)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Empezar
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            ¿Listo para probar Vitalica?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            Queremos que explores la plataforma como lo harías normalmente.
            Probá funciones, recorré cursos y contanos cuando algo no funcione o
            no se entienda.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            to="/buscar?search=&page=1&limit=10"
            className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground outline-none transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Explorar Vitalica
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/solicitar-ser-instructor"
            className="group inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-5 py-3 text-sm font-medium text-foreground outline-none transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Quiero probar como instructor
            <ArrowRight className="h-4 w-4 text-primary" />
          </Link>
        </div>
      </div>
    </section>
  );
}
