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

interface FeedbackApplicationFormProps {
  applicationId: string;
}

interface FeedbackFormData {
  status: StatusInstructorApplication;
  reviewerNotes: string;
  reviewedBy: string;
}

export const FeedbackApplicationForm = ({
  applicationId,
}: FeedbackApplicationFormProps) => {
  const { setBackendErrors, getGeneralErrors, clearErrors } =
    useBackendErrors();
  const { showToast } = useToast();

  const form = useForm<FeedbackFormData>({
    defaultValues: {
      status: "UNDER_REVIEW",
      reviewerNotes: "",
      reviewedBy: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      const result = await giveInstructorApplicationFeedback(
        applicationId,
        data
      );

      if (!result.success && result.message) {
        setBackendErrors(result.errors);
        return;
      }

      clearErrors();
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
