import { GoogleIcon } from "@/assets/Icons/google";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputPassword } from "@/components/ui/password-input";
import { Link } from "react-router-dom";

// --- MAIN COMPONENT ---

const RegisterPage = () => {
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
          <form className="space-y-5">
            {/* Nombre y Apellido */}
            <div className="animate-element animate-delay-200 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder="Ingrese su nombre"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder="Ingrese su apellido"
                />
              </div>
            </div>

            {/* Correo */}
            <div className="animate-element animate-delay-300">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                name="email"
                type="email"
                placeholder="Ingrese su correo electrónico"
              />
            </div>

            {/* Contraseña */}
            <div className="animate-element animate-delay-400">
              <InputPassword />
            </div>

            {/* Checkbox y link */}
            <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox name="rememberMe" className="custom-checkbox" />
                <span className="text-foreground/90">
                  Acepto las políticas de privacidad
                </span>
              </label>
              <Link
                to="/politicas-de-privacidad"
                target="_blank"
                className="hover:underline text-secondary transition-colors cursor-pointer"
              >
                Ver políticas
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>

          {/* Separador */}
          <div className="animate-element animate-delay-700 relative flex items-center justify-center">
            <span className="w-full border-t border-border"></span>
            <span className="px-4 text-sm text-muted-foreground bg-background absolute">
              O continúa con
            </span>
          </div>

          {/* Botón Google */}
          <GoogleLoginButton />

          {/* Link crear cuenta */}
          <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
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
