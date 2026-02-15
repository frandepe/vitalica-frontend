import { CirclesImg } from "@/components/Banners/HeaderBanner";
import { Step1 } from "@/components/Instructor/Forms/Course/Steps/Step1";
import { Step, Stepper } from "@/components/Instructor/Stepper";
import { Form } from "@/components/ui/form";
import {
  ICourse,
  LessonFormValues,
  NewCourseFormValues,
} from "@/types/course.types";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import banner1 from "/Banners/banner4.jpg";
import mask01 from "@/assets/Masks/mask-20.svg";
import { Step2 } from "@/components/Instructor/Forms/Course/Steps/Step2";
import { Step3 } from "@/components/Instructor/Forms/Course/Steps/Step3";
import { Step4 } from "@/components/Instructor/Forms/Course/Steps/Step4";
import { Step5 } from "@/components/Instructor/Forms/Course/Steps/Step5";
import { Step6 } from "@/components/Instructor/Forms/Course/Steps/Step6";
import {
  BookOpenCheck,
  ClipboardCheck,
  FileText,
  HandCoins,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCourseById,
  saveCourseAsDraft,
  saveCourseThumbnail,
  submitCourseForReview,
} from "@/api";
import { useBackendErrors } from "@/hooks/useBackendErrors";
import { useToast } from "@/components/ui/toast";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";
import { getValidationIssues } from "@/utils/course-validations";
import { Badge } from "@/components/ui/badge";
import {
  createPromoVideoDirectUpload,
  getMuxUploadStatus,
  savePromoVideoToCourse,
} from "@/api/videoEndpoints";

// TODO: (Posible TODO)
// click siguiente →
//   si isDirty → guardar
//   si no → avanzar

interface LessonTypes {
  [sectionIndex: number]: {
    [lessonIndex: number]: string;
  };
}

