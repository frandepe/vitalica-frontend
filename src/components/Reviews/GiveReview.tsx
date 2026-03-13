import * as React from "react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Info, Star, CheckCircle } from "lucide-react";
import { getCourseReview, upsertCourseReview } from "@/api/reviewsEndpints";
import { useIntervalClick } from "@/hooks/useIntervalClick";

interface GiveReviewProps {
  courseId: string;
  percentage: number;
}

interface FormValues {
  rating: number;
  comment: string;
}

interface ExistingReview {
  rating: number;
  comment?: string;
}

export const GiveReview: React.FC<GiveReviewProps> = ({
  courseId,
  percentage,
}) => {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingReview, setExistingReview] = useState<ExistingReview | null>(
    null,
  );

  const { isResendDisabled, setIsResendDisabled, setTimer, timer } =
    useIntervalClick();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { rating: 0, comment: "" },
  });

  useEffect(() => {
    const fetchExistingReview = async () => {
      try {
        const res = await getCourseReview(courseId);

        if (res.success && res.data) {
          setExistingReview(res.data);
          setValue("rating", res.data.rating);
          setValue("comment", res.data.comment || "");
        }
      } catch (err) {
        console.error("Error fetching review:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingReview();
  }, [courseId, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (isResendDisabled) return;

    setSending(true);

    try {
      await upsertCourseReview(courseId, data.rating, data.comment);

      setExistingReview({
        rating: data.rating,
        comment: data.comment,
      });

      setSubmitted(true);

      setTimer(10);
      setIsResendDisabled(true);
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  if (percentage < 50) {
    const remaining = 50 - percentage;

    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Info className="h-5 w-5" />
        </div>

        <h3 className="text-base font-semibold text-foreground">
          Reseña bloqueada
        </h3>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Completaste {percentage}% del curso. Necesitas alcanzar al menos 50%
          para poder dejar tu reseña. Te faltan {remaining}%.
        </p>

        <p className="mt-4 text-xs text-muted-foreground">
          Sigue avanzando en las lecciones para poder compartir tu experiencia.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 px-6 py-10 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle className="h-6 w-6" />
        </div>

        <h3 className="text-base font-semibold text-foreground">
          ¡Gracias por tu reseña!
        </h3>

        <p className="max-w-md text-sm text-muted-foreground">
          Tu opinión fue guardada correctamente.
        </p>

        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          Editar reseña
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">Deja tu reseña</h3>

          {/* rating */}
          <Controller
            name="rating"
            control={control}
            rules={{ min: 1 }}
            render={({ field }) => (
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={22}
                    fill={field.value >= star ? "currentColor" : "none"}
                    className={`cursor-pointer transition-colors ${
                      field.value >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => field.onChange(star)}
                  />
                ))}
              </div>
            )}
          />

          {errors.rating && (
            <p className="text-xs text-red-500">
              Seleccioná al menos una estrella
            </p>
          )}

          {/* comment */}
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <Textarea
                placeholder="Escribe un comentario (opcional)"
                {...field}
                className="resize-none"
                disabled={sending}
              />
            )}
          />
        </CardContent>

        <CardFooter>
          <Button
            size="lg"
            type="submit"
            className="mt-6"
            disabled={sending || isResendDisabled}
          >
            {sending
              ? existingReview
                ? "Actualizando..."
                : "Enviando..."
              : isResendDisabled
                ? `Espera ${timer}s`
                : existingReview
                  ? "Actualizar reseña"
                  : "Enviar reseña"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
