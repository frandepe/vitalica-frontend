import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { GoogleIcon } from "@/assets/Icons/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Link } from "react-router-dom";

// --- MAIN COMPONENT ---

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

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

          <form className="space-y-5">
            <div className="animate-element animate-delay-300">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                name="email"
                type="email"
                placeholder="Ingrese su correo electrónico"
              />
            </div>

            <div className="animate-element animate-delay-400">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  className="pe-9"
                  placeholder="Ingrese su contraseña"
                  type={isVisible ? "text" : "password"}
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
            </div>

            <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
              <a className="hover:underline text-secondary transition-colors cursor-pointer">
                Olvidé mi contraseña
              </a>
            </div>

            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>

          <div className="animate-element animate-delay-700 relative flex items-center justify-center">
            <span className="w-full border-t border-border"></span>
            <span className="px-4 text-sm text-muted-foreground bg-background absolute">
              O continúa con
            </span>
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
