import { CirclesImg } from "@/components/Banners/HeaderBanner";
import { Step1 } from "@/components/instructor/Forms/Course/Steps/Step1";
import { Step, Stepper } from "@/components/instructor/Stepper";
import { Form } from "@/components/ui/form";
import {
  CoursePublishValidation,
  ICourse,
  ISpecialty,
  LessonFormValues,
  NewCourseFormValues,
} from "@/types/course.types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import banner1 from "/Banners/banner4.jpg";
import mask01 from "@/assets/Masks/mask-20.svg";
import { Step2 } from "@/components/instructor/Forms/Course/Steps/Step2";
import { Step3 } from "@/components/instructor/Forms/Course/Steps/Step3";
import { Step4 } from "@/components/instructor/Forms/Course/Steps/Step4";
import { Step5 } from "@/components/instructor/Forms/Course/Steps/Step5";
import { Step6 } from "@/components/instructor/Forms/Course/Steps/Step6";
import {
  BookOpenCheck,
  ClipboardCheck,
  FileText,
  HandCoins,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCourseById,
  getFinalQuizzes,
  saveCourseAsDraft,
  saveCourseThumbnail,
  submitCourseForReview,
  validateCourseForPublication,
} from "@/api";
import { useBackendErrors } from "@/hooks/useBackendErrors";
import { useToast } from "@/components/ui/toast";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";
import { getValidationIssues } from "@/utils/course-validations";
import { Badge } from "@/components/ui/badge";
import {
  createPromoVideoDirectUpload,
} from "@/api/videoEndpoints";
import { isUploadAbortError } from "@/utils/mux-upload";
import { processAndConfirmPromoVideo } from "@/utils/promo-video-upload";
import MuxVideoUploader, {
  type MuxVideoUploadContext,
  type MuxVideoUploaderHandle,
} from "@/components/Uploads/MuxVideoUploader";
import { useAuth } from "@/hooks/useAuth";
import { SpecialtyLabels } from "@/constants";
import {
  getLocalVideoDurationSeconds,
  isMp4VideoFile,
  MAX_VIDEO_DURATION_ERROR_MESSAGE,
  MAX_VIDEO_DURATION_SECONDS,
  MAX_VIDEO_SIZE_BYTES,
  MAX_VIDEO_SIZE_ERROR_MESSAGE,
  VIDEO_FORMAT_ERROR_MESSAGE,
} from "@/constants/video";
import axios from "axios";
import type { VideoUploadPhase } from "@/types/video-upload.types";
import type { InstructorFinalQuiz } from "@/types/quiz.types";

// TODO: (Posible TODO)
// click siguiente ->
//   si isDirty -> guardar
//   si no -> avanzar

interface LessonTypes {
  [sectionIndex: number]: {
    [lessonIndex: number]: LessonFormValues["type"];
  };
}

type UploadStatus =
  | "Validando archivo..."
  | "Preparando subida..."
  | "Subiendo video..."
  | "Sin conexión. La subida continuará cuando vuelva internet..."
  | "Procesando el video, esto puede tardar varios minutos..."
  | "Guardando video..."
  | "¡Video guardado!"
  | "Ocurrió un error al subir el video";

