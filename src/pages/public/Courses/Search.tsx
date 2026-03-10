import { getCourses } from "@/api";
import {
  CourseCardProps,
  CoursePublicCard,
} from "@/components/CardsAnimated/CoursePublic";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";
import { COURSES_CARD_DEFAULTS } from "@/constants";
import { parsePositiveInt } from "@/utils/number";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [courses, setCourses] = useState<CourseCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

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

  useEffect(() => {
    const controller = new AbortController();

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getCourses(page, limit, search);

        setCourses(res.data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Error cargando cursos");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    return () => controller.abort();
  }, [page, limit, search]);

  return (
    <div className="container mx-auto my-10">
      {search ? (
        <h2 className="text-xl font-bold mb-4">Resultados para "{search}"</h2>
      ) : (
        <h2 className="text-xl font-bold mb-4">Todos los cursos disponibles</h2>
      )}

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
        </div>
      )}
    </div>
  );
};

export default Search;