export default function EditCourse() {
  const [lessonTypes, setLessonTypes] = useState<LessonTypes>({});
  const [isLoading, setIsLoading] = useState(false);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<ICourse | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { setBackendErrors, getGeneralErrors, clearErrors } =
    useBackendErrors();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const defaultValues: NewCourseFormValues = {
    title: "",
    description: "",
    tags: [],
    specialty: null,
    modules: [
      {
        id: "",
        title: "",
        description: "",
        order: 0,
        lessons: [
          {
            id: "",
            title: "",
            content: "",
            type: null,
            isFree: false,
            order: 0,
            muxPlaybackId: null,
          },
        ],
      },
    ],
    level: null,
    durationHours: 0,
    durationMinutes: 0,
    price: 0,
    currency: "ARS",
    quizzes: [],
  };

  const form = useForm<NewCourseFormValues>({
    defaultValues,
  });
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
  } = form;

  const { fields: modules, remove: removeModule } = useFieldArray({
    control,
    name: "modules",
    keyName: "formId",
  });

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const response = await getCourseById(courseId);
        if (response.success && response.data) {
          setCourseData(response.data as ICourse);
        }
        console.log("data", response);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, reset]);

  // Prellenar formulario si ya hay datos
  useEffect(() => {
    if (courseData) {
      reset({
        ...courseData,
      });
    }
  }, [courseData, reset]);

  const handleLessonTypeChange = (
    sectionIndex: number,
    lessonIndex: number,
    type: string,
  ) => {
    setLessonTypes((prev: LessonTypes) => ({
      ...prev,
      [sectionIndex]: {
        ...prev[sectionIndex],
        [lessonIndex]: type,
      },
    }));
  };

  const handleRemoveLesson = (moduleIndex: number, lessonIndex: number) => {
    const currentLessons = watch(`modules.${moduleIndex}.lessons`);
    const updatedLessons = currentLessons?.filter(
      (_: LessonFormValues, index: number) => index !== lessonIndex,
    );
    setValue(`modules.${moduleIndex}.lessons`, updatedLessons);
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const { durationHours, durationMinutes, ...rest } = data;

      const payload = {
        ...rest,
        duration: durationHours * 60 + durationMinutes,
      };

      await saveCourseAsDraft(payload);

      const res = await submitCourseForReview(courseId!);

      console.log("resultado de submit", res);
      if (res.errors && res.errors.length > 0) {
        setBackendErrors(res.errors);
        return;
      }

      if (
        res.message ===
        "El curso ya fue enviado a revisión y no puede modificarse ni reenviarse hasta que finalice el proceso"
      ) {
        showToast(
          "El curso ya fue enviado a revisión y no puede modificarse ni reenviarse hasta que finalice el proceso",
          "info",
          "top-right",
        );
      }

      if (res.success) {
        navigate(`/estado-curso/${courseId}`);
      }
      clearErrors();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al guardar el curso");
    } finally {
      setIsLoading(false);
    }
  });

  const onSubmitDraft = handleSubmit(async (data) => {
    setIsLoading(true);

    const { durationHours, durationMinutes, ...rest } = data;

    const payload = {
      ...rest,
      duration: durationHours * 60 + durationMinutes,
    };

    try {
      const res = await saveCourseAsDraft(payload);
      console.log("res", res);

      if (res.errors && res.errors.length > 0) {
        setBackendErrors(res.errors);
        return;
      }
      if (res.success) {
        showToast("Borrador guardado", "success", "top-right");
      }
      clearErrors();
    } catch (error) {
      console.error("Error guardando borrador:", error);
    } finally {
      setIsLoading(false);
    }
  });

  const validationIssues = getValidationIssues(courseData!);
  const errorCount = validationIssues.filter((i) => i.type === "error").length;
  const warningCount = validationIssues.filter(
    (i) => i.type === "warning",
  ).length;
  const totalLessons = courseData?.modules!.reduce(
    (acc, module) => acc + module.lessons!.length,
    0,
  );
  const completionPercentage = Math.round(
    ((14 - validationIssues.length) / 14) * 100,
  ); // 14 possible fields to complete

  const handleThumbnailReady = async (fileBase64: string) => {
    try {
      const res = await saveCourseThumbnail(courseId!, fileBase64);

      // 2. El backend debe devolver { thumbnailUrl }
      form.setValue("thumbnailUrl", res.data.thumbnailUrl, {
        shouldDirty: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromoVideoUpload = async (file: File) => {
    if (!courseId) return;
    try {
      // 1) Crear Direct Upload
      setUploadProgress(0);
      setUploadStatus("Preparando subida…");

      const res1 = await createPromoVideoDirectUpload(courseId);

      if (!res1.success) {
        console.error(res1.message);
        return;
      }

      const { uploadUrl, uploadId } = res1.data;

      // 2) Subir archivo a Mux con barra de progreso
      setUploadStatus("Subiendo video…");

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("PUT", uploadUrl);

        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            console.log("Progreso:", progress + "%");

            // llamá a tu hook o setState
            setUploadProgress(progress);
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

      // El paso dos se puede reemplazar con esto:
      // await fetch(uploadUrl, {
      //   method: "PUT",
      //   headers: { "Content-Type": file.type },
      //   body: file,
      // });
      // pero no me permite trackear el progreso fácilmente.

      // 3) Mostrar feedback mientras Mux procesa
      setUploadStatus("Procesando el video, por favor no cierre la página…");

      let playbackId: string | null = null;
      let assetId: string | null = null;

      while (!assetId) {
        const statusRes = await getMuxUploadStatus(uploadId);

        if (!statusRes.success) {
          console.error(statusRes.message);
          return;
        }

        if (statusRes.status === "asset_created") {
          assetId = statusRes.assetId;
          playbackId = statusRes.playbackId;
        } else {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }

      // 4) Confirmar en backend
      setUploadStatus("Guardando video…");
      const res2 = await savePromoVideoToCourse(courseId, uploadId);

      if (!res2.success) {
        console.error(res2.message);
        return;
      }

      // 5) Actualizar formulario
      form.setValue("muxPromoAssetId", assetId, { shouldDirty: true });

      if (playbackId) {
        form.setValue("muxPlaybackId", playbackId, { shouldDirty: true });
      }

      setUploadStatus("¡Video guardado!");
      setUploadProgress(100);
    } catch (err) {
      console.error(err);
      setUploadStatus("Ocurrió un error al subir el video");
    }
  };

  if (isLoading) return <GlobalLoading text="Autoguardado..." />;

  if (
    courseData &&
    ["PUBLISHED", "ARCHIVED", "UNDER_REVIEW"].includes(courseData.status)
  ) {
    showToast(
      "No podés editar este curso en su estado actual",
      "warning",
      "bottom-right",
    );
    navigate("/");
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold">Crea un nuevo curso</h2>
      <Form {...form}>
        <Stepper
          className="mt-8"
          initialStep={1}
          onStepChange={(step) => {
            console.log("Current step:", step);
          }}
          onFinalStepCompleted={onSubmit}
          onSaveToDraft={onSubmitDraft}
          isDirty={isDirty}
          backButtonText="Atrás"
          nextButtonText="Siguiente"
          errorCount={errorCount}
        >
          <Step>
            <h2 className="text-xl font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <FileText />
              Información básica
            </h2>
            <div className="flex flex-col xl:flex-row">
              <Step1 watch={watch} register={register} errors={errors} />
              <div className="xl:flex justify-center w-full hidden">
                <CirclesImg
                  className="hidden lg:block"
                  maskSrc={mask01}
                  imgCircles={banner1}
                />
              </div>
            </div>
          </Step>
          <Step>
            <Step2
              onThumbnailReady={handleThumbnailReady}
              onPromoVideoUpload={handlePromoVideoUpload}
              uploadProgress={uploadProgress}
              uploadStatus={uploadStatus}
            />
          </Step>
          <Step>
            <h2 className="text-xl font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <HandCoins />
              Detalles comerciales
            </h2>
            <Step3
              register={register}
              priceDB={courseData?.price?.toString()}
            />
          </Step>
          <Step>
            <h2 className="text-xl font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <BookOpenCheck />
              Módulos y lecciones
            </h2>
            <Step4
              courseId={courseId!}
              handleLessonTypeChange={handleLessonTypeChange}
              handleRemoveLesson={handleRemoveLesson}
              lessonTypes={lessonTypes}
              modules={modules}
              register={register}
              removeModule={removeModule}
              setValue={setValue}
              watch={watch}
              control={control}
              priceDB={courseData?.price?.toString()}
            />
          </Step>
          <Step>
            <h2 className="text-xl font-semibold text-slate-700 flex gap-2 mb-2">
              <ClipboardCheck /> Examen final del curso
            </h2>
            <div className="min-h-[60vh]">
              <Step5 courseId={courseId!} />
            </div>
          </Step>
          <Step>
            <h2 className="text-xl font-semibold text-slate-700 flex gap-2 mb-2">
              Vista previa y publicación
            </h2>
            <Step6
              course={courseData!}
              completionPercentage={completionPercentage}
              totalLessons={totalLessons}
              warningCount={warningCount}
              errorCount={errorCount}
              validationIssues={validationIssues}
            />
          </Step>
        </Stepper>
      </Form>
      {getGeneralErrors?.()?.length > 0 && (
        <Badge variant="warning" className="p-2">
          <ul>
            {getGeneralErrors().map((msg, i) => (
              <li key={i} className="text-red-600 text-sm mb-2 ml-4">
                {msg}
              </li>
            ))}
          </ul>
        </Badge>
      )}
    </div>
  );
}
