import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function Step6Instructor() {
  const { getValues } = useFormContext();
  const navigate = useNavigate();

  // obtener todos los valores completados en el onboarding
  const formData = getValues();

  const handleExplorePrimary = () => {
    navigate("/solicitar-ser-instructor"); // TODO: reemplazar con la ruta de cursos/instructores si hay
  };
  const handleExploreSecondary = () => {
    navigate("/"); // TODO: reemplazar con la ruta de cursos/instructores si hay
  };

  console.log("formData", formData);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 space-y-8 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">
        ¡Bienvenido a Vitalica!
      </h1>
      <p className="text-lg text-zinc-600 max-w-xl">
        ¡Ya estás listo para iniciar tu camino como instructor! Completá tu
        solicitud para ser verificado y poder crear cursos, editar tu perfil
        como instructor y gestionar alumnos.
      </p>

      <div className="flex gap-2">
        <Button size="lg" onClick={handleExplorePrimary}>
          Verificarme como instructor
        </Button>
        <Button variant="outline" size="lg" onClick={handleExploreSecondary}>
          Explorar por mi cuenta
        </Button>
      </div>
    </div>
  );
}
