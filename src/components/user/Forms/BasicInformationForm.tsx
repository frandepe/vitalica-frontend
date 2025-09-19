import { TooltipIconButton } from "@/components/TooltipIconButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { useId } from "react";

export const BasicInformationForm = () => {
  const id = useId();
  return (
    <form className="flex-1 flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor={`${id}-first-name`}>
            Nombre <span className="text-red-700">*</span>
          </Label>
          <Input
            id={`${id}-first-name`}
            placeholder="Matt"
            defaultValue="Margaret"
            type="text"
            required
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor={`${id}-last-name`}>
            Apellido <span className="text-red-700">*</span>
          </Label>
          <Input
            id={`${id}-last-name`}
            placeholder="Welsh"
            defaultValue="Villard"
            type="text"
            required
          />
        </div>
      </div>
      {/* Podés agregar más inputs acá */}

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor={`${id}-first-name`} className="flex items-center">
            Teléfono
            <TooltipIconButton
              tooltip="Este campo se usa solo con fines administrativos, no será mostrado en tu perfil"
              side="top"
            >
              <Info className="h-4 w-4" />
            </TooltipIconButton>
          </Label>
          <Input
            id={`${id}-first-name`}
            placeholder="+54 011 2345 6789"
            defaultValue=""
            type="text"
            required
          />
        </div>
        <div className="flex-1 space-y-2">
          <Button variant="outline" className="w-full sm:mt-6">
            Guardar configuración básica
          </Button>
        </div>
      </div>
    </form>
  );
};
