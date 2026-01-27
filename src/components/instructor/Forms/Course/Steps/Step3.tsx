import { TooltipIconButton } from "@/components/TooltipIconButton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { requirementsAndMaterialsCourseLimit } from "@/constants";
import { NewCourseFormValues } from "@/types/course.types";
import { cn } from "@/utils/cn";
import { formatDuration } from "@/utils/format-duration";
import { ClockFading, InfoIcon } from "lucide-react";
import { useEffect } from "react";
import { useFormContext, UseFormRegister } from "react-hook-form";

interface Step3Props {
  register: UseFormRegister<NewCourseFormValues>;
  priceDB: string | undefined;
}
export const Step3 = ({ register, priceDB }: Step3Props) => {
  const {
    watch,
    setValue,
    formState: { errors },
    control,
  } = useFormContext();

  const duration = watch("duration");
  const price = watch("price");

  // estado derivado SOLO para UI
  const isFree = price === 0;

  useEffect(() => {
    if (priceDB === "0") {
      setValue("price", 0);
    }
  }, [priceDB, setValue]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Requisitos y materiales</Label>
        <Textarea
          placeholder="Describí los requisitos previos que los estudiantes deben cumplir para aprovechar al máximo este curso, así como los materiales necesarios que deberán tener a mano."
          className={cn(
            "resize-y w-full h-[200px] dark:bg-card bg-background rounded-[13px]",
            errors.description && "border-red-500 focus-visible:ring-red-500",
          )}
          {...register("requirementsAndMaterials", {
            maxLength: {
              value: requirementsAndMaterialsCourseLimit,
              message: `El campo no puede superar los ${requirementsAndMaterialsCourseLimit} caracteres`,
            },
          })}
        />

        <span className="text-sm text-muted-foreground">
          {requirementsAndMaterialsCourseLimit -
            (watch("requirementsAndMaterials")?.length || 0)}{" "}
          caracteres restantes
        </span>

        <p className="text-red-500 text-sm mt-1">
          {typeof errors.requirementsAndMaterials?.message === "string"
            ? errors.requirementsAndMaterials.message
            : null}
        </p>
      </div>

      <Card className="p-4">
        {/* SWITCH CURSO GRATUITO */}
        <div className="flex items-center space-x-2">
          <Switch
            checked={isFree}
            onCheckedChange={(checked) => {
              if (checked) {
                setValue("price", 0, { shouldValidate: true });
              } else {
                setValue("price", undefined as any);
              }
            }}
          />
          <Label>Curso gratuito</Label>
        </div>

        {/* PRECIO */}
        <Label>Precio</Label>
        <div className="relative flex rounded-lg shadow-sm shadow-black/5">
          <span className="pointer-events-none z-20 absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground">
            $
          </span>

          <Input
            disabled={isFree}
            className={cn(
              "-me-px z-10 rounded-e-none ps-6 shadow-none",
              isFree && "opacity-60 cursor-not-allowed",
              errors.price && "border-red-500 focus-visible:ring-red-500",
            )}
            placeholder="0.00"
            type="number"
            step="0.01"
            {...register("price", {
              valueAsNumber: true,
              validate: {
                maxValue: (value) =>
                  value <= 1000000 || "El precio no puede superar $1.000.000",
                positive: (value) =>
                  value >= 0 || "El precio no puede ser negativo",
              },
            })}
          />

          <span className="inline-flex items-center rounded-e-md border border-border bg-background px-3 text-sm text-muted-foreground">
            AR
          </span>
        </div>

        {isFree && (
          <p className="text-sm text-muted-foreground">
            Este curso será publicado como gratuito.
          </p>
        )}

        {errors.price?.message && (
          <p className="text-red-500 text-sm mt-1">
            {typeof errors.price?.message === "string"
              ? errors.price.message
              : null}
          </p>
        )}
      </Card>

      <div>
        <div className="flex items-center gap-1">
          <Label>Duración aproximada</Label>
          <TooltipIconButton
            tooltip={
              <>
                Indica cuánto creés que los alumnos tardarán en completar tu
                curso.
                <br />
                Ingresá una duración estimada en horas y minutos.
                <br />
                Este valor es orientativo y ayuda a los estudiantes a planificar
                su tiempo.
              </>
            }
            side="top"
          >
            <InfoIcon size={15} className="text-secondary" />
          </TooltipIconButton>
        </div>

        <div className="flex items-end gap-2 mt-2">
          {/* Horas */}
          <div className="w-[70px]">
            <Label className="text-xs text-muted-foreground">Hs</Label>
            <Input
              type="number"
              min={0}
              max={48}
              step={1}
              placeholder="2"
              className="text-center"
              {...register("durationHours", {
                valueAsNumber: true,
                min: { value: 0, message: "La duración no puede ser negativa" },
              })}
            />
          </div>

          <span className="pb-2 text-sm text-muted-foreground">:</span>

          {/* Minutos */}
          <div className="w-[80px]">
            <Label className="text-xs text-muted-foreground">Min</Label>

            <FormField
              control={control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger className="text-center">
                        <SelectValue placeholder="00" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="0">00</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="45">45</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <Badge variant="info">
            Duración total estimada: {formatDuration(duration)} hs{" "}
            <ClockFading />
          </Badge>
        </div>
      </div>
    </div>
  );
};
