import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CourseModule, Lesson } from "@/types/course.types";
import { LessonItem } from "./LessonAccordion";
import { ChevronDown, Text, Video } from "lucide-react";
import { UniversalModal } from "../UniversalModal";
import { getFreeLessons } from "@/api";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "../ui/button";
import { formatPrice } from "@/utils/format-price";
import { useNavigate, useParams } from "react-router-dom";

export function ModulesAccordion({
  modules,
  courseId,
  price,
}: {
  modules: CourseModule[];
  courseId: string;
  price: number;
}) {
  const [activeId, setActiveId] = useState<string | null>("design");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openPay, setOpenPay] = useState(false);
  const [freeLessons, setFreeLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleOpenPayModal = () => {
    setOpenPay(true);
  };

  const handleOpenFreeLesson = async (lessonClicked: Lesson) => {
    setOpen(true);

    try {
      setLoading(true);
      const res = await getFreeLessons(courseId);
      const lessons = res.data.modules.flatMap((m: any) => m.lessons);

      setFreeLessons(lessons);

      const selected =
        lessons.find((l: Lesson) => l.id === lessonClicked.id) ??
        lessons[0] ??
        null;

      setActiveLesson(selected);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || !activeLesson;

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleCloseModalPay = () => {
    setOpenPay(false);
  };

  const handleBtnCheckout = () => {
    price > 0
      ? navigate(`/cursos/${courseId}/pago`)
      : navigate(`/mis-cursos/${slug}`);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="space-y-0">
        {modules.map((item, index) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;

          return (
            <div key={item.id}>
              <motion.button
                onClick={() => setActiveId(isActive ? null : item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="w-full group relative"
                initial={false}
              >
                <div className="flex items-center gap-6 py-5 px-1">
                  {/* Number with animated circle */}
                  <div className="relative flex items-center justify-center w-10 h-10">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary"
                      initial={false}
                      animate={{
                        scale: isActive ? 1 : isHovered ? 0.85 : 0,
                        opacity: isActive ? 1 : isHovered ? 0.1 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                    <motion.span
                      className="relative z-10 text-sm font-medium tracking-wide"
                      animate={{
                        color: isActive
                          ? "var(--primary-foreground)"
                          : "var(--muted-foreground)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {index <= 9 ? `0${index + 1}` : index + 1}
                    </motion.span>
                  </div>

                  {/* Title */}
                  <motion.h3
                    className="text-xl font-semibold"
                    animate={{
                      x: isActive || isHovered ? 4 : 0,
                      color: isActive
                        ? "var(--foreground)"
                        : isHovered
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    {item.title}
                  </motion.h3>

                  {/* Animated indicator */}
                  <div className="ml-auto flex items-center gap-3">
                    {item.lessons!.length > 0 && (
                      <motion.span
                        className="text-xs text-muted-foreground font-medium"
                        animate={{
                          opacity: isActive || isHovered ? 1 : 0.6,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.lessons!.length}{" "}
                        {item.lessons!.length === 1 ? "lección" : "lecciones"}
                      </motion.span>
                    )}
                    <motion.div
                      className="flex items-center justify-center w-8 h-8"
                      animate={{ rotate: isActive ? -90 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-foreground"
                        animate={{
                          opacity: isActive || isHovered ? 1 : 0.4,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} />
                      </motion.svg>
                    </motion.div>
                  </div>
                </div>

                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-border origin-left"
                  initial={false}
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-px bg-foreground origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: isActive ? 1 : isHovered ? 0.3 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              </motion.button>

              {/* Content */}
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2, delay: 0.1 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.1 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pl-16 pr-4 py-6 space-y-1">
                      {item.lessons!.length > 0 ? (
                        item.lessons!.map((lesson, idx) => (
                          <LessonItem
                            key={lesson.id}
                            lesson={lesson}
                            index={idx}
                            onFreeClick={handleOpenFreeLesson}
                            onPayClick={handleOpenPayModal}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground py-2">
                          No hay lecciones en este módulo aún.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <UniversalModal
        open={open}
        onOpenChange={handleCloseModal}
        title="Vista previa del curso"
      >
        <div className="flex flex-col gap-6">
          {/* VISOR SUPERIOR */}
          <div className="w-full rounded-lg overflow-hidden min-h-[360px] bg-muted">
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Cargando vista previa...
              </p>
            )}

            {!isLoading && activeLesson?.muxPlaybackId && (
              <MuxPlayer
                key={activeLesson.id}
                playbackId={activeLesson.muxPlaybackId}
                className="w-full h-full mux-custom"
                metadata={{
                  video_id: activeLesson.muxPlaybackId,
                  video_title: "Video gratuito del curso",
                }}
                accentColor="#20ab9f"
              />
            )}

            {!isLoading && activeLesson?.content && (
              <div className="max-h-[360px] overflow-y-auto p-6 prose prose-invert tiptap">
                <div
                  dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                />
              </div>
            )}
          </div>

          {/* LISTA DE CLASES */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              Clases gratuitas disponibles:
            </h4>

            <ul className="space-y-1">
              {loading && (
                <li className="text-sm text-muted-foreground px-3 py-2">
                  Cargando clases...
                </li>
              )}

              {!loading &&
                freeLessons.map((lesson) => {
                  const isActive = lesson.id === activeLesson?.id;

                  return (
                    <li
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`cursor-pointer rounded-md px-3 py-2 text-sm flex justify-between
          ${isActive ? "bg-muted font-medium" : "hover:bg-muted/50"}`}
                    >
                      <span>{lesson.title}</span>
                      {lesson.type === "videoFile" ? (
                        <Video size={18} />
                      ) : (
                        <Text size={18} />
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </UniversalModal>
      <UniversalModal
        open={openPay}
        onOpenChange={handleCloseModalPay}
        title={price > 0 ? "Inscribirme en el curso" : "Curso gratuito"}
      >
        <div>
          {price > 0 && (
            <div className="space-y-1">
              <p className="text-4xl font-semibold text-black">
                ARS ${formatPrice(price)}
              </p>
              <p className="text-sm text-neutral-500">
                Pago único · Acceso de por vida
              </p>
            </div>
          )}

          <Button
            onClick={handleBtnCheckout}
            size="lg"
            className="w-full text-base"
          >
            Inscribirme ahora
          </Button>

          {price > 0 && (
            <p className="text-center text-xs text-neutral-500">
              Garantía de devolución de 7 días
            </p>
          )}
        </div>
      </UniversalModal>
    </div>
  );
}
