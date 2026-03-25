import { motion } from "framer-motion";
import { useEffect, useTransition, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BlogGrid } from "@/components/Blog/BlogGrid";
import { TextPagination } from "@/components/Pagination/TextPagination";
import { Button } from "@/components/ui/button";
import {
  type BlogAudienceFilter,
  type BlogPost,
  getBlogsByAudienceFilter,
} from "@/content/blogs";
import { cn } from "@/utils/cn";

const audienceOptions: Array<{
  value: BlogAudienceFilter;
  label: string;
  description: string;
}> = [
  {
    value: "TODOS",
    label: "Todos",
    description: "Todo el contenido editorial en la web.",
  },
  {
    value: "ALUMNOS",
    label: "Alumnos",
    description: "Recursos para elegir, cursar y sostener tu formación.",
  },
  {
    value: "INSTRUCTORES",
    label: "Instructores",
    description: "Guías para diseñar, grabar y publicar cursos con criterio.",
  },
  {
    value: "COMUNIDAD",
    label: "Comunidad",
    description: "Contenidos compartidos para enseñar y aprender mejor.",
  },
];

const audienceSectionLabel: Record<BlogAudienceFilter, string> = {
  TODOS: "Todas las publicaciones",
  ALUMNOS: "Publicaciones para alumnos",
  INSTRUCTORES: "Publicaciones para instructores",
  COMUNIDAD: "Publicaciones para la comunidad",
};

const POSTS_PER_PAGE = 9;

function getFeaturedSelection(posts: BlogPost[]) {
  const highlighted = posts.filter((post) => post.featured);
  return (highlighted.length >= 3 ? highlighted : posts).slice(0, 3);
}

