import { getMyCoursesEnrrolled } from "@/api";
import { StudentPracticePanel } from "@/components/Practice/StudentPracticePanel";
import { getStatusCopy } from "@/components/Practice/student-practice-panel.helpers";
import { PublicCourseCard } from "@/components/CardsAnimated/PublicCourseCard";
import { MainCarouselSkeleton } from "@/components/Skeletons/MainCarouselSkeleton";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { ISpecialty } from "@/types/course.types";
import type { PracticeProgressInfo } from "@/types/practice.types";
import { DotsPagination } from "@/components/Pagination/DotsPagination";
import { EmptyState } from "@/components/Pagination/helpers/empty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const LIMIT = 8;
const MY_COURSES_TAB_PARAM = "tab";
const MY_COURSES_TABS = {
  teorico: "teorico",
  practico: "practico",
} as const;

type MyCoursesTab = (typeof MY_COURSES_TABS)[keyof typeof MY_COURSES_TABS];

const DEFAULT_MY_COURSES_TAB = MY_COURSES_TABS.teorico;

function isMyCoursesTab(value: string | null): value is MyCoursesTab {
  return (
    value === MY_COURSES_TABS.teorico || value === MY_COURSES_TABS.practico
  );
}

interface MyCoursesResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    avgTheoreticalRating: number;
    specialty: ISpecialty;
    muxPlaybackId: string | null;
    enrollmentId: string;
    requiresPractice: boolean;
    practiceUnlockedAt: string | null;
    practiceCompleted: boolean;
    practiceCompletedAt: string | null;
    hasPendingPracticeRequest: boolean;
    latestPracticeRequestId: string | null;
    latestPracticeRequestStatus: "PENDING" | "COMPLETED" | "CANCELLED" | null;
    practiceCertificateAvailable: boolean;
  }[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

type MyCourse = MyCoursesResponse["data"][number];

function getPracticeBadge(course: MyCoursesResponse["data"][number]) {
  if (!course.requiresPractice) {
    return null;
  }

  if (course.practiceCompleted) {
    return { label: "Practica completada", variant: "success" as const };
  }

  if (course.latestPracticeRequestStatus === "PENDING") {
    return { label: "Solicitud pendiente", variant: "info" as const };
  }

  if (course.latestPracticeRequestStatus === "CANCELLED") {
    return { label: "Solicitud cancelada", variant: "warning" as const };
  }

  if (course.practiceUnlockedAt) {
    return { label: "Practica disponible", variant: "info" as const };
  }

  return { label: "Practica bloqueada", variant: "warning" as const };
}

function getPracticeInfo(course: MyCourse): PracticeProgressInfo {
  return {
    enrollmentId: course.enrollmentId,
    requiresPractice: course.requiresPractice,
    practiceUnlockedAt: course.practiceUnlockedAt,
    practiceCompleted: course.practiceCompleted,
    practiceCompletedAt: course.practiceCompletedAt,
    latestPracticeRequestId: course.latestPracticeRequestId,
    latestPracticeRequestStatus: course.latestPracticeRequestStatus,
    hasPendingPracticeRequest: course.hasPendingPracticeRequest,
    practiceCertificateAvailable: course.practiceCertificateAvailable,
  };
}

function getPracticeActionLabel(practice: PracticeProgressInfo) {
  if (!practice.practiceUnlockedAt && !practice.practiceCompleted) {
    return "Continuar teoria";
  }

  if (practice.practiceCompleted) {
    return "Ver practica";
  }

  if (practice.latestPracticeRequestStatus === "PENDING") {
    return "Ver solicitud";
  }

  if (practice.latestPracticeRequestStatus === "CANCELLED") {
    return "Crear nueva solicitud";
  }

  return "Elegir instructor";
}

const MyCourses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<MyCoursesResponse | undefined>();
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedPracticeSlug, setSelectedPracticeSlug] = useState<
    string | null
  >(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCourses = useCallback(
    async (p: number, q: string, options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setLoading(true);
      }
      setLoadError(null);

      try {
        const res = await getMyCoursesEnrrolled(p, LIMIT, q);
        setCourses(res);

        // Adjust these fields to match your actual API response shape
        setTotalItems(res.meta.total ?? res.data.length);
        setTotalPages(
          res.meta.totalPages ??
            Math.ceil((res.meta.total ?? res.data.length) / LIMIT),
        );
      } catch {
        setLoadError(
          "No pudimos cargar tus cursos. Reintenta en unos segundos.",
        );
      } finally {
        if (!options?.silent) {
          setLoading(false);
        }
      }
    },
    [],
  );

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  useEffect(() => {
    fetchCourses(page, search);
  }, [page, search, fetchCourses]);

  const handleClear = () => {
    setInputValue("");
  };

  const isEmpty = !loading && (courses?.data?.length ?? 0) === 0;
  const practiceCourses =
    courses?.data.filter((course) => course.requiresPractice) ?? [];
  const requestedTab = searchParams.get(MY_COURSES_TAB_PARAM);
  const activeTab = isMyCoursesTab(requestedTab)
    ? requestedTab
    : DEFAULT_MY_COURSES_TAB;
  const reloadCourses = useCallback(
    (options?: { silent?: boolean }) => fetchCourses(page, search, options),
    [fetchCourses, page, search],
  );

  const setMyCoursesTab = useCallback(
    (tab: MyCoursesTab, options?: { replace?: boolean }) => {
      const nextSearchParams = new URLSearchParams(searchParams);

      if (tab === DEFAULT_MY_COURSES_TAB) {
        nextSearchParams.delete(MY_COURSES_TAB_PARAM);
      } else {
        nextSearchParams.set(MY_COURSES_TAB_PARAM, tab);
      }

      setSearchParams(nextSearchParams, { replace: options?.replace ?? false });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (!requestedTab || requestedTab === activeTab) return;
    setMyCoursesTab(activeTab, { replace: true });
  }, [activeTab, requestedTab, setMyCoursesTab]);

  useEffect(() => {
    setSelectedPracticeSlug(null);
  }, [activeTab, page, search]);

  return (
    <div className="min-h-screen px-4 md:px-0 py-10">
      {/* Header */}
      <div className="container mx-auto mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-foreground/65 mb-1 font-medium">
              Tu progreso
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Mis Cursos</h1>
            {!loading && (
              <p className="text-sm text-foreground/65 mt-1">
                {totalItems === 0
                  ? "Aún no tenés cursos inscriptos"
                  : `${totalItems} curso${totalItems !== 1 ? "s" : ""} inscripto${totalItems !== 1 ? "s" : ""}`}
              </p>
            )}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/65 pointer-events-none" />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Buscar curso..."
              className="pl-9 pr-9 placeholder:text-zinc-600
                         focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600
                         rounded-xl h-11 text-sm transition-colors"
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/65 hover:text-zinc-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setMyCoursesTab(value as MyCoursesTab)}
          className="w-full"
        >
          <TabsList className="mb-8 h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
            <TabsTrigger
              value={MY_COURSES_TABS.teorico}
              className="rounded-b-none border-b-2 border-transparent px-4 py-2 text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Teoria
            </TabsTrigger>
            <TabsTrigger
              value={MY_COURSES_TABS.practico}
              className="rounded-b-none border-b-2 border-transparent px-4 py-2 text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Practica
            </TabsTrigger>
          </TabsList>

          <TabsContent value={MY_COURSES_TABS.teorico} className="mt-0">
            {loadError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-6">
                <p className="text-sm font-medium text-foreground">
                  No se pudieron cargar tus cursos
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {loadError}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => fetchCourses(page, search)}
                >
                  Reintentar
                </Button>
              </div>
            ) : loading ? (
              <MainCarouselSkeleton />
            ) : isEmpty ? (
              <EmptyState hasSearch={!!search} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {courses?.data.map((course) => {
                    const practiceBadge = getPracticeBadge(course);

                    return (
                      <div key={course.slug} className="space-y-2">
                        <PublicCourseCard
                          course={course}
                          href={`/mis-cursos/${course.slug}`}
                        />

                        {(practiceBadge ||
                          course.practiceCertificateAvailable) && (
                          <div className="flex flex-wrap items-center gap-2">
                            {practiceBadge && (
                              <Badge variant={practiceBadge.variant} size="sm">
                                {practiceBadge.label}
                              </Badge>
                            )}
                            {course.practiceCertificateAvailable && (
                              <Badge variant="outline" size="sm">
                                Certificado practico disponible
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <DotsPagination
                      page={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value={MY_COURSES_TABS.practico} className="mt-0">
            {loadError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-6">
                <p className="text-sm font-medium text-foreground">
                  No se pudieron cargar tus practicas
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {loadError}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => fetchCourses(page, search)}
                >
                  Reintentar
                </Button>
              </div>
            ) : loading ? (
              <MainCarouselSkeleton />
            ) : isEmpty ? (
              <EmptyState hasSearch={!!search} />
            ) : practiceCourses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10">
                <p className="text-sm font-medium text-foreground">
                  {search
                    ? "No encontramos practicas para esa busqueda"
                    : "No tenes practicas pendientes"}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {search
                    ? "Proba con otro termino o volve al listado completo de cursos."
                    : "Tus cursos actuales no requieren una etapa practica presencial."}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  {practiceCourses.map((course) => {
                    const practice = getPracticeInfo(course);
                    const status = getStatusCopy(practice);
                    const StatusIcon = status.icon;
                    const isSelected = selectedPracticeSlug === course.slug;
                    const isPracticeBlocked =
                      !practice.practiceUnlockedAt &&
                      !practice.practiceCompleted;

                    return (
                      <div
                        key={course.slug}
                        className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={status.variant} size="sm">
                                {status.badge}
                              </Badge>
                              {practice.practiceCertificateAvailable && (
                                <Badge variant="outline" size="sm">
                                  Certificado practico disponible
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <StatusIcon className="h-5 w-5" />
                              </span>
                              <div className="min-w-0 space-y-1">
                                <h2 className="text-base font-semibold leading-6 text-foreground sm:text-lg">
                                  {course.title}
                                </h2>
                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                                  {status.description}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row lg:flex-col">
                            {isPracticeBlocked ? (
                              <Button asChild size="sm" className="w-full sm:w-auto">
                                <Link
                                  to={`/mis-cursos/${course.slug}?tab=progress`}
                                >
                                  {getPracticeActionLabel(practice)}
                                </Link>
                              </Button>
                            ) : practice.practiceCompleted &&
                              practice.practiceCertificateAvailable ? (
                              <>
                                <Button
                                  asChild
                                  size="sm"
                                  className="w-full sm:w-auto"
                                >
                                  <Link
                                    to={`/certificado-practico/${practice.enrollmentId}`}
                                  >
                                    Ver certificado practico
                                  </Link>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full sm:w-auto"
                                  onClick={() =>
                                    setSelectedPracticeSlug(
                                      isSelected ? null : course.slug,
                                    )
                                  }
                                >
                                  {isSelected
                                    ? "Ocultar detalle"
                                    : "Ver detalle"}
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() =>
                                  setSelectedPracticeSlug(
                                    isSelected ? null : course.slug,
                                  )
                                }
                              >
                                {isSelected
                                  ? "Ocultar practica"
                                  : getPracticeActionLabel(practice)}
                              </Button>
                            )}
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="w-full sm:w-auto"
                            >
                              <Link to={`/mis-cursos/${course.slug}`}>
                                Ir al curso
                              </Link>
                            </Button>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-5 border-t border-border pt-5">
                            <StudentPracticePanel
                              practice={practice}
                              reloadPractice={reloadCourses}
                              onGoToReviews={() =>
                                navigate(
                                  `/mis-cursos/${course.slug}?tab=reviews`,
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <DotsPagination
                      page={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyCourses;
