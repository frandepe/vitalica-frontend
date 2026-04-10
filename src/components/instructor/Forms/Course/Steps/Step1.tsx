import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { descriptionCourseLimit, levels } from "@/constants";

import {
  UseFormRegister,
  UseFormWatch,
  Control,
  Controller,
  FieldErrors,
} from "react-hook-form";
import {
  CourseLevel,
  ISpecialty,
  NewCourseFormValues,
} from "@/types/course.types";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipIconButton } from "@/components/TooltipIconButton";
import { InfoIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import TagsInputBasic from "../Tags";

interface Step1Props {
  register: UseFormRegister<NewCourseFormValues>;
  watch: UseFormWatch<NewCourseFormValues>;
  control?: Control<NewCourseFormValues>;
  errors: FieldErrors<NewCourseFormValues>;
  availableSpecialties: Array<{
    id: number;
    value: ISpecialty;
    label: string;
  }>;
}

export const Step1 = ({
  register,
  watch,
  control,
  errors,
  availableSpecialties,
}: Step1Props) => {
  const hasApprovedSpecialties = availableSpecialties.length > 0;

  return (
    <div className="w-full">
      <Label>Título</Label>
      <Input
        type="text"
        placeholder="Ej: Toxicología: evaluación y manejo inicial"
        {...register("title", {
          maxLength: {
            value: 150,
            message: "El título es demasiado largo. Máximo 150 caracteres",
          },
          minLength: {
            value: 2,
            message: "El título debe tener al menos dos caracteres",
          },
        })}
        name="title"
        className={cn(
          "mb-4",
          errors.title && "border-red-500 focus-visible:ring-red-500",
        )}
      />
      {errors.title && (
        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
      )}
      <Label>Descripción</Label>
      <Textarea
        placeholder="Describí de qué trata el curso, a quién está dirigido y qué va a aprender el alumno."
        className={cn(
          "resize-y w-full h-[200px] dark:bg-card bg-background rounded-[13px]",
          errors.description && "border-red-500 focus-visible:ring-red-500",
        )}
        {...register("description", {
          minLength: {
            value: 10,
            message: "La descripción debe tener al menos 10 caracteres",
          },
          maxLength: {
            value: descriptionCourseLimit,
            message: `La descripción no puede superar los ${descriptionCourseLimit} caracteres`,
          },
        })}
      />

      <span className="text-sm text-muted-foreground">
        {descriptionCourseLimit - (watch("description")?.length || 0)}{" "}
        caracteres restantes
      </span>

      {errors.description && (
        <p className="text-red-500 text-sm mt-1">
          {errors.description.message}
        </p>
      )}

      <div className="mt-4">
        <div className="flex gap-1 items-center">
          <Label>Etiquetas</Label>
          <TooltipIconButton
            tooltip="Las etiquetas son palabras clave que ayudan a que tu curso sea más fácil de encontrar para los motores de búsqueda."
            side="top"
          >
            <InfoIcon size={15} className="text-secondary" />
          </TooltipIconButton>
        </div>
        <Controller
          name="tags"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <TagsInputBasic value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
        )}
      </div>

      <FormField
        control={control}
        name="specialty"
        render={({ field }) => (
          <FormItem
            className={cn(
              "mt-4",
              errors.specialty && "border-red-500 focus-visible:ring-red-500",
            )}
          >
            <Label>Categoría</Label>
            <Select
              value={String(field.value)}
              onValueChange={field.onChange}
              disabled={!hasApprovedSpecialties}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      hasApprovedSpecialties
                        ? "Selecciona una categoría"
                        : "No tenes especialidades aprobadas"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableSpecialties.map((specialty) => (
                  <SelectItem
                    key={specialty.id}
                    title={specialty.label}
                    value={specialty.value}
                  >
                    <div className="flex items-center">
                      <span>{specialty.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      {!hasApprovedSpecialties && (
        <p className="text-amber-600 text-sm mt-1">
          Necesitas al menos una especialidad aprobada para guardar o publicar
          cursos.
        </p>
      )}
      {errors.specialty && (
        <p className="text-red-500 text-sm mt-1">{errors.specialty.message}</p>
      )}

      <FormField
        control={control}
        name="level"
        render={({ field }) => (
          <FormItem
            className={cn(
              "mt-4",
              errors.level && "border-red-500 focus-visible:ring-red-500",
            )}
          >
            <Label>Nivel</Label>
            <Select
              value={field.value ?? undefined}
              onValueChange={(value) => field.onChange(value as CourseLevel)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={"Selecciona el nivel del curso"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {levels?.map((level) => (
                  <SelectItem
                    key={level.id}
                    title={level.label}
                    value={level.value}
                  >
                    <div className="flex items-center">
                      <span>{level.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      {errors.level && (
        <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
      )}
    </div>
  );
};
