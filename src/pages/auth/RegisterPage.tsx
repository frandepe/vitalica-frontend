import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputPassword } from "@/components/ui/password-input";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Link } from "react-router-dom";
import { registerUser, sendValidationEmail } from "@/api";
import { useToast } from "@/components/ui/toast";
import { DataValidationEmail, RegisterFormValues } from "@/types/auth.types";
import { EmailConfirm } from "@/components/user/auth/EmailConfirm";
import { useBackendErrors } from "@/hooks/useBackendErrors";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationEmailSent, setValidationEmailSent] = useState(false);
  const [userData, setUserData] = useState<DataValidationEmail>();
  const { setBackendErrors, getGeneralErrors, clearErrors } =
    useBackendErrors();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>();
  const { showToast } = useToast();

  const onSubmit = async (data: RegisterFormValues) => {
    if (data.password !== confirmPassword) {
      showToast("Las contraseñas no coinciden", "warning", "top-right");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      if (res.errors && res.errors.length > 0) {
        setBackendErrors(res.errors);
        return;
      }

      clearErrors();

      if (res.success && res.data) {
        const { user } = res.data;
        await sendValidationEmail({
          firstName: user.firstName,
          email: user.email,
        });
        setUserData({
          firstName: user.firstName,
          email: user.email,
        });
        setValidationEmailSent(true);
      } else {
        alert("No se pudo crear la cuenta");
        console.log("Respuesta inesperada del backend:", res);
      }
    } catch (err) {
      console.error("Error de fetch:", err);
      alert("Ocurrió un error al registrar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  if (validationEmailSent) {
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
            Crea tu cuenta para comenzar
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Nombre y Apellido */}
            <div className="animate-element animate-delay-200 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  placeholder="Ingrese su nombre"
                  {...register("firstName", {
                    // required: "El nombre es obligatorio",
                    minLength: {
                      value: 2,
                      message: "El nombre debe tener al menos 2 caracteres",
                    },
                    maxLength: {
                      value: 25,
                      message: "El nombre no puede superar los 25 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message:
                        "El nombre solo puede contener letras y espacios",
                    },
                  })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  placeholder="Ingrese su apellido"
                  {...register("lastName", {
                    required: "El apellido es obligatorio",
                    minLength: {
                      value: 2,
                      message: "El apellido debe tener entre 2 y 25 caracteres",
                    },
                    maxLength: {
                      value: 25,
                      message: "El apellido debe tener entre 2 y 25 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message:
                        "El apellido solo puede contener letras y espacios",
                    },
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Correo */}
            <div className="animate-element animate-delay-300">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingrese su correo electrónico"
                {...register("email", {
                  required: "El email es obligatorio",
                  maxLength: {
                    value: 255,
                    message: "El email es demasiado largo",
                  },
                  pattern: {
                    // Validación básica de email en frontend
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingresa un email válido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña con Controller */}
            <div className="animate-element animate-delay-400">
              <Controller
                control={control}
                name="password"
                rules={{ required: "La contraseña es obligatoria" }}
                render={({ field }) => (
                  <InputPassword
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    showConfirm
                    onConfirmChange={setConfirmPassword}
                    name="password"
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Checkbox */}
            <div className="animate-element animate-delay-500 flex items-start justify-between text-sm">
              <span className="text-foreground/90 lg:max-w-72 max-w-52">
                Al registrarte aceptas nuestras políticas de privacidad
              </span>

              <Link
                to="/politicas-de-privacidad"
                target="_blank"
                className="hover:underline text-secondary transition-colors cursor-pointer"
              >
                Ver políticas
              </Link>
            </div>
            {getGeneralErrors().map((msg, i) => (
              <p key={i} className="text-red-600 text-sm mb-2">
                {msg}
              </p>
            ))}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Crear cuenta"}
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

          <p className="animate-delay-900 text-center text-sm text-muted-foreground">
            ¿Ya tenés una cuenta?{" "}
            <Link
              to="/auth/login"
              className="text-secondary hover:underline transition-colors cursor-pointer"
            >
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
// if (res.errors && res.errors.length > 0) {
//   res.errors.forEach((err: { field: string; message: string }) => {
//     setError(err.field as keyof RegisterFormValues, {
//       type: "server",
//       message: err.message,
//     });
//   });
//   return;
// }
