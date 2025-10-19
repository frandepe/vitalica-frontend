import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { loginUser } from "@/api";
import { useBackendErrors } from "@/hooks/useBackendErrors";
import { DataValidationEmail } from "@/types/auth.types";
import { EmailConfirm } from "@/components/user/auth/EmailConfirm";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth(); // guarda usuario globalmente
  const { setBackendErrorMessage, getGeneralErrors, clearErrors } =
    useBackendErrors();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<DataValidationEmail>();
  const { register, handleSubmit, formState } = useForm<LoginFormValues>();
  const { errors } = formState;

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setUserData({
      firstName: data.email.split("@")[0],
      email: data.email,
    });
    try {
      const result = await loginUser(data);
      if (!result.success && result.message) {
        setBackendErrorMessage(result.message);
        return;
      }

      clearErrors();

      if (result.success) {
        localStorage.setItem("token", result.data.token);
        setUser(result.data.user); // guardamos usuario global
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  if (
    getGeneralErrors().includes(
      "Por favor verifica tu email antes de iniciar sesión"
    )
  ) {
    return <EmailConfirm userData={userData!} />;
  }

  return (
    <section className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
            <span className="font-light text-foreground tracking-tighter">
              Bienvenido
            </span>
          </h1>
          <p className="animate-element animate-delay-200 text-muted-foreground">
            Accede a tu cuenta para continuar
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="animate-element animate-delay-300">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                placeholder="Ingrese su correo electrónico"
                {...register("email", { required: "El email es obligatorio" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="animate-element animate-delay-400">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  className="pe-9"
                  placeholder="Ingrese su contraseña"
                  type={isVisible ? "text" : "password"}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                  })}
                />
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  aria-controls="password"
                >
                  {isVisible ? (
                    <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
              <a className="hover:underline text-secondary transition-colors cursor-pointer">
                Olvidé mi contraseña
              </a>
            </div>
            {getGeneralErrors().map((msg, i) => (
              <p key={i} className="text-red-600 text-sm mb-2">
                {msg}
              </p>
            ))}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <div className="animate-delay-700 flex items-center gap-2">
            <span className="flex-1 border-t border-border"></span>
            <span className="text-sm text-muted-foreground">
              O continúa con
            </span>
            <span className="flex-1 border-t border-border"></span>
          </div>

          <GoogleLoginButton />

          <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
            Nuevo en la plataforma?{" "}
            <Link
              to="/auth/register"
              className="text-secondary hover:underline transition-colors cursor-pointer"
            >
              Crear una cuenta
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
