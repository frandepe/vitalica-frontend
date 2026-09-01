import { BookOpenCheck, GraduationCap, ShieldAlert } from "lucide-react";

const experiences = [
  {
    title: "Como alumno",
    description:
      "Registrarte, explorar cursos gratuitos, realizar clases, avanzar en los contenidos y completar las experiencias disponibles.",
    icon: BookOpenCheck,
  },
  {
    title: "Como instructor",
    description:
      "Solicitar el rol de instructor, conocer el dashboard y probar las herramientas de creación y publicación de cursos utilizando contenido ficticio.",
    icon: GraduationCap,
  },
];

export function BetaExperienceSections() {
  return (
    <section className="border-t border-border/60 py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            ¿Qué podés probar?
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Recorré las principales experiencias de Vitalica.
          </h2>
          <div className="mt-6 flex gap-3 rounded-lg border-l border-secondary bg-secondary/5 p-5 text-sm leading-7 text-muted-foreground">
            <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-secondary" />
            <p>
              La Beta es un entorno de prueba. No subas contenido real de
              cursos ni materiales que quieras conservar.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {experiences.map((experience) => (
            <article
              key={experience.title}
              className="rounded-lg border border-border/70 bg-background/90 p-6 shadow-[0_18px_60px_-42px_rgba(34,80,69,0.32)]"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-primary/15 bg-primary/8 text-primary">
                <experience.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                {experience.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                {experience.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
