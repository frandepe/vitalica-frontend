import { Star } from "lucide-react";
import { ICourseProgressResponse } from "@/types/courseProgress.types";
import { formatDuration } from "@/utils/format-duration";
import { formatDate } from "@/utils/formatDate";
import { t } from "@/utils/translations";
import { formatStudentCount } from "@/utils/format-student-count";

interface CourseAboutTabProps {
  course: ICourseProgressResponse;
}

export function CourseAboutTab({ course }: CourseAboutTabProps) {
  return (
    <>
      <div>
        <h2 className="text-xl font-bold mb-4">{course.title}</h2>
        <p className="text-muted-foreground leading-relaxed text-pretty">
          {course.description}
        </p>
      </div>

      {course.specialty && (
        <div>
          <h2 className="text-xl font-bold mb-4">Especialidad</h2>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            {t("courseSpecialty", course.specialty)}
          </p>
        </div>
      )}
      {course.level && (
        <div>
          <h2 className="text-xl font-bold mb-4">Nivel</h2>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            {t("courseLevel", course.level)}
          </p>
        </div>
      )}
      {course.requirementsAndMaterials && (
        <div>
          <h2 className="text-xl font-bold mb-4">Requisitos y materiales</h2>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            {course.requirementsAndMaterials}
          </p>
        </div>
      )}
      {course.duration && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Duración aproximada{" "}
            <span className="text-muted-foreground text-sm font-medium">
              (Establecida por el autor)
            </span>
          </h2>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            {formatDuration(course.duration)} horas
          </p>
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold mb-4">Califiación</h2>
        <div className="flex items-center gap-2 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(course.avgTheoreticalRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground">
            {formatStudentCount(course.totalStudents)}
          </span>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Fecha de publicación</h2>
        <p className="text-muted-foreground leading-relaxed text-pretty">
          {formatDate(course.publishedAt!, { showTime: false })}
        </p>
      </div>
    </>
  );
}
