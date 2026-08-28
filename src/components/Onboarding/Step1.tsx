import { Button } from "../ui/button";

type StepProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function Step1({ setStep }: StepProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main className="text-center flex flex-col items-center max-w-5xl">
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
          style={{ animation: "fade-in-up 0.8s ease-out 0.2s backwards" }}
        >
          Te damos la bienvenida a Vitalica
        </h1>

        <p
          className="text-foreground mt-6 text-lg md:text-xl"
          style={{ animation: "fade-in-up 0.8s ease-out 0.4s backwards" }}
        >
          Formación teórica online y práctica presencial con instructores
          certificados.
        </p>

        <Button
          className="mt-8 text-lg"
          style={{ animation: "fade-in-up 0.8s ease-out 0.6s backwards" }}
          onClick={() => setStep((prev) => prev + 1)}
        >
          Continuar
        </Button>
      </main>
    </div>
  );
}
