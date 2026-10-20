import { connectMP } from "@/api";
import { Button } from "../ui/button";

export const MercadoPagoConnect = () => {
  const handleConnectMP = async () => {
    try {
      const res = await connectMP();
      console.log("res connectMP front", res);

      const authUrl = res?.data?.authUrl;
      console.log("authUrl", authUrl);

      if (!authUrl) {
        throw new Error("No se recibió la URL de autorización");
      }

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error conectando Mercado Pago", error);
    }
  };
  return (
    <Button
      type="button"
      onClick={handleConnectMP}
      className="
        flex items-center gap-3
        bg-[#009EE3] hover:bg-[#0085C3]
        text-white
        px-6 py-3
        rounded-lg
        font-medium
        transition-colors
      "
    >
      {/* TODO: La imagen deberia ser blanca */}
      <img
        src="/Svgs/mercado-pago-svg.svg"
        alt="Mercado Pago"
        className="w-10 h-10 rounded-sm p-0.5"
      />
      Conectar Mercado Pago
    </Button>
  );
};

// OPCIÓN 1 (la correcta): OAuth Marketplace

// Es la forma oficial.

// Flujo:

// Instructor hace click en
// 👉 “Conectar mi cuenta de Mercado Pago”

// Autoriza a Vitalica

// Mercado Pago te devuelve:

// access_token

// user_id (collector_id) ← ESTE

// Guardás ese ID en tu DB

// Ventajas:

// Legal

// Escalable

// MP no te rompe las bolas después
