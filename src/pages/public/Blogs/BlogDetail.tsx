import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogBySlug, type BlogPost } from "@/content/blogs";
import { NotFound } from "@/pages/public/404Page";

const audienceLabel: Record<BlogPost["audience"], string> = {
  ALUMNOS: "Alumnos",
  INSTRUCTORES: "Instructores",
  COMUNIDAD: "Comunidad",
};

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = slug ? getBlogBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 md:px-6">
        <NotFound
          title="Blog no encontrado"
          description="No encontramos una publicación asociada a esta URL."
        />
      </div>
    );
  }

  const sections = buildBlogSections(post);

  return (
    <article className="min-h-screen bg-[linear-gradient(180deg,#f5f9fb_0%,#ffffff_14%,#ffffff_100%)] text-slate-900">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8">
            <Button
              variant="ghost"
              asChild
              className="rounded-lg px-0 text-slate-600 hover:bg-transparent hover:text-slate-950"
            >
              <Link to="/blogs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al blog
              </Link>
            </Button>
          </div>

          <header className="border-b border-slate-200 pb-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)] lg:items-end">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    variant={
                      post.audience === "INSTRUCTORES" ? "warning" : "info"
                    }
                    appearance="ghost"
                    className="rounded-lg border border-current/15 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em]"
                  >
                    {audienceLabel[post.audience]}
                  </Badge>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {post.topic}
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
                    {post.title}
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-slate-600">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <figure className="overflow-hidden rounded-lg bg-slate-100">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </figure>
            </div>
          </header>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
            <div className="min-w-0">
              <div className="max-w-3xl space-y-12">
                {sections.map((section, index) => (
                  <section
                    key={section.heading}
                    className={
                      index === 0 ? "" : "border-t border-slate-200 pt-10"
                    }
                  >
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                      {section.heading}
                    </h2>
                    <div className="mt-5 space-y-5 text-[1.06rem] leading-8 text-slate-700">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="space-y-8 border-l border-slate-200 pl-0 lg:pl-8">
                <section className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Ficha editorial
                  </p>
                  <dl className="space-y-4 text-sm leading-7 text-slate-600">
                    <div>
                      <dt className="font-semibold text-slate-900">
                        Audiencia
                      </dt>
                      <dd>{audienceLabel[post.audience]}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">Tema</dt>
                      <dd>{post.topic}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">Contexto</dt>
                      <dd>Biblioteca editorial pública de Vitalica.</dd>
                    </div>
                  </dl>
                </section>

                <section className="space-y-4 border-t border-slate-200 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Seguir explorando
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline" className="justify-start">
                      <Link to={`/blogs?audience=${post.audience}`}>
                        Ver más sobre{" "}
                        {audienceLabel[post.audience].toLowerCase()}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <Link to="/blogs">Ir a todas las publicaciones</Link>
                    </Button>
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </article>
  );
}

function buildBlogSections(post: BlogPost) {
  const audienceCopy =
    post.audience === "ALUMNOS"
      ? "para quienes están organizando su formación y necesitan decisiones claras"
      : post.audience === "INSTRUCTORES"
        ? "para profesionales que quieren transformar experiencia en una propuesta formativa sólida"
        : "para una comunidad que aprende y enseña con foco en claridad y calidad";

  return [
    {
      heading: "Contexto",
      paragraphs: [
        `${post.title} aborda un punto frecuente dentro de ${post.topic.toLowerCase()} ${audienceCopy}. En Vitalica, este tipo de contenido busca ordenar decisiones concretas sin sumar complejidad innecesaria.`,
        `La idea central es simple: cuando el criterio está claro desde el inicio, tanto la experiencia de aprendizaje como la experiencia de enseñanza ganan consistencia, foco y mejores resultados.`,
      ],
    },
    {
      heading: "Qué conviene priorizar",
      paragraphs: [
        `Antes de avanzar, conviene definir qué objetivo real tiene esta publicación dentro del recorrido formativo. No se trata solo de acumular recursos, sino de identificar qué cambio práctico debería producir en la persona que lo lee.`,
        `Por eso la prioridad está en la claridad operativa: entender el problema, ordenar los pasos y sostener una secuencia que permita pasar de una intención general a una acción concreta.`,
      ],
    },
    {
      heading: "Cómo aplicarlo en Vitalica",
      paragraphs: [
        `En el contexto de Vitalica, este tema se integra mejor cuando se conecta con una experiencia de uso simple: contenidos bien presentados, expectativas claras y una navegación que acompañe el proceso sin distraer.`,
        `Ese enfoque permite que ${post.topic.toLowerCase()} funcione como una herramienta real y no solo como información aislada. El valor aparece cuando la publicación ayuda a decidir, mejorar o avanzar con más seguridad.`,
      ],
    },
  ];
}
