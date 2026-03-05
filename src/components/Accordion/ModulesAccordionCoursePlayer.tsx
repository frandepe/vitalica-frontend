"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { LessonItemCoursePlayer } from "./LessonAccordionCoursePlayer";

import { BookOpenText, ChevronDown, Loader2 } from "lucide-react";
import { getModuleQuizzes } from "@/api";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { UniversalModal } from "../UniversalModal";
import { ICourseModuleWithProgress } from "@/types/courseProgress.types";
import { QuizCoursePlayer } from "../Quizzes/QuizCoursePlayer";

export function ModulesAccordionCoursePlayer({
  modules,
}: {
  modules: ICourseModuleWithProgress[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [quizzesByModule, setQuizzesByModule] = useState<Record<string, any>>(
    {},
  );
  const [loadingModule, setLoadingModule] = useState<string | null>(null);

  const handleOpenExam = async (moduleId: string) => {
    setOpenModuleId(moduleId);

    // Si ya tenemos los quizzes cargados, no volvemos a cargar
    if (quizzesByModule[moduleId]) return;

    try {
      setLoadingModule(moduleId);
      const res = await getModuleQuizzes(moduleId);
      console.log("res", res);

      // Guardamos los quizzes del módulo en el estado
      if (res.success && res.data) {
        setQuizzesByModule((prev) => ({
          ...prev,
          [moduleId]: res.data!,
        }));
      }
    } catch (error) {
      console.error("Error fetching module quizzes:", error);
    } finally {
      setLoadingModule(null);
    }
  };

  const handleCloseModal = () => {
    setOpenModuleId(null);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="space-y-0">
        {modules.map((item, index) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;
          const quizzes = quizzesByModule[item.id] ?? [];
          const isLoading = loadingModule === item.id;

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
                  <div className="relative flex items-center justify-center w-10 h-10">
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-primary"
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

                  <motion.h3
                    title={item.title} // muestra completo al hover
                    className="text-lg font-semibold truncate"
                    animate={{
                      x: isActive || isHovered ? 4 : 0,
                      color:
                        isActive || isHovered
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    {item.title.length > 10
                      ? item.title.slice(0, 10) + "…"
                      : item.title}
                  </motion.h3>

                  <div className="flex items-center gap-3 ml-auto">
                    {item?.lessons?.length! > 0 && (
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
              </motion.button>

              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-foreground/70">{item.title}</p>
                    <div className="pr-4 py-6 space-y-1">
                      {item?.lessons?.length! > 0 ? (
                        item.lessons!.map((lesson, idx) => (
                          <LessonItemCoursePlayer
                            key={lesson.id}
                            lesson={lesson}
                            index={idx}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground py-2">
                          No hay lecciones en este módulo aún.
                        </p>
                      )}
                    </div>
                    <Card className="mx-1 mb-4 max-w-max">
                      <Button
                        onClick={() => handleOpenExam(item.id)}
                        variant="link"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 size={18} className="mr-1 animate-spin" />
                        ) : (
                          <BookOpenText size={18} className="mr-1" />
                        )}
                        Examen del módulo {item.order}
                      </Button>

                      <UniversalModal
                        open={openModuleId === item.id}
                        onOpenChange={handleCloseModal}
                        title={`Examen del módulo ${item.order}`}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">
                              Cargando preguntas...
                            </span>
                          </div>
                        ) : (
                          <QuizCoursePlayer
                            quizzes={quizzes}
                            moduleTitle={`Módulo ${item.order}: ${item.title}`}
                            onComplete={(answers: any) =>
                              console.log("Respuestas enviadas", answers)
                            }
                            isPractice={true}
                          />
                        )}
                      </UniversalModal>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
