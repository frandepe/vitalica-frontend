import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { sendInstructorInvitation } from "@/api";
import GlassmorphismHero from "@/components/Hero/GlassmorphismHero";
import ReasonsToTech from "@/components/Sections/ReasonsToTeach";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIntervalClick } from "@/hooks/useIntervalClick";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TeachesOnVitalica = () => {
  const navigate = useNavigate();
  const { timer, isResendDisabled, setIsResendDisabled, setTimer } =
    useIntervalClick();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleInviteInstructor = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setFeedback({
        type: "error",
        message: "Ingresá un correo para enviar la invitación.",
      });
      return;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setFeedback({
        type: "error",
        message: "Ingresá un email válido.",
      });
      return;
    }

    try {
      setIsSending(true);
      setFeedback(null);

      const response = await sendInstructorInvitation({
        email: normalizedEmail,
      });

      if (!response?.success) {
        setFeedback({
          type: "error",
          message:
            response?.message ||
            "No pudimos enviar la invitación. Intentá nuevamente.",
        });
        return;
      }

      setFeedback({
        type: "success",
        message: "Invitación enviada. La persona recibirá el correo en breve.",
      });
      setEmail("");
      setIsResendDisabled(true);
      setTimer(15);
    } catch {
      setFeedback({
        type: "error",
        message: "Ocurrió un error al enviar la invitación.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <GlassmorphismHero />
      <ReasonsToTech />
      <motion.div
        className="flex flex-col md:flex-row justify-center items-center gap-4 bg-gradient-to-r from-primary to-primary/80 text-white py-10 px-6 rounded-lg overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="absolute inset-0 bg-white/10 rounded-lg"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.h3
          className="text-2xl md:text-4xl font-bold relative z-10 text-center md:text-left"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Convertite en instructor ahora
        </motion.h3>

        <motion.button
          className="relative z-10 px-6 py-2 bg-white text-primary font-semibold rounded-md shadow-md hover:bg-white/90 transition-colors cursor-pointer"
          onClick={() => navigate("/solicitar-ser-instructor")}
          whileTap={{ scale: 0.95 }}
        >
          Unirme
        </motion.button>
      </motion.div>
      <div className="py-20 w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-sans font-bold">
            Sumá talento a Vitálica
          </h1>

          <p className="text-muted-foreground max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Si conocés a un instructor certificado, podés invitarlo a formar
            parte de esta experiencia. Ingresá su correo y le enviaremos la
            invitación.
          </p>

          <div className="w-full mt-4 relative z-10 flex gap-2">
            <Input
              type="email"
              placeholder="correo@instructor.com"
              className="flex-1"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (feedback) setFeedback(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (!isSending && !isResendDisabled) {
                    void handleInviteInstructor();
                  }
                }
              }}
              aria-label="Email para invitar instructor"
            />
            <Button
              className="whitespace-nowrap"
              onClick={() => void handleInviteInstructor()}
              disabled={isSending || isResendDisabled}
            >
              {isSending
                ? "Enviando..."
                : isResendDisabled
                  ? `Reenviar en ${timer}s`
                  : "Enviar invitación"}
            </Button>
          </div>
          {feedback ? (
            <p
              className={`mt-3 text-sm ${
                feedback.type === "success"
                  ? "text-emerald-600"
                  : "text-red-500"
              }`}
            >
              {feedback.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TeachesOnVitalica;
