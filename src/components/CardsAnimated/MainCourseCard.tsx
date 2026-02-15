import * as React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";
import { CourseCardProps } from "./CoursePublic";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/format-price";
import { t } from "@/utils/translations";

interface MainCourseCardProps {
  course: CourseCardProps;
  className?: string;
  onActionClick?: () => void;
}

const MainCourseCard = React.forwardRef<HTMLDivElement, MainCourseCardProps>(
  ({ course, className }) => {
    const {
      title,
      thumbnailUrl,
      avgRating,
      totalStudents,
      specialty,
      price,
      slug,
      muxPlaybackId,
    } = course;

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

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={() => navigate(`/cursos/${slug}`)}
        className={cn(
          "w-full max-w-sm h-[350px] rounded-2xl border border-border bg-card p-4 shadow-sm cursor-pointer flex flex-col",
          className,
        )}
      >
        {/* TOP CONTENT */}
        <div className="flex flex-col gap-3">
          {/* Image */}
          <div className="aspect-video w-full overflow-hidden rounded-lg relative group">
            <img
              src={imageUrl}
              alt={title}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                hasMuxPreview && "group-hover:opacity-0",
              )}
            />

            {hasMuxPreview && gifUrl && (
              <img
                src={gifUrl}
                alt={`${title} preview`}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            )}
          </div>

          {/* Title + specialty */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {t("courseSpecialty", specialty)}
            </p>
          </div>
        </div>

        {/* BOTTOM CONTENT (se pega abajo siempre) */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{avgRating.toFixed(1)}</span>
            <span className="text-gray-400 text-sm">
              ({totalStudents} estudiantes)
            </span>
          </div>

          <p className="font-bold">{formatPrice(price)} $ARS</p>
        </div>
      </motion.div>
    );
  },
);

MainCourseCard.displayName = "MainCourseCard";

export { MainCourseCard };
