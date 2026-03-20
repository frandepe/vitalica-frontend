import type { ReactNode } from "react";

interface LegalSection {
  title: string;
  content: ReactNode;
}

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
}

const LegalPageLayout = ({
  eyebrow,
  title,
  intro,
  lastUpdated,
  sections,
}: LegalPageLayoutProps) => {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fffd_0%,#ffffff_18%,#ffffff_100%)] px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[-8rem] top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-px w-[min(92%,80rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <header className="grid gap-10 border-b border-border/70 pb-12 pt-20 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.8fr)] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              {intro}
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:pl-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Referencia
              </p>
              <p className="mt-3 text-base leading-7 text-foreground">
                Ultima actualizacion
              </p>
              <p className="text-sm text-muted-foreground">{lastUpdated}</p>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-border via-border/40 to-transparent" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Alcance
              </p>
              <p className="mt-3 text-base leading-7 text-foreground">
                Texto base de ejemplo para adaptar luego al contenido legal
                final de Vitalica.
              </p>
            </div>
          </div>
        </header>

        <div className="mt-14 grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
              En esta pagina
            </p>
            <ol className="mt-6 space-y-4">
              {sections.map((section, index) => (
                <li key={section.title}>
                  <a
                    href={`#legal-section-${index + 1}`}
                    className="group flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="mt-0.5 text-xs font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-6">{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <article
                key={section.title}
                id={`legal-section-${index + 1}`}
                className="grid gap-4 border-t border-border/70 pt-8 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-8"
              >
                <div className="text-sm font-semibold tracking-[0.18em] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {section.title}
                  </h2>
                  <div className="mt-5 max-w-3xl space-y-4 text-base leading-8 text-muted-foreground">
                    {section.content}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalPageLayout;
