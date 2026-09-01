import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { updateUserOnboarding } from "@/api";
import { useState } from "react";
import { IOnboarding } from "@/types/auth.types";

export default function Step6Instructor() {
  const { getValues } = useFormContext<IOnboarding>();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const finalizeOnboarding = async (redirectTo: string) => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const formData = getValues();
      await updateUserOnboarding(formData);
      navigate(redirectTo);
    } catch (err) {
      console.error("Error al actualizar onboarding:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 space-y-8 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">¡Ya podés empezar!</h1>
      <p className="text-lg text-zinc-600 max-w-xl">
        Para publicar cursos y ofrecer prácticas, primero necesitamos verificar
        tu perfil como instructor. Podés completar la solicitud ahora o seguir
        explorando y hacerlo más adelante.
      </p>

      <div className="flex gap-2">
        <Button
          size="lg"
          onClick={() => finalizeOnboarding("/dar-cursos")}
          disabled={isSaving}
        >
          Verificarme como instructor
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => finalizeOnboarding("/")}
          disabled={isSaving}
        >
          Explorar por mi cuenta
        </Button>
      </div>
    </div>
  );
}
