import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Activity, ArrowRight } from "lucide-react";

export const InvalidToken = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center ">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold">Token inválido</h2>
        <p className="md:text-2xl">Por favor, contactá al soporte</p>
        <p>
          Parece que hay un problema con tu token de usuario, ya que parece ser
          inválido. Si crees que esto es un error, por favor contactá al
          soporte. <strong>¡Gracias!</strong>
        </p>
      </div>
      <div className="flex justify-center mt-6 gap-2">
        <Button
          onClick={() => navigate("/")}
          className="gap-2"
          variant="secondary"
        >
          Soporte
          <ArrowRight size={20} />
        </Button>
        <Button onClick={() => navigate("/")} className="gap-2">
          Inicio
          <Activity size={20} />
        </Button>
      </div>
    </div>
  );
};
