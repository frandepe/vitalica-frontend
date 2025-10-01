import { CirclesImg } from "@/components/Banners/HeaderBanner";
import { Step1 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step1";
import { Step, Stepper } from "@/components/instructor/Stepper";
import { Form } from "@/components/ui/form";
import { LessonFormValues, NewCourseFormValues } from "@/types/course.types";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import banner1 from "/Banners/banner4.jpg";
import mask01 from "@/assets/Masks/mask-20.svg";
import { Step2 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step2";
import { Step3 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step3";
import { Step4 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step4";
import { Step5 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step5";
import { Step6 } from "@/components/instructor/Forms/NuevoCurso/Step1/Step6";
import { BookOpenCheck, FileText, HandCoins } from "lucide-react";

interface LessonTypes {
  [sectionIndex: number]: {
    [lessonIndex: number]: string;
  };
}

const NewCourse = () => {
  const [lessonTypes, setLessonTypes] = useState<LessonTypes>({});
  const [isLoading, setIsLoading] = useState(false);
  const [picture, setPicture] = useState<any>(null);
  const [enabledDraft, setEnabledDraft] = useState(false);

  const form = useForm<NewCourseFormValues>();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    watch,
  } = form;

  const {
    fields: modules,
    append: addModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: "modules",
  });

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

  const title = watch("title");
  const description = watch("description");
  const tags = watch("tags");
  const specialty = watch("specialty");
  const level = watch("level");

  const isDraftEnabled =
    title?.trim() &&
    description?.trim() &&
    tags?.length > 0 &&
    specialty?.trim() &&
    level?.trim();

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    // const newData = {
    //   ...data,
    //   thumbnail: picture || '',
    // };
    try {
      const promoVideoFile = values.promoVideoFile; // viene de RHF

      if (promoVideoFile) {
        // 1️⃣ Pedir al backend la URL de subida directa
        const res = await fetch("/api/course/direct-upload", {
          method: "POST",
        });
        const { data } = await res.json();

        const uploadUrl = data.uploadUrl;
        const uploadId = data.uploadId;

        // 2️⃣ Subir el archivo a Mux
        await fetch(uploadUrl, {
          method: "PUT",
          body: promoVideoFile, // el File
        });

        // 3️⃣ Preguntar a Mux por el asset final
        // Esto se puede hacer llamando a tu backend que ya tenga la lógica con mux.video.uploads.get(uploadId)
        const assetRes = await fetch(`/api/course/mux-asset/${uploadId}`);
        const { muxAssetId, muxPlaybackId } = await assetRes.json();

        // 4️⃣ Crear o actualizar el curso en tu backend
        await fetch("/api/course/upsert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            muxPromoAssetId: muxAssetId,
            muxPlaybacktId: muxPlaybackId,
          }),
        });

        console.log("Curso guardado con Mux asset:", muxAssetId, muxPlaybackId);
      } else {
        // Si no hay video, solo guardamos el curso sin promoVideo
        await fetch("/api/course/upsert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      }
    } catch (err) {
      console.error("Error subiendo el video:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitDraft = async (data: NewCourseFormValues) => {
    setIsLoading(true);
    try {
      if (isDraftEnabled) {
        setEnabledDraft(true);
        console.log("Guardado en borrador:", data);
      } else {
        alert("no se puede guardar todavia"); // TODO: hacer un sonner copado
      }
      // await saveDraft(data);
    } catch (error) {
      console.error("Error al guardar borrador:", error);
    } finally {
      setIsLoading(false);
    }
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
          onSaveToDraft={handleSubmit(onSubmitDraft)}
          backButtonText="Atrás"
          nextButtonText="Siguiente"
        >
          <Step>
            <h2 className="text-xl font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <FileText />
              Información básica
            </h2>
            <div className="flex flex-col xl:flex-row">
              <Step1 watch={watch} register={register} />
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
            <Step2 />
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
              addModule={addModule}
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
    </div>
  );
};

export default NewCourse;
