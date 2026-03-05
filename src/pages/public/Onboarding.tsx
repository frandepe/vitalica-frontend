import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
} from "@/components/Onboarding";
import { BeamsBackground } from "@/components/Backgrounds/BeamsBackground";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { getUserOnboarding } from "@/api";

const steps = [Step1, Step2, Step3, Step4, Step5, Step6];

type OnboardingForm = {
  userType?: "STUDENT" | "PROFESSIONAL";
  primaryGoal?: string;
  hasCompletedOnboarding: boolean;
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const StepComponent = steps[step];

  const methods = useForm<OnboardingForm>({
    defaultValues: {
      userType: undefined,
      primaryGoal: undefined,
      hasCompletedOnboarding: false,
    },
  });

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const res = await getUserOnboarding();
        if (res.success && res.data.onboarding?.hasCompletedOnboarding) {
          navigate("/");
        }
      } catch (err) {
        console.error("Error al verificar onboarding:", err);
      }
    };

    checkOnboarding();
  }, [navigate]);

  const handleSkip = () => {
    navigate("/");
  };

  const handleBack = () => {
    setStep((currentStep) => {
      if (currentStep <= 0) return 0;

      switch (currentStep) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 3:
          return 1;
        case 4:
          return 2;
        case 5:
          return 3;
        default:
          return Math.max(currentStep - 1, 0);
      }
    });
  };

  const completed = step === 5 || step === 6;

  return (
    <FormProvider {...methods}>
      <BeamsBackground intensity="medium">
        {!completed && (
          <div className="absolute top-4 left-4 z-50 flex gap-2">
            {step > 0 && (
              <Button variant="link" size="sm" onClick={handleBack}>
                Atras
              </Button>
            )}
            <Button variant="link" size="sm" onClick={handleSkip}>
              Completar mas tarde
            </Button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {StepComponent && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <StepComponent setStep={setStep} />
            </motion.div>
          )}
        </AnimatePresence>
      </BeamsBackground>
    </FormProvider>
  );
};

export default Onboarding;
