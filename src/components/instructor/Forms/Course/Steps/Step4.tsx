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
import { Progress } from "@/components/ui/progress-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  descriptionModuleCourseLimit,
  sectionBackgrounds,
  titleMaxModuleAndLessonsCourseLimit,
  titleMinModuleAndLessonsMaxCourseLimit,
} from "@/constants";
import {
  CourseModuleFormValues,
  LessonFormValues,
  LessonUploadState,
  NewCourseFormValues,
} from "@/types/course.types";
import MuxPlayer from "@mux/mux-player-react";
import {
  CheckCircle,
  FileText,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useState } from "react";
import {
  Control,
  Controller,
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
  getMuxUploadStatus,
  saveLessonVideoToCourse,
} from "@/api/videoEndpoints";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Props {
  courseId: string;
  modules: CourseModuleFormValues[];
  register: UseFormRegister<NewCourseFormValues>;
  watch: UseFormWatch<NewCourseFormValues>;
  removeModule: any;
  handleRemoveLesson: any;
  setValue: UseFormSetValue<NewCourseFormValues>;
  handleLessonTypeChange: any;
  lessonTypes: any;
  control: Control<NewCourseFormValues>;
  priceDB: string | undefined;
}

export const Step4 = ({
  courseId,
  modules,
  // register,
  // watch,
  removeModule,
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
  const [replacingLessonId, setReplacingLessonId] = useState<string | null>(
    null,
  );

  const {
    watch,
    setValue,
    formState: { errors },
    control,
    register,
  } = useFormContext<NewCourseFormValues>();

  const handleAddModule = async () => {
    if (isCreatingModule) return;

    try {
      setIsCreatingModule(true);

      const res = await createCourseModule(courseId);
      if (!res.success) return;

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
    if (creatingLessonModuleId === moduleId) return;

    try {
      setCreatingLessonModuleId(moduleId);

      const res = await createCourseLesson(moduleId);

      if (!res.success) return;

      const lesson = res.data;

      const currentLessons = watch(`modules.${moduleIndex}.lessons`) || [];

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
    try {
      setDeletingLessonId(lessonId);

      const res = await deleteCourseLesson(lessonId);
      if (!res.success) return;

      const currentLessons = watch(`modules.${moduleIndex}.lessons`) || [];

      const updatedLessons = currentLessons.filter(
        (_: any, index: number) => index !== lessonIndex,
      );

      // Reordenar en frontend
      const reordered = updatedLessons.map((l: any, i: number) => ({
        ...l,
        order: i,
      }));

      setValue(`modules.${moduleIndex}.lessons`, reordered);
    } catch (error) {
      console.error("Error eliminando lección", error);
    } finally {
      setDeletingLessonId(null);
    }
  };

  const handleLessonVideoUpload = async (
    file: File,
    lessonId: string,
    lessonIndex: number,
    moduleIndex: number,
  ) => {
    setValue(
      `modules.${moduleIndex}.lessons.${lessonIndex}.muxPlaybackId`,
      null,
      { shouldDirty: true },
    );
    // 1) crear direct upload
    setLessonUploads((prev) => ({
      ...prev,
      [lessonId]: { progress: 0, status: "Subiendo…" },
    }));
    const res = await createLessonDirectUpload(lessonId);

    if (!res.success) return;

    const { uploadUrl, uploadId } = res.data;

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", uploadUrl);

      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          console.log("Progreso:", progress + "%");

          setLessonUploads((prev) => ({
            ...prev,
            [lessonId]: {
              ...prev[lessonId],
              progress,
            },
          }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject("Error subiendo archivo a Mux");
        }
      };

      xhr.onerror = () => reject("Error en la subida");

      xhr.send(file);
    });

    // 3) esperar asset
    let playbackId: string | null = null;
    let assetId: string | null = null;

    setLessonUploads((prev) => ({
      ...prev,
      [lessonId]: {
        progress: 100,
        status: "Procesando el video, esto puede tardar varios minutos…",
      },
    }));

    while (!assetId) {
      const status = await getMuxUploadStatus(uploadId);
      console.log("getMuxUploadStatus res:", status);
      if (!status.success) return;

      if (status.status === "ready") {
        // if (status.status === "asset_created") {
        assetId = status.assetId;
        playbackId = status.playbackId;
      } else {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    // 4) confirmar backend
    await saveLessonVideoToCourse(lessonId, uploadId);

    setValue(
      `modules.${moduleIndex}.lessons.${lessonIndex}.muxPlaybackId`,
      playbackId,
      { shouldDirty: true },
    );

    setLessonUploads((prev) => ({
      ...prev,
      [lessonId]: {
        progress: 100,
        status: "¡Video guardado!",
      },
    }));
  };

  const handleDeleteLessonVideo = async (
    lessonId: string,
    moduleIndex: number,
    lessonIndex: number,
  ) => {
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
          {modules.map((section, moduleIndex) => {
            const sectionBgColor =
              sectionBackgrounds[moduleIndex % sectionBackgrounds.length];

            return (
              <Card
                key={section.formId}
                className="bg-white text-black border-slate-400"
              >
                <div
                  className={`flex flex-col ${sectionBgColor} px-2 md:px-3 rounded-[13px]`}
                >
                  <span className="font-poppins font-semibold text-sm md:text-base pt-3">
                    Módulo {moduleIndex + 1}
                  </span>
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
                            value: titleMinModuleAndLessonsMaxCourseLimit,
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
                            disabled={deletingModuleId === section.id}
                            className="ml-2"
                          >
                            {deletingModuleId === section.id ? (
                              <span className="text-sm text-muted-foreground">
                                Eliminando…
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
                              Este módulo y todas las lecciones que contiene
                              serán eliminadas de forma permanente.
                              <br />
                              Incluye videos, materiales y todo su contenido.
                              <br />
                              <strong>Esta acción no se puede deshacer.</strong>
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          {/* Confirmación por texto */}
                          <div className="space-y-2">
                            <p className="text-sm">
                              Escribí <strong>ELIMINAR</strong> para confirmar
                            </p>

                            <Input
                              type="text"
                              value={confirmText}
                              onChange={(e) => setConfirmText(e.target.value)}
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
                                ? "Eliminando…"
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
                      {...register(`modules.${moduleIndex}.description`, {
                        minLength: {
                          value: 10,
                          message:
                            "La descripción debe tener al menos 10 caracteres",
                        },
                        maxLength: {
                          value: descriptionModuleCourseLimit,
                          message: `La descripción no puede superar los ${descriptionModuleCourseLimit} caracteres`,
                        },
                      })}
                    />

                    {errors.modules?.[moduleIndex]?.description?.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.modules?.[moduleIndex]?.description?.message}
                      </p>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {descriptionModuleCourseLimit -
                        (watch(`modules.${moduleIndex}.description`)?.length ||
                          0)}{" "}
                      caracteres restantes
                    </span>
                    <div className="space-y-3 md:space-y-4">
                      {watch(`modules.${moduleIndex}.lessons`)?.map(
                        (lesson: LessonFormValues, lessonIndex: number) => {
                          const playbackId = watch(
                            `modules.${moduleIndex}.lessons.${lessonIndex}.muxPlaybackId`,
                          );
                          const upload = lessonUploads[lesson.id];
                          return (
                            <div
                              key={lessonIndex}
                              className="border border-slate-400 px-2 md:px-3 rounded-md py-2"
                            >
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
                                      disabled={deletingLessonId === lesson.id}
                                      className="ml-2"
                                    >
                                      {deletingLessonId === lesson.id ? (
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
                                        La lección se eliminará de forma
                                        permanente.
                                        <br />
                                        Esto incluye el video y cualquier
                                        material asociado.
                                        <br />
                                        Esta acción no se puede deshacer.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                      <AlertDialogCancel
                                        disabled={
                                          deletingLessonId === lesson.id
                                        }
                                      >
                                        Cancelar
                                      </AlertDialogCancel>

                                      <AlertDialogAction
                                        variant="destructive"
                                        disabled={
                                          deletingLessonId === lesson.id
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
                              </div>
                              {errors.modules?.[moduleIndex]?.lessons?.[
                                lessonIndex
                              ]?.title?.message && (
                                <p className="text-red-500 text-sm my-1">
                                  {
                                    errors.modules?.[moduleIndex]?.lessons?.[
                                      lessonIndex
                                    ]?.title?.message
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
                                        "relative flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-400 p-4 text-sm transition cursor-pointer",
                                        lesson.type === "videoFile"
                                          ? "border-primary bg-primary/10 ring-2 ring-primary"
                                          : "hover:border-muted-foreground/40",
                                      )}
                                    >
                                      {lesson.type === "videoFile" && (
                                        <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-primary" />
                                      )}

                                      <Video className="w-6 h-6" />
                                      <span className="font-medium">Video</span>
                                    </button>

                                    {/* TEXTO */}
                                    <button
                                      type="button"
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
                                        "relative flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-400 p-4 text-sm transition cursor-pointer",
                                        lesson.type === "content"
                                          ? "border-primary bg-primary/10 ring-2 ring-primary"
                                          : "hover:border-muted-foreground/40",
                                      )}
                                    >
                                      {lesson.type === "content" && (
                                        <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-primary" />
                                      )}

                                      <FileText className="w-6 h-6" />
                                      <span className="font-medium">Texto</span>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* ========= CONTENT ========= */}
                              {lesson.type === "content" && (
                                <RichTextEditor
                                  value={
                                    watch(
                                      `modules.${moduleIndex}.lessons.${lessonIndex}.content`,
                                    ) as string
                                  }
                                  onChange={(html) =>
                                    setValue(
                                      `modules.${moduleIndex}.lessons.${lessonIndex}.content`,
                                      html,
                                    )
                                  }
                                />
                              )}

                              {/* ========= VIDEO ========= */}
                              {lesson.type === "videoFile" && (
                                <div className="space-y-2">
                                  {/* ===== PROGRESO ===== */}
                                  {upload && upload.progress > 0 && (
                                    <div className="space-y-3 max-w-sm w-full mx-auto">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold">
                                          Subiendo video
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {upload.status}
                                        </span>
                                      </div>

                                      <Progress
                                        value={upload.progress}
                                        showValue
                                        size="sm"
                                      />
                                    </div>
                                  )}

                                  {/* ===== VIDEO EXISTENTE ===== */}
                                  {playbackId &&
                                    replacingLessonId !== lesson.id && (
                                      <>
                                        <div className="aspect-video w-full max-w-lg rounded-xl overflow-hidden">
                                          <MuxPlayer
                                            key={playbackId}
                                            playbackId={playbackId}
                                            className="w-full h-full"
                                            accentColor="#20ab9f"
                                          />
                                        </div>

                                        <div className="flex gap-2">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                              setReplacingLessonId(lesson.id)
                                            }
                                          >
                                            Reemplazar video
                                          </Button>

                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button
                                                variant="destructive"
                                                type="button"
                                                disabled={
                                                  deletingVideoLesson ===
                                                  lesson.id
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
                                                  ¿Eliminar el video de esta
                                                  lección?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  El video se eliminará de forma
                                                  permanente de esta lección.
                                                  <br />
                                                  Esta acción no se puede
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
                                                  Sí, eliminar video
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </div>
                                      </>
                                    )}

                                  {/* ===== SUBIDA ===== */}
                                  {(!playbackId ||
                                    replacingLessonId === lesson.id) && (
                                    <div className="flex">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={() =>
                                          document
                                            .getElementById(
                                              `lesson-video-${moduleIndex}-${lessonIndex}`,
                                            )
                                            ?.click()
                                        }
                                      >
                                        <Upload className="w-4 h-4" />
                                        Subir video
                                      </Button>

                                      <input
                                        id={`lesson-video-${moduleIndex}-${lessonIndex}`}
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;

                                          await handleLessonVideoUpload(
                                            file,
                                            lesson.id,
                                            lessonIndex,
                                            moduleIndex,
                                          );

                                          setReplacingLessonId(null);
                                          e.target.value = "";
                                        }}
                                      />

                                      {playbackId && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          onClick={() =>
                                            setReplacingLessonId(null)
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
                                  existingMaterial={
                                    lesson.lessonMaterial?.[0] ?? null
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
                                        onCheckedChange={field.onChange}
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
                          );
                        },
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        disabled={creatingLessonModuleId === section.id}
                        onClick={() => handleAddLesson(moduleIndex, section.id)}
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
            );
          })}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddModule}
            disabled={isCreatingModule}
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
        </div>
      </ScrollArea>
    </div>
  );
};
