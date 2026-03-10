import { ICourseProgressResponse } from "@/types/courseProgress.types";

interface CourseInstructorCardProps {
  instructor: ICourseProgressResponse["instructor"];
}

export function CourseInstructorCard({
  instructor,
}: CourseInstructorCardProps) {
  return (
    <a
      href={`/perfil/${instructor.user.slug}`}
      className="group flex gap-4 rounded-xl border border-border p-4 hover:bg-muted/40 transition-colors"
      target="_blank"
    >
      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
        {instructor.user.avatarUrl ? (
          <img
            src={instructor.user.avatarUrl}
            alt={`${instructor.user.firstName} ${instructor.user.lastName}`}
            className="h-full w-full object-cover"
          />
        ) : (
          `${instructor.user.firstName?.[0] ?? ""}${
            instructor.user.lastName?.[0] ?? ""
          }`
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground group-hover:underline underline-offset-4">
          {instructor.user.firstName} {instructor.user.lastName}
        </p>

        {instructor.bio && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
            {instructor.bio}
          </p>
        )}

        <p className="mt-2 text-xs text-muted-foreground">
          Ver perfil del instructor
        </p>
      </div>
    </a>
  );
}
