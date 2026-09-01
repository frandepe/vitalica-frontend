import {
  createCourseLesson,
  createCourseModule,
  deleteCourseLesson,
  deleteCourseModule,
} from "@/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  COURSE_STRUCTURE_LIMITS,
  courseStructureLimitMessages,
  descriptionModuleCourseLimit,
  sectionBackgrounds,
  titleMaxModuleAndLessonsCourseLimit,
  titleMinModuleAndLessonsMaxCourseLimit,
} from "@/constants";
import {
  getLocalVideoDurationSeconds,
  isMp4VideoFile,
  MAX_VIDEO_DURATION_ERROR_MESSAGE,
  MAX_VIDEO_DURATION_SECONDS,
  MAX_VIDEO_SIZE_BYTES,
  MAX_VIDEO_SIZE_ERROR_MESSAGE,
  VIDEO_FORMAT_ERROR_MESSAGE,
} from "@/constants/video";
import {
  CourseModuleFormValues,
  LessonFormValues,
  LessonUploadState,
  NewCourseFormValues,
} from "@/types/course.types";
import MuxPlayer from "@mux/mux-player-react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  CheckCircle,
  FileText,
  GripVertical,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Control,
  Controller,
  UseFieldArrayMove,
  UseFieldArrayRemove,
  useFormContext,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/utils/cn";
import { RichTextEditor } from "@/components/TextEditor/RichTextEditor";
import { ModuleQuizzes } from "@/components/Quizzes/ModuleQuizzes";
import UploadMaterial from "../UploadMaterial";
import {
  createLessonDirectUpload,
  deleteLessonVideo,
} from "@/api/videoEndpoints";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { isUploadAbortError } from "@/utils/mux-upload";
import { SortableItem, useStep4Dnd } from "@/hooks/useStep4Dnd";
import { useToast } from "@/components/ui/toast";
import MuxVideoUploader, {
  type MuxVideoUploadContext,
  type MuxVideoUploaderHandle,
} from "@/components/Uploads/MuxVideoUploader";
import { VideoUploadStatus } from "@/components/Uploads/VideoUploadStatus";
import {
  findLessonLocation,
  processAndConfirmLessonVideo,
} from "@/utils/lesson-video-upload";

interface Props {
  courseId: string;
  modules: CourseModuleFormValues[];
  register: UseFormRegister<NewCourseFormValues>;
  watch: UseFormWatch<NewCourseFormValues>;
  removeModule: UseFieldArrayRemove;
  moveModule: UseFieldArrayMove;
  handleRemoveLesson: (moduleIndex: number, lessonIndex: number) => void;
  setValue: UseFormSetValue<NewCourseFormValues>;
  handleLessonTypeChange: (
    sectionIndex: number,
    lessonIndex: number,
    type: LessonFormValues["type"],
  ) => void;
  lessonTypes: Record<number, Record<number, LessonFormValues["type"]>>;
  control: Control<NewCourseFormValues>;
  priceDB: string | undefined;
}

const isLessonUploadActive = (upload?: LessonUploadState) =>
  Boolean(upload && !["idle", "ready", "aborted"].includes(upload.phase));

