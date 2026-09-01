import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function NotificationConfig() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Elegí cómo querés recibir avisos y recordatorios. Podés cambiar estas
          opciones en cualquier momento.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/10 transition">
          <Checkbox id="email" defaultChecked />
          <div>
            <Label htmlFor="email" className="font-medium cursor-pointer">
              Correos electrónicos
            </Label>
            <p className="text-sm text-muted-foreground">
              Recibí novedades, promociones y alertas de seguridad por correo.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/10 transition">
          <Checkbox id="push" />
          <div>
            <Label htmlFor="push" className="font-medium cursor-pointer">
              Notificaciones push
            </Label>
            <p className="text-sm text-muted-foreground">
              Enterate al instante desde tu navegador o dispositivo móvil.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/10 transition">
          <Checkbox id="sms" />
          <div>
            <Label htmlFor="sms" className="font-medium cursor-pointer">
              Mensajes SMS
            </Label>
            <p className="text-sm text-muted-foreground">
              Recibí avisos urgentes directamente en tu celular.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NotificationConfig };
