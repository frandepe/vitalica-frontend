import { sendBetaFeedback } from "@/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BetaFeedbackPayload,
  BetaFeedbackType,
} from "@/types/beta-feedback.types";
import { cn } from "@/utils/cn";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  BetaFeedbackImage,
  BetaFeedbackImageUploader,
} from "./BetaFeedbackImageUploader";

type BetaFeedbackFormValues = {
  type: BetaFeedbackType | "";
  message: string;
  images: BetaFeedbackImage[];
};

type BetaFeedbackFormProps = {
  originPath?: string;
};

const feedbackTypes: {
  value: BetaFeedbackType;
  label: string;
  description: string;
}[] = [
  {
    value: "ERROR",
    label: "Algo no funciona",
    description: "Algo no responde, se rompe o no pasa lo que esperabas.",
  },
  {
    value: "CONFUSION",
    label: "No sé cómo hacer algo",
    description: "Querés avanzar, pero la plataforma no te resulta clara.",
  },
  {
    value: "SUGGESTION",
    label: "Tengo una idea o sugerencia",
    description: "Se te ocurrió una mejora para Vitalica.",
  },
  {
    value: "OTHER",
    label: "Otra cosa",
    description: "Cualquier otro comentario que quieras compartir.",
  },
];

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No pudimos preparar la imagen"));
    reader.readAsDataURL(file);
  });

export function BetaFeedbackForm({ originPath }: BetaFeedbackFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSucceeded, setSubmitSucceeded] = useState(false);
  const successMessageRef = useRef<HTMLDivElement>(null);
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BetaFeedbackFormValues>({
    defaultValues: {
      type: "",
      message: "",
      images: [],
    },
  });

  useEffect(() => {
    if (!submitSucceeded) return;

    const successMessage = successMessageRef.current;
    if (!successMessage) return;

    successMessage.focus({ preventScroll: true });
    successMessage.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [submitSucceeded]);

  const onSubmit = async (values: BetaFeedbackFormValues) => {
    if (!values.type) return;
    setSubmitError(null);
    setSubmitSucceeded(false);

    try {
      const images = await Promise.all(
        values.images.map((image) => fileToBase64(image.file)),
      );

      const payload: BetaFeedbackPayload = {
        type: values.type,
        message: values.message,
        originPath,
        images,
      };

      const response = await sendBetaFeedback(payload);

      if (!response.success) {
        setSubmitError(
          response.message ?? "No pudimos enviar tu comentario. Probá de nuevo.",
        );
        return;
      }

      setSubmitSucceeded(true);
      values.images.forEach((image) => URL.revokeObjectURL(image.preview));
      reset({
        type: "",
        message: "",
        images: [],
      });
    } catch {
      setSubmitSucceeded(false);
      setSubmitError("No pudimos enviar tu comentario. Probá de nuevo.");
    }
  };

  return (
    <div className="rounded-lg border border-border/70 bg-background/95 p-5 shadow-[0_24px_80px_-48px_rgba(34,80,69,0.4)] sm:p-7">
      {submitSucceeded && (
        <div
          ref={successMessageRef}
          tabIndex={-1}
          className="mb-6 flex gap-3 rounded-lg border border-emerald-400/70 bg-emerald-50 p-4 text-sm text-emerald-950 shadow-[0_12px_32px_-20px_rgba(5,150,105,0.75)] outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:border-emerald-600/70 dark:bg-emerald-950/45 dark:text-emerald-100"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="font-semibold">¡Gracias! Recibimos tu comentario.</p>
            <p className="mt-1 text-emerald-800 dark:text-emerald-200/85">
              Lo vamos a revisar para mejorar la Beta.
            </p>
          </div>
        </div>
      )}

      <form
        className="space-y-8"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <fieldset disabled={isSubmitting} className="space-y-3">
          <legend className="text-base font-semibold text-foreground">
            ¿Qué querés contarnos?
          </legend>
          <Controller
            name="type"
            control={control}
            rules={{ required: "Elegí una opción para continuar." }}
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                {feedbackTypes.map((type) => {
                  const selected = field.value === type.value;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => field.onChange(type.value)}
                      className={cn(
                        "rounded-lg border p-4 text-left outline-none transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        selected
                          ? "border-primary bg-primary/8 text-foreground"
                          : "border-border bg-background hover:border-primary/35",
                      )}
                      aria-pressed={selected}
                    >
                      <span className="block text-sm font-semibold">
                        {type.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {type.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.type && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {errors.type.message}
            </p>
          )}
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="beta-feedback-message" className="text-foreground">
            Contanos un poco más
          </Label>
          <Textarea
            id="beta-feedback-message"
            placeholder="Escribí acá qué pasó o qué estabas intentando hacer..."
            className="min-h-40 resize-y"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.message)}
            {...register("message", {
              required: "Escribí un comentario para poder enviarlo.",
              minLength: {
                value: 5,
                message: "El comentario es demasiado corto.",
              },
              maxLength: {
                value: 2000,
                message: "El comentario puede tener hasta 2000 caracteres.",
              },
            })}
          />
          {errors.message && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-base font-semibold text-foreground">
              ¿Querés mostrarnos lo que estás viendo?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Podés adjuntar hasta 5 imágenes. Es opcional.
            </p>
          </div>
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <BetaFeedbackImageUploader
                value={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar comentario
        </Button>

        {submitError && (
          <p className="text-sm font-medium text-destructive" role="alert">
            {submitError}
          </p>
        )}
      </form>
    </div>
  );
}
