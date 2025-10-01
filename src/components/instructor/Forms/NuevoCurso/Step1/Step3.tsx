import BannerDiagonal from "@/components/Banners/BannerDiagonal";
import { TooltipIconButton } from "@/components/TooltipIconButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewCourseFormValues } from "@/types/course.types";
import { InfoIcon } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

interface Step3Props {
  register: UseFormRegister<NewCourseFormValues>;
}
export const Step3 = ({ register }: Step3Props) => {
  return (
    <BannerDiagonal>
      <div>
        <Label>Precio</Label>
        <div className="relative flex rounded-lg shadow-sm shadow-black/5">
          <span className="pointer-events-none z-20 absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground">
            $
          </span>
          <Input
            className="-me-px z-10 rounded-e-none ps-6 shadow-none"
            placeholder="0.00"
            type="number"
            step="0.01"
            {...register("price", {
              valueAsNumber: true,
              required: "El precio es obligatorio",
              validate: {
                maxValue: (value) =>
                  value <= 500000 || "El precio no puede superar $500.000",
                positive: (value) =>
                  value >= 0 || "El precio no puede ser negativo",
              },
            })}
          />
          <span className="inline-flex items-center rounded-e-md border border-border bg-background px-3 text-sm text-muted-foreground">
            AR
          </span>
        </div>
      </div>
      <div className="flex gap-1 items-center mt-6">
        <Label>Duración aproximada</Label>
        <TooltipIconButton
          tooltip="Indica cuánto creés que los alumnos tardarán en completar tu curso, en horas y minutos. Esta duración es aproximada y ayudará a los estudiantes a planificar su tiempo."
          side="top"
        >
          <InfoIcon size={15} className="text-secondary" />
        </TooltipIconButton>
      </div>
      <Input type="time" step="60" {...register("duration")} className="mb-6" />
    </BannerDiagonal>
  );
};
// 💰 Step 3 – Detalles comerciales Duración estimada (duration) Precio
//     (price) Moneda (currency)
