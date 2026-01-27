import { Controller, useFormContext } from "react-hook-form";
import MuxPlayer from "@mux/mux-player-react";
import { FileUpload } from "@/components/Uploads/FileUpload";
import { VideoUploadCard } from "@/components/Uploads/VideoUpload";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import {
  CircleCheckBig,
  Clapperboard,
  ImagePlus,
  InfoIcon,
  RotateCcw,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { TooltipIconButton } from "@/components/TooltipIconButton";

type Step2Props = {
  onThumbnailReady: (base64: string) => void;
  onPromoVideoUpload: (file: File) => Promise<void>;
  uploadStatus: string;
  uploadProgress: number;
};

export const Step2 = ({
  onThumbnailReady,
  onPromoVideoUpload,
  uploadStatus,
  uploadProgress,
}: Step2Props) => {
  const { control, watch } = useFormContext();
  const playbackId = watch("muxPlaybackId");

  const [isReplacingVideo, setIsReplacingVideo] = useState(false);
  const { user } = useAuth();

  return (
    <div>
      {/* ================= Miniatura ================= */}
      <h2 className="text-xl font-semibold text-slate-700 flex items-center mb-2">
        <ImagePlus />
        Miniatura{" "}
        <span className="font-normal text-muted-foreground text-sm ml-1">
          (opcional)
        </span>
        <TooltipIconButton
          tooltip="Si no quiere subir una miniatura personalizada, se generará automáticamente una a partir de su video promocional o una imagen por defecto."
          side="top"
        >
          <InfoIcon size={15} className="text-secondary" />
        </TooltipIconButton>
      </h2>

      <Controller
        name="thumbnail"
        control={control}
        render={({ field: { onChange } }) => (
          <FileUpload
            onChange={onChange}
            onThumbnailReady={onThumbnailReady}
            existingUrl={watch("thumbnailUrl")}
          />
        )}
      />

      <Separator className="my-6" />

      {/* ================= Video promocional ================= */}
      <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2 mb-2">
        <Clapperboard />
        Video promocional{" "}
        <span className="font-normal text-muted-foreground text-sm">
          (opcional)
        </span>
      </h2>

      {/* Progreso */}
      {uploadProgress > 0 && (
        <div className="space-y-3 max-w-sm w-full mx-auto mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2">
              {uploadStatus === "¡Video guardado!" && (
                <CircleCheckBig className="text-primary" />
              )}
              Subiendo video
            </span>
            <span className="text-xs text-muted-foreground">
              {uploadStatus}
            </span>
          </div>
          <Progress value={uploadProgress} showValue size="sm" />
        </div>
      )}

      <div className="relative w-full h-[550px] flex flex-col justify-center">
        {playbackId && !isReplacingVideo ? (
          /* ================= VIDEO LISTO ================= */
          <div className="flex flex-col items-center justify-center gap-4 h-full">
            <div className="w-full max-w-lg aspect-video rounded-xl overflow-hidden">
              <MuxPlayer
                playbackId={playbackId}
                className="w-full h-full mux-custom"
                metadata={{
                  video_id: playbackId,
                  video_title: "Video promocional del curso",
                  viewer_user_id: user.id.toString(),
                }}
                accentColor="#20ab9f"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsReplacingVideo(true)}
              className="flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reemplazar video
            </Button>
          </div>
        ) : (
          /* ================= SUBIDA ================= */
          <div className="flex flex-col justify-center h-full">
            <VideoUploadCard
              onChange={async (file) => {
                if (!file) return;
                await onPromoVideoUpload(file);
                setIsReplacingVideo(false);
              }}
              title="Video promocional"
              description="Subí un video promocional de tu curso."
            />

            {playbackId && (
              <Button
                type="button"
                variant="ghost"
                className="mt-4 mx-auto flex items-center gap-2"
                onClick={() => setIsReplacingVideo(false)}
              >
                <Undo2 size={16} />
                Volver al video actual
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
