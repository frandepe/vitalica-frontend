import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordReset } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBackendErrors } from "@/hooks/useBackendErrors";
import { PasswordResetRequestData } from "@/types/auth.types";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string>();
  const navigate = useNavigate();
  const { setBackendErrorMessage, getGeneralErrors, clearErrors } =
    useBackendErrors();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordResetRequestData>();

  const onSubmit = async (data: PasswordResetRequestData) => {
    if (loading) return;

    setLoading(true);
    clearErrors();

    try {
      const response = await requestPasswordReset(data);

      if (!response.success) {
        setBackendErrorMessage(
          response.message || "No pudimos procesar la solicitud.",
        );
        return;
      }

      setConfirmationMessage(
        response.message ||
          "Si existe una cuenta compatible con recuperación para ese correo, recibirás un enlace con los próximos pasos.",
      );
    } catch {
      setBackendErrorMessage(
        "No pudimos conectarnos. Intenta nuevamente más tarde.",
      );
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setConfirmationMessage(undefined);
    clearErrors();
    reset();
  };

  return (
    <section className="flex-1 flex items-center justify-center md:p-8 relative">
      <Button
        variant="link"
        className="absolute top-2 right-2"
        onClick={() => navigate("/auth/login")}
        aria-label="Volver al inicio de sesión"
      >
        <ArrowLeft />
      </Button>

      <div className="w-full max-w-md">
        {confirmationMessage ? (
          <div className="flex flex-col gap-6" aria-live="polite">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheck aria-hidden="true" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tighter">
                Revisá tu correo
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {confirmationMessage}
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/auth/login">Volver a ingresar</Link>
            </Button>
            <Button type="button" variant="link" onClick={restart}>
              Usar otro correo
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
                <span className="font-light text-foreground tracking-tighter">
                  Recuperá tu acceso
                </span>
              </h1>
              <p className="animate-element animate-delay-200 text-muted-foreground leading-relaxed">
                Ingresá el correo asociado a tu cuenta. Si corresponde, te
                enviaremos un enlace seguro para cambiar la contraseña.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="animate-element animate-delay-300">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Ingrese su correo electrónico"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email", {
                    required: "El email es obligatorio",
                    maxLength: {
                      value: 255,
                      message: "El email es demasiado largo",
                    },
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un email válido",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div aria-live="polite">
                {getGeneralErrors().map((message) => (
                  <p key={message} className="text-red-600 text-sm mb-2">
                    {message}
                  </p>
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar enlace"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              ¿Recordaste tu contraseña?{" "}
              <Link
                to="/auth/login"
                className="text-primary hover:underline transition-colors"
              >
                Volver a ingresar
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
