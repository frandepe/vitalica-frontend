import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Check, Eye, EyeOff, KeyRound, X } from "lucide-react";
import { Link } from "react-router-dom";
import { confirmPasswordReset } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_REQUIREMENTS,
  validatePassword,
} from "@/utils/password-validation";

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const INVALID_LINK_MESSAGE = "El enlace es inválido o expiró";

const captureToken = () => {
  const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
  return token && token.length <= 256 ? token : null;
};

const ResetPasswordPage = () => {
  const [token, setToken] = useState<string | null>(captureToken);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useLayoutEffect(() => {
    if (!window.location.hash) return;

    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  const password = watch("newPassword");

  const onSubmit = async ({ newPassword }: ResetPasswordFormData) => {
    if (!token || loading) return;

    setLoading(true);
    setRequestError(undefined);

    try {
      const response = await confirmPasswordReset({ token, newPassword });

      if (!response.success) {
        setRequestError(response.message || INVALID_LINK_MESSAGE);
        return;
      }

      setSuccessMessage(
        response.message ||
          "Contraseña actualizada correctamente. Ya podés iniciar sesión.",
      );
      setToken(null);
    } catch {
      setRequestError("No pudimos conectarnos. Intenta nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <ResetStatus
        title="Contraseña actualizada"
        message={successMessage}
        actionLabel="Iniciar sesión"
        actionTo="/auth/login"
      />
    );
  }

  if (!token) {
    return (
      <ResetStatus
        title="El enlace no está disponible"
        message={INVALID_LINK_MESSAGE}
        actionLabel="Solicitar otro enlace"
        actionTo="/auth/recuperar-contrasena"
      />
    );
  }

  return (
    <section className="flex-1 flex items-center justify-center md:p-8 relative">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-light leading-tight tracking-tighter">
              Creá una nueva contraseña
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Elegí una clave segura para volver a ingresar a tu cuenta.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  maxLength={PASSWORD_MAX_LENGTH}
                  className="pe-10"
                  aria-invalid={Boolean(errors.newPassword)}
                  aria-describedby="password-requirements"
                  {...register("newPassword", {
                    required: "La nueva contraseña es obligatoria",
                    validate: validatePassword,
                  })}
                />
                <PasswordVisibilityButton
                  visible={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                  label="nueva contraseña"
                />
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm" role="alert">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <ul id="password-requirements" className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {PASSWORD_REQUIREMENTS.map((requirement) => {
                const met = requirement.test(password);
                return (
                  <li key={requirement.text} className="flex items-center gap-2 text-xs">
                    {met ? (
                      <Check size={15} className="text-emerald-600" aria-hidden="true" />
                    ) : (
                      <X size={15} className="text-muted-foreground/70" aria-hidden="true" />
                    )}
                    <span className={met ? "text-emerald-700" : "text-muted-foreground"}>
                      {requirement.text}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmation ? "text" : "password"}
                  autoComplete="new-password"
                  maxLength={PASSWORD_MAX_LENGTH}
                  className="pe-10"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  {...register("confirmPassword", {
                    required: "Confirmá la nueva contraseña",
                    validate: (value) =>
                      value === password || "Las contraseñas no coinciden",
                  })}
                />
                <PasswordVisibilityButton
                  visible={showConfirmation}
                  onClick={() => setShowConfirmation((current) => !current)}
                  label="confirmación de contraseña"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {requestError && (
              <div className="space-y-2" role="alert">
                <p className="text-red-600 text-sm">{requestError}</p>
                {requestError === INVALID_LINK_MESSAGE && (
                  <Link to="/auth/recuperar-contrasena" className="text-sm text-primary hover:underline">
                    Solicitar otro enlace
                  </Link>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

const PasswordVisibilityButton = ({
  visible,
  onClick,
  label,
}: {
  visible: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    aria-label={`${visible ? "Ocultar" : "Mostrar"} ${label}`}
  >
    {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
  </button>
);

const ResetStatus = ({
  title,
  message,
  actionLabel,
  actionTo,
}: {
  title: string;
  message: string;
  actionLabel: string;
  actionTo: string;
}) => (
  <section className="flex-1 flex items-center justify-center md:p-8">
    <div className="flex w-full max-w-md flex-col gap-6" aria-live="polite">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <KeyRound aria-hidden="true" />
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tighter">{title}</h1>
        <p className="text-muted-foreground leading-relaxed">{message}</p>
      </div>
      <Button asChild className="w-full">
        <Link to={actionTo}>{actionLabel}</Link>
      </Button>
    </div>
  </section>
);

export default ResetPasswordPage;
