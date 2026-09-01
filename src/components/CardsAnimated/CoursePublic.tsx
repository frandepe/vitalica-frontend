import { Star, Clock, BarChart3, Users, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { t } from "@/utils/translations";
import { CourseLevel, ISpecialty } from "@/types/course.types";
import { formatPrice } from "@/utils/format-price";
import { formatDuration } from "@/utils/format-duration";
import { formatStudentCount } from "@/utils/format-student-count";

export interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  price: number;
  thumbnailUrl: string | null;
  avgTheoreticalRating: number;
  totalStudents: number;
  muxPlaybackId: string;
  specialty: ISpecialty;
  description: string;
  level: CourseLevel;
  duration: number | null;
  instructorName: string;
}

export function CoursePublicCard({
  title,
  slug,
  price,
  thumbnailUrl,
  avgTheoreticalRating,
  totalStudents,
  muxPlaybackId,
  specialty,
  description,
  level,
  duration,
  instructorName,
}: CourseCardProps) {
  const navigate = useNavigate();
  const hasMuxPreview = Boolean(muxPlaybackId);
  const imageUrl =
    thumbnailUrl ??
    (muxPlaybackId
      ? `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=400&height=300&fit_mode=smartcrop`
      : "/Placeholders/no-image-course-generic.jpg");

  const gifUrl = hasMuxPreview
    ? `https://image.mux.com/${muxPlaybackId}/animated.gif?width=400&height=300&fit_mode=smartcrop&start_time=2&end_time=7`
    : null;

  const handleNavigate = (slug: string) => {
    navigate(`/cursos/${slug}`);
  };

  return (
    <div
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 md:flex-row"
      onClick={() => handleNavigate(slug)}
    >
      {/* Left side - Image */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted md:aspect-auto md:w-72">
        {/* Thumbnail */}
        <img
          src={imageUrl}
          alt={title}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            gifUrl ? "group-hover:opacity-0" : ""
          }`}
        />

        {gifUrl && (
          <img
            src={gifUrl}
            alt={`${title} preview`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Price badge */}
        <Badge className="absolute right-3 top-3 bg-primary px-3 py-1">
          <span className="text-primary-foreground text-xs font-bold">
            ${formatPrice(price)}
          </span>
        </Badge>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-white">
            {avgTheoreticalRating.toFixed(1)}
          </span>
          <span className="text-gray-400 text-sm">
            ({formatStudentCount(totalStudents)})
          </span>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="min-w-0 flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Header */}
          <div className="mb-3 flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
            <div className="flex min-w-0 items-start gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <h3 className="break-words text-lg font-semibold text-foreground">
                {title}
              </h3>
            </div>
            <Badge
              variant="outline"
              className="max-w-full shrink-0 whitespace-normal border-primary/50 bg-primary/10 text-left text-xs text-primary"
            >
              {t("courseSpecialty", specialty)}
            </Badge>
          </div>

          {/* Description */}
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="bg-muted/50 text-muted-foreground border border-border/50 font-normal"
            >
              Profe {instructorName}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-muted/50 text-muted-foreground border border-border/50 font-normal flex items-center gap-1.5"
            >
              <BarChart3 className="h-3 w-3" />
              {t("courseLevel", level)}
            </Badge>
            {duration && (
              <Badge
                variant="secondary"
                className="bg-muted/50 text-muted-foreground border border-border/50 font-normal flex items-center gap-1.5"
              >
                <Clock className="h-3 w-3" />
                {formatDuration(duration)}
              </Badge>
            )}
          </div>
        </div>

        {/* Students & Specialty */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="bg-muted/50 text-muted-foreground border border-border/50 font-normal flex items-center gap-1.5 w-fit"
          >
            <Users className="h-3 w-3" />
            {formatStudentCount(totalStudents)}
          </Badge>
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-500 border border-amber-500/30 font-normal"
          >
            {t("courseSpecialty", specialty)}
          </Badge>
        </div>
      </div>
    </div>
  );
}
