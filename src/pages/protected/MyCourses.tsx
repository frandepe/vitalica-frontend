import { getMyCoursesEnrrolled } from "@/api";
import { PublicCourseCard } from "@/components/CardsAnimated/PublicCourseCard";
import { MainCarouselSkeleton } from "@/components/Skeletons/MainCarouselSkeleton";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { ISpecialty } from "@/types/course.types";
import { DotsPagination } from "@/components/Pagination/DotsPagination";
import { EmptyState } from "@/components/Pagination/helpers/empty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LIMIT = 8;

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

const MyCourses = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<MyCoursesResponse | undefined>();
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCourses = useCallback(async (p: number, q: string) => {
    setLoading(true);
    try {
      const res = await getMyCoursesEnrrolled(p, LIMIT, q);
      setCourses(res);
      console.log("reasds", res);

      // Adjust these fields to match your actual API response shape
      setTotalItems(res.meta.total ?? res.data.length);
      setTotalPages(
        res.meta.totalPages ??
          Math.ceil((res.meta.total ?? res.data.length) / LIMIT),
      );
    } finally {
      setLoading(false);
    }
  }, []);

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
        {loading ? (
          <MainCarouselSkeleton />
        ) : isEmpty ? (
          <EmptyState hasSearch={!!search} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {courses?.data.map((course) => {
                const practiceBadge = getPracticeBadge(course);

                return (
                  <div key={course.slug} className="space-y-3">
                    <PublicCourseCard
                      course={course}
                      href={`/mis-cursos/${course.slug}`}
                    />

                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
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

                      <p className="mt-3 text-sm text-muted-foreground">
                        {course.requiresPractice
                          ? course.practiceCompleted
                            ? "Tu practica ya fue completada. Entra al curso para ver el certificado y la reseña."
                            : course.practiceUnlockedAt
                              ? "La practica ya esta habilitada. Entra al curso para elegir instructor o seguir tu solicitud."
                              : "Este curso requiere practica. Se habilita cuando completes la parte teorica."
                          : "Curso teorico sin practica adicional."}
                      </p>

                      <Button asChild size="sm" className="mt-4 w-full">
                        <Link to={`/mis-cursos/${course.slug}`}>
                          Ir al panel del curso
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
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
      </div>
    </div>
  );
};

export default MyCourses;
