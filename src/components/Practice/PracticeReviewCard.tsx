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
import { useIntervalClick } from "@/hooks/useIntervalClick";
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
  const [submitted, setSubmitted] = useState(false);
  const [review, setReview] = useState<PracticeReview | null>(
    existingReview ?? null,
  );
  const { isResendDisabled, setIsResendDisabled, setTimer, timer } =
    useIntervalClick();
  const {
    control,
    handleSubmit,
    reset,
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
      reset({
        rating: existingReview.rating,
        comment: existingReview.comment ?? "",
      });
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadReview = async () => {
      const response = await getPracticeReview(practiceRequestId);
      if (cancelled) return;

      if (response.success && response.data) {
        setReview(response.data);
        reset({
          rating: response.data.rating,
          comment: response.data.comment ?? "",
        });
      }

      setLoading(false);
    };

    loadReview();

    return () => {
      cancelled = true;
    };
  }, [existingReview, practiceRequestId, reset]);

  const onSubmit = async (data: PracticeReviewFormValues) => {
    if (isResendDisabled) return;

    const isUpdating = Boolean(review);
    setSending(true);

    const response = await createPracticeReview(practiceRequestId, data);

    if (!response.success || !response.data) {
      showToast(
        response.message ?? "No se pudo guardar la reseña de practica",
        "error",
        "top-right",
      );
      setSending(false);
      return;
    }

    setReview(response.data);
    onCreated(response.data);
    setSubmitted(true);
    setTimer(10);
    setIsResendDisabled(true);
    reset({
      rating: response.data.rating,
      comment: response.data.comment ?? "",
    });
    showToast(
      isUpdating
        ? "Reseña de practica actualizada"
        : "Reseña de practica enviada",
      "success",
      "top-right",
    );
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

  if (submitted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center justify-center space-y-4 px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              {review ? "Tu reseña se actualizó" : "Tu reseña fue enviada"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Tu opinión sobre la práctica fue guardada correctamente.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSubmitted(false)}
          >
            Editar reseña
          </Button>
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
            Contanos como fue tu practica
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
              Selecciona una calificacion entre 1 y 5 estrellas.
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
                disabled={sending}
              />
            )}
          />

          {review && (
            <p className="text-xs text-muted-foreground">
              Enviada el {formatDate(review.createdAt, { showTime: false })}
            </p>
          )}
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-2">
          <Button
            size="lg"
            type="submit"
            disabled={sending || isResendDisabled}
          >
            {sending
              ? review
                ? "Actualizando..."
                : "Enviando..."
              : isResendDisabled
                ? `Espera ${timer}s`
                : review
                  ? "Actualizar reseña"
                  : "Enviar reseña"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
