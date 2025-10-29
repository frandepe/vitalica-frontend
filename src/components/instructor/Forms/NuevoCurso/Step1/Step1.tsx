import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { descriptionCourseLimit, levels, specialties } from "@/constants";
import TagsInputBasic from "./Tags";
import {
  UseFormRegister,
  UseFormWatch,
  Control,
  Controller,
} from "react-hook-form";
import { NewCourseFormValues } from "@/types/course.types";
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

interface Step1Props {
  register: UseFormRegister<NewCourseFormValues>;
  watch: UseFormWatch<NewCourseFormValues>;
  control?: Control<NewCourseFormValues>;
}
export const Step1 = ({ register, watch, control }: Step1Props) => {
  return (
    <div className="w-full">
      <Label>Título</Label>
      <Input
        type="text"
        placeholder="Título del curso"
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
        className="mb-4"
      />
      <Label>Descripción</Label>
      <Textarea
        placeholder="Comparte una descripción detallada sobre el curso"
        className="resize-y w-full h-[200px] dark:bg-card bg-background rounded-[13px]"
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
      <div className="mt-4">
        <div className="flex gap-1 items-center">
          <Label>Etiquetas</Label>
          <TooltipIconButton
            tooltip="Las etiquetas son palabras clave que ayudan a que tu curso sea más fácil de encontrar en el buscador."
            side="top"
          >
            <InfoIcon size={15} className="text-secondary" />
          </TooltipIconButton>
        </div>
        <Controller
          name="tags"
          control={control}
          defaultValue={[]} // valor inicial
          render={({ field }) => (
            <TagsInputBasic value={field.value} onChange={field.onChange} />
          )}
        />
      </div>
      <FormField
        control={control}
        name="specialty"
        render={({ field }) => (
          <FormItem className="mt-4">
            <Label>Categoría del curso</Label>
            <Select value={String(field.value)} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={"Selecciona una categoria"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {specialties?.map((specialty) => (
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
      <FormField
        control={control}
        name="level"
        render={({ field }) => (
          <FormItem>
            <Label>Nivel del curso</Label>
            <Select value={field.value} onValueChange={field.onChange}>
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
    </div>
  );
};
