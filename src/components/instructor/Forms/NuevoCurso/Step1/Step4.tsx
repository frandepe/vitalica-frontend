import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  CourseModuleFormValues,
  LessonFormValues,
  LessonType,
  NewCourseFormValues,
} from "@/types/course.types";
import { ClipboardPenLine, Plus, Trash } from "lucide-react";
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface Props {
  modules: CourseModuleFormValues[];
  register: UseFormRegister<NewCourseFormValues>;
  watch: UseFormWatch<NewCourseFormValues>;
  removeModule: any;
  handleRemoveLesson: any;
  setValue: UseFormSetValue<NewCourseFormValues>;
  handleLessonTypeChange: any;
  lessonTypes: any;
  addModule: any;
  control: Control<NewCourseFormValues>;
}
const sectionBackgrounds = [
  "bg-secondary/20",
  "bg-primary/20",
  "bg-yellow-100",
  "bg-pink-100",
  "bg-purple-100",
];

export const Step4 = ({
  modules,
  register,
  watch,
  removeModule,
  handleRemoveLesson,
  setValue,
  handleLessonTypeChange,
  lessonTypes,
  addModule,
  control,
}: Props) => {
  return (
    <div>
      <ScrollArea className="flex-grow">
        <div className="flex flex-col gap-4 md:gap-5">
          {modules.map((section, moduleIndex) => {
            const sectionBgColor =
              sectionBackgrounds[moduleIndex % sectionBackgrounds.length];

            return (
              <Card
                key={section.id}
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
                        variant="ghost"
                        onClick={() => removeModule(moduleIndex)}
                        className="ml-2 hover:bg-secondary"
                      >
                        <Trash className="text-red-500 hover:text-white w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      {watch(`modules.${moduleIndex}.lessons`)?.map(
                        (_: LessonFormValues, lessonIndex: number) => (
                          <div
                            key={lessonIndex}
                            className="border border-slate-400 px-2 md:px-3 rounded-md py-2"
                          >
                            <p className="pb-2 md:pb-3 text-sm md:text-base">
                              Lección {lessonIndex + 1}
                            </p>
                            <div className="flex justify-between gap-3 md:gap-5 items-center">
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
                                variant="ghost"
                                onClick={() =>
                                  handleRemoveLesson(moduleIndex, lessonIndex)
                                }
                                className="ml-2"
                              >
                                <Trash className="text-red-500 hover:text-white w-4 h-4 md:w-5 md:h-5" />
                              </Button>
                            </div>
                            <div className="py-2 md:py-3">
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
                                defaultValue="none"
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar tipo de contenido" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none" disabled>
                                    Selecciona el tipo de contenido
                                  </SelectItem>
                                  <SelectItem value="videoFile">
                                    Video
                                  </SelectItem>
                                  <SelectItem value="content">Texto</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {lessonTypes[moduleIndex]?.[lessonIndex] ===
                            undefined ? null : lessonTypes[moduleIndex]?.[
                                lessonIndex
                              ] === "content" ? (
                              <>
                                {/* react-mde + showdown + dompurify */}

                                <Input
                                  {...register(
                                    `modules.${moduleIndex}.lessons.${lessonIndex}.content`
                                  )}
                                  placeholder="Ingresar texto"
                                  className="dark:bg-background bg-white mb-2 md:mb-3 text-sm md:text-base"
                                />
                              </>
                            ) : (
                              <div className="pb-3">
                                {/* videoFile */}
                                <Button
                                  onClick={() =>
                                    alert(
                                      "subir video, se gaurda automaticamente el curso al subirlo. Es un endpoint nuevo"
                                    )
                                  }
                                >
                                  Subir video
                                </Button>
                              </div>
                            )}
                            <div className="pb-3">
                              {/* lessonMaterial */}

                              <Button
                                variant="link"
                                className="flex items-center gap-2 p-0"
                                onClick={() =>
                                  alert(
                                    "subir material extra, debe ser pdf y se guarda automaticamente el curso al subirlo. Nuevo endpoint"
                                  )
                                }
                              >
                                <ClipboardPenLine size={16} />
                                Subir material extra
                              </Button>
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
                        )
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setValue(`modules.${moduleIndex}.lessons`, [
                            ...(watch(`modules.${moduleIndex}.lessons`) || []),
                            {
                              title: "",
                              videoFile: "",
                              isFree: false,
                              type: "videoFile", // o "content" según default
                              order:
                                (watch(`modules.${moduleIndex}.lessons`)
                                  ?.length || 0) + 1,
                            },
                          ])
                        }
                        className="mt-2 text-sm md:text-base"
                      >
                        <Plus className="mr-2 w-4 h-4 md:w-5 md:h-5" /> Añadir
                        Lección
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
            onClick={() => addModule({ title: "", lessons: [] })}
            className="mt-4 mx-4 md:mx-20 lg:mx-80 dark:bg-card bg-white font-poppins hover:text-[#A7A7A7] py-4 md:py-5 lg:py-7 text-sm md:text-base"
          >
            <Plus className="mr-2 w-4 h-4 md:w-5 md:h-5" /> Añadir Módulo
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};