export const Step4 = ({
  courseId,
  modules,
  // register,
  // watch,
  removeModule,
  moveModule,
  // setValue,
  handleLessonTypeChange,
  // control,
  priceDB,
}: Props) => {
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [creatingLessonModuleId, setCreatingLessonModuleId] = useState<
    string | null
  >(null);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [deletingVideoLesson, setDeletingVideoLesson] = useState<string | null>(
    null,
  );
  const [lessonUploads, setLessonUploads] = useState<
    Record<string, LessonUploadState>
  >({});
  const [replacingLessonIds, setReplacingLessonIds] = useState<
    Record<string, boolean>
  >({});
  const lessonUploadAbortRef = useRef<Record<string, AbortController>>({});
  const lessonUploaderRefs = useRef<
    Record<string, MuxVideoUploaderHandle | null>
  >({});
  const lessonUploadSessionRef = useRef<Record<string, number>>({});
  const lessonUploadCompletionRef = useRef<Record<string, () => void>>({});
  const { showToast } = useToast();

  const {
    watch,
    setValue,
    formState: { errors },
    control,
    register,
  } = useFormContext<NewCourseFormValues>();
  const {
    sensors,
    onModuleDragEnd,
    onLessonDragEnd,
    MODULES_SORTABLE_ID,
    LESSONS_SORTABLE_PREFIX,
    getModuleDragId,
    getLessonDragId,
  } = useStep4Dnd({
    watch,
    setValue,
    moveModule,
  });

  useEffect(() => {
    const uploadControllers = lessonUploadAbortRef.current;
    return () => {
      Object.values(uploadControllers).forEach((controller) =>
        controller.abort(),
      );
    };
  }, []);

  const watchedModules = watch("modules") || [];
  const moduleCount = watchedModules.length;
  const hasReachedModuleLimit =
    moduleCount >= COURSE_STRUCTURE_LIMITS.MAX_MODULES_PER_COURSE;

  const getResponseErrorMessage = (response: {
    message?: string;
    errors?: Array<{ message: string }>;
  }) => response.errors?.[0]?.message || response.message || "Ocurrió un error";

  const handleAddModule = async () => {
    if (isCreatingModule || hasReachedModuleLimit) {
      if (hasReachedModuleLimit) {
        showToast(courseStructureLimitMessages.modules, "warning", "top-right");
      }
      return;
    }

    try {
      setIsCreatingModule(true);

      const res = await createCourseModule(courseId);
      if (!res.success) {
        showToast(getResponseErrorMessage(res), "warning", "top-right");
        return;
      }

      const newModule = res.data;

      setValue("modules", [
        ...(watch("modules") || []),
        {
          id: newModule.id,
          title: newModule.title || "",
          description: newModule.description || "",
          order: newModule.order,
          lessons: [],
        },
      ]);
    } catch (error) {
      console.error("Error creando módulo", error);
    } finally {
      setIsCreatingModule(false);
    }
  };

  const handleDeleteModule = async (moduleId: string, moduleIndex: number) => {
    const hasActiveUpload = (
      watch(`modules.${moduleIndex}.lessons`) || []
    ).some((lesson: LessonFormValues) =>
      isLessonUploadActive(lessonUploads[lesson.id]),
    );
    if (hasActiveUpload) {
      showToast(
        "Cancelá las subidas activas antes de eliminar el módulo",
        "warning",
        "top-right",
      );
      return;
    }

    try {
      setDeletingModuleId(moduleId);

      await deleteCourseModule(moduleId);

      // eliminar del form (react-hook-form)
      removeModule(moduleIndex);
    } catch (error) {
      console.error("Error eliminando módulo", error);
      // opcional: toast
    } finally {
      setDeletingModuleId(null);
      setConfirmText("");
    }
  };

  const handleAddLesson = async (moduleIndex: number, moduleId: string) => {
    const currentLessons = watch(`modules.${moduleIndex}.lessons`) || [];
    const hasReachedLessonLimit =
      currentLessons.length >= COURSE_STRUCTURE_LIMITS.MAX_LESSONS_PER_MODULE;

    if (creatingLessonModuleId === moduleId || hasReachedLessonLimit) {
      if (hasReachedLessonLimit) {
        showToast(courseStructureLimitMessages.lessons, "warning", "top-right");
      }
      return;
    }

    try {
      setCreatingLessonModuleId(moduleId);

      const res = await createCourseLesson(moduleId);

      if (!res.success) {
        showToast(getResponseErrorMessage(res), "warning", "top-right");
        return;
      }

      const lesson = res.data;

      setValue(`modules.${moduleIndex}.lessons`, [
        ...currentLessons,
        {
          id: lesson.id,
          title: lesson.title,
          content: lesson.content || "",
          isFree: lesson.isFree,
          type: lesson.type,
          order: lesson.order,
        },
      ]);
    } catch (error) {
      console.error("Error creando lección", error);
    } finally {
      setCreatingLessonModuleId(null);
    }
  };

  const handleDeleteLesson = async (
    moduleIndex: number,
    lessonIndex: number,
    lessonId: string,
  ) => {
    if (isLessonUploadActive(lessonUploads[lessonId])) {
      showToast(
        "Cancelá la subida antes de eliminar la lección",
        "warning",
        "top-right",
      );
      return;
    }

    try {
      setDeletingLessonId(lessonId);

      const res = await deleteCourseLesson(lessonId);
      if (!res.success) return;

      const currentLessons = watch(`modules.${moduleIndex}.lessons`) || [];

      const updatedLessons = currentLessons.filter(
        (_lesson: LessonFormValues, index: number) => index !== lessonIndex,
      );

      // Reordenar en frontend
      const reordered = updatedLessons.map((lesson: LessonFormValues, i) => ({
        ...lesson,
        order: i + 1,
      }));

      setValue(`modules.${moduleIndex}.lessons`, reordered, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Error eliminando lección", error);
    } finally {
      setDeletingLessonId(null);
    }
  };

  const finishLessonUploadOperation = (lessonId: string) => {
    lessonUploadCompletionRef.current[lessonId]?.();
    delete lessonUploadCompletionRef.current[lessonId];
  };

  const updateLessonUpload = (
    lessonId: string,
    updates: Partial<LessonUploadState>,
  ) => {
    setLessonUploads((previous) => {
      const current = previous[lessonId] ?? {
        phase: "idle" as const,
        progress: 0,
        status: "",
      };
      return {
        ...previous,
        [lessonId]: { ...current, ...updates },
      };
    });
  };

  const createLessonUploadEndpoint = async (lessonId: string, file: File) => {
    const response = await createLessonDirectUpload(lessonId, file);
    if (!response.success || !response.data) {
      throw new Error(response.message || "MUX_DIRECT_UPLOAD_FAILED");
    }
    return response.data;
  };

  const handleLessonTransferComplete = async (
    lessonId: string,
    { uploadId, sessionId }: Required<MuxVideoUploadContext>,
  ) => {
    if (lessonUploadSessionRef.current[lessonId] !== sessionId) return;

    const abortController = new AbortController();
    lessonUploadAbortRef.current[lessonId]?.abort();
    lessonUploadAbortRef.current[lessonId] = abortController;

    try {
      updateLessonUpload(lessonId, {
        phase: "processing",
        progress: 100,
        status: "Procesando el video, esto puede tardar varios minutos...",
      });

      const { playbackId, confirmation } = await processAndConfirmLessonVideo({
        lessonId,
        uploadId,
        signal: abortController.signal,
        onReadyToConfirm: () =>
          updateLessonUpload(lessonId, {
            phase: "confirming",
            status: "Guardando video...",
          }),
      });

      if (!confirmation.success) {
        showToast(
          confirmation.message || "Ocurrió un error al validar el video",
          "warning",
          "top-right",
        );
        updateLessonUpload(lessonId, {
          phase: "error",
          progress: 0,
          status: "Ocurrió un error al subir el video",
        });
        return;
      }

      const location = findLessonLocation(watch("modules") || [], lessonId);
      if (!location) throw new Error("LESSON_NOT_FOUND_AFTER_UPLOAD");

      setValue(
        `modules.${location.moduleIndex}.lessons.${location.lessonIndex}.muxPlaybackId`,
        playbackId,
        { shouldDirty: true },
      );

      updateLessonUpload(lessonId, {
        phase: "ready",
        progress: 100,
        status: "¡Video guardado!",
      });
      setReplacingLessonIds((previous) => ({
        ...previous,
        [lessonId]: false,
      }));
      delete lessonUploadSessionRef.current[lessonId];
      finishLessonUploadOperation(lessonId);
    } catch (error) {
      console.error("Error procesando video de lección:", error);
      if (isUploadAbortError(error)) return;
      updateLessonUpload(lessonId, {
        phase: "error",
        progress: 0,
        status: "Ocurrió un error al subir el video",
      });
    } finally {
      if (lessonUploadAbortRef.current[lessonId] === abortController) {
        delete lessonUploadAbortRef.current[lessonId];
      }
    }
  };

  const handleLessonVideoUpload = async (file: File, lessonId: string) => {
    const location = findLessonLocation(watch("modules") || [], lessonId);
    if (!location) return;
    const previousPlaybackId =
      watch(
        `modules.${location.moduleIndex}.lessons.${location.lessonIndex}.muxPlaybackId`,
      ) ?? null;

    setLessonUploads((previous) => ({
      ...previous,
      [lessonId]: {
        phase: "validating",
        progress: 0,
        status: "Validando archivo...",
        previousPlaybackId,
      },
    }));

    if (!isMp4VideoFile(file)) {
      updateLessonUpload(lessonId, { phase: "idle", status: "" });
      showToast(VIDEO_FORMAT_ERROR_MESSAGE, "warning", "top-right");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      updateLessonUpload(lessonId, { phase: "idle", status: "" });
      showToast(MAX_VIDEO_SIZE_ERROR_MESSAGE, "warning", "top-right");
      return;
    }

    const durationSeconds = await getLocalVideoDurationSeconds(file);
    if (
      durationSeconds !== null &&
      durationSeconds > MAX_VIDEO_DURATION_SECONDS
    ) {
      updateLessonUpload(lessonId, { phase: "idle", status: "" });
      showToast(MAX_VIDEO_DURATION_ERROR_MESSAGE, "warning", "top-right");
      return;
    }

    lessonUploadAbortRef.current[lessonId]?.abort();
    lessonUploaderRefs.current[lessonId]?.abort();
    finishLessonUploadOperation(lessonId);

    const completion = new Promise<void>((resolve) => {
      lessonUploadCompletionRef.current[lessonId] = resolve;
    });
    const sessionId = lessonUploaderRefs.current[lessonId]?.start(file);
    if (!sessionId) {
      finishLessonUploadOperation(lessonId);
      return;
    }
    lessonUploadSessionRef.current[lessonId] = sessionId;

    setLessonUploads((previous) => ({
      ...previous,
      [lessonId]: {
        sessionId,
        phase: "preparing",
        progress: 0,
        status: "Preparando subida...",
        previousPlaybackId,
      },
    }));

    await completion;
  };

  const handleRetryLessonVideoUpload = (lessonId: string) => {
    lessonUploadAbortRef.current[lessonId]?.abort();
    delete lessonUploadAbortRef.current[lessonId];
    const sessionId = lessonUploaderRefs.current[lessonId]?.retry();
    if (!sessionId) return;
    lessonUploadSessionRef.current[lessonId] = sessionId;
    updateLessonUpload(lessonId, {
      sessionId,
      phase: "preparing",
      progress: 0,
      status: "Preparando subida...",
    });
  };

  const handleCancelLessonVideoUpload = (lessonId: string) => {
    const previousPlaybackId =
      lessonUploads[lessonId]?.previousPlaybackId ?? null;

    lessonUploadAbortRef.current[lessonId]?.abort();
    delete lessonUploadAbortRef.current[lessonId];
    lessonUploaderRefs.current[lessonId]?.abort();
    delete lessonUploadSessionRef.current[lessonId];

    const location = findLessonLocation(watch("modules") || [], lessonId);
    if (location) {
      setValue(
        `modules.${location.moduleIndex}.lessons.${location.lessonIndex}.muxPlaybackId`,
        previousPlaybackId,
        { shouldDirty: true },
      );
    }
    setLessonUploads((prev) => ({
      ...prev,
      [lessonId]: {
        phase: "aborted",
        progress: 0,
        status: "",
        previousPlaybackId,
      },
    }));
    setReplacingLessonIds((previous) => ({
      ...previous,
      [lessonId]: false,
    }));
    finishLessonUploadOperation(lessonId);
  };

  const handleDeleteLessonVideo = async (
    lessonId: string,
    moduleIndex: number,
    lessonIndex: number,
  ) => {
    if (isLessonUploadActive(lessonUploads[lessonId])) {
      showToast(
        "Cancelá la subida antes de eliminar el video",
        "warning",
        "top-right",
      );
      return false;
    }

    try {
      setDeletingVideoLesson(lessonId);
      const res = await deleteLessonVideo(lessonId);
      setValue(
        `modules.${moduleIndex}.lessons.${lessonIndex}.muxPlaybackId`,
        null,
        { shouldDirty: true },
      );
      if (!res.success) return false;
      return true;
    } catch (error) {
      console.error("Error eliminando video de la lección", error);
    } finally {
      setDeletingVideoLesson(null);
      setLessonUploads((prev) => ({
        ...prev,
        [lessonId]: {
          phase: "idle",
          progress: 0,
          status: "",
        },
      }));
    }
  };

  return (
    <div>
      <ScrollArea className="flex-grow">
        <div className="flex flex-col gap-4 md:gap-5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onModuleDragEnd}
          >
            <SortableContext
              id={MODULES_SORTABLE_ID}
              items={modules.map((module, moduleIndex) =>
                getModuleDragId(module, moduleIndex),
              )}
              strategy={verticalListSortingStrategy}
            >
              {modules.map((section, moduleIndex) => {
                const sectionBgColor =
                  sectionBackgrounds[moduleIndex % sectionBackgrounds.length];
                const moduleDragId = getModuleDragId(section, moduleIndex);
                const lessonCount =
                  watch(`modules.${moduleIndex}.lessons`)?.length || 0;
                const hasReachedLessonLimit =
                  lessonCount >= COURSE_STRUCTURE_LIMITS.MAX_LESSONS_PER_MODULE;
                const hasActiveModuleUpload = (
                  watch(`modules.${moduleIndex}.lessons`) || []
                ).some((lesson: LessonFormValues) =>
                  isLessonUploadActive(lessonUploads[lesson.id]),
                );

                return (
                  <SortableItem key={moduleDragId} id={moduleDragId}>
                    {({ attributes, listeners, setActivatorNodeRef }) => (
                      <Card className="bg-white text-black border-slate-400">
                        <div
                          className={`flex flex-col ${sectionBgColor} px-2 md:px-3 rounded-[13px]`}
                        >
                          <div className="flex items-center justify-between pt-3">
                            <div className="flex flex-col gap-1">
                              <span className="font-poppins font-semibold text-sm md:text-base">
                                Modulo {moduleIndex + 1}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Módulos: {moduleCount}/
                                {COURSE_STRUCTURE_LIMITS.MAX_MODULES_PER_COURSE}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Reordenar modulo ${moduleIndex + 1}`}
                              ref={(element) => setActivatorNodeRef(element)}
                              {...attributes}
                              {...listeners}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="pb-3">
                            <div className="pb-3">
                              <Label className="text-sm md:text-base">
                                Ingrese el título del módulo{" "}
                                <span className="text-red-600">*</span>
                              </Label>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <Input
                                {...register(`modules.${moduleIndex}.title`, {
                                  required: true,
                                  minLength: {
                                    value:
                                      titleMinModuleAndLessonsMaxCourseLimit,
                                    message: `El título debe tener al menos ${titleMinModuleAndLessonsMaxCourseLimit} caracteres`,
                                  },
                                  maxLength: {
                                    value: titleMaxModuleAndLessonsCourseLimit,
                                    message: `El título no puede superar los ${titleMaxModuleAndLessonsCourseLimit} caracteres`,
                                  },
                                })}
                                placeholder="Ingrese el título del módulo"
                              />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    type="button"
                                    disabled={
                                      deletingModuleId === section.id ||
                                      hasActiveModuleUpload
                                    }
                                    className="ml-2"
                                  >
                                    {deletingModuleId === section.id ? (
                                      <span className="text-sm text-muted-foreground">
                                        Eliminando...
                                      </span>
                                    ) : (
                                      <Trash2 className="text-red-500 w-4 h-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      ¿Eliminar este módulo completo?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Este módulo y todas las lecciones que
                                      contiene serán eliminadas de forma
                                      permanente.
                                      <br />
                                      Incluye videos, materiales y todo su
                                      contenido.
                                      <br />
                                      <strong>
                                        Esta acción no se puede deshacer.
                                      </strong>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>

                                  {/* Confirmación por texto */}
                                  <div className="space-y-2">
                                    <p className="text-sm">
                                      Escribí <strong>ELIMINAR</strong> para
                                      confirmar
                                    </p>

                                    <Input
                                      type="text"
                                      value={confirmText}
                                      onChange={(e) =>
                                        setConfirmText(e.target.value)
                                      }
                                      placeholder="ELIMINAR"
                                      className="w-full rounded-md border px-3 py-2 text-sm"
                                      disabled={deletingModuleId === section.id}
                                    />
                                  </div>

                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      disabled={deletingModuleId === section.id}
                                    >
                                      Cancelar
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                      variant="destructive"
                                      disabled={
                                        confirmText !== "ELIMINAR" ||
                                        deletingModuleId === section.id
                                      }
                                      onClick={async () => {
                                        setDeletingModuleId(section.id);
                                        try {
                                          await handleDeleteModule(
                                            section.id,
                                            moduleIndex,
                                          );
                                        } finally {
                                          setDeletingModuleId(null);
                                        }
                                      }}
                                    >
                                      {deletingModuleId === section.id
                                        ? "Eliminando..."
                                        : "Eliminar módulo"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            {errors.modules?.[moduleIndex]?.title?.message && (
                              <p className="text-red-500 text-sm my-1">
                                {errors.modules?.[moduleIndex]?.title?.message}
                              </p>
                            )}

                            <Textarea
                              placeholder="Descrbí de qué trata este módulo y qué aprenderán los estudiantes. Por ejemplo: 'En este módulo, exploraremos los conceptos fundamentales de...'"
                              className={cn(
                                "resize-y w-full h-[100px] dark:bg-card bg-background rounded-[13px]",
                              )}
                              {...register(
                                `modules.${moduleIndex}.description`,
                                {
                                  minLength: {
                                    value: 10,
                                    message:
                                      "La descripción debe tener al menos 10 caracteres",
                                  },
                                  maxLength: {
                                    value: descriptionModuleCourseLimit,
                                    message: `La descripción no puede superar los ${descriptionModuleCourseLimit} caracteres`,
                                  },
                                },
                              )}
                            />

                            {errors.modules?.[moduleIndex]?.description
                              ?.message && (
                              <p className="text-red-500 text-sm mt-1">
                                {
                                  errors.modules?.[moduleIndex]?.description
                                    ?.message
                                }
                              </p>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {descriptionModuleCourseLimit -
                                (watch(`modules.${moduleIndex}.description`)
                                  ?.length || 0)}{" "}
                              caracteres restantes
                            </span>
                            <div className="mt-4">
                              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                                <span>
                                  Lecciones: {lessonCount}/
                                  {
                                    COURSE_STRUCTURE_LIMITS.MAX_LESSONS_PER_MODULE
                                  }
                                </span>
                                {hasReachedLessonLimit && (
                                  <span>
                                    {courseStructureLimitMessages.lessons}
                                  </span>
                                )}
                              </div>
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={onLessonDragEnd(moduleIndex)}
                              >
                                <SortableContext
                                  id={`${LESSONS_SORTABLE_PREFIX}${moduleDragId}`}
                                  items={(
                                    watch(`modules.${moduleIndex}.lessons`) ||
                                    []
                                  ).map(
                                    (
                                      lesson: LessonFormValues,
                                      lessonIndex: number,
                                    ) =>
                                      getLessonDragId(
                                        lesson,
                                        moduleIndex,
                                        lessonIndex,
                                      ),
                                  )}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {watch(`modules.${moduleIndex}.lessons`)?.map(
                                    (
                                      lesson: LessonFormValues,
                                      lessonIndex: number,
                                    ) => {
                                      const playbackId = watch(
                                        `modules.${moduleIndex}.lessons.${lessonIndex}.muxPlaybackId`,
                                      );
                                      const upload = lessonUploads[lesson.id];
                                      const isLessonVideoUploading =
                                        isLessonUploadActive(upload);
                                      const lessonDragId = getLessonDragId(
                                        lesson,
                                        moduleIndex,
                                        lessonIndex,
                                      );
                                      return (
                                        <SortableItem
                                          key={lessonDragId}
                                          id={lessonDragId}
                                        >
                                          {({
                                            attributes: lessonAttributes,
                                            listeners: lessonListeners,
                                            setActivatorNodeRef:
                                              setLessonActivatorNodeRef,
                                          }) => (
                                            <div className="border border-slate-400 px-2 md:px-3 rounded-md py-2">
                                              <MuxVideoUploader
                                                ref={(handle) => {
                                                  lessonUploaderRefs.current[
                                                    lesson.id
                                                  ] = handle;
                                                }}
                                                createDirectUpload={(file) =>
                                                  createLessonUploadEndpoint(
                                                    lesson.id,
                                                    file,
                                                  )
                                                }
                                                onPhaseChange={(phase) => {
                                                  if (phase === "preparing") {
                                                    updateLessonUpload(
                                                      lesson.id,
                                                      {
                                                        phase: "preparing",
                                                        status:
                                                          "Preparando subida...",
                                                      },
                                                    );
                                                  }
                                                  if (phase === "uploading") {
                                                    updateLessonUpload(
                                                      lesson.id,
                                                      {
                                                        phase: "uploading",
                                                        status:
                                                          "Subiendo video...",
                                                      },
                                                    );
                                                  }
                                                  if (phase === "offline") {
                                                    updateLessonUpload(
                                                      lesson.id,
                                                      {
                                                        phase: "offline",
                                                        status:
                                                          "Sin conexión. La subida continuará cuando vuelva internet...",
                                                      },
                                                    );
                                                  }
                                                }}
                                                onProgress={(progress) =>
                                                  updateLessonUpload(
                                                    lesson.id,
                                                    {
                                                      progress:
                                                        Math.round(progress),
                                                    },
                                                  )
                                                }
                                                onTransferComplete={(context) =>
                                                  void handleLessonTransferComplete(
                                                    lesson.id,
                                                    context,
                                                  )
                                                }
                                                onError={(error) => {
                                                  console.error(
                                                    "Error subiendo video de lección:",
                                                    error,
                                                  );
                                                  updateLessonUpload(
                                                    lesson.id,
                                                    {
                                                      phase: "error",
                                                      progress: 0,
                                                      status:
                                                        "Ocurrió un error al subir el video",
                                                    },
                                                  );
                                                }}
                                              />
                                              <p className="pb-2 md:pb-3 text-sm md:text-base">
                                                Lección {lessonIndex + 1}
                                              </p>
                                              <div className="flex justify-between items-center">
                                                <Input
                                                  {...register(
                                                    `modules.${moduleIndex}.lessons.${lessonIndex}.title`,
                                                    {
                                                      required: true,
                                                      minLength: {
                                                        value:
                                                          titleMinModuleAndLessonsMaxCourseLimit,
                                                        message: `El título debe tener al menos ${titleMinModuleAndLessonsMaxCourseLimit} caracteres`,
                                                      },
                                                      maxLength: {
                                                        value:
                                                          titleMaxModuleAndLessonsCourseLimit,
                                                        message: `El título no puede superar los ${titleMaxModuleAndLessonsCourseLimit} caracteres`,
                                                      },
                                                    },
                                                  )}
                                                  placeholder="Ingrese el título de la lección"
                                                  className="flex-1 dark:bg-background bg-white text-sm md:text-base"
                                                />
                                                <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                    <Button
                                                      type="button"
                                                      variant="outline"
                                                      disabled={
                                                        deletingLessonId ===
                                                          lesson.id ||
                                                        isLessonVideoUploading
                                                      }
                                                      className="ml-2"
                                                    >
                                                      {deletingLessonId ===
                                                      lesson.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                                      ) : (
                                                        <Trash2 className="text-red-500 w-4 h-4" />
                                                      )}
                                                    </Button>
                                                  </AlertDialogTrigger>

                                                  <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                      <AlertDialogTitle>
                                                        ¿Eliminar esta lección?
                                                      </AlertDialogTitle>

                                                      <AlertDialogDescription>
                                                        La lección se eliminará
                                                        de forma permanente.
                                                        <br />
                                                        Esto incluye el video y
                                                        cualquier material
                                                        asociado.
                                                        <br />
                                                        Esta acción no se puede
                                                        deshacer.
                                                      </AlertDialogDescription>
                                                    </AlertDialogHeader>

                                                    <AlertDialogFooter>
                                                      <AlertDialogCancel
                                                        disabled={
                                                          deletingLessonId ===
                                                          lesson.id
                                                        }
                                                      >
                                                        Cancelar
                                                      </AlertDialogCancel>

                                                      <AlertDialogAction
                                                        variant="destructive"
                                                        disabled={
                                                          deletingLessonId ===
                                                          lesson.id
                                                        }
                                                        onClick={() =>
                                                          handleDeleteLesson(
                                                            moduleIndex,
                                                            lessonIndex,
                                                            lesson.id,
                                                          )
                                                        }
                                                      >
                                                        Eliminar lección
                                                      </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                  </AlertDialogContent>
                                                </AlertDialog>
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="icon"
                                                  aria-label={`Reordenar leccion ${lessonIndex + 1}`}
                                                  ref={(element) =>
                                                    setLessonActivatorNodeRef(
                                                      element,
                                                    )
                                                  }
                                                  {...lessonAttributes}
                                                  {...lessonListeners}
                                                  className="ml-2 cursor-grab active:cursor-grabbing"
                                                >
                                                  <GripVertical className="w-4 h-4" />
                                                </Button>
                                              </div>
                                              {errors.modules?.[moduleIndex]
                                                ?.lessons?.[lessonIndex]?.title
                                                ?.message && (
                                                <p className="text-red-500 text-sm my-1">
                                                  {
                                                    errors.modules?.[
                                                      moduleIndex
                                                    ]?.lessons?.[lessonIndex]
                                                      ?.title?.message
                                                  }
                                                </p>
                                              )}

                                              {/* ========= SELECT VIDEO OR CONTENT ========= */}
                                              <div>
                                                <Separator className="my-4 bg-slate-400" />
                                                <div className="space-y-3 max-w-lg mb-2">
                                                  <p className="text-sm font-medium">
                                                    Seleccioná una opción
                                                  </p>

                                                  <div className="grid grid-cols-2 gap-3">
                                                    {/* VIDEO */}
                                                    <button
                                                      type="button"
                                                      disabled={
                                                        isLessonVideoUploading
                                                      }
                                                      onClick={() => {
                                                        setValue(
                                                          `modules.${moduleIndex}.lessons.${lessonIndex}.type`,
                                                          "videoFile",
                                                        );
                                                        handleLessonTypeChange(
                                                          moduleIndex,
                                                          lessonIndex,
                                                          "videoFile",
                                                        );
                                                      }}
                                                      className={cn(
                                                        "relative flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-400 p-4 text-sm transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
                                                        lesson.type ===
                                                          "videoFile"
                                                          ? "border-primary bg-primary/10 ring-2 ring-primary"
                                                          : "hover:border-muted-foreground/40",
                                                      )}
                                                    >
                                                      {lesson.type ===
                                                        "videoFile" && (
                                                        <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-primary" />
                                                      )}

                                                      <Video className="w-6 h-6" />
                                                      <span className="font-medium">
                                                        Video
                                                      </span>
                                                    </button>

                                                    {/* TEXTO */}
                                                    <button
                                                      type="button"
                                                      disabled={
                                                        isLessonVideoUploading
                                                      }
                                                      onClick={() => {
                                                        setValue(
                                                          `modules.${moduleIndex}.lessons.${lessonIndex}.type`,
                                                          "content",
                                                        );
                                                        handleLessonTypeChange(
                                                          moduleIndex,
                                                          lessonIndex,
                                                          "content",
                                                        );
                                                      }}
                                                      className={cn(
                                                        "relative flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-400 p-4 text-sm transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
                                                        lesson.type ===
                                                          "content"
                                                          ? "border-primary bg-primary/10 ring-2 ring-primary"
                                                          : "hover:border-muted-foreground/40",
                                                      )}
                                                    >
                                                      {lesson.type ===
                                                        "content" && (
                                                        <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-primary" />
                                                      )}

                                                      <FileText className="w-6 h-6" />
                                                      <span className="font-medium">
                                                        Texto
                                                      </span>
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* ========= CONTENT ========= */}
                                              {lesson.type === "content" && (
                                                <Controller
                                                  name={`modules.${moduleIndex}.lessons.${lessonIndex}.content`}
                                                  control={control}
                                                  render={({ field }) => (
                                                    <RichTextEditor
                                                      value={field.value || ""}
                                                      onChange={field.onChange}
                                                      onBlur={field.onBlur}
                                                    />
                                                  )}
                                                />
                                              )}

                                              {/* ========= VIDEO ========= */}
                                              {lesson.type === "videoFile" && (
                                                <div className="space-y-2">
                                                  {/* ===== PROGRESO ===== */}
                                                  {isLessonVideoUploading && (
                                                    <VideoUploadStatus
                                                      phase={upload.phase}
                                                      status={upload.status}
                                                      progress={upload.progress}
                                                      onRetry={() =>
                                                        handleRetryLessonVideoUpload(
                                                          lesson.id,
                                                        )
                                                      }
                                                      onCancel={() =>
                                                        handleCancelLessonVideoUpload(
                                                          lesson.id,
                                                        )
                                                      }
                                                      cancelDisabled={
                                                        upload.phase ===
                                                        "confirming"
                                                      }
                                                    />
                                                  )}

                                                  {/* ===== VIDEO EXISTENTE ===== */}
                                                  {playbackId &&
                                                    !replacingLessonIds[
                                                      lesson.id
                                                    ] && (
                                                      <>
                                                        <div className="aspect-video w-full max-w-lg rounded-xl overflow-hidden">
                                                          <MuxPlayer
                                                            key={playbackId}
                                                            playbackId={
                                                              playbackId
                                                            }
                                                            className="w-full h-full"
                                                            accentColor="#20ab9f"
                                                          />
                                                        </div>

                                                        <div className="flex gap-2">
                                                          <Button
                                                            type="button"
                                                            variant="outline"
                                                            disabled={
                                                              isLessonVideoUploading
                                                            }
                                                            onClick={() =>
                                                              setReplacingLessonIds(
                                                                (previous) => ({
                                                                  ...previous,
                                                                  [lesson.id]: true,
                                                                }),
                                                              )
                                                            }
                                                          >
                                                            Reemplazar video
                                                          </Button>

                                                          <AlertDialog>
                                                            <AlertDialogTrigger
                                                              asChild
                                                            >
                                                              <Button
                                                                variant="destructive"
                                                                type="button"
                                                                disabled={
                                                                  deletingVideoLesson ===
                                                                    lesson.id ||
                                                                  isLessonVideoUploading
                                                                }
                                                              >
                                                                {deletingVideoLesson ===
                                                                lesson.id ? (
                                                                  <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                  "Eliminar video"
                                                                )}
                                                              </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                              <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                  ¿Eliminar el
                                                                  video de esta
                                                                  lección?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                  El video se
                                                                  eliminará de
                                                                  forma
                                                                  permanente de
                                                                  esta lección.
                                                                  <br />
                                                                  Esta acción no
                                                                  se puede
                                                                  deshacer.
                                                                </AlertDialogDescription>
                                                              </AlertDialogHeader>
                                                              <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                  Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                  variant="destructive"
                                                                  onClick={() =>
                                                                    handleDeleteLessonVideo(
                                                                      lesson.id,
                                                                      moduleIndex,
                                                                      lessonIndex,
                                                                    )
                                                                  }
                                                                >
                                                                  Sí, eliminar
                                                                  video
                                                                </AlertDialogAction>
                                                              </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                          </AlertDialog>
                                                        </div>
                                                      </>
                                                    )}

                                                  {/* ===== SUBIDA ===== */}
                                                  {(!playbackId ||
                                                    replacingLessonIds[
                                                      lesson.id
                                                    ]) &&
                                                    !isLessonVideoUploading && (
                                                      <div className="flex">
                                                        <Button
                                                          type="button"
                                                          variant="outline"
                                                          className="flex items-center gap-2"
                                                          onClick={() =>
                                                            document
                                                              .getElementById(
                                                                `lesson-video-${lesson.id}`,
                                                              )
                                                              ?.click()
                                                          }
                                                        >
                                                          <Upload className="w-4 h-4" />
                                                          Subir video
                                                        </Button>

                                                        <input
                                                          id={`lesson-video-${lesson.id}`}
                                                          type="file"
                                                          accept=".mp4,video/mp4"
                                                          className="hidden"
                                                          onChange={async (
                                                            e,
                                                          ) => {
                                                            const file =
                                                              e.target
                                                                .files?.[0];
                                                            if (!file) return;

                                                            await handleLessonVideoUpload(
                                                              file,
                                                              lesson.id,
                                                            );
                                                            e.target.value = "";
                                                          }}
                                                        />

                                                        {playbackId && (
                                                          <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() =>
                                                              setReplacingLessonIds(
                                                                (previous) => ({
                                                                  ...previous,
                                                                  [lesson.id]: false,
                                                                }),
                                                              )
                                                            }
                                                            className="ml-2"
                                                          >
                                                            Cancelar reemplazo
                                                          </Button>
                                                        )}
                                                      </div>
                                                    )}
                                                </div>
                                              )}
                                              <Separator className="mt-4 bg-slate-400" />
                                              <div className="py-4">
                                                {/* lessonMaterial */}
                                                <UploadMaterial
                                                  lessonId={lesson.id}
                                                  existingMaterials={
                                                    lesson.lessonMaterial ?? []
                                                  }
                                                  onMaterialsChange={(
                                                    materials,
                                                  ) =>
                                                    setValue(
                                                      `modules.${moduleIndex}.lessons.${lessonIndex}.lessonMaterial`,
                                                      materials,
                                                      { shouldDirty: true },
                                                    )
                                                  }
                                                />
                                              </div>
                                              {priceDB !== "0" && (
                                                <div className="mt-2 flex items-center gap-2">
                                                  <Controller
                                                    name={`modules.${moduleIndex}.lessons.${lessonIndex}.isFree`}
                                                    control={control}
                                                    defaultValue={false}
                                                    render={({ field }) => (
                                                      <Switch
                                                        id={`isFree-${moduleIndex}-${lessonIndex}`}
                                                        checked={field.value}
                                                        onCheckedChange={
                                                          field.onChange
                                                        }
                                                      />
                                                    )}
                                                  />

                                                  <Label
                                                    htmlFor={`isFree-${moduleIndex}-${lessonIndex}`}
                                                    className="text-sm md:text-base cursor-pointer"
                                                  >
                                                    Clase gratuita
                                                  </Label>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </SortableItem>
                                      );
                                    },
                                  )}
                                </SortableContext>
                              </DndContext>

                              <Button
                                type="button"
                                variant="outline"
                                disabled={
                                  creatingLessonModuleId === section.id ||
                                  hasReachedLessonLimit
                                }
                                onClick={() =>
                                  handleAddLesson(moduleIndex, section.id)
                                }
                                className="mt-2 text-sm md:text-base"
                              >
                                {creatingLessonModuleId === section.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando lección...
                                  </>
                                ) : (
                                  <>
                                    <Plus className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                                    Añadir Lección
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="pb-3">
                            {/* quizzes */}
                            <ModuleQuizzes moduleId={section.id} />
                          </div>
                        </div>
                      </Card>
                    )}
                  </SortableItem>
                );
              })}
            </SortableContext>
          </DndContext>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddModule}
            disabled={isCreatingModule || hasReachedModuleLimit}
            className="mt-4 mx-4 md:mx-20 lg:mx-80 dark:bg-card bg-white font-poppins hover:text-[#A7A7A7] py-4 md:py-5 lg:py-7 text-sm md:text-base"
          >
            {isCreatingModule ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando módulo...
              </>
            ) : (
              <>
                <Plus className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                Añadir Módulo
              </>
            )}
          </Button>
          <div className="px-4 text-center text-xs text-muted-foreground">
            <span>
              Módulos: {moduleCount}/
              {COURSE_STRUCTURE_LIMITS.MAX_MODULES_PER_COURSE}
            </span>
            {hasReachedModuleLimit && (
              <p className="mt-1">{courseStructureLimitMessages.modules}</p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
