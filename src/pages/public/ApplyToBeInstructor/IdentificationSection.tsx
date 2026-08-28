import ImagesUpload from "@/components/Uploads/ImagesUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InstructorApplication } from "@/types/instructor.types";
import { t } from "@/utils/translations";
import { useFormContext } from "react-hook-form";
import type { IApplyInstructor } from "@/types/instructor.types";
import type { ImageState } from "@/components/instructor/Credentials/types";

type IdentificationSectionProps = {
  applicationData: InstructorApplication | null;
  dniImages: ImageState;
  onDniImagesChange: (images: ImageState) => void;
  onStatusClick: () => void;
};

const IdentificationSection = ({
  applicationData,
  dniImages,
  onDniImagesChange,
  onStatusClick,
}: IdentificationSectionProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<IApplyInstructor>();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Informacion de Identificacion{" "}
        {applicationData && (
          <span className="text-sm font-bold text-primary">
            Estado: {t("application", applicationData.status)}
          </span>
        )}
      </h2>

      {applicationData && (
        <p className="text-sm mt-2 text-foreground/70 bg-primary/50 p-2 rounded">
          Hace{" "}
          <span
            className="underline cursor-pointer text-secondary hover:text-secondary/80"
            onClick={onStatusClick}
          >
            click aqui
          </span>{" "}
          para obtener mas informacion sobre el seguimiento de tu solicitud
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dni-number">
            Numero de DNI <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dni-number"
            placeholder="Ej: 25000222"
            {...register("dniNumber", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^\d{7,8}$/,
                message: "Debe ser un numero de DNI valido (7 u 8 digitos)",
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
        <ImagesUpload
          value={dniImages.existing}
          onChange={onDniImagesChange}
          multiple={false}
          maxFiles={1}
        />
      </div>
    </div>
  );
};

export default IdentificationSection;
