import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { getCourseReviews } from "@/api/reviewsEndpints";
import { getCoursePracticeReviews } from "@/api/practiceEndpoints";
import { ReviewItem } from "./ReviewItem";
import { PublicReview } from "@/types/reviews.types";
import { PracticeReview } from "@/types/practice.types";

interface ReviewsProps {
  courseId: string;
}

interface ReviewPaginationMeta {
  totalPages: number;
}

interface ReviewSectionProps {
  title: string;
  description: string;
  reviews: PublicReview[];
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const DEFAULT_LIMIT = 10;

const normalizePracticeReview = (review: PracticeReview): PublicReview => ({
  id: review.id,
  rating: review.rating,
  comment: review.comment ?? undefined,
  createdAt: review.createdAt,
  user: review.student
    ? {
        name: review.student.name,
        avatarUrl:
          review.student.avatarUrl || "/Placeholders/no-image-profile.jpg",
      }
    : null,
});

const EmptyReviewsState = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
      <MessageSquare className="h-5 w-5" />
    </div>

    <h3 className="text-base font-semibold text-foreground">
      Este curso aún no tiene reseñas publicadas
    </h3>

    <p className="mt-2 max-w-md text-sm text-muted-foreground">
      Sé uno de los primeros en realizar el curso y compartir tu experiencia.
      Tus comentarios ayudarán a mejorar el contenido y a otros estudiantes a
      decidir.
    </p>

    <p className="mt-4 text-xs text-muted-foreground">
      Las reseñas aparecen aquí cuando ya fueron publicadas dentro del curso o
      de la práctica.
    </p>
  </div>
);

const ReviewSection = ({
  title,
  description,
  reviews,
  page,
  totalPages,
  onPrevious,
  onNext,
}: ReviewSectionProps) => (
  <section className="space-y-4">
    <div className="space-y-1">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>

    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>

    {totalPages > 1 && (
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={onPrevious}
          className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-2 py-1 text-sm text-muted-foreground">{page}</span>
        <button
          disabled={page >= totalPages}
          onClick={onNext}
          className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    )}
  </section>
);

export const Reviews = ({ courseId }: ReviewsProps) => {
  const [theoreticalReviews, setTheoreticalReviews] = useState<PublicReview[]>(
    [],
  );
  const [practicalReviews, setPracticalReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [theoreticalPage, setTheoreticalPage] = useState<number>(1);
  const [practicalPage, setPracticalPage] = useState<number>(1);
  const [theoreticalMeta, setTheoreticalMeta] = useState<ReviewPaginationMeta>({
    totalPages: 1,
  });
  const [practicalMeta, setPracticalMeta] = useState<ReviewPaginationMeta>({
    totalPages: 1,
  });

  useEffect(() => {
    setTheoreticalPage(1);
    setPracticalPage(1);
  }, [courseId]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      try {
        const [theoreticalResponse, practicalResponse] = await Promise.all([
          getCourseReviews(courseId, theoreticalPage, DEFAULT_LIMIT),
          getCoursePracticeReviews(courseId, practicalPage, DEFAULT_LIMIT),
        ]);

        setTheoreticalReviews(
          theoreticalResponse.success && Array.isArray(theoreticalResponse.data)
            ? theoreticalResponse.data
            : [],
        );
        setTheoreticalMeta({
          totalPages: theoreticalResponse.meta?.totalPages || 1,
        });

        const normalizedPracticalReviews =
          practicalResponse.success && Array.isArray(practicalResponse.data)
            ? practicalResponse.data.map(normalizePracticeReview)
            : [];

        setPracticalReviews(normalizedPracticalReviews);
        setPracticalMeta({
          totalPages: practicalResponse.meta?.totalPages || 1,
        });
      } catch (error) {
        console.error("Error cargando reviews:", error);
        setTheoreticalReviews([]);
        setPracticalReviews([]);
        setTheoreticalMeta({ totalPages: 1 });
        setPracticalMeta({ totalPages: 1 });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId, practicalPage, theoreticalPage]);

  if (loading) {
    return <p>Cargando reseñas...</p>;
  }

  const hasTheoreticalReviews = theoreticalReviews.length > 0;
  const hasPracticalReviews = practicalReviews.length > 0;

  if (!hasTheoreticalReviews && !hasPracticalReviews) {
    return <EmptyReviewsState />;
  }

  return (
    <div className="space-y-10">
      {hasTheoreticalReviews && (
        <ReviewSection
          title="Reseñas del curso online"
          description="Opiniones de estudiantes sobre el contenido teórico del curso."
          reviews={theoreticalReviews}
          page={theoreticalPage}
          totalPages={theoreticalMeta.totalPages}
          onPrevious={() => setTheoreticalPage((page) => page - 1)}
          onNext={() => setTheoreticalPage((page) => page + 1)}
        />
      )}

      {hasPracticalReviews && (
        <ReviewSection
          title="Reseñas de la práctica"
          description="Opiniones de estudiantes sobre la experiencia práctica vinculada al curso."
          reviews={practicalReviews}
          page={practicalPage}
          totalPages={practicalMeta.totalPages}
          onPrevious={() => setPracticalPage((page) => page - 1)}
          onNext={() => setPracticalPage((page) => page + 1)}
        />
      )}
    </div>
  );
};
