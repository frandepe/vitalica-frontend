import {
  getInstructorApplication,
  submitInstructorApplication,
  upsertInstructorApplication,
} from "@/api";
import BannerTop from "@/components/Banners/BannerTop";
import {
  credentialRequiresImage,
  emptyToNull,
  mapCertificationToCredentialForm,
  mapCredentialToForm,
} from "@/components/instructor/Credentials/credential-utils";
import type { ImageState } from "@/components/instructor/Credentials/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useBackendErrors } from "@/hooks/useBackendErrors";
import type {
  IApplyInstructor,
  InstructorApplication,
} from "@/types/instructor.types";
import { filesToBase64Array, fileToBase64 } from "@/utils/file-utils";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CredentialsSection from "./ApplyToBeInstructor/CredentialsSection";
import IdentificationSection from "./ApplyToBeInstructor/IdentificationSection";
import SpecialtiesSection from "./ApplyToBeInstructor/SpecialtiesSection";

const INSTRUCTOR_CREDENTIALS_ROUTE = "/instructor/especialidades";

const ApplyToBeInstructor = () => {
  const { showToast } = useToast();
  const { setBackendErrors, getGeneralErrors, clearErrors } =
    useBackendErrors();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingApplication, setIsLoadingApplication] = useState(true);
  const [applicationData, setApplicationData] =
    useState<InstructorApplication | null>(null);
  const navigate = useNavigate();
  const [dniImages, setDniImages] = useState<ImageState>({
    existing: [],
    new: [],
  });
  const [credentialImages, setCredentialImages] = useState<ImageState[]>([]);

  const form = useForm<IApplyInstructor>({
    defaultValues: {
      dniNumber: "",
      dniCountry: "AR",
      credentials: [],
      requestedSpecialties: [],
      urlDni: null,
    },
  });
  const { handleSubmit, reset } = form;

  const getApplication = useCallback(async () => {
    try {
      const response = await getInstructorApplication();
      if (response.success && response.data) {
        setApplicationData(response.data as InstructorApplication);
      }
    } catch (error) {
      console.error("Error fetching instructor application:", error);
    } finally {
      setIsLoadingApplication(false);
    }
  }, []);

  useEffect(() => {
    getApplication();
  }, [getApplication]);

  useEffect(() => {
    if (!applicationData) return;

    const credentials =
      applicationData.credentials?.length > 0
        ? applicationData.credentials.map(mapCredentialToForm)
        : applicationData.certifications?.length > 0
          ? applicationData.certifications.map(mapCertificationToCredentialForm)
          : [];

    reset({
      dniNumber: applicationData.dniNumber || "",
      dniCountry: applicationData.dniCountry || "AR",
      credentials,
      requestedSpecialties: applicationData.requestedSpecialties || [],
      urlDni: null,
    });

    setDniImages({
      existing: applicationData.documents?.[0]?.urlDni
        ? [applicationData.documents[0].urlDni]
        : [],
      new: [],
    });

    setCredentialImages(
      applicationData.credentials?.length > 0
        ? applicationData.credentials.map((credential) => ({
            existing: credential.imageUrls || [],
            new: [],
          }))
        : applicationData.certifications?.length > 0
          ? applicationData.certifications.map((certification) => ({
              existing: certification.imageUrls || [],
              new: [],
            }))
          : [],
    );
  }, [applicationData, reset]);

  const onSubmit = async (data: IApplyInstructor) => {
    try {
      setIsLoading(true);

      if (data.credentials.length === 0) {
        throw new Error("Debes agregar al menos una credencial");
      }

      let finalDniUrl = "";
      if (dniImages.existing.length > 0) {
        finalDniUrl = dniImages.existing[0];
      } else if (dniImages.new.length > 0) {
        finalDniUrl = await fileToBase64(dniImages.new[0]);
      }

      if (!finalDniUrl) {
        throw new Error("Debe subir una foto del DNI");
      }

      const credentials = await Promise.all(
        data.credentials.map(async (credential, index) => {
          const images = credentialImages[index] || { existing: [], new: [] };
          const newImagesBase64 = await filesToBase64Array(images.new);
          const finalImages = [...images.existing, ...newImagesBase64];

          if (
            credentialRequiresImage(credential.type) &&
            finalImages.length === 0
          ) {
            throw new Error(
              `La credencial ${index + 1} debe tener una imagen respaldatoria`,
            );
          }

          if (
            credential.expiresAt &&
            credential.issuedAt &&
            new Date(credential.expiresAt) < new Date(credential.issuedAt)
          ) {
            throw new Error(
              `La fecha de vencimiento de la credencial ${
                index + 1
              } no puede ser anterior a la fecha de emision`,
            );
          }

          if (
            credential.endDate &&
            credential.startDate &&
            new Date(credential.endDate) < new Date(credential.startDate)
          ) {
            throw new Error(
              `La fecha de fin de la credencial ${
                index + 1
              } no puede ser anterior a la fecha de inicio`,
            );
          }

          return {
            id: credential.id,
            type: credential.type,
            title: emptyToNull(credential.title),
            organization: emptyToNull(credential.organization),
            credentialNumber: emptyToNull(credential.credentialNumber),
            jurisdiction: emptyToNull(credential.jurisdiction),
            issuedAt: credential.issuedAt || null,
            expiresAt: credential.noExpiration
              ? null
              : credential.expiresAt || null,
            roleOrArea: emptyToNull(credential.roleOrArea),
            startDate: credential.startDate || null,
            endDate: credential.currentlyActive
              ? null
              : credential.endDate || null,
            currentlyActive: credential.currentlyActive,
            description: emptyToNull(credential.description),
            images: finalImages,
          };
        }),
      );

      const upsertResponse = await upsertInstructorApplication({
        dniNumber: data.dniNumber,
        dniCountry: "AR",
        credentials,
        requestedSpecialties: data.requestedSpecialties || [],
        urlDni: finalDniUrl,
      });

      if (upsertResponse.errors && upsertResponse.errors.length > 0) {
        setBackendErrors(upsertResponse.errors);
        return;
      }

      if (!upsertResponse.success) {
        setBackendErrors([]);
        showToast(
          upsertResponse.message || "No se pudo guardar la solicitud",
          "error",
          "top-right",
        );
        return;
      }

      const submitResponse = await submitInstructorApplication();

      if (submitResponse.errors && submitResponse.errors.length > 0) {
        setBackendErrors(submitResponse.errors);
        return;
      }

      if (!submitResponse.success) {
        setBackendErrors([]);
        showToast(
          submitResponse.message || "No se pudo enviar la solicitud",
          "error",
          "top-right",
        );
        return;
      }

      clearErrors();
      showToast(
        applicationData
          ? "Solicitud actualizada y enviada exitosamente"
          : "Solicitud enviada exitosamente",
        "success",
        "top-right",
      );
      navigate("/estado-aplicacion");
      void getApplication();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error al enviar la solicitud",
        "error",
        "top-right",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isApprovedApplication = applicationData?.status === "APPROVED";

  if (isLoadingApplication) {
    return (
      <div className="py-8">
        <div className="container mx-auto">
          <BannerTop />
          <div className="mt-8 rounded-lg border border-border bg-background p-6">
            <p className="text-sm text-muted-foreground">
              Cargando solicitud...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isApprovedApplication) {
    return (
      <div className="py-8">
        <div className="container mx-auto">
          <BannerTop />

          <section className="mt-8 rounded-lg border border-border bg-background p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-100 text-green-700">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700">
                    Solicitud aprobada
                  </p>
                  <h1 className="text-2xl font-semibold text-foreground">
                    Tu solicitud para ser instructor ya fue aprobada
                  </h1>
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    Ya tenes acceso como instructor. Esta solicitud inicial esta
                    cerrada y no puede modificarse ni reenviarse desde este
                    formulario.
                  </p>
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    Para agregar nuevas credenciales o ampliar tus
                    especialidades, usa el apartado de credenciales dentro de tu
                    panel de instructor.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                className="w-full md:w-auto"
                onClick={() => navigate(INSTRUCTOR_CREDENTIALS_ROUTE)}
              >
                Gestionar credenciales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <BannerTop />

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <IdentificationSection
              applicationData={applicationData}
              dniImages={dniImages}
              onDniImagesChange={setDniImages}
              onStatusClick={() => navigate("/estado-aplicacion")}
            />

            <CredentialsSection
              credentialImages={credentialImages}
              setCredentialImages={setCredentialImages}
            />

            <SpecialtiesSection />

            {getGeneralErrors().map((msg, i) => (
              <p key={i} className="text-red-600 text-sm mb-2">
                {msg}
              </p>
            ))}

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading
                  ? "Guardando..."
                  : applicationData
                    ? "Actualizar Solicitud"
                    : "Enviar Solicitud"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ApplyToBeInstructor;
