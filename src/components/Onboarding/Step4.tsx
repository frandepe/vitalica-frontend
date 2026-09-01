import { useFormContext } from "react-hook-form";
import { RadioGroup, RadioCard } from "../RadioGroups/RadioGroupOnboarding";
import { Book, Users, DollarSign, Globe, Compass } from "lucide-react";

export default function Step4({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { setValue, watch } = useFormContext<{
    primaryGoal?: string;
    hasCompletedOnboarding: boolean;
  }>();
  const selectedGoal = watch("primaryGoal") || "";

  const handleSelectGoal = (goal: string) => {
    setValue("primaryGoal", goal);
    setValue("hasCompletedOnboarding", true);
    setStep(() => 5);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 space-y-6 text-center">
      <h2 className="text-2xl font-semibold">
        ¿Cuál es tu principal objetivo como instructor?
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        Elegí la opción que mejor represente lo que buscás.
      </p>

      <RadioGroup
        value={selectedGoal}
        className="w-full max-w-md space-y-3"
        onValueChange={handleSelectGoal}
      >
        <RadioCard
          value="create_courses"
          emoji={<Book className="w-6 h-6" />}
          title="Crear y publicar cursos"
          description="Quiero desarrollar mi propia propuesta de formación."
        />
        <RadioCard
          value="share_experience"
          emoji={<Users className="w-6 h-6" />}
          title="Compartir mi experiencia profesional"
          description="Quiero enseñar a partir de mi experiencia y conocimientos."
        />
        <RadioCard
          value="monetize_knowledge"
          emoji={<DollarSign className="w-6 h-6" />}
          title="Generar ingresos con mis cursos"
          description="Quiero obtener ingresos a partir de mi formación."
        />
        <RadioCard
          value="reach_more_students"
          emoji={<Globe className="w-6 h-6" />}
          title="Llegar a más alumnos"
          description="Quiero ampliar el alcance de mis cursos y prácticas."
        />
        <RadioCard
          value="exploring"
          emoji={<Compass className="w-6 h-6" />}
          title="Todavía estoy explorando la plataforma"
          description="Quiero conocer cómo funciona antes de decidir."
        />
      </RadioGroup>
    </div>
  );
}
