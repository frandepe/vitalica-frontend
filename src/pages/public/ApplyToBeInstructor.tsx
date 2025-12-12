import { getInstructorApplication, upsertInstructorApplication } from "@/api";
import BannerTop from "@/components/Banners/BannerTop";
import { DotsCard } from "@/components/CardsAnimated/DotsCard";
import { Button } from "@/components/ui/button";
import DateTimePicker from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import ImageUpload from "@/components/UploadFiles/UploadFiles";
import { t } from "@/constants/statusTranslations";
import { useBackendErrors } from "@/hooks/useBackendErrors";
import type {
  IApplyInstructor,
  InstructorApplication,
} from "@/types/instructor.types";
import { filesToBase64Array, fileToBase64 } from "@/utils/file-utils";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ApplyToBeInstructor = () => {
  const { showToast } = useToast();
  const { setBackendErrors, getGeneralErrors, clearErrors } =
    useBackendErrors();
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] =
    useState<InstructorApplication | null>(null);
  const navigate = useNavigate();
  const [dniImages, setDniImages] = useState<{
    existing: string[];
    new: File[];
  }>({
    existing: [],
    new: [],
  });
  const [certificateImages, setCertificateImages] = useState<{
    existing: string[];
    new: File[];
  }>({
    existing: [],
    new: [],
  });

  const getApplication = async () => {
    try {
      const response = await getInstructorApplication();
      if (response.success && response.data) {
        setApplicationData(response.data as InstructorApplication);
      }
    } catch (error) {
      console.error("Error fetching instructor application:", error);
    }
  };

  useEffect(() => {
    getApplication();
  }, []);

  const defaultValues: IApplyInstructor = {
    dniNumber: "",
    dniCountry: "",
    certificateType: "",
    enrollmentNumber: "",
    issuedBy: "",
    issueDate: "",
    expiryDate: "",
    urlDni: null,
    urlCertificate: [],
  };

  const form = useForm<IApplyInstructor>({ defaultValues });
  const { register, control, handleSubmit, watch, reset, formState } = form;
  const { errors } = formState;

  // ✅ Prellenar formulario si ya hay datos
  useEffect(() => {
    if (applicationData) {
      reset({
        dniNumber: applicationData.dniNumber || "",
        dniCountry: applicationData.dniCountry || "",
        certificateType: applicationData.certificateType || "",
        enrollmentNumber: applicationData.enrollmentNumber || "",
        issuedBy: applicationData.issuedBy || "",
        issueDate: applicationData.issueDate
          ? new Date(applicationData.issueDate).toISOString()
          : "",
        expiryDate: applicationData.expiryDate
          ? new Date(applicationData.expiryDate).toISOString()
          : "",
        urlDni: null,
        urlCertificate: [],
      });

      setDniImages({
        existing: applicationData.documents?.[0]?.urlDni
          ? [applicationData.documents[0].urlDni]
          : [],
        new: [],
      });

      setCertificateImages({
        existing: applicationData.documents?.[0]?.urlCertificate || [],
        new: [],
      });
    }
  }, [applicationData, reset]);

  const onSubmit = async (data: IApplyInstructor) => {
    try {
      setIsLoading(true);

      let finalDniUrl = "";
      if (dniImages.existing.length > 0) {
        // Si hay una imagen existente y no hay nuevas, mantener la existente
        finalDniUrl = dniImages.existing[0];
      } else if (dniImages.new.length > 0) {
        // Si hay una imagen nueva, convertirla a base64
        finalDniUrl = await fileToBase64(dniImages.new[0]);
      }

      // Para certificados, combinar existentes y nuevos
      const existingCertificates = certificateImages.existing;
      const newCertificatesBase64 = await filesToBase64Array(
        certificateImages.new
      );
      const finalCertificates = [
        ...existingCertificates,
        ...newCertificatesBase64,
      ];

      const instructorData: IApplyInstructor = {
        dniNumber: data.dniNumber,
        dniCountry: "AR",
        certificateType: data.certificateType,
        enrollmentNumber: data.enrollmentNumber,
        issuedBy: data.issuedBy,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        urlDni: finalDniUrl,
        urlCertificate: finalCertificates,
      };

      console.log("[v0] Datos a enviar:", instructorData);
      console.log(
        "[v0] DNI - Existentes:",
        dniImages.existing.length,
        "Nuevas:",
        dniImages.new.length
      );
      console.log(
        "[v0] Certificados - Existentes:",
        certificateImages.existing.length,
        "Nuevos:",
        certificateImages.new.length
      );

      const response = await upsertInstructorApplication(instructorData);
      console.log("response", response);
      if (response.errors && response.errors.length > 0) {
        setBackendErrors(response.errors);
        return;
      }
      clearErrors();
      if (response.success) {
        showToast(
          applicationData
            ? "Solicitud actualizada exitosamente"
            : "Solicitud enviada exitosamente",
          "success",
          "top-right"
        );

        getApplication(); // refresca la data
      }
    } catch (error) {
      console.error("[v0] Error submitting form:", error);
      alert("Error al enviar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  const dniNumber = watch("dniNumber");
  const certificateType = watch("certificateType");
  const issuedBy = watch("issuedBy");
  const issueDate = watch("issueDate");
  const expiryDate = watch("expiryDate");

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <BannerTop />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
          {/* ======= DNI ======= */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Información de Identificación{" "}
              {applicationData && (
                <span className="text-sm font-bold text-primary">
                  Estado: {t("application", applicationData.status)}
                </span>
              )}
              {applicationData && (
                <p className="text-sm mt-2 text-foreground/70 bg-primary/50 p-2 rounded">
                  Haz{" "}
                  <span
                    className="underline cursor-pointer text-secondary hover:text-secondary/80"
                    onClick={() => navigate("/estado-aplicacion")}
                  >
                    click aquí
                  </span>{" "}
                  para obtener más información sobre el seguimiento de tu
                  solicitud
                </p>
              )}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dni-number">
                  Número de DNI <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dni-number"
                  placeholder="12345678"
                  {...register("dniNumber", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^\d{7,8}$/,
                      message:
                        "Debe ser un número de DNI válido (7 u 8 dígitos)",
                    },
                  })}
                />
                {errors.dniNumber && (
                  <p className="text-destructive text-sm">
                    {errors.dniNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Imagen del DNI <span className="text-destructive">*</span>
              </Label>
              <ImageUpload
                value={dniImages.existing}
                onChange={(data) => setDniImages(data)}
                multiple={false}
                maxFiles={1}
              />
            </div>
          </div>

          {/* ======= CERTIFICADOS ======= */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Certificaciones</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certificate-type">
                    Tipo de Certificado *
                  </Label>
                  <Input
                    id="certificate-type"
                    {...register("certificateType", {
                      required: "Este campo es obligatorio",
                    })}
                  />
                  {errors.certificateType && (
                    <p className="text-destructive text-sm">
                      {errors.certificateType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issued-by">Emitido por *</Label>
                  <Input
                    id="issued-by"
                    {...register("issuedBy", {
                      required: "Este campo es obligatorio",
                    })}
                  />
                  {errors.issuedBy && (
                    <p className="text-destructive text-sm">
                      {errors.issuedBy.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="enrollment-number">Número de matrícula</Label>
                  <Input
                    id="enrollment-number"
                    {...register("enrollmentNumber")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-date">Fecha de emisión *</Label>
                  <Controller
                    name="issueDate"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        showTime={false}
                        value={field.value ? new Date(field.value) : null}
                        onChange={(val) => field.onChange(val?.toISOString())}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Fecha de vencimiento *</Label>
                  <Controller
                    name="expiryDate"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        showTime={false}
                        value={field.value ? new Date(field.value) : null}
                        onChange={(val) => field.onChange(val?.toISOString())}
                      />
                    )}
                  />
                </div>
              </div>

              {/* DotsCard */}
              <DotsCard
                title={certificateType || "Tipo de Certificado"}
                description={`Emitido por ${issuedBy || "-"}`}
                metricValue={
                  dniNumber
                    ? new Intl.NumberFormat("es-AR").format(Number(dniNumber))
                    : "35.123.456"
                }
                metricLabel={`Emitido el ${
                  issueDate
                    ? new Date(issueDate).toLocaleDateString("es-AR")
                    : "-/-/-"
                } Vence el ${
                  expiryDate
                    ? new Date(expiryDate).toLocaleDateString("es-AR")
                    : "-/-/-"
                }`}
                buttonText="Borrar campos"
                onButtonClick={() =>
                  reset({
                    certificateType: "",
                    enrollmentNumber: "",
                    issuedBy: "",
                    issueDate: "",
                    expiryDate: "",
                    dniNumber: "",
                  })
                }
                icon={<Star className="h-6 w-6" fill="currentColor" />}
              />
            </div>

            <div className="space-y-2">
              <Label>Imágenes del Certificado *</Label>
              <ImageUpload
                value={certificateImages.existing}
                onChange={(data) => setCertificateImages(data)}
                multiple={true}
                maxFiles={10}
              />
            </div>
          </div>
          {getGeneralErrors().map((msg, i) => (
            <p key={i} className="text-red-600 text-sm mb-2">
              {msg}
            </p>
          ))}
          {/* ======= SUBMIT ======= */}
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
      </div>
    </div>
  );
};

export default ApplyToBeInstructor;
