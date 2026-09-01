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
        ¿Cuál es tu principal objetivo al aprender?
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
          value="learn"
          emoji={<BookOpen className="w-6 h-6" />}
          title="Aprender desde cero"
          description="Quiero empezar por los conocimientos fundamentales."
        />

        <RadioCard
          value="update"
          emoji={<RefreshCcw className="w-6 h-6" />}
          title="Actualizar mis conocimientos"
          description="Ya tengo experiencia y quiero reforzar lo que sé."
        />

        <RadioCard
          value="practice"
          emoji={<Zap className="w-6 h-6" />}
          title="Prepararme para situaciones reales"
          description="Quiero aprender a aplicar lo que sé en la práctica."
        />

        <RadioCard
          value="certify"
          emoji={<ShieldCheck className="w-6 h-6" />}
          title="Obtener una certificación"
          description="Busco una formación que pueda acreditar."
        />

        <RadioCard
          value="explore"
          emoji={<Globe className="w-6 h-6" />}
          title="Explorar distintas especialidades"
          description="Quiero conocer opciones antes de decidir."
        />
      </RadioGroup>
    </div>
  );
}
