import SpecialtyChecks from "@/components/instructor/Forms/Profile/SpecialtyChecks";
import type { IApplyInstructor } from "@/types/instructor.types";
import { useFormContext } from "react-hook-form";

const SpecialtiesSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<IApplyInstructor>();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Especialidades solicitadas{" "}
        <span className="text-info-foreground text-sm">
          Importante: selecciona solo las especialidades que coincidan con tus
          credenciales.
        </span>
      </h2>

      <SpecialtyChecks
        control={control}
        name="requestedSpecialties"
        rules={{
          validate: (value) =>
            Array.isArray(value) && value.length > 0
              ? true
              : "Debes elegir al menos una especialidad",
        }}
      />

      {errors.requestedSpecialties && (
        <p className="text-destructive text-sm">
          {errors.requestedSpecialties.message as string}
        </p>
      )}
    </div>
  );
};

export default SpecialtiesSection;