export default function BlogLandingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedAudience = searchParams.get("audience");
  const requestedPage = searchParams.get("page");
  const initialAudience = isValidAudienceFilter(requestedAudience)
    ? requestedAudience
    : "TODOS";
  const initialPage = getValidPageNumber(requestedPage);
  const [activeAudience, setActiveAudience] =
    useState<BlogAudienceFilter>(initialAudience);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (
      isValidAudienceFilter(requestedAudience) &&
      requestedAudience !== activeAudience
    ) {
      setActiveAudience(requestedAudience);
    }

    if (!requestedAudience && activeAudience !== "TODOS") {
      setActiveAudience("TODOS");
    }
  }, [activeAudience, requestedAudience]);

  useEffect(() => {
    const nextPage = getValidPageNumber(requestedPage);

    if (nextPage !== currentPage) {
      setCurrentPage(nextPage);
    }
  }, [currentPage, requestedPage]);

  const filteredBlogs = getBlogsByAudienceFilter(activeAudience);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / POSTS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * POSTS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(
    pageStart,
    pageStart + POSTS_PER_PAGE,
  );
  const featuredSelection = getFeaturedSelection(paginatedBlogs);
  const featuredIds = new Set(featuredSelection.map((post) => post.id));
  const gridPosts =
    featuredSelection.length > 0
      ? paginatedBlogs.filter((post) => !featuredIds.has(post.id))
      : paginatedBlogs;
  const activeOption =
    audienceOptions.find((option) => option.value === activeAudience) ??
    audienceOptions[0];

  useEffect(() => {
    if (safeCurrentPage !== currentPage) {
      setCurrentPage(safeCurrentPage);
      setSearchParams(buildBlogSearchParams(activeAudience, safeCurrentPage), {
        replace: true,
      });
    }
  }, [activeAudience, currentPage, safeCurrentPage, setSearchParams]);

  const handleAudienceChange = (audience: BlogAudienceFilter) => {
    startTransition(() => {
      setActiveAudience(audience);
      setCurrentPage(1);
      setSearchParams(buildBlogSearchParams(audience, 1));
    });
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      setCurrentPage(page);
      setSearchParams(buildBlogSearchParams(activeAudience, page));
    });
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbfd_0%,#ffffff_18%,#f8fafc_100%)]">
      <div className="mx-auto flex w-full container flex-col gap-12 px-4 py-8 md:py-12 lg:gap-16">
        <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white/90 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.4)]">
          <div className="relative overflow-hidden px-6 py-8 md:px-10 md:py-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-teal-100/70 blur-3xl" />
            <div className="absolute left-0 top-16 h-28 w-28 rounded-full bg-sky-100/80 blur-3xl" />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-end"
            >
              <div className="space-y-5">
                <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Blog y guías
                </span>
                <div className="space-y-3">
                  <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                    Recursos para aprender, enseñar y mejorar la experiencia
                    formativa
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                    Un espacio editorial para alumnos, instructores y contenidos
                    compartidos, con herramientas concretas para avanzar con más
                    claridad.
                  </p>
                </div>
              </div>

              <div className="relative z-10 rounded-lg border border-slate-200/80 bg-slate-50/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Audiencia activa
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-2xl font-semibold text-slate-950">
                    {activeOption.label}
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    {activeOption.description}
                  </p>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-500">
                  {filteredBlogs.length} publicaciones disponibles
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="relative z-10 mt-8 border-t border-slate-200/80 pt-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Explorar por audiencia
                  </p>
                  <p className="text-sm text-slate-600">
                    Elegí qué tipos de blogs queres ver
                  </p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {audienceOptions.map((option) => {
                    const isActive = option.value === activeAudience;

                    return (
                      <Button
                        key={option.value}
                        type="button"
                        variant="ghost"
                        onClick={() => handleAudienceChange(option.value)}
                        className={cn(
                          "h-11 rounded-lg border px-4 text-sm font-medium transition-all",
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-900/95 hover:text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        {option.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {featuredSelection.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Destacados
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                  Una selección editorial para empezar por lo más relevante
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-600">
                Priorizamos contenidos que ayudan a orientarse rápido dentro de
                cada audiencia.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
              <FeaturedPrimaryCard post={featuredSelection[0]} />

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {featuredSelection.slice(1).map((post) => (
                  <FeaturedCompactCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Biblioteca editorial
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {audienceSectionLabel[activeAudience]}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              El filtro por audiencia es la navegación principal en esta etapa.
              Los topics se mantienen como metadata visual dentro de cada card.
            </p>
          </div>

          {isPending ? (
            <div className="rounded-lg border border-slate-200/80 bg-white/80 px-6 py-10 text-sm text-slate-500">
              Actualizando publicaciones...
            </div>
          ) : gridPosts.length > 0 ? (
            <BlogGrid posts={gridPosts} />
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center">
              <p className="text-lg font-semibold text-slate-950">
                Todavía no hay artículos publicados para esta audiencia.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Podés revisar los contenidos compartidos o volver a todas las
                publicaciones para explorar la biblioteca completa.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-6 rounded-lg border-slate-300 bg-white px-5"
                onClick={() => handleAudienceChange("TODOS")}
              >
                Volver a todos
              </Button>
            </div>
          )}

          {filteredBlogs.length > POSTS_PER_PAGE && (
            <div className="flex justify-center pt-4">
              <TextPagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function FeaturedPrimaryCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]"
    >
      <Link
        to={`/blog/${post.slug}`}
        className="grid h-full gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]"
      >
        <div className="relative min-h-[280px] overflow-hidden bg-slate-100">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between gap-8 p-6 md:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span>{formatAudience(post.audience)}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{post.topic}</span>
            </div>
            <h3 className="text-3xl font-semibold tracking-tight text-slate-950">
              {post.title}
            </h3>
            <p className="text-base leading-7 text-slate-600">{post.excerpt}</p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500">
            <span>Selección destacada</span>
            <span className="font-medium text-slate-900">
              Vitalica Editorial
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function FeaturedCompactCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_20px_50px_-42px_rgba(15,23,42,0.4)]"
    >
      <Link to={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-slate-200 bg-slate-100">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>{formatAudience(post.audience)}</span>
            <span>{post.topic}</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold leading-tight text-slate-950">
              {post.title}
            </h3>
            <p className="text-sm leading-6 text-slate-600">{post.excerpt}</p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function formatAudience(audience: BlogPost["audience"]) {
  if (audience === "ALUMNOS") {
    return "Alumnos";
  }

  if (audience === "INSTRUCTORES") {
    return "Instructores";
  }

  return "Comunidad";
}

function isValidAudienceFilter(
  value: string | null,
): value is BlogAudienceFilter {
  return (
    value === "TODOS" ||
    value === "ALUMNOS" ||
    value === "INSTRUCTORES" ||
    value === "COMUNIDAD"
  );
}

function getValidPageNumber(value: string | null) {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

function buildBlogSearchParams(audience: BlogAudienceFilter, page: number) {
  const params = new URLSearchParams();

  if (audience !== "TODOS") {
    params.set("audience", audience);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  return params;
}
