import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { t } from "@/utils/translations";
import { ISpecialty } from "@/types/course.types";

interface PublicCourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    avgTheoreticalRating: number;
    specialty: ISpecialty;
    muxPlaybackId: string | null;
  };
  className?: string;
  href: string;
}

const PublicCourseCard = ({
  course,
  className,
  href,
}: PublicCourseCardProps) => {
  const {
    title,
    thumbnailUrl,
    avgTheoreticalRating,
    specialty,
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate(href)}
      className={cn(
        "w-full max-w-sm h-[320px] rounded-2xl border border-border bg-card p-4 shadow-sm cursor-pointer flex flex-col hover:shadow-md transition-shadow",
        className,
      )}
    >
      {/* Imagen */}
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

      {/* Contenido */}
      <div className="mt-3 space-y-1 flex-1">
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>

        <p className="text-sm text-muted-foreground">
          {t("courseSpecialty", specialty)}
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mt-auto">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{avgTheoreticalRating}</span>
      </div>
    </motion.div>
  );
};

export { PublicCourseCard };
