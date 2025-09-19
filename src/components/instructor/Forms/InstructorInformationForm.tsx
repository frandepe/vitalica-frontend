import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/hooks/useCharacterLimits";
import { useId, useState } from "react";
import { UbicationSelect } from "./UbicationSelect";
import SpecialityChecks from "./SpecialityChecks";
import { FileCheck, FileQuestion, Settings } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import PaymentRadio from "./SelectPaymentMethod";
import { Separator } from "@/components/ui/separator";
import { CirclesImg } from "@/components/Banners/HeaderBanner";
import mask01 from "@/assets/Masks/mask-06.svg";
import banner1 from "/Banners/pago.jpg";
import banner2 from "/Banners/dinero.jpg";
import { Button } from "@/components/ui/button";

export const InstructorInformationForm = () => {
  const id = useId();

  // Configuración límite de biografía
  const maxLength = 180;
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
  });

  const [ciudad, setCiudad] = useState(""); // en ciudad aparece la ciudad y la provincia separadas por coma

  return (
    <div className="h-full relative space-y-6" id="instructor-information-form">
      <h3 className="text-2xl mt-6 flex gap-2 align-center">
        <Settings className="text-gray-700" /> Configura tu perfil de Instructor
      </h3>
      {/* Headline */}
      <div className="space-y-2">
        <Label htmlFor={`${id}-headline`}>Título profesional</Label>
        <Input
          id={`${id}-headline`}
          type="text"
          placeholder="Ej: Instructor certificado en atención prehospitalaria"
        />
      </div>

      {/* Biografía */}
      <div className="space-y-2">
        <Label htmlFor={`${id}-bio`}>Biografía</Label>
        <Textarea
          id={`${id}-bio`}
          placeholder="Escribe brevemente tu biografía..."
          defaultValue={value}
          maxLength={maxLength}
          onChange={handleChange}
          aria-describedby={`${id}-description`}
        />
        <p
          id={`${id}-description`}
          className="mt-2 text-xs text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <span>{limit - characterCount}</span> caracteres restantes
        </p>
      </div>

      {/* Ubicación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UbicationSelect onSelectCiudad={setCiudad} />
        <div className="space-y-2">
          <Label htmlFor={`${id}-zip`}>Código Postal</Label>
          <Input id={`${id}-zip`} placeholder="Ej: 1900" />
        </div>
      </div>
      <Separator className="my-6" />
      {/* Specialties - acá van tus checkboxes */}
      <h3 className="text-2xl mb-6">¿Cuáles son tus especialidades?</h3>
      <div className="flex justify-start">
        <SpecialityChecks />
        <div className="h-full">
          <Alert
            icon={FileCheck}
            variant="warning"
            title="Revisión de especialidades"
          >
            Podés seleccionar tus especialidades, pero antes de que se publiquen
            deberán ser revisadas y aprobadas por el administrador. Esto asegura
            que solo se muestren las áreas en las que estés certificado y que la
            plataforma mantenga la calidad de los cursos.
          </Alert>
        </div>
      </div>
      <Separator className="my-6" />

      {/* Payout info - apartado reservado */}
      <div className="flex justify-start">
        {/* TODO: agregar selector de payoutMethod */}
        {/* TODO: agregar input de payoutAccountId */}
        {/* TODO: agregar input de payoutEmail */}
        <CirclesImg maskSrc={mask01} imgCircles={banner1} />
        <div>
          <h3 className="text-2xl mb-6">Método de pago</h3>
          <PaymentRadio />
        </div>
        <CirclesImg maskSrc={mask01} imgCircles={banner2} />
      </div>

      {/* Explicación final */}
      <div className=""></div>
      <Alert
        icon={FileQuestion}
        variant="info"
        title="¿Por qué solicitamos esta información?"
      >
        Esta información nos permite verificar tu identidad, mostrar tu perfil
        de manera profesional a los estudiantes y garantizar que los pagos se
        procesen de forma segura y sin inconvenientes.
      </Alert>
      <Button>Guardar perfil</Button>
    </div>
  );
};

// Imgs sugeridas
// https://www.freepik.es/foto-gratis/impresionado-mirando-al-lado-joven-medico-vistiendo-uniforme-medico-estetoscopio-sosteniendo-efectivo-tarjeta-credito-aislado-pared-blanca_14110998.htm#fromView=search&page=1&position=31&uuid=e7a43faa-6fbb-4972-984a-53efe09ab0cf&query=payment+medicine
// https://www.freepik.es/foto-gratis/alegre-joven-medico-vistiendo-uniforme-medico-estetoscopio-sosteniendo-dinero-efectivo-mostrando-lengua-mirar-gesto-aislado-pared-blanca_15006070.htm#fromView=search&page=1&position=20&uuid=5aa912d4-6d72-45db-90b5-6298ead548a7&query=money+medicine
