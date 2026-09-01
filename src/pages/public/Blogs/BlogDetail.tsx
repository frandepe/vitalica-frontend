import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Square, Volume2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getBlogDetailBySlug,
  type BlogContentBlock,
  type BlogContentSection,
} from "@/content/blog-details";
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

  return <BlogDetailArticle post={post} />;
}

function BlogDetailArticle({ post }: { post: BlogPost }) {
  const content = getBlogDetailBySlug(post.slug);
  const sections = useMemo<BlogContentSection[]>(
    () =>
      content && content.sections.length > 0
        ? content.sections
        : getFallbackSections(post),
    [content, post],
  );
  const articleText = useMemo(
    () => buildArticleSpeechText(post, sections),
    [post, sections],
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const canUseSpeech =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  useEffect(() => {
    return () => {
      if (canUseSpeech) {
        window.speechSynthesis.cancel();
      }
    };
  }, [canUseSpeech, post.slug]);

  const handleListenClick = () => {
    if (!canUseSpeech) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(articleText);
    utterance.lang = "es-AR";
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

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
                      {section.blocks.map((block, blockIndex) => (
                        <BlogContentBlockRenderer
                          key={`${section.heading}-${blockIndex}`}
                          block={block}
                        />
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
                    Escuchar
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleListenClick}
                    disabled={!canUseSpeech}
                  >
                    {isSpeaking ? (
                      <Square className="mr-2 h-4 w-4" />
                    ) : (
                      <Volume2 className="mr-2 h-4 w-4" />
                    )}
                    {isSpeaking ? "Detener audio" : "Escuchar blog"}
                  </Button>
                  {!canUseSpeech && (
                    <p className="text-sm leading-6 text-slate-500">
                      Tu navegador no soporta lectura por voz.
                    </p>
                  )}
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

function BlogContentBlockRenderer({ block }: { block: BlogContentBlock }) {
  if (block.type === "paragraph") {
    return <p>{block.text}</p>;
  }

  if (block.type === "ordered-list") {
    return (
      <ol className="list-decimal space-y-2 pl-6">
        {block.items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ol>
    );
  }

  return (
    <ul className="list-disc space-y-2 pl-6">
      {block.items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

function buildArticleSpeechText(
  post: BlogPost,
  sections: BlogContentSection[],
) {
  const sectionText = sections
    .map((section) =>
      [
        section.heading,
        ...section.blocks.map((block) => getBlockSpeechText(block)),
      ]
        .filter(Boolean)
        .join(". "),
    )
    .join(". ");

  return [post.title, post.excerpt, sectionText].filter(Boolean).join(". ");
}

function getBlockSpeechText(block: BlogContentBlock) {
  if (block.type === "paragraph") {
    return block.text;
  }

  return block.items.join(". ");
}

function getFallbackSections(post: BlogPost): BlogContentSection[] {
  return [
    {
      heading: "Contenido en revision",
      blocks: [
        {
          type: "paragraph",
          text: `El articulo "${post.title}" todavia no tiene contenido editorial cargado.`,
        },
        {
          type: "paragraph",
          text: "Mientras tanto, podes volver a la biblioteca editorial para explorar otras publicaciones disponibles.",
        },
      ],
    },
  ];
}
