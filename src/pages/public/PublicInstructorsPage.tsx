import { getPublicInstructors } from "@/api";
import { CirclesImg } from "@/components/Banners/HeaderBanner";
import { InstructorProfileCard } from "@/components/CardsAnimated/InstructorProfileCard";
import { TextPagination } from "@/components/Pagination/TextPagination";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { specialties } from "@/constants/course";
import { ISpecialty } from "@/types/course.types";
import { PublicInstructorListItem } from "@/types/public-instructor.types";
import { t } from "@/utils/translations";
import { formatStudentCount } from "@/utils/format-student-count";
import { AlertCircle, Search, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import mask01 from "@/assets/Masks/mask-11.svg";
import banner1 from "/Banners/banner1.jpg";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const PAGE_LIMIT = 12;
const SEO_TITLE = "Instructores | Vitalica";
const SEO_DESCRIPTION =
  "Explora la red publica de instructores de Vitalica: perfiles verificados, especialidades y trayectoria dentro de la plataforma.";

const formatFullName = (instructor: PublicInstructorListItem) =>
  `${instructor.firstName ?? ""} ${instructor.lastName ?? ""}`.trim() ||
  "Instructor Vitalica";

const formatLocation = (instructor: PublicInstructorListItem) => {
  if (instructor.city && instructor.state) {
    return `${instructor.city}, ${instructor.state}`;
  }

  return instructor.city || instructor.state || null;
};

const formatCourseLabel = (totalCourses: number) =>
  totalCourses === 1 ? "1 curso" : `${totalCourses} cursos`;

const PublicInstructorsPage = () => {
  const [items, setItems] = useState<PublicInstructorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<
    "ALL" | ISpecialty
  >("ALL");

  const loadInstructors = async () => {
    setLoading(true);
    setHasError(false);

    try {
      const response = await getPublicInstructors({
        page: currentPage,
        limit: PAGE_LIMIT,
        search: appliedSearch || undefined,
        specialty: selectedSpecialty === "ALL" ? "ALL" : selectedSpecialty,
      });

      setItems(Array.isArray(response.data) ? response.data : []);
      setTotalPages(response.meta?.totalPages || 1);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      console.error("Error loading public instructors:", error);
      setHasError(true);
      setItems([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInstructors();
  }, [currentPage, appliedSearch, selectedSpecialty]);

  useEffect(() => {
    const previousTitle = document.title;
    const previousLang = document.documentElement.lang;

    const ensureMeta = (
      selector: string,
      attributes: Record<string, string>,
    ) => {
      let element = document.head.querySelector(selector) as
        | HTMLMetaElement
        | HTMLLinkElement
        | null;

      if (!element) {
        element = document.createElement(
          selector.startsWith("link") ? "link" : "meta",
        ) as HTMLMetaElement | HTMLLinkElement;
        document.head.appendChild(element);
      }

      Object.entries(attributes).forEach(([key, value]) => {
        element?.setAttribute(key, value);
      });

      return element;
    };

    document.title = SEO_TITLE;
    document.documentElement.lang = "es";

    const metaDescription = ensureMeta('meta[name="description"]', {
      name: "description",
      content: SEO_DESCRIPTION,
    });
    const ogTitle = ensureMeta('meta[property="og:title"]', {
      property: "og:title",
      content: SEO_TITLE,
    });
    const ogDescription = ensureMeta('meta[property="og:description"]', {
      property: "og:description",
      content: SEO_DESCRIPTION,
    });
    const canonical = ensureMeta('link[rel="canonical"]', {
      rel: "canonical",
      href: `${window.location.origin}/instructores`,
    });

    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLang || "es";
      metaDescription?.setAttribute("content", "");
      ogTitle?.setAttribute("content", "");
      ogDescription?.setAttribute("content", "");
      canonical?.setAttribute("href", window.location.origin);
    };
  }, []);

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    setAppliedSearch(searchInput.trim());
  };

  const resetFilters = () => {
    setSearchInput("");
    setAppliedSearch("");
    setSelectedSpecialty("ALL");
    setCurrentPage(1);
  };

  const hasFilters = Boolean(appliedSearch || selectedSpecialty !== "ALL");

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f5fffc_0%,#ffffff_26%,#ffffff_100%)]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-7rem] top-14 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto container px-4 pb-24 pt-16 md:px-0">
        <header className="grid gap-10 border-b border-border/60 pb-14 pt-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Red de instructores
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              Instructores verificados y en actividad.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              Explorá perfiles de instructores con experiencia en formación en
              emergencias. Vas a encontrar sus especialidades, trayectoria y
              actividad dentro de la red.
            </p>
          </div>
          <CirclesImg
            className="hidden 2xl:block"
            maskSrc={mask01}
            imgCircles={banner1}
          />
          {/* <div className="rounded-lg border-l border-primary bg-background/90 p-6 shadow-[0_24px_80px_-40px_rgba(34,80,69,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Confianza
            </p>

            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Todos los instructores fueron verificados y aprobados antes de
                  aparecer en la plataforma.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <BookOpen className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Cada perfil refleja su experiencia, especialidades y actividad
                  real dentro de Vitalica.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Users className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Forman parte de una red en crecimiento enfocada en formacion
                  de calidad en emergencias.
                </span>
              </div>
            </div>
          </div> */}
        </header>

        <section className="border-b border-border/60 py-10">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem_auto] lg:items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Buscar instructor
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearchSubmit();
                    }
                  }}
                  placeholder="Nombre, apellido o titular profesional"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Especialidad
              </label>
              <Select
                value={selectedSpecialty}
                onValueChange={(value) => {
                  setCurrentPage(1);
                  setSelectedSpecialty(value as "ALL" | ISpecialty);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas las especialidades</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSearchSubmit}>Aplicar</Button>
              {hasFilters ? (
                <Button variant="outline" onClick={resetFilters}>
                  Limpiar
                </Button>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>
              {loading
                ? "Cargando instructores..."
                : `${total} instructores visibles`}
            </span>
            {appliedSearch ? (
              <Badge variant="outline" size="sm">
                Busqueda: {appliedSearch}
              </Badge>
            ) : null}
            {selectedSpecialty !== "ALL" ? (
              <Badge variant="outline" size="sm">
                {t("courseSpecialty", selectedSpecialty)}
              </Badge>
            ) : null}
          </div>
        </section>

        <section className="py-12">
          {hasError && !loading ? (
            <Alert
              icon={AlertCircle}
              variant="warning"
              title="No pudimos cargar la red de instructores"
            >
              <div className="flex flex-col gap-4">
                <p>
                  Ocurrio un problema al consultar la informacion publica en
                  este momento.
                </p>
                <div>
                  <Button onClick={() => void loadInstructors()}>
                    Reintentar
                  </Button>
                </div>
              </div>
            </Alert>
          ) : loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[29rem] animate-pulse rounded-[28px] border border-border/70 bg-muted/40"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <Card className="border-dashed bg-background/85">
              <CardContent className="flex flex-col gap-4 px-6 py-12">
                <h2 className="text-2xl font-semibold text-foreground">
                  {hasFilters
                    ? "No encontramos instructores para este criterio."
                    : "Todavia no hay instructores visibles en la red publica."}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  {hasFilters
                    ? "Ajusta la busqueda o elimina el filtro aplicado para explorar mejor la red publica de instructores."
                    : "Cuando existan perfiles publicos disponibles, los vas a ver publicados en esta seccion."}
                </p>
                {hasFilters ? (
                  <div>
                    <Button variant="outline" onClick={resetFilters}>
                      Ver toda la red
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {items.map((instructor) => {
                  const fullName = formatFullName(instructor);
                  const location = formatLocation(instructor);
                  const approvedDate =
                    instructor.approvedAt &&
                    format(
                      new Date(instructor.approvedAt),
                      "d 'de' MMMM 'de' yyyy",
                      {
                        locale: es,
                      },
                    );
                  return (
                    <InstructorProfileCard
                      key={instructor.userId}
                      name={fullName}
                      headline={
                        instructor.headline ||
                        "Perfil profesional dentro de la red de instructores de Vitalica."
                      }
                      avatarUrl={instructor.avatarUrl}
                      specialties={instructor.specialties
                        .slice(0, 3)
                        .map((specialty) => t("courseSpecialty", specialty))}
                      extraSpecialtiesCount={Math.max(
                        instructor.specialties.length - 3,
                        0,
                      )}
                      location={location || "Ubicacion no especificada"}
                      theoryRating={instructor.stats.theory.averageRating}
                      theoryReviewCount={instructor.stats.theory.reviewCount}
                      practiceRating={instructor.stats.practice.averageRating}
                      practiceReviewCount={
                        instructor.stats.practice.reviewCount
                      }
                      totalCourses={instructor.stats.publishedCourses}
                      totalStudents={instructor.stats.uniqueStudents}
                      courseLabel={formatCourseLabel(
                        instructor.stats.publishedCourses,
                      )}
                      studentLabel={formatStudentCount(
                        instructor.stats.uniqueStudents,
                      )}
                      approvedLabel={
                        approvedDate
                          ? `Parte de Vitalica desde ${approvedDate}`
                          : "Instructor aprobado en Vitalica"
                      }
                      credentialTypes={instructor.credentialTypes}
                      profileHref={`/perfil/${instructor.slug}`}
                      isFoundingInstructor={instructor.isFoundingInstructor}
                    />
                  );
                })}
              </div>

              {totalPages > 1 ? (
                <div className="mt-10 flex justify-center">
                  <TextPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </section>
  );
};

export default PublicInstructorsPage;