export default function EditCourse() {
  const [lessonTypes, setLessonTypes] = useState<LessonTypes>({});
  const [isLoading, setIsLoading] = useState(false);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<ICourse | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
    "Preparando subida...",
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [promoUploadPhase, setPromoUploadPhase] =
    useState<VideoUploadPhase>("idle");
  const [isPromoVideoUploading, setIsPromoVideoUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [publishValidation, setPublishValidation] =
    useState<CoursePublishValidation | null>(null);
  const [isPublishValidationLoading, setIsPublishValidationLoading] =
    useState(false);
  const [isFinalQuizMutationPending, setIsFinalQuizMutationPending] =
    useState(false);
  const promoUploadAbortRef = useRef<AbortController | null>(null);
  const promoUploaderRef = useRef<MuxVideoUploaderHandle | null>(null);
  const promoUploadCompletionRef = useRef<(() => void) | null>(null);
  const redirectHandledRef = useRef(false);
  const { setBackendErrors, getGeneralErrors, clearErrors } =
    useBackendErrors();
  const { showToast } = useToast();
  const { instructor } = useAuth();
  const navigate = useNavigate();
  const approvedSpecialtyValues = (instructor?.specialties ??
    []) as ISpecialty[];
  const availableSpecialties = useMemo(
    () =>
      approvedSpecialtyValues.map((value, index) => ({
        id: index + 1,
        value,
        label: SpecialtyLabels[value],
      })),
    [approvedSpecialtyValues],
  );

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

  const {
    fields: modules,
    remove: removeModule,
    move: moveModule,
  } = useFieldArray({
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

  useEffect(() => {
    const selectedSpecialty = watch("specialty");
    if (
      selectedSpecialty &&
      !approvedSpecialtyValues.includes(selectedSpecialty)
    ) {
      setValue("specialty", null, { shouldDirty: true });
    }
  }, [approvedSpecialtyValues, setValue, watch]);

  useEffect(() => {
    return () => {
      promoUploadAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!courseData) return;
    if (redirectHandledRef.current) return;

    if (["PUBLISHED", "ARCHIVED", "UNDER_REVIEW"].includes(courseData.status)) {
      redirectHandledRef.current = true;
      showToast(
        "No podés editar este curso en su estado actual",
        "warning",
        "bottom-right",
      );
      navigate("/");
    }
  }, [courseData, navigate, showToast]);

  useEffect(() => {
    if (currentStep !== 6 || !courseId) return;

    let cancelled = false;

    const loadStep6Data = async () => {
      setIsPublishValidationLoading(true);
      const [quizzesResponse, validationResponse] = await Promise.all([
        getFinalQuizzes(courseId),
        validateCourseForPublication(courseId),
      ]);

      if (cancelled) return;

      if (quizzesResponse.success) {
        setValue("quizzes", quizzesResponse.data || [], {
          shouldDirty: false,
        });
      }

      if (validationResponse.success && validationResponse.data) {
        setPublishValidation(validationResponse.data);
      } else {
        setPublishValidation(null);
      }

      setIsPublishValidationLoading(false);
    };

    loadStep6Data();

    return () => {
      cancelled = true;
    };
  }, [courseId, currentStep, setValue]);

  const handleFinalQuizzesChange = useCallback(
    (quizzes: InstructorFinalQuiz[]) => {
      setValue("quizzes", quizzes, { shouldDirty: false });
    },
    [setValue],
  );

  const handleLessonTypeChange = (
    sectionIndex: number,
    lessonIndex: number,
    type: LessonFormValues["type"],
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
      if (approvedSpecialtyValues.length === 0) {
        setBackendErrors([
          {
            message:
              "No tenes especialidades aprobadas. No podes guardar ni publicar cursos.",
          },
        ]);
        return;
      }

      if (data.specialty && !approvedSpecialtyValues.includes(data.specialty)) {
        setBackendErrors([
          {
            message:
              "La especialidad seleccionada no esta aprobada para tu perfil.",
          },
        ]);
        return;
      }

      const { durationHours, durationMinutes, ...rest } = data;

      const payload = {
        ...rest,
        duration: durationHours * 60 + durationMinutes,
      };

      const resp = await saveCourseAsDraft(payload);
      console.log("resp se gaurda en borrador", resp);

      const validationResponse = await validateCourseForPublication(courseId!);
      if (validationResponse.success && validationResponse.data) {
        setPublishValidation(validationResponse.data);

        console.log("validationResponse.data", validationResponse.data);
        if (!validationResponse.data.isValid) {
          setBackendErrors(
            validationResponse.data.errors.map((message) => ({ message })),
          );
          return;
        }
      }

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
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message
        : err instanceof Error
          ? err.message
          : "Error al guardar el curso";
      alert(errorMessage || "Error al guardar el curso");
    } finally {
      setIsLoading(false);
    }
  });

  const onSubmitDraft = handleSubmit(async (data) => {
    setIsLoading(true);

    if (approvedSpecialtyValues.length === 0) {
      setBackendErrors([
        {
          message:
            "No tenes especialidades aprobadas. No podes guardar ni publicar cursos.",
        },
      ]);
      setIsLoading(false);
      return;
    }

    if (data.specialty && !approvedSpecialtyValues.includes(data.specialty)) {
      setBackendErrors([
        {
          message:
            "La especialidad seleccionada no esta aprobada para tu perfil.",
        },
      ]);
      setIsLoading(false);
      return;
    }

    const { durationHours, durationMinutes, ...rest } = data;

    const payload = {
      ...rest,
      duration: durationHours * 60 + durationMinutes,
    };

    try {
      const res = await saveCourseAsDraft(payload);
      console.log("res.errors", res);

      if (res.errors && res.errors.length > 0) {
        setBackendErrors(res.errors);
        return;
      }
      if (res.success) {
        showToast("Borrador guardado", "success", "top-right");
        reset(data);
      }
      clearErrors();
    } catch (error) {
      console.error("Error guardando borrador:", error);
    } finally {
      setIsLoading(false);
    }
  });

  const watchedCourseValues = watch();
  const previewCourse = useMemo<ICourse | null>(() => {
    if (!courseData) return null;

    const durationInMinutes =
      (watchedCourseValues.durationHours || 0) * 60 +
      (watchedCourseValues.durationMinutes || 0);

    return {
      ...courseData,
      ...watchedCourseValues,
      level: watchedCourseValues.level ?? undefined,
      duration: durationInMinutes,
      modules: watchedCourseValues.modules as ICourse["modules"],
      quizzes: watchedCourseValues.quizzes as ICourse["quizzes"],
    };
  }, [courseData, watchedCourseValues]);

  const minimumFinalQuizQuestions =
    publishValidation?.minimumFinalQuizQuestions ?? 5;
  const validationIssues = getValidationIssues(
    previewCourse,
    minimumFinalQuizQuestions,
  );
  const errorCount = validationIssues.filter((i) => i.type === "error").length;
  const warningCount = validationIssues.filter(
    (i) => i.type === "warning",
  ).length;
  const totalLessons =
    previewCourse?.modules?.reduce(
      (acc, module) => acc + (module.lessons?.length || 0),
      0,
    ) ?? 0;
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

  const createPromoDirectUploadForUploader = useCallback(
    async (file: File) => {
      if (!courseId) throw new Error("COURSE_ID_REQUIRED");

      const response = await createPromoVideoDirectUpload(courseId, file);
      if (!response.success || !response.data) {
        throw new Error(response.message || "MUX_DIRECT_UPLOAD_FAILED");
      }

      return response.data;
    },
    [courseId],
  );

  const finishPromoUploadOperation = useCallback(() => {
    promoUploadCompletionRef.current?.();
    promoUploadCompletionRef.current = null;
  }, []);

  const handlePromoTransferComplete = useCallback(
    async ({ uploadId }: Required<MuxVideoUploadContext>) => {
      if (!courseId) return;

      const abortController = new AbortController();
      promoUploadAbortRef.current?.abort();
      promoUploadAbortRef.current = abortController;

      try {
        setPromoUploadPhase("processing");
        setUploadProgress(100);
        setUploadStatus(
          "Procesando el video, esto puede tardar varios minutos...",
        );

        const { assetId, playbackId, confirmation: response } =
          await processAndConfirmPromoVideo({
            courseId,
            uploadId,
            signal: abortController.signal,
            onReadyToConfirm: () => {
              setPromoUploadPhase("confirming");
              setUploadStatus("Guardando video...");
            },
          });

        if (!response.success) {
          setUploadProgress(0);
          setPromoUploadPhase("error");
          setUploadStatus("Ocurrió un error al subir el video");
          showToast(
            response.message || "Ocurrió un error al validar el video",
            "warning",
            "top-right",
          );
          return;
        }

        form.setValue("muxPromoAssetId", assetId, { shouldDirty: true });
        if (playbackId) {
          form.setValue("muxPlaybackId", playbackId, { shouldDirty: true });
        }

        setUploadStatus("¡Video guardado!");
        setPromoUploadPhase("ready");
        setUploadProgress(100);
        setIsPromoVideoUploading(false);
        finishPromoUploadOperation();
      } catch (error) {
        console.error(error);
        if (isUploadAbortError(error)) return;
        setUploadProgress(0);
        setPromoUploadPhase("error");
        setUploadStatus("Ocurrió un error al subir el video");
      } finally {
        if (promoUploadAbortRef.current === abortController) {
          promoUploadAbortRef.current = null;
        }
      }
    },
    [courseId, finishPromoUploadOperation, form, showToast],
  );

  const handlePromoUploaderError = useCallback((error: Error) => {
    console.error(error);
    setUploadProgress(0);
    setPromoUploadPhase("error");
    setUploadStatus("Ocurrió un error al subir el video");
  }, []);

  const handlePromoVideoUpload = async (file: File) => {
    if (!courseId) return;
    setIsPromoVideoUploading(true);
    setPromoUploadPhase("validating");
    setUploadProgress(0);
    setUploadStatus("Validando archivo...");

    if (!isMp4VideoFile(file)) {
      setUploadProgress(0);
      setPromoUploadPhase("idle");
      setIsPromoVideoUploading(false);
      showToast(VIDEO_FORMAT_ERROR_MESSAGE, "warning", "top-right");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      setUploadProgress(0);
      setPromoUploadPhase("idle");
      setIsPromoVideoUploading(false);
      showToast(MAX_VIDEO_SIZE_ERROR_MESSAGE, "warning", "top-right");
      return;
    }

    const durationSeconds = await getLocalVideoDurationSeconds(file);
    if (
      durationSeconds !== null &&
      durationSeconds > MAX_VIDEO_DURATION_SECONDS
    ) {
      setUploadProgress(0);
      setPromoUploadPhase("idle");
      setIsPromoVideoUploading(false);
      showToast(MAX_VIDEO_DURATION_ERROR_MESSAGE, "warning", "top-right");
      return;
    }

    promoUploadAbortRef.current?.abort();
    promoUploaderRef.current?.abort();
    finishPromoUploadOperation();

    setPromoUploadPhase("preparing");
    setUploadProgress(0);
    setUploadStatus("Preparando subida...");

    await new Promise<void>((resolve) => {
      promoUploadCompletionRef.current = resolve;
      promoUploaderRef.current?.start(file);
    });
  };

  const handleRetryPromoVideoUpload = () => {
    promoUploadAbortRef.current?.abort();
    promoUploadAbortRef.current = null;
    setUploadProgress(0);
    setPromoUploadPhase("preparing");
    setUploadStatus("Preparando subida...");
    promoUploaderRef.current?.retry();
  };

  const handleCancelPromoVideoUpload = () => {
    promoUploadAbortRef.current?.abort();
    promoUploadAbortRef.current = null;
    promoUploaderRef.current?.abort();
    setUploadProgress(0);
    setPromoUploadPhase("idle");
    setUploadStatus("Preparando subida...");
    setIsPromoVideoUploading(false);
    finishPromoUploadOperation();
  };

  if (isLoading) return <GlobalLoading text="Autoguardado..." />;

  return (
    <div className="my-8">
      <MuxVideoUploader
        ref={promoUploaderRef}
        createDirectUpload={createPromoDirectUploadForUploader}
        onPhaseChange={(phase) => {
          if (phase === "preparing") {
            setPromoUploadPhase("preparing");
            setUploadStatus("Preparando subida...");
          }
          if (phase === "uploading") {
            setPromoUploadPhase("uploading");
            setUploadStatus("Subiendo video...");
          }
          if (phase === "offline") {
            setPromoUploadPhase("offline");
            setUploadStatus(
              "Sin conexión. La subida continuará cuando vuelva internet...",
            );
          }
        }}
        onProgress={(progress) => setUploadProgress(Math.round(progress))}
        onTransferComplete={handlePromoTransferComplete}
        onError={handlePromoUploaderError}
      />
      <h2 className="text-2xl font-semibold">Crea un nuevo curso</h2>
      <Form {...form}>
        <Stepper
          className="mt-8"
          initialStep={1}
          onStepChange={setCurrentStep}
          onFinalStepCompleted={onSubmit}
          onSaveToDraft={onSubmitDraft}
          isDirty={isDirty}
          backButtonText="Atrás"
          nextButtonText="Siguiente"
          errorCount={errorCount}
          nextButtonProps={{
            disabled:
              (currentStep === 5 && isFinalQuizMutationPending) ||
              (currentStep === 6 &&
                (isPublishValidationLoading || errorCount > 0)),
          }}
        >
          <Step>
            <h2 className="text-xl font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <FileText />
              Información básica
            </h2>
            <div className="flex flex-col xl:flex-row">
              <Step1
                watch={watch}
                register={register}
                errors={errors}
                control={control}
                availableSpecialties={availableSpecialties}
              />
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
              onCancelPromoVideoUpload={handleCancelPromoVideoUpload}
              onRetryPromoVideoUpload={handleRetryPromoVideoUpload}
              isPromoVideoUploading={isPromoVideoUploading}
              uploadPhase={promoUploadPhase}
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
              moveModule={moveModule}
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
              <Step5
                courseId={courseId!}
                onQuizzesChange={handleFinalQuizzesChange}
                onPendingChange={setIsFinalQuizMutationPending}
              />
            </div>
          </Step>
          <Step>
            <h2 className="text-xl font-semibold text-slate-700 flex gap-2 mb-2">
              Vista previa y publicación
            </h2>
            <Step6
              course={previewCourse}
              completionPercentage={completionPercentage}
              totalLessons={totalLessons}
              warningCount={warningCount}
              errorCount={errorCount}
              minimumFinalQuizQuestions={minimumFinalQuizQuestions}
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
