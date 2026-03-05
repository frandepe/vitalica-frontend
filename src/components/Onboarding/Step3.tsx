import { useFormContext } from "react-hook-form";
import { RadioGroup, RadioCard } from "../RadioGroups/RadioGroupOnboarding";
import { BookOpen, RefreshCcw, Zap, ShieldCheck, Globe } from "lucide-react";

export default function Step3({
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
    setStep(() => 4);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 space-y-6 text-center">
      <h2 className="text-2xl font-semibold">
        ¿Qué estás buscando en Vitalica?
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        Selecciona la opción que mejor refleje tu objetivo.
      </p>

      <RadioGroup
        value={selectedGoal}
        className="w-full max-w-md space-y-3"
        onValueChange={handleSelectGoal}
      >
        <RadioCard
          value="learn"
          emoji={<BookOpen className="w-6 h-6" />}
          title="Aprender desde cero"
          description="No tengo formación previa."
        />
        <RadioCard
          value="update"
          emoji={<RefreshCcw className="w-6 h-6" />}
          title="Actualizar / reforzar conocimientos"
          description="Ya tengo base y quiero mantenerme al día."
        />
        <RadioCard
          value="practice"
          emoji={<Zap className="w-6 h-6" />}
          title="Prepararme para situaciones reales"
          description="Enfoque práctico, escenarios y toma de decisiones."
        />
        <RadioCard
          value="certify"
          emoji={<ShieldCheck className="w-6 h-6" />}
          title="Certificar mis conocimientos"
          description="Me importa el respaldo y la validación."
        />
        <RadioCard
          value="explore"
          emoji={<Globe className="w-6 h-6" />}
          title="Explorar distintas especialidades"
          description="Aún no lo tengo claro."
        />
      </RadioGroup>
    </div>
  );
}
