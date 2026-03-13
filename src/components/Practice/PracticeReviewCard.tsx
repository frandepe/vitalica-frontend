import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Star, CheckCircle2, MessageSquareQuote } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  createPracticeReview,
  getPracticeReview,
} from "@/api/practiceEndpoints";
import { PracticeReview } from "@/types/practice.types";
import { formatDate } from "@/utils/formatDate";

interface PracticeReviewCardProps {
  practiceRequestId: string;
  existingReview?: PracticeReview | null;
  onCreated: (review: PracticeReview) => void;
}

interface PracticeReviewFormValues {
  rating: number;
  comment: string;
}

export function PracticeReviewCard({
  practiceRequestId,
  existingReview,
  onCreated,
}: PracticeReviewCardProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(!existingReview);
  const [sending, setSending] = useState(false);
  const [review, setReview] = useState<PracticeReview | null>(
    existingReview ?? null,
  );
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PracticeReviewFormValues>({
    defaultValues: {
      rating: existingReview?.rating ?? 0,
      comment: existingReview?.comment ?? "",
    },
  });

  useEffect(() => {
    if (existingReview) {
      setReview(existingReview);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadReview = async () => {
      const response = await getPracticeReview(practiceRequestId);
      if (cancelled) return;

      if (response.success && response.data) {
        setReview(response.data);
        setValue("rating", response.data.rating);
        setValue("comment", response.data.comment ?? "");
      }

      setLoading(false);
    };

    loadReview();

    return () => {
      cancelled = true;
    };
  }, [existingReview, practiceRequestId, setValue]);

  const onSubmit = async (data: PracticeReviewFormValues) => {
    setSending(true);

    const response = await createPracticeReview(practiceRequestId, data);

    if (!response.success || !response.data) {
      showToast(
        response.message ?? "No se pudo guardar la reseña de práctica",
        "error",
        "top-right",
      );
      setSending(false);
      return;
    }

    setReview(response.data);
    onCreated(response.data);
    showToast("Reseña de práctica enviada", "success", "top-right");
    setSending(false);
  };

  if (loading) {
    return (
      <Card className="border-dashed">
        <CardContent className="px-6 py-8 text-sm text-muted-foreground">
          Cargando reseña de práctica...
        </CardContent>
      </Card>
    );
  }

  if (review) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Tu reseña de práctica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-6 pb-6">
          <div className="flex items-center gap-1 text-yellow-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="h-4 w-4"
                fill={index < review.rating ? "currentColor" : "none"}
              />
            ))}
            <span className="ml-2 text-sm font-medium text-foreground">
              {review.rating}/5
            </span>
          </div>

          {review.comment ? (
            <div className="rounded-xl border bg-background px-4 py-3 text-sm text-foreground">
              {review.comment}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enviastes una reseña sin comentario adicional.
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Enviada el {formatDate(review.createdAt, { showTime: false })}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="px-6 pt-6">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <MessageSquareQuote className="h-4 w-4 text-primary" />
            Contanos cómo fue tu práctica
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 px-6">
          <Controller
            name="rating"
            control={control}
            rules={{ min: 1 }}
            render={({ field }) => (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer transition-colors ${
                      field.value >= star
                        ? "text-yellow-500"
                        : "text-muted-foreground/40"
                    }`}
                    fill={field.value >= star ? "currentColor" : "none"}
                    onClick={() => field.onChange(star)}
                  />
                ))}
              </div>
            )}
          />

          {errors.rating && (
            <p className="text-xs text-destructive">
              Seleccioná una calificación entre 1 y 5 estrellas.
            </p>
          )}

          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                className="min-h-28 resize-none"
                maxLength={2000}
                placeholder="Comentario opcional"
              />
            )}
          />
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-2">
          <Button type="submit" disabled={sending}>
            {sending ? "Enviando..." : "Enviar reseña"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
