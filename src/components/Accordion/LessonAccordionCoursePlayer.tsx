import { motion } from "framer-motion";
import { FileText, FileDown, Check } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ILessonWithProgress } from "@/types/courseProgress.types";

interface LessonItemProps {
  lesson: ILessonWithProgress;
  index: number;
  basePath?: string;
}

export function LessonItemCoursePlayer({ lesson, index, basePath = "/mis-cursos" }: LessonItemProps) {
  const { title, type, lessonMaterial, muxPlaybackId, completed } = lesson;
  const navigate = useNavigate();
  const { slug } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      <Card
        className="relative cursor-pointer transition-all hover:shadow-md"
        onClick={() => navigate(`${basePath}/${slug}/${lesson.id}`)}
      >
        <CardContent className="p-3">
          <div className="flex gap-3">
            {/* Thumbnail / Icon */}
            {type === "videoFile" ? (
              <img
                loading="lazy"
                decoding="async"
                alt="Video thumbnail"
                className="w-[100px] h-[60px] rounded-lg object-cover flex-shrink-0"
                src={`https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=100&height=80&time=3`}
              />
            ) : (
              <div className="w-[100px] h-[60px] rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>

                {lessonMaterial && lessonMaterial.length > 0 && (
                  <FileDown className="w-3 h-3 text-muted-foreground" />
                )}
              </div>

              <span className="text-xs text-muted-foreground">
                {type === "videoFile" ? "Video" : "Contenido"}
              </span>
            </div>
          </div>

          {completed && (
            <div className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-1 shadow">
              <Check className="w-3 h-3" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
