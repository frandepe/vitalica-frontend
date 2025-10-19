import { sendValidationEmail } from "@/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useIntervalClick } from "@/hooks/useIntervalClick";
import { DataValidationEmail } from "@/types/auth.types";
import { Loader, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// http://localhost:3000/verificar-email?token=571a9ffd-2ca8-4724-a254-14439be2638d

export const EmailConfirm = ({
  userData,
}: {
  userData: DataValidationEmail;
}) => {
  const navigate = useNavigate();
  const { timer, isResendDisabled, setIsResendDisabled, setTimer } =
    useIntervalClick();
  const { showToast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const handleResendEmail = async () => {
    try {
      setIsSending(true);

      const resEmail = await sendValidationEmail(userData);

      if (resEmail?.success) {
        showToast(
          "Verificación de email enviada. Revisa tu bandeja de entrada",
          "info",
          "top-right"
        );
        setIsResendDisabled(true);
        setTimer(15);
      } else {
        showToast(
          "Falló el envío del correo electrónico",
          "error",
          "top-right"
        );
      }
    } catch (error) {
      console.error("Error al reenviar email de verificación:", error);
      showToast("Error al reenviar el correo", "error", "top-right");
    } finally {
      setIsSending(false); // → vuelve al estado normal
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Solo un paso más</h2>
      <div className="flex items-center gap-2 mb-4">
        <Mail size={20} className="text-secondary" />
        <h2>Verifica tu dirección de correo electrónico</h2>
      </div>

      <p className="relative bottom-2 text-sm text-[#818181]">
        Hey {userData.firstName || ""}, hemos enviado un enlace de verificación
        al siguiente correo:
      </p>

      {userData.email ? (
        <p className="font-medium text-lg mt-4">{userData?.email}</p>
      ) : (
        <Loader />
      )}

      <p className="my-6 relative text-sm text-[#818181]">
        Simplemente haz clic en el enlace de ese correo para completar tu
        registro. Si no lo ves, es posible que debas{" "}
        <span className="font-bold">revisar tu carpeta de spam.</span>
      </p>

      <p className="mb-4 text-sm text-[#818181]">
        ¿Aún no encuentras el correo? No hay problema.
      </p>

      <div className="flex flex-col">
        <Button
          onClick={handleResendEmail}
          disabled={isResendDisabled || isSending}
          className="mb-2"
          variant="secondary"
        >
          {isSending ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin w-4 h-4" />
              Enviando...
            </div>
          ) : isResendDisabled ? (
            `Reenviar en ${timer} segundos`
          ) : (
            "Reenviar notificación al correo electrónico"
          )}
        </Button>

        <Button onClick={() => navigate("/")}>Inicio</Button>
      </div>
    </div>
  );
};
