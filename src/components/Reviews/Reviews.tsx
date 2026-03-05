import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { getCourseReviews } from "@/api/reviewsEndpints";
import { ReviewItem } from "./ReviewItem";
import { Review } from "@/types/reviews.types";

interface ReviewsProps {
  courseId: string;
}

export const Reviews = ({ courseId }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await getCourseReviews(courseId, page, limit);

        if (res.success && res.data) {
          setReviews(res.data);
          setTotalPages(res.meta?.totalPages || 1);
        }
      } catch (error) {
        console.error("Error cargando reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId, page, limit]);

  if (loading) {
    return <p>Cargando reseñas...</p>;
  }

  return (
    <div>
      {reviews.length === 0 ? (
        // EMPTY STATE
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>

          <h3 className="text-base font-semibold text-foreground">
            Este curso aún no tiene reseñas
          </h3>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Sé uno de los primeros en realizar el curso y compartir tu
            experiencia. Tus comentarios ayudarán a mejorar el contenido y a
            otros estudiantes a decidir.
          </p>

          <p className="mt-4 text-xs text-muted-foreground">
            Las reseñas solo pueden dejarse después de completar una lección.
          </p>
        </div>
      ) : (
        // LISTADO DE REVIEWS
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}

          {/* Aquí podrías agregar botones de paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded border"
              >
                Anterior
              </button>
              <span className="px-2 py-1">{page}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded border"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
