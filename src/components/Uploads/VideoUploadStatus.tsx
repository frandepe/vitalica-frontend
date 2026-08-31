import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  UploadCloud,
  WifiOff,
} from "lucide-react";
import type { VideoUploadPhase } from "@/types/video-upload.types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress-bar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type VideoUploadStatusProps = {
  phase: VideoUploadPhase;
  status: string;
  progress: number;
  onRetry?: () => void;
  onCancel?: () => void;
  cancelDisabled?: boolean;
};

const phaseContent: Record<
  VideoUploadPhase,
  { title: string; icon: typeof UploadCloud }
> = {
  idle: { title: "Listo para subir", icon: UploadCloud },
  validating: { title: "Validando archivo", icon: Loader2 },
  preparing: { title: "Preparando carga segura", icon: Loader2 },
  uploading: { title: "Subiendo archivo", icon: UploadCloud },
  pausing: { title: "Pausando al terminar el bloque actual", icon: Loader2 },
  paused: { title: "Carga pausada", icon: UploadCloud },
  offline: { title: "Esperando conexión", icon: WifiOff },
  "transfer-complete": { title: "Carga completa", icon: CheckCircle2 },
  processing: { title: "Carga completa · Procesando video", icon: Loader2 },
  confirming: { title: "Video procesado · Guardando", icon: Loader2 },
  ready: { title: "Video listo", icon: CheckCircle2 },
  error: { title: "No se pudo completar la carga", icon: AlertCircle },
  aborted: { title: "Carga cancelada", icon: AlertCircle },
};

const spinningPhases: VideoUploadPhase[] = [
  "validating",
  "preparing",
  "processing",
  "confirming",
  "pausing",
];

export const VideoUploadStatus = ({
  phase,
  status,
  progress,
  onRetry,
  onCancel,
  cancelDisabled = false,
}: VideoUploadStatusProps) => {
  const { title, icon: StatusIcon } = phaseContent[phase];
  const isError = phase === "error";

  return (
    <div className="space-y-3 max-w-sm w-full mx-auto" aria-live="polite">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <StatusIcon
            aria-hidden="true"
            className={`size-4 shrink-0 ${
              isError ? "text-destructive" : "text-primary"
            } ${spinningPhases.includes(phase) ? "animate-spin" : ""}`}
          />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <span
          role="status"
          className="text-xs leading-5 text-muted-foreground text-right"
        >
          {status}
        </span>
      </div>

      <Progress value={progress} showValue size="sm" />

      <div className="flex flex-wrap gap-2">
        {isError && onRetry && (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        )}

        {onCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={cancelDisabled}
              >
                Cancelar carga
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cancelar la carga del video?</AlertDialogTitle>
                <AlertDialogDescription>
                  El archivo no se guardará. Si ya había un video, seguirá
                  disponible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Volver</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={cancelDisabled}
                  onClick={onCancel}
                >
                  Cancelar carga
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};
