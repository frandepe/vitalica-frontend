import { useEffect, useState } from "react";
import { MessageSquare, Stethoscope } from "lucide-react";
import { getPracticeRequestById } from "@/api";
import { PracticeReviewCard } from "@/components/Practice/PracticeReviewCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  PracticeProgressInfo,
  PracticeRequestStudentView,
  PracticeReview,
} from "@/types/practice.types";

interface CoursePracticalReviewSectionProps {
  practice?: PracticeProgressInfo;
}

export function CoursePracticalReviewSection({
  practice,
}: CoursePracticalReviewSectionProps) {
  const [request, setRequest] = useState<PracticeRequestStudentView | null>(
    null,
  );
  const [loading, setLoading] = useState(
    Boolean(practice?.latestPracticeRequestId),
  );

  useEffect(() => {
    if (!practice?.latestPracticeRequestId) {
      setRequest(null);
      setLoading(false);
      return;
    }

    const latestPracticeRequestId = practice.latestPracticeRequestId;
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      const response = await getPracticeRequestById(latestPracticeRequestId);

      if (cancelled) return;

      if (response.success && response.data) {
        setRequest(response.data as PracticeRequestStudentView);
      } else {
        setRequest(null);
      }

      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [practice?.latestPracticeRequestId]);

  const handleReviewCreated = (review: PracticeReview) => {
    if (!request) return;
    setRequest({ ...request, review });
  };

  if (!practice?.requiresPractice) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="space-y-3 px-6 py-8">
          <p className="text-sm font-medium text-foreground">
            Este curso no incluye reseña práctica.
          </p>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            La sección práctica solo aparece en cursos con práctica presencial.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="px-6 py-8 text-sm text-muted-foreground">
          Cargando estado de la reseña práctica...
        </CardContent>
      </Card>
    );
  }

  if (!practice.latestPracticeRequestId || !request) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="space-y-3 px-6 py-8">
          <p className="text-sm font-medium text-foreground">
            Aún no tenés una práctica lista para reseñar.
          </p>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Cuando completes la práctica presencial, tu reseña práctica se
            habilitará en esta sección.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (request.status !== "COMPLETED") {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardHeader className="px-6 py-6">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Stethoscope className="h-4 w-4" />
            </span>
            Reseña práctica no disponible todavía
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6">
            La reseña práctica se habilita cuando tu solicitud queda completada.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0 text-sm text-muted-foreground">
          {request.status === "PENDING"
            ? "Tu práctica sigue en coordinación con el instructor."
            : "Tu última solicitud práctica no quedó completada, por eso todavía no podés dejar esta reseña."}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <MessageSquare className="h-4 w-4 text-primary" />
        Feedback de la práctica presencial
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Acá podés dejar tu reseña práctica y, si ya enviaste una, también
        actualizarla una vez completada la práctica.
      </p>

      <PracticeReviewCard
        practiceRequestId={request.id}
        existingReview={request.review}
        onCreated={handleReviewCreated}
      />
    </div>
  );
}
