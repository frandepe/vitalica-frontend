import { useState } from "react";
import { Button } from "../ui/button";
import { getEmailByVerificationToken, sendValidationEmail } from "@/api";
import { useToast } from "../ui/toast";

import { useIntervalClick } from "@/hooks/useIntervalClick";
import { Activity, Loader } from "lucide-react";
import { Link } from "react-router-dom";

export const ExpiredToken = () => {
  const { timer, isResendDisabled, setIsResendDisabled, setTimer } =
    useIntervalClick();
  const { showToast } = useToast();
  const [isSending, setIsSending] = useState(false);

  // Obtener token de la URL
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  // Reenvío de email
  const handleResendEmail = async () => {
    if (!token) return;

    setIsSending(true);

    try {
      // 1️⃣ Obtener email desde el token
      const res = await getEmailByVerificationToken(token);
      console.log("resres", res);

      if (!res.success || !res.data) {
        showToast("No se pudo obtener el email", "error", "top-right");
        setIsSending(false);
        return;
      }

      // 2️⃣ Enviar email de verificación
      const resEmail = await sendValidationEmail({
        firstName: "Usuario",
        email: res.data.email || "",
      });

      if (resEmail?.success) {
        showToast(
          "Verificación de email enviada. Revisa tu bandeja de entrada",
          "info",
          "top-right"
        );
        setIsResendDisabled(true);
        setTimer(20);
      } else {
        showToast(
          "Falló el envío del correo electrónico",
          "error",
          "top-right"
        );
      }
    } catch (error) {
      console.error("Error al reenviar email de verificación:", error);
      showToast("Ocurrió un error inesperado", "error", "top-right");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div className="text-center">
        <h1 className="text-5xl font-bold">Token Expirado</h1>
        <p className="text-center text-lg font-light mt-4">
          Por favor reenvía el email de verificación.
        </p>
        <p className="mb-8 text-center mt-2">
          Tu token de usuario no es válido o ha expirado. Si crees que esto es
          un error, contactá al{" "}
          <Link className="underline" to="/soporte">
            soporte.
          </Link>{" "}
          <strong>¡Gracias!</strong>
        </p>

        <div className="flex justify-center gap-2 flex-wrap">
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
          <Button className="gap-2 flex">
            Inicio <Activity />
          </Button>
        </div>
      </div>

      {isResendDisabled && (
        <p className="text-center text-green-500 mt-4">
          Te hemos enviado un email a tu correo
        </p>
      )}
    </div>
  );
};
