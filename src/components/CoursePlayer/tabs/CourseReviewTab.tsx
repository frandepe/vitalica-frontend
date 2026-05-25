import type { ReactNode } from "react";
import { BookOpenText, MessageSquareQuote, Stethoscope } from "lucide-react";
import { CoursePracticalReviewSection } from "@/components/CoursePlayer/tabs/CoursePracticalReviewSection";
import { GiveReview } from "@/components/Reviews/GiveReview";

import { ICourseProgressResponse } from "@/types/courseProgress.types";

interface CourseReviewTabProps {
  course: ICourseProgressResponse;
}

interface ReviewSectionProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

function ReviewSection({
  title,
  description,
  icon,
  children,
}: ReviewSectionProps) {
  return (
    <section className="space-y-5 rounded-xl border border-border bg-background/80 p-4 shadow-sm md:p-6">
      <div className="flex items-start gap-3 border-b pb-5">
        <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
        <div className="space-y-1">
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
      <ReviewSection
        title="Reseña teórica"
        description="Dejá tu reseña sobre la parte teórica o revisá la que ya enviaste."
        icon={<BookOpenText className="h-5 w-5" />}
      >
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MessageSquareQuote className="h-4 w-4 text-primary" />
          Reseña de la parte teórica
        </p>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Compartí tu experiencia con la parte teórica del curso.
        </p>

        <GiveReview
          courseId={course.id}
          percentage={course.progress.percentage}
        />
      </ReviewSection>

      <ReviewSection
        title="Reseña práctica"
        description="Dejá tu reseña sobre la práctica presencial cuando la hayas completado."
        icon={<Stethoscope className="h-5 w-5" />}
      >
        <CoursePracticalReviewSection practice={course.practice} />
      </ReviewSection>
    </div>
  );
}
