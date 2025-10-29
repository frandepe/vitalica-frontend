import BannerTop from "@/components/Banners/BannerTop";
import { DotsCard } from "@/components/CardsAnimated/DotsCard";
import { Button } from "@/components/ui/button";
import DateTimePicker from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/UploadFiles/UploadFiles";

import type { IApplyInstructor } from "@/types/instructor.types";
import { filesToBase64Array, fileToBase64 } from "@/utils/file-utils";
import { Star } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface FileData {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  preview: string | null;
}

interface FormData {
  dniNumber: string;
  dniCountry: string;
  certificateType: string;
  enrollmentNumber: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  urlDni: File | null;
  urlCertificate: File[];
}

const ApplyToBeInstructor = () => {
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: FormData = {
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

  const form = useForm<FormData>({
    defaultValues,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    reset,
  } = form;

  const dniNumber = watch("dniNumber");
  const certificateType = watch("certificateType");
  const issuedBy = watch("issuedBy");
  const issueDate = watch("issueDate");
  const expiryDate = watch("expiryDate");

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      // Convert files to base64
      const urlDniBase64 = data.urlDni ? await fileToBase64(data.urlDni) : "";
      const urlCertificateBase64 = await filesToBase64Array(
        data.urlCertificate
      );

      // Prepare data for backend
      const instructorData: IApplyInstructor = {
        dniNumber: data.dniNumber,
        dniCountry: data.dniCountry,
        certificateType: data.certificateType,
        enrollmentNumber: data.enrollmentNumber,
        issuedBy: data.issuedBy,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        urlDni: urlDniBase64,
        urlCertificate: urlCertificateBase64,
      };

      // Call the API
      // const response = await upsertInstructor(instructorData)
      console.log("[v0] Sending data to backend:", instructorData);

      // TODO: Handle success response
      alert("Solicitud enviada exitosamente");
    } catch (error) {
      console.error("[v0] Error submitting form:", error);
      alert("Error al enviar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto">
        {/* Header */}
        <BannerTop />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
          {/* DNI Information Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Información de Identificación
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dni-number">
                  Número de DNI <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dni-number"
                  placeholder="12345678"
                  type="text"
                  {...register("dniNumber", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^\d{7,8}$/, // solo números, 7 u 8 dígitos
                      message:
                        "Debe ser un número de DNI válido (7 u 8 dígitos)",
                    },
                    maxLength: {
                      value: 8,
                      message: "Máximo 8 dígitos",
                    },
                    minLength: {
                      value: 7,
                      message: "Mínimo 7 dígitos",
                    },
                  })}
                />

                {errors.dniNumber && (
                  <p className="text-destructive text-sm">
                    {errors.dniNumber.message}
                  </p>
                )}
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="dni-country">
                  País de emisión <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dni-country"
                  placeholder="Argentina"
                  type="text"
                  {...register("dniCountry", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.dniCountry && (
                  <p className="text-destructive text-sm">
                    {errors.dniCountry.message}
                  </p>
                )}
              </div> */}
            </div>

            <div className="space-y-2">
              <Label>
                Imagen del DNI <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Subí una foto clara de tu documento
              </p>
              <Controller
                name="urlDni"
                control={control}
                rules={{
                  required: "Debes subir una imagen del DNI",
                  validate: (file) => {
                    if (!file) {
                      return "Debes subir una imagen del DNI";
                    }
                    return true;
                  },
                }}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className="space-y-2">
                    <ImageUpload
                      accept="image/*"
                      multiple={false}
                      maxSize={10 * 1024 * 1024}
                      maxFiles={1}
                      onFilesSelect={(files: FileData[]) => {
                        onChange(files[0]?.file || null);
                      }}
                      onFilesRemove={(files: FileData[]) => {
                        onChange(files[0]?.file || null);
                      }}
                    />
                    {error && (
                      <p className="text-destructive text-sm">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Certificate Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Certificaciones</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certificate-type">
                    Tipo de Certificado{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="certificate-type"
                    placeholder="Ej: RCP, DEA, Primeros Auxilios, etc."
                    type="text"
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
                  <Label htmlFor="issued-by">
                    Emitido por <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="issued-by"
                    placeholder="Institución certificadora"
                    type="text"
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
                <div className="space-y-2">
                  <Label htmlFor="issue-date">Fecha de emisión</Label>
                  <Controller
                    name="issueDate"
                    control={control}
                    rules={{ required: "Este campo es obligatorio" }}
                    render={({ field }) => (
                      <DateTimePicker
                        showTime={false}
                        value={field.value ? new Date(field.value) : null} // RHF maneja string o Date
                        onChange={(val) => field.onChange(val)} // guardar en RHF
                      />
                    )}
                  />
                  {errors.issueDate && (
                    <p className="text-destructive text-sm">
                      {errors.issueDate.message}
                    </p>
                  )}
                </div>
                {/* <DateTimePicker /> */}

                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Fecha de vencimiento</Label>

                  <Controller
                    name="expiryDate"
                    control={control}
                    rules={{ required: "Este campo es obligatorio" }}
                    render={({ field }) => (
                      <DateTimePicker
                        showTime={false}
                        value={field.value ? new Date(field.value) : null} // RHF maneja string o Date
                        onChange={(val) => field.onChange(val)} // guardar en RHF
                      />
                    )}
                  />
                  {errors.expiryDate && (
                    <p className="text-destructive text-sm">
                      {errors.expiryDate.message}
                    </p>
                  )}
                </div>
              </div>
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
              <Label>
                Imágenes del Certificado{" "}
                <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Sube imágenes claras de tus certificaciones profesionales
                (máximo 10)
              </p>
              <Controller
                name="urlCertificate"
                control={control}
                rules={{
                  required: "Debes subir al menos una imagen del certificado",
                  validate: (files) => {
                    if (!files || files.length === 0) {
                      return "Debes subir al menos una imagen del certificado";
                    }
                    return true;
                  },
                }}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className="space-y-2">
                    <ImageUpload
                      accept="image/*"
                      multiple={true}
                      maxSize={10 * 1024 * 1024}
                      maxFiles={10}
                      onFilesSelect={(files: FileData[]) => {
                        onChange(files.map((f) => f.file));
                      }}
                      onFilesRemove={(files: FileData[]) => {
                        onChange(files.map((f) => f.file));
                      }}
                    />
                    {error && (
                      <p className="text-destructive text-sm">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyToBeInstructor;
