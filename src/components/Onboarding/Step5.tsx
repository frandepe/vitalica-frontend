import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { updateUserOnboarding } from "@/api";
import { useEffect } from "react";
import { IOnboarding } from "@/types/auth.types";

export default function Step5() {
  const { getValues } = useFormContext<IOnboarding>();
  const navigate = useNavigate();

  // obtener todos los valores completados en el onboarding
  const formData = getValues();

  useEffect(() => {
    const saveOnboarding = async () => {
      try {
        await updateUserOnboarding(formData);
      } catch (err) {
        console.error("Error al actualizar onboarding:", err);
      }
    };

    saveOnboarding();
  }, []);

  const handleExplorePrimary = () => {
    navigate("/courses");
  };
  const handleExploreSecondary = () => {
    navigate("/");
  };
  console.log("formData", formData);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 space-y-8 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">
        ¡Bienvenido a Vitalica!
      </h1>
      <p className="text-lg text-zinc-600 max-w-xl">
        Ahora podemos personalizar tu experiencia según tus intereses. Explora
        cursos en emergencias prehospitalarias y empieza a aprender desde hoy.
      </p>

      <div className="flex gap-2">
        <Button size="lg" onClick={handleExplorePrimary}>
          Explorar cursos
        </Button>
        <Button variant="outline" size="lg" onClick={handleExploreSecondary}>
          Explorar por mi cuenta
        </Button>
      </div>
    </div>
  );
}
