import { useEffect, useMemo, useState } from "react";
import { getInstructorCourses, getInstructorReviews } from "@/api";
import { TextPagination } from "@/components/Pagination/TextPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICourse } from "@/types/course.types";
import {
  InstructorReviewItem,
  InstructorReviewType,
  InstructorReviewsMeta,
  InstructorReviewsSummary,
} from "@/types/instructor-reviews.types";
import { formatDate } from "@/utils/formatDate";
import { BookOpen, Filter, MessageSquare, RefreshCw, Star } from "lucide-react";
import { ReviewsLoadingState } from "@/components/Skeletons/Reviews";
import TitleAdminPages from "@/components/Texts/TitleAdminPages";

const REVIEWS_PER_PAGE = 12;
const ALL_COURSES_VALUE = "ALL_COURSES";

const TYPE_LABELS: Record<Exclude<InstructorReviewType, "ALL">, string> = {
  THEORETICAL: "Teorica",
  PRACTICAL: "Practica",
};

const TYPE_BADGE_VARIANTS: Record<
  Exclude<InstructorReviewType, "ALL">,
  "info" | "success"
> = {
  THEORETICAL: "info",
  PRACTICAL: "success",
};

function SummaryStrip({ summary }: { summary: InstructorReviewsSummary }) {
  const items = [
    {
      label: "Total de reseñas",
      value: summary.total,
      hint: "Todas las opiniones recibidas",
    },
    {
      label: "Teóricas",
      value: summary.theoretical,
      hint: "Opiniones sobre tus cursos",
    },
    {
      label: "Prácticas",
      value: summary.practical,
      hint: "Opiniones sobre tus prácticas",
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="grid md:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`px-6 py-5 ${
              index < items.length - 1
                ? "border-b border-slate-200 md:border-b-0 md:border-r"
                : ""
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {item.label}
            </p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-3xl font-semibold tracking-tight text-slate-950">
                {item.value}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{item.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-slate-700">
        {rating}/5
      </span>
    </div>
  );
}

function ReviewRow({ review }: { review: InstructorReviewItem }) {
  return (
    <article className="px-6 py-5 transition-colors duration-200 hover:bg-slate-50/80">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={TYPE_BADGE_VARIANTS[review.type]} size="sm">
              {TYPE_LABELS[review.type]}
            </Badge>
            <span className="text-sm text-slate-500">
              {formatDate(review.createdAt, { showTime: true })}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <img
              src={
                review.student?.avatarUrl ||
                "/Placeholders/no-image-profile.jpg"
              }
              alt={review.student?.name || "Alumno"}
              className="h-12 w-12 rounded-full border border-slate-200 object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900">
                {review.student?.name || "Usuario anonimo"}
              </p>
              <p className="text-sm text-slate-500">
                Alumno que completo una evaluacion
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ReviewStars rating={review.rating} />
          </div>

          <div className="mt-4 max-w-4xl">
            {review.comment ? (
              <p className="text-sm leading-7 text-slate-700">
                {review.comment}
              </p>
            ) : (
              <p className="text-sm italic text-slate-500">
                El alumno no dejo comentario adicional.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ReviewsGroup({
  course,
  reviews,
}: {
  course: InstructorReviewItem["course"];
  reviews: InstructorReviewItem[];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BookOpen className="h-4 w-4" />
            <span>Curso</span>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            {course.title || "Curso sin titulo"}
          </h2>
        </div>
        <div className="text-sm text-slate-500">
          {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"} en esta
          página
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {reviews.map((review) => (
          <ReviewRow key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}

export default function Reviews() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [reviews, setReviews] = useState<InstructorReviewItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<InstructorReviewType>("ALL");
  const [page, setPage] = useState(1);
  const [retryKey, setRetryKey] = useState(0);
  const [meta, setMeta] = useState<InstructorReviewsMeta>({
    page: 1,
    limit: REVIEWS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [summary, setSummary] = useState<InstructorReviewsSummary>({
    total: 0,
    theoretical: 0,
    practical: 0,
  });

  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true);
      setCoursesError(null);

      try {
        const response = await getInstructorCourses();

        if (!response.success || !Array.isArray(response.data)) {
          setCourses([]);
          setCoursesError(
            response.message ||
              "No se pudieron cargar los cursos del instructor.",
          );
          return;
        }

        setCourses(response.data);
      } catch (loadError) {
        console.error("Error cargando cursos del instructor:", loadError);
        setCourses([]);
        setCoursesError("No se pudieron cargar los cursos del instructor.");
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, [retryKey]);

  useEffect(() => {
    if (loadingCourses) {
      return;
    }

    if (coursesError) {
      setLoadingReviews(false);
      setReviews([]);
      setMeta({
        page: 1,
        limit: REVIEWS_PER_PAGE,
        total: 0,
        totalPages: 0,
      });
      setSummary({
        total: 0,
        theoretical: 0,
        practical: 0,
      });
      return;
    }

    if (courses.length === 0) {
      setLoadingReviews(false);
      setReviews([]);
      setMeta({
        page: 1,
        limit: REVIEWS_PER_PAGE,
        total: 0,
        totalPages: 0,
      });
      setSummary({
        total: 0,
        theoretical: 0,
        practical: 0,
      });
      return;
    }

    const loadReviews = async () => {
      setLoadingReviews(true);
      setReviewsError(null);

      try {
        const response = await getInstructorReviews({
          page,
          limit: REVIEWS_PER_PAGE,
          courseId: selectedCourseId || undefined,
          type: selectedType,
        });

        if (!response.success) {
          setReviews([]);
          setMeta({
            page,
            limit: REVIEWS_PER_PAGE,
            total: 0,
            totalPages: 0,
          });
          setSummary({
            total: 0,
            theoretical: 0,
            practical: 0,
          });
          setReviewsError(
            response.message ||
              "No se pudieron cargar las reseñas del instructor.",
          );
          return;
        }

        setReviews(Array.isArray(response.data) ? response.data : []);
        setMeta(
          response.meta || {
            page,
            limit: REVIEWS_PER_PAGE,
            total: 0,
            totalPages: 0,
          },
        );
        setSummary(
          response.summary || {
            total: 0,
            theoretical: 0,
            practical: 0,
          },
        );
      } catch (loadError) {
        console.error("Error cargando reseñas del instructor:", loadError);
        setReviews([]);
        setMeta({
          page,
          limit: REVIEWS_PER_PAGE,
          total: 0,
          totalPages: 0,
        });
        setSummary({
          total: 0,
          theoretical: 0,
          practical: 0,
        });
        setReviewsError("No se pudieron cargar las reseñas del instructor.");
      } finally {
        setLoadingReviews(false);
      }
    };

    loadReviews();
  }, [
    courses.length,
    coursesError,
    loadingCourses,
    page,
    selectedCourseId,
    selectedType,
  ]);

  const groupedReviews = useMemo(() => {
    const groups = new Map<
      string,
      {
        course: InstructorReviewItem["course"];
        reviews: InstructorReviewItem[];
      }
    >();

    reviews.forEach((review) => {
      const existing = groups.get(review.course.id);

      if (existing) {
        existing.reviews.push(review);
        return;
      }

      groups.set(review.course.id, {
        course: review.course,
        reviews: [review],
      });
    });

    return Array.from(groups.values());
  }, [reviews]);

  const hasActiveFilters = Boolean(selectedCourseId) || selectedType !== "ALL";
  const hasCourses = courses.length > 0;
  const error = coursesError || reviewsError;

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value === ALL_COURSES_VALUE ? "" : value);
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value as InstructorReviewType);
    setPage(1);
  };

  const handleRetry = () => {
    setRetryKey((current) => current + 1);
  };

  if (loadingCourses || loadingReviews) {
    return <ReviewsLoadingState />;
  }

  if (error) {
    return (
      <div className="space-y-8 py-8">
        <header className="space-y-3">
          <TitleAdminPages title="Reseñas de tus cursos" />
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            Conocé qué opinan tus alumnos y usá sus comentarios para seguir
            mejorando tu propuesta de formación.
          </p>
        </header>

        <Card className="border-slate-200 bg-white">
          <CardContent className="px-6 py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <RefreshCw className="h-4 w-4" />
                  <span>Error de carga</span>
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  No se pudieron cargar las reseñas
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  {error}
                </p>
              </div>
              <Button onClick={handleRetry} className="gap-2 md:self-start">
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasCourses) {
    return (
      <div className="space-y-8 py-8">
        <header className="space-y-3">
          <TitleAdminPages title="Reseñas de tus cursos" />
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            Conocé qué opinan tus alumnos y usá sus comentarios para seguir
            mejorando tu propuesta de formación.
          </p>
        </header>

        <Card className="border-slate-200 bg-white">
          <CardContent className="px-6 py-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <BookOpen className="h-4 w-4" />
                <span>Sin cursos</span>
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Todavia no tenes cursos creados
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Cuando publiques cursos y los alumnos completen la cursada o la
                practica, las reseñas apareceran aca.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <header className="space-y-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="space-y-2">
              <TitleAdminPages title="Reseñas de tus cursos" />
              <p className="max-w-3xl text-sm leading-6 text-slate-600">
                Conocé qué opinan tus alumnos y usá sus comentarios para seguir
                mejorando tu propuesta de formación.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>
              Página {meta.page} de {Math.max(meta.totalPages, 1)}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 md:block" />
            <span>{meta.total} resultados</span>
          </div>
        </div>
      </header>

      <SummaryStrip summary={summary} />

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </div>
        </div>
        <div className="space-y-5 px-6 py-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,300px)_1fr]">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Curso</p>
              <Select
                value={selectedCourseId || ALL_COURSES_VALUE}
                onValueChange={handleCourseChange}
              >
                <SelectTrigger className="h-11 border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Todos los cursos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_COURSES_VALUE}>
                    Todos los cursos
                  </SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title || "Curso sin titulo"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Tipo</p>
              <Tabs value={selectedType} onValueChange={handleTypeChange}>
                <TabsList className="h-auto w-full flex-wrap justify-start rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <TabsTrigger value="ALL" className="rounded-lg">
                    Todas
                  </TabsTrigger>
                  <TabsTrigger value="THEORETICAL" className="rounded-lg">
                    Teoricas
                  </TabsTrigger>
                  <TabsTrigger value="PRACTICAL" className="rounded-lg">
                    Prácticas
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-500">
              {hasActiveFilters
                ? "Mostrando resultados para la combinacion de filtros actual."
                : "Mostrando todas las reseñas disponibles para tus cursos."}
            </p>

            {hasActiveFilters ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCourseId("");
                  setSelectedType("ALL");
                  setPage(1);
                }}
              >
                Limpiar filtros
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {reviews.length === 0 ? (
        <Card className="border-slate-200 bg-white">
          <CardContent className="px-6 py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MessageSquare className="h-4 w-4" />
                  <span>Sin resultados</span>
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  {hasActiveFilters
                    ? "No hay reseñas para el filtro seleccionado"
                    : "Todavia no recibiste reseñas en tus cursos"}
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  {hasActiveFilters
                    ? "Proba con otro curso o cambia el tipo de reseña para ampliar los resultados."
                    : "Las reseñas apareceran aca cuando los alumnos califiquen la parte teorica o la practica presencial."}
                </p>
              </div>
              {hasActiveFilters ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCourseId("");
                    setSelectedType("ALL");
                    setPage(1);
                  }}
                >
                  Limpiar filtros
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {groupedReviews.map((group) => (
            <ReviewsGroup
              key={group.course.id}
              course={group.course}
              reviews={group.reviews}
            />
          ))}

          {meta.totalPages > 1 ? (
            <div className="flex justify-center border-t border-slate-200 pt-6">
              <Card className="rounded-full border-slate-200 bg-white">
                <CardContent className="px-2 py-2">
                  <TextPagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                  />
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
