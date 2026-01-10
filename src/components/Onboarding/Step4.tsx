import { useFormContext } from "react-hook-form";
import { RadioGroup, RadioCard } from "../RadioGroups/RadioGroupOnboarding";
import { Book, Users, DollarSign, Globe, Compass } from "lucide-react";

export default function Step4({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { setValue } = useFormContext();

  const handleSelectGoal = (goal: string) => {
    setValue("primaryGoal", goal);
    setValue("hasCompletedOnboarding", true);
    setStep(() => 5);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 space-y-6 text-center">
      <h2 className="text-2xl font-semibold">
        ¿Qué querés hacer como instructor en Vitalica?
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        Selecciona la opción que mejor refleje tu objetivo.
      </p>

      <RadioGroup
        defaultValue=""
        className="w-full max-w-md space-y-3"
        onValueChange={handleSelectGoal}
      >
        <RadioCard
          value="create_courses"
          emoji={<Book className="w-6 h-6" />}
          title="Crear y publicar cursos"
          description="Ya sé qué enseñar."
        />
        <RadioCard
          value="share_experience"
          emoji={<Users className="w-6 h-6" />}
          title="Compartir mi experiencia profesional"
          description="Perfil fuerte, contenido más avanzado."
        />
        <RadioCard
          value="monetize_knowledge"
          emoji={<DollarSign className="w-6 h-6" />}
          title="Monetizar mis conocimientos"
          description="Enfoque negocio."
        />
        <RadioCard
          value="reach_more_students"
          emoji={<Globe className="w-6 h-6" />}
          title="Llegar a más alumnos"
          description="Escalabilidad, visibilidad."
        />
        <RadioCard
          value="exploring"
          emoji={<Compass className="w-6 h-6" />}
          title="Todavía estoy explorando la plataforma"
          description="No hay apuro."
        />
      </RadioGroup>
    </div>
  );
}
