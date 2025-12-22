import {
  confirmLessonVideoUpload,
  createCourseLesson,
  createCourseModule,
  createLessonDirectUpload,
  deleteCourseLesson,
  deleteCourseModule,
  getMuxUploadStatus,
} from "@/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sectionBackgrounds } from "@/constants";
import {
  CourseModuleFormValues,
  LessonFormValues,
  LessonType,
  LessonUploadState,
  NewCourseFormValues,
} from "@/types/course.types";
import MuxPlayer from "@mux/mux-player-react";
import { ClipboardPenLine, Loader2, Plus, Trash } from "lucide-react";
import { useState } from "react";
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import UploadMaterial from "../../UploadMaterial";
import { Separator } from "@/components/ui/separator";

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
}

export const Step4 = ({
  courseId,
  modules,
  register,
  watch,
  removeModule,
  setValue,
  handleLessonTypeChange,
  control,
}: Props) => {
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null);
  const [creatingLessonModuleId, setCreatingLessonModuleId] = useState<
    string | null
  >(null);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [lessonUploads, setLessonUploads] = useState<
    Record<string, LessonUploadState>
  >({});
  const [replacingLessonId, setReplacingLessonId] = useState<string | null>(
    null
  );

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
    lessonId: string
  ) => {
    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar esta lección?\nSe perderá todo su contenido."
    );

    if (!confirmDelete) return;

    try {
      setDeletingLessonId(lessonId);

      const res = await deleteCourseLesson(lessonId);
      if (!res.success) return;

      const currentLessons = watch(`modules.${moduleIndex}.lessons`) || [];

      const updatedLessons = currentLessons.filter(
        (_: any, index: number) => index !== lessonIndex
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
    moduleIndex: number
  ) => {
    setValue(
      `modules.${moduleIndex}.lessons.${lessonIndex}.muxPlaybackId`,
      null,
      { shouldDirty: true }
    );
    // 1) crear direct upload
    setLessonUploads((prev) => ({
      ...prev,
      [lessonId]: { progress: 0, status: "Subiendo…" },
    }));
    const res = await createLessonDirectUpload(lessonId);
    console.log("createLessonDirectUpload res:", res);

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
        status: "Procesando…",
      },
    }));

    while (!assetId) {
      const status = await getMuxUploadStatus(uploadId);
      console.log("getMuxUploadStatus res:", status);
      if (!status.success) return;

      if (status.status === "asset_created") {
        assetId = status.assetId;
        playbackId = status.playbackId;
      } else {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    // 4) confirmar backend
    const resp = await confirmLessonVideoUpload(lessonId, uploadId);
    console.log("confirmLessonVideoUpload res:", resp);

    setValue(
      `modules.${moduleIndex}.lessons.${lessonIndex}.muxPlaybackId`,
      playbackId,
      { shouldDirty: true }
    );

    setLessonUploads((prev) => ({
      ...prev,
      [lessonId]: {
        progress: 100,
        status: "¡Video guardado!",
      },
    }));
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
                className="dark:bg-[#1A1A23] bg-white dark:text-white text-black"
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
                        })}
                        placeholder="Ingrese el título del módulo"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        disabled={deletingModuleId === section.id}
                        onClick={() =>
                          handleDeleteModule(section.id, moduleIndex)
                        }
                        className="ml-2"
                      >
                        {deletingModuleId === section.id ? (
                          <span className="text-sm text-muted-foreground">
                            Eliminando…
                          </span>
                        ) : (
                          <Trash className="text-red-500 hover:text-red-600 w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </Button>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      {watch(`modules.${moduleIndex}.lessons`)?.map(
                        (lesson: LessonFormValues, lessonIndex: number) => {
                          const playbackId = watch(
                            `modules.${moduleIndex}.lessons.${lessonIndex}.muxPlaybackId`
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
                                    { required: true }
                                  )}
                                  placeholder="Ingrese el título de la lección"
                                  className="flex-1 dark:bg-background bg-white text-sm md:text-base"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={deletingLessonId === lesson.id}
                                  onClick={() =>
                                    handleDeleteLesson(
                                      moduleIndex,
                                      lessonIndex,
                                      lesson.id
                                    )
                                  }
                                  className="ml-2"
                                >
                                  {deletingLessonId === lesson.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                  ) : (
                                    <Trash className="text-red-500 hover:text-red-600 w-4 h-4 md:w-5 md:h-5" />
                                  )}
                                </Button>
                              </div>

                              {/* ========= SELECT SOLO SI NO HAY TIPO ========= */}

                              <div className="py-2">
                                <Select
                                  onValueChange={(value: LessonType) => {
                                    setValue(
                                      `modules.${moduleIndex}.lessons.${lessonIndex}.type`,
                                      value
                                    );
                                    handleLessonTypeChange(
                                      moduleIndex,
                                      lessonIndex,
                                      value
                                    );
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={`${
                                        lesson.type
                                          ? lesson.type
                                          : "Seleccionar tipo de contenido"
                                      }`}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="videoFile">
                                      Video
                                    </SelectItem>
                                    <SelectItem value="content">
                                      Texto
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* ========= CONTENT ========= */}
                              {lesson.type === "content" && (
                                <Input
                                  {...register(
                                    `modules.${moduleIndex}.lessons.${lessonIndex}.content`
                                  )}
                                  placeholder="Ingresar texto"
                                  className="mb-3"
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

                                          <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() =>
                                              alert(
                                                "TODO: eliminar video (endpoint + mux)"
                                              )
                                            }
                                          >
                                            Eliminar video
                                          </Button>
                                        </div>
                                      </>
                                    )}

                                  {/* ===== SUBIDA ===== */}
                                  {(!playbackId ||
                                    replacingLessonId === lesson.id) && (
                                    <>
                                      <Button
                                        type="button"
                                        onClick={() =>
                                          document
                                            .getElementById(
                                              `lesson-video-${moduleIndex}-${lessonIndex}`
                                            )
                                            ?.click()
                                        }
                                      >
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
                                            moduleIndex
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
                                          Cancelar
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                              <Separator className="mt-4" />
                              <div className="py-4">
                                {/* lessonMaterial */}
                                <UploadMaterial
                                  lessonId={lesson.id}
                                  existingMaterial={
                                    lesson.lessonMaterial?.[0] ?? null
                                  }
                                />
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <Controller
                                  name={`modules.${moduleIndex}.lessons.${lessonIndex}.isFree`}
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      id={`isFree-${moduleIndex}-${lessonIndex}`}
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  )}
                                />

                                <label
                                  htmlFor={`isFree-${moduleIndex}-${lessonIndex}`}
                                  className="text-sm md:text-base"
                                >
                                  Clase gratuita
                                </label>
                              </div>
                            </div>
                          );
                        }
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
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2"
                      onClick={() =>
                        alert(
                          "subir quizzes para el modulo. Se va a abrir un modal para ahorrar espacio. Nuevo endpoint"
                        )
                      }
                    >
                      <ClipboardPenLine size={16} />
                      Agregar preguntas de evaluación para este módulo
                    </Button>
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
