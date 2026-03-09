import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { giveInstructorApplicationFeedback } from "@/api/adminEndpoints";
import { StatusInstructorApplication } from "@/types/instructor.types";
import { useBackendErrors } from "@/hooks/useBackendErrors";
import { useToast } from "../ui/toast";
import SpecialtyChecks from "@/components/Instructor/Forms/Profile/SpecialtyChecks";
import { ISpecialty } from "@/types/course.types";

interface FeedbackApplicationFormProps {
  applicationId: string;
  requestedSpecialties: ISpecialty[];
}

interface FeedbackFormData {
  status: StatusInstructorApplication;
  reviewerNotes: string;
  reviewedBy: string;
  approvedSpecialties: ISpecialty[];
}

export const FeedbackApplicationForm = ({
  applicationId,
  requestedSpecialties,
}: FeedbackApplicationFormProps) => {
  const { setBackendErrors, getGeneralErrors, clearErrors: clearBackendErrors } =
    useBackendErrors();
  const { showToast } = useToast();

  const form = useForm<FeedbackFormData>({
    defaultValues: {
      status: "UNDER_REVIEW",
      reviewerNotes: "",
      reviewedBy: "",
      approvedSpecialties: requestedSpecialties || [],
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { isSubmitting },
    reset,
  } = form;

  const currentStatus = watch("status");

  const onSubmit = async (data: FeedbackFormData) => {
    if (data.status === "APPROVED" && data.approvedSpecialties.length === 0) {
      setError("approvedSpecialties", {
        type: "manual",
        message: "Para aprobar, debés seleccionar al menos una especialidad",
      });
      return;
    }

    clearErrors("approvedSpecialties");

    try {
      const result = await giveInstructorApplicationFeedback(
        applicationId,
        data,
      );

      if (!result.success && result.message) {
        setBackendErrors(result.errors);
        return;
      }

      clearBackendErrors();
      showToast("Feedback enviado", "success", "top-right");
      reset();
    } catch (error) {
      console.error(error);

      showToast("Error al enviar el feedback.", "error", "top-right");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white shadow-md rounded-2xl p-6 max-w-lg"
      >
        <h2 className="text-lg font-semibold">Enviar feedback al instructor</h2>

        {/* Estado */}
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado de la aplicación</FormLabel>
              <Select
                value={String(field.value)}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UNDER_REVIEW">En revisión</SelectItem>
                  <SelectItem value="APPROVED">Aprobada</SelectItem>
                  <SelectItem value="REJECTED">Rechazada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notas del revisor */}
        <FormField
          control={control}
          name="reviewerNotes"
          rules={{
            required: "Las notas son obligatorias",
            minLength: {
              value: 5,
              message: "Debe contener al menos 5 caracteres",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas del revisor</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escribe tus observaciones o comentarios..."
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="approvedSpecialties"
          rules={{
            validate: (value) =>
              currentStatus !== "APPROVED" || value.length > 0
                ? true
                : "Para aprobar, debés seleccionar al menos una especialidad",
          }}
          render={() => (
            <FormItem>
              <FormLabel>
                Especialidades finales aprobadas
                {currentStatus === "APPROVED" ? " *" : ""}
              </FormLabel>
              <FormControl>
                <SpecialtyChecks
                  control={control}
                  name="approvedSpecialties"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nombre del revisor */}
        <FormField
          control={control}
          name="reviewedBy"
          rules={{ required: "El nombre del revisor es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Revisado por</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Franco De Paulo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-medium"
        >
          {isSubmitting ? "Enviando..." : "Enviar feedback"}
        </Button>
        {getGeneralErrors().map((msg, i) => (
          <p key={i} className="text-red-600 text-sm mb-2">
            {msg}
          </p>
        ))}
      </form>
    </Form>
  );
};
