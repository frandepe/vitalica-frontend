import { CirclesImg } from "@/components/Banners/HeaderBanner";
import { Step1 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step1";
import { Step, Stepper } from "@/components/instructor/Stepper";
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
import { Step2 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step2";
import { Step3 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step3";
import { Step4 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step4";
import { Step5 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step5";
import { Step6 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step6";
import { BookOpenCheck, FileText, HandCoins } from "lucide-react";
import { CourseLevel, Specialty } from "@/constants";
import { useParams } from "react-router-dom";
import {
  confirmPromoUpload,
  createPromoDirectUpload,
  getCourseById,
  getMuxUploadStatus,
  saveCourseAsDraft,
  saveCourseThumbnail,
} from "@/api";
import { useBackendErrors } from "@/hooks/useBackendErrors";
import { useToast } from "@/components/ui/toast";
import { GlobalLoading } from "@/components/GlobalLoading";

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
  // const navigate = useNavigate();

  const defaultValues: NewCourseFormValues = {
    title: "",
    description: "",
    tags: [],
    specialty: Specialty.CPR,
    // promoVideoFile: undefined,
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
            type: "videoFile", // o null si preferís
            isFree: false,
            order: 0,
            muxPlaybackId: null, // 👈 CLAVE
          },
        ],
      },
    ],
    level: CourseLevel.BEGINNER,
    // duration: undefined,
    durationHours: 0,
    durationMinutes: 0,
    price: 0,
    currency: "ARS",
    // modules: [],
    quizzes: [],
  };

  // Inicializamos el form
  const form = useForm<NewCourseFormValues>({
    defaultValues,
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
  } = form;

  const {
    fields: modules,
    // append: addModule,
    remove: removeModule,
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

  // ✅ Prellenar formulario si ya hay datos
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
    type: string
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
      (_: LessonFormValues, index: number) => index !== lessonIndex
    );
    setValue(`modules.${moduleIndex}.lessons`, updatedLessons);
  };

  const values = watch();

  const onSubmit = async (values: NewCourseFormValues) => {
    setIsLoading(true);

    try {
      // Si tenemos un courseId, lo incluimos para que el backend actualice
      const payload = courseId ? { ...values, courseId } : values;

      // const result = await upsertCourse(payload);

      // if (!result.success) throw new Error(result.message);

      // console.log(result.message, result.data);
      // alert(result.message);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al guardar el curso");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <GlobalLoading text="Autoguardado..." />;

  const onSubmitDraft = handleSubmit(async (data) => {
    setIsLoading(true);

    const { durationHours, durationMinutes, ...rest } = data;

    const payload = {
      ...rest,
      duration: durationHours * 60 + durationMinutes,
    };

    try {
      console.log("Guardado en borrador:", data);

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

  const handleThumbnailReady = async (fileBase64: string) => {
    try {
      console.log("fileBase64", courseId);

      // 1. Llamar al backend y que él suba la miniatura
      const res = await saveCourseThumbnail(courseId!, fileBase64);
      console.log("res", res);

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

    // -------------------------
    // 1) Crear Direct Upload
    // -------------------------
    const res1 = await createPromoDirectUpload(courseId);

    if (!res1.success) {
      console.error(res1.message);
      return;
    }

    const { uploadUrl, uploadId } = res1.data;

    // -------------------------
    // 2) Subir archivo a Mux con barra de progreso
    // -------------------------
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

    // -------------------------
    // 3) Mostrar feedback mientras Mux procesa
    // -------------------------
    setUploadStatus("Por favor, no cierre la página…");

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

    // -------------------------
    // 4) Confirmar en backend
    // -------------------------
    const res2 = await confirmPromoUpload(courseId, uploadId);

    if (!res2.success) {
      console.error(res2.message);
      return;
    }

    // -------------------------
    // 5) Actualizar formulario
    // -------------------------
    form.setValue("muxPromoAssetId", assetId, { shouldDirty: true });

    if (playbackId) {
      form.setValue("muxPlaybackId", playbackId, { shouldDirty: true });
    }

    setUploadStatus("¡Video guardado!");
    setUploadProgress(100);

    console.log("Video listo y guardado!");
  };

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
          onFinalStepCompleted={handleSubmit(onSubmit)}
          onSaveToDraft={onSubmitDraft}
          backButtonText="Atrás"
          nextButtonText="Siguiente"
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
            <Step3 register={register} />
          </Step>
          <Step>
            <h2 className="text-xl font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <BookOpenCheck />
              Módulos y lecciones
            </h2>
            <Step4
              courseId={courseId!}
              // addModule={addModule}
              handleLessonTypeChange={handleLessonTypeChange}
              handleRemoveLesson={handleRemoveLesson}
              lessonTypes={lessonTypes}
              modules={modules}
              register={register}
              removeModule={removeModule}
              setValue={setValue}
              watch={watch}
              control={control}
            />
          </Step>
          <Step>
            <h2 className="text-xl font-semibold text-slate-700 flex gap-2 mb-2">
              5
            </h2>
            <Step5 />
          </Step>
          <Step>
            <h2 className="text-xl font-semibold text-slate-700 flex gap-2 mb-2">
              Final Step
            </h2>
            <Step6 />
          </Step>
        </Stepper>
      </Form>
      {getGeneralErrors().map((msg, i) => (
        <li key={i} className="text-red-600 text-sm mb-2 ml-4">
          {msg}
        </li>
      ))}
    </div>
  );
}
// const onSubmit = async (values: NewCourseFormValues) => {
//   setIsLoading(true);
//   // const newData = {
//   //   ...data,
//   //   thumbnail: picture || '',
//   // };
//   try {
//     const promoVideoFile = values.promoVideoFile; // viene de RHF

//     if (promoVideoFile) {
//       // 1️⃣ Pedir al backend la URL de subida directa
//       const res = await fetch("/api/course/direct-upload", {
//         method: "POST",
//       });
//       const { data } = await res.json();

//       const uploadUrl = data.uploadUrl;
//       const uploadId = data.uploadId;

//       // 2️⃣ Subir el archivo a Mux
//       await fetch(uploadUrl, {
//         method: "PUT",
//         body: promoVideoFile, // el File
//       });

//       // 3️⃣ Preguntar a Mux por el asset final
//       // Esto se puede hacer llamando a tu backend que ya tenga la lógica con mux.video.uploads.get(uploadId)
//       const assetRes = await fetch(`/api/course/mux-asset/${uploadId}`);
//       const { muxAssetId, muxPlaybackId } = await assetRes.json();

//       // 4️⃣ Crear o actualizar el curso en tu backend
//       await fetch("/api/course/upsert", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...values,
//           muxPromoAssetId: muxAssetId,
//           muxPlaybackId: muxPlaybackId,
//         }),
//       });

//       console.log("Curso guardado con Mux asset:", muxAssetId, muxPlaybackId);
//     } else {
//       // Si no hay video, solo guardamos el curso sin promoVideo
//       await fetch("/api/course/upsert", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });
//     }
//   } catch (err) {
//     console.error("Error subiendo el video:", err);
//   } finally {
//     setIsLoading(false);
//   }
// };
