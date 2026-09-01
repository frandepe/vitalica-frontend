import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CourseStatus, ICourse } from "@/types/course.types";
import { translateStatusCourse } from "@/constants";
import { FeedbackFormValues } from "@/types/admin.types";
import { t } from "@/utils/translations";
import { Input } from "../ui/input";

interface FeedbackCourseProps {
  course: ICourse;
  onSubmit: (data: FeedbackFormValues) => void;
  isSubmitting?: boolean;
  adminEmail: string;
}

export const FeedbackCourse = ({
  course,
  onSubmit,
  isSubmitting = false,
  adminEmail,
}: FeedbackCourseProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    defaultValues: {
      status: course.status as CourseStatus,
      reviewerNotes: course.reviewerNotes || "",
      revewedBy: adminEmail,
    },
  });

  const status = watch("status");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white border border-slate-300 rounded-lg p-6"
    >
      {/* Estado */}
      <div className="space-y-2">
        <Label>Decisión del curso</Label>
        <Select
          value={status}
          onValueChange={(value) =>
            setValue("status", value as keyof typeof translateStatusCourse, {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>

          <SelectContent>
            {(
              Object.keys(translateStatusCourse) as Array<
                keyof typeof translateStatusCourse
              >
            )
              .filter((statusKey) => statusKey !== "ARCHIVED")
              .map((statusKey) => (
                <SelectItem key={statusKey} value={statusKey}>
                  {translateStatusCourse[statusKey]}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {errors.status && (
          <p className="text-xs text-red-600">Estado inválido</p>
        )}
      </div>

      {/* Observaciones */}
      <div className="space-y-2">
        <Label>Notas del revisor</Label>
        <Textarea
          placeholder="Detallá claramente qué está bien o qué debe corregirse"
          rows={6}
          {...register("reviewerNotes", {
            required:
              status !== "SUBMITTED"
                ? "Las observaciones son obligatorias"
                : false,
            minLength: {
              value: 10,
              message: "Las observaciones son demasiado cortas",
            },
          })}
        />

        {errors.reviewerNotes && (
          <p className="text-xs text-red-600">{errors.reviewerNotes.message}</p>
        )}
      </div>

      {/* Reviewer (hidden, controlado) */}
      <Input type="hidden" {...register("revewedBy")} />

      {/* Info contextual */}
      <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded p-3">
        <p>
          <strong>Curso:</strong> {course.title}
        </p>
        <p>
          <strong>Estado actual:</strong> {t("statusCourse", course.status)}
        </p>
      </div>

      {/* Acción */}

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting} className="min-w-[160px]">
          {isSubmitting ? "Guardando..." : "Guardar feedback"}
        </Button>
      </div>
    </form>
  );
};
