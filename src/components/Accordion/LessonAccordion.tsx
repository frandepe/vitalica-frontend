import { motion } from "framer-motion";
import { Lock, LockOpen, FileText, PlayCircle, FileDown } from "lucide-react";
import type { Lesson } from "@/types/course.types";
import { Badge } from "../ui/badge";

interface LessonItemProps {
  lesson: Lesson;
  index: number;
}

//TODO: Si presiona en una clase que no es gratis redirigila a pagar

export function LessonItem({ lesson, index }: LessonItemProps) {
  const { title, isFree, type, lessonMaterial } = lesson;

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
      className="group relative flex items-start gap-4 py-3 px-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
    >
      {/* Lock Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {isFree ? (
          <LockOpen className="w-4 h-4 text-green-600 dark:text-green-500" />
        ) : (
          <Lock className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {/* Content Type Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {type === "videoFile" ? (
          <PlayCircle className="w-4 h-4 text-primary" />
        ) : (
          <FileText className="w-4 h-4 text-primary" />
        )}
      </div>

      {/* Lesson Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`text-sm font-medium leading-relaxed ${
              isFree
                ? "text-foreground"
                : "text-muted-foreground group-hover:text-foreground transition-colors"
            }`}
          >
            {title}
          </h4>

          {/* Material Badge */}
          {lessonMaterial && lessonMaterial.length > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.1 }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="text-xs font-medium whitespace-nowrap">
                {lessonMaterial.length}{" "}
                {lessonMaterial.length === 1 ? "archivo" : "archivos"}
              </span>
            </motion.div>
          )}
        </div>

        {/* Material Details */}
        {lessonMaterial && lessonMaterial.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {lessonMaterial.map((material) => (
              <span
                key={material.id}
                className="inline-flex items-center text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded"
              >
                {material.type}
              </span>
            ))}
          </div>
        )}

        {/* Type Badge */}
        <div className="mt-1.5">
          <span className="inline-flex items-center text-xs text-muted-foreground">
            {type === "videoFile" ? "Video" : "Contenido"}
            {!isFree && (
              <Badge size={"sm"} variant="info" className="ml-1">
                Premium
              </Badge>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
