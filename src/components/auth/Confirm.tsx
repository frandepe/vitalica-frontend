import { Activity, CircleCheckBig } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const Confirm = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-4">
      <div className="space-y-4">
        <h2 className="text-5xl font-bold">¡Felicitaciones!</h2>
        <p className="text-xl">
          Tu cuenta ha sido confirmada. Ahora podés acceder a nuestros cursos de
          emergencias médicas y empezar a capacitarte.
        </p>
        <div className="flex justify-center">
          <CircleCheckBig size={30} />
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={() => navigate("/auth/login")} variant="secondary">
          Inicia sesión
        </Button>
        <Button className="gap-2 flex">
          Inicio <Activity />
        </Button>
      </div>
    </div>
  );
};
