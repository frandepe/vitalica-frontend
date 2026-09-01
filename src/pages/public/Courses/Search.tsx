import { getCourses } from "@/api";
import {
  CourseCardProps,
  CoursePublicCard,
} from "@/components/CardsAnimated/CoursePublic";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";
import { TextPagination } from "@/components/Pagination/TextPagination";
import { CourseFiltersPanel } from "@/components/Search/CourseFiltersPanel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COURSES_CARD_DEFAULTS, SpecialtyLabels } from "@/constants";
import type { ISpecialty } from "@/types/course.types";
import { parsePositiveInt } from "@/utils/number";
import {
  countActiveCourseSearchFilters,
  EMPTY_COURSE_SEARCH_FILTERS,
  parseCourseSearchFilters,
  parseCourseSpecialty,
  writeCourseSpecialty,
  writeCourseSearchFilters,
} from "@/utils/search-filters";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [courses, setCourses] = useState<CourseCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [availableSpecialties, setAvailableSpecialties] = useState<
    ISpecialty[]
  >([]);

  const [searchParams, setSearchParams] = useSearchParams();

  // Sanitización segura
  const page = parsePositiveInt(
    searchParams.get("page"),
    COURSES_CARD_DEFAULTS.page,
  );

  const limit = Math.min(
    parsePositiveInt(searchParams.get("limit"), COURSES_CARD_DEFAULTS.limit),
    COURSES_CARD_DEFAULTS.MAX_LIMIT,
  );

  const search = searchParams.get("search")?.trim() || "";
  const paramsKey = searchParams.toString();
  const appliedFilters = useMemo(
    () => parseCourseSearchFilters(new URLSearchParams(paramsKey)),
    [paramsKey],
  );
  const activeFiltersCount = countActiveCourseSearchFilters(appliedFilters);
  const specialty = useMemo(
    () => parseCourseSpecialty(new URLSearchParams(paramsKey)),
    [paramsKey],
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getCourses(
          page,
          limit,
          search,
          appliedFilters,
          specialty || undefined,
        );

        if (!res.success) throw new Error(res.message || "Error cargando cursos");

        setCourses(Array.isArray(res.data) ? res.data : []);
        setTotal(res.meta?.total ?? 0);
        setTotalPages(res.meta?.totalPages ?? 0);
        setAvailableSpecialties(res.meta?.availableSpecialties ?? []);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Error cargando cursos");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    return () => controller.abort();
  }, [page, limit, search, appliedFilters, specialty]);

  const applyFilters = (filters: typeof appliedFilters) => {
    setSearchParams(writeCourseSearchFilters(searchParams, filters));
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setSearchParams(
      writeCourseSearchFilters(searchParams, EMPTY_COURSE_SEARCH_FILTERS),
    );
    setFiltersOpen(false);
  };

  const changePage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const changeSpecialty = (value: string) => {
    setSearchParams(
      writeCourseSpecialty(
        searchParams,
        value === "ALL" ? "" : (value as ISpecialty),
      ),
    );
  };

  return (
    <div className="container mx-auto my-10 px-4 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {search ? (
            <h2 className="text-xl font-bold">Resultados para "{search}"</h2>
          ) : (
            <h2 className="text-xl font-bold">Todos los cursos disponibles</h2>
          )}
          {!loading && !error && (
            <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
              {total === 1 ? "1 curso encontrado" : `${total} cursos encontrados`}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Select value={specialty || "ALL"} onValueChange={changeSpecialty}>
            <SelectTrigger
              aria-label="Filtrar por especialidad"
              className="w-full sm:w-[16rem]"
            >
              <SelectValue placeholder="Especialidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las especialidades</SelectItem>
              {availableSpecialties.map((value) => (
                <SelectItem key={value} value={value}>
                  {SpecialtyLabels[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 active:scale-[0.98] transition-transform sm:w-auto"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Todos los filtros
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {loading && <GlobalLoading text="Cargando cursos..." />}

      {!loading && error && <p className="text-red-500">{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <p className="text-gray-500">No se encontraron cursos.</p>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="space-y-6">
          {courses.map((course) => (
            <CoursePublicCard key={course.id} {...course} />
          ))}
          {totalPages > 1 && (
            <div className="pt-4">
              <TextPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={changePage}
              />
            </div>
          )}
        </div>
      )}

      <CourseFiltersPanel
        open={filtersOpen}
        appliedFilters={appliedFilters}
        onOpenChange={setFiltersOpen}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </div>
  );
};

export default Search;
