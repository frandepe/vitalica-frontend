import type { ReactNode } from "react";
import { BookOpenText, MessageSquareQuote, Stethoscope } from "lucide-react";
import { CoursePracticalReviewSection } from "@/components/CoursePlayer/tabs/CoursePracticalReviewSection";
import { GiveReview } from "@/components/Reviews/GiveReview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ICourseProgressResponse } from "@/types/courseProgress.types";

interface CourseReviewTabProps {
  course: ICourseProgressResponse;
}

interface ReviewSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

function ReviewSection({
  eyebrow,
  title,
  description,
  icon,
  children,
}: ReviewSectionProps) {
  return (
    <section className="space-y-5 rounded-3xl border bg-background/80 p-4 shadow-sm md:p-6">
      <div className="flex items-start gap-3 border-b pb-5">
        <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

export function CourseReviewTab({ course }: CourseReviewTabProps) {
  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-primary/[0.04] via-background to-background p-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Reseñas del curso
          </CardTitle>

          <CardDescription className="max-w-3xl text-sm leading-6">
            Acá podés revisar y enviar tanto la reseña teórica como la reseña
            práctica. Cada una se habilita según el progreso que hayas tenido
            dentro del curso.
          </CardDescription>
        </CardHeader>

        <CardContent className="border-t pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Teórica */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Reseña teórica
              </h3>

              <p className="text-sm leading-6 text-muted-foreground">
                Refleja tu experiencia con los contenidos del curso, los módulos
                y el material teórico.
              </p>
            </div>

            {/* Práctica */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Reseña práctica
              </h3>

              <p className="text-sm leading-6 text-muted-foreground">
                Refleja tu experiencia durante la práctica presencial y el
                trabajo realizado junto al instructor.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReviewSection
        eyebrow="Feedback 1"
        title="Reseña teórica"
        description="Gestioná tu reseña sobre la parte teórica del curso. Si ya enviaste una, acá también la vas a encontrar."
        icon={<BookOpenText className="h-5 w-5" />}
      >
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MessageSquareQuote className="h-4 w-4 text-primary" />
          Feedback sobre el curso teórico
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Esta reseña se mantiene con las reglas actuales del curso teórico.
        </p>

        <GiveReview
          courseId={course.id}
          percentage={course.progress.percentage}
        />
      </ReviewSection>

      <ReviewSection
        eyebrow="Feedback 2"
        title="Reseña práctica"
        description="Gestioná tu reseña sobre la práctica presencial. Solo se habilita cuando el instructor haya marcado la práctica como completada"
        icon={<Stethoscope className="h-5 w-5" />}
      >
        <CoursePracticalReviewSection practice={course.practice} />
      </ReviewSection>
    </div>
  );
}
