import { Controller, useFormContext } from "react-hook-form";
import { FileUpload } from "@/components/FileUpload";
import { VideoUploadCard } from "@/components/VideoUpload";
import { Separator } from "@/components/ui/separator";
import { CircleCheckBig, Clapperboard, ImagePlus } from "lucide-react";
import { Progress } from "@/components/ui/progress-bar";

export const Step2 = ({
  onThumbnailReady,
  onPromoVideoUpload,
  uploadStatus,
  uploadProgress,
}: {
  onThumbnailReady: (base64: string) => void;
  onPromoVideoUpload: (file: File) => Promise<void>;
  uploadStatus: string;
  uploadProgress: number;
}) => {
  const { control, watch } = useFormContext(); // usa el contexto del <FormProvider>

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2 mb-2">
        <ImagePlus />
        Miniatura
      </h2>
      <Controller
        name="thumbnail"
        control={control}
        rules={{
          validate: (files) => {
            const file = files?.[0];
            if (!file) return true;
            const maxSizeInBytes = 4 * 1024 * 1024;
            return (
              file.size <= maxSizeInBytes ||
              "El archivo supera el límite de 4 MB"
            );
          },
        }}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <>
            <FileUpload
              onChange={onChange}
              onThumbnailReady={onThumbnailReady}
              existingUrl={watch("thumbnailUrl")}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error.message}</p>
            )}
          </>
        )}
      />
      <Separator className="my-6" />
      <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2 mb-2">
        <Clapperboard />
        Video promocional
      </h2>
      {uploadProgress > 0 && (
        <div className="space-y-3 max-w-sm w-full mx-auto mb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">
              {uploadStatus === "¡Video guardado!" ? (
                <CircleCheckBig className="text-primary" />
              ) : (
                "Procesando video..."
              )}
            </span>
            <span className="text-xs text-muted-foreground ">
              {uploadStatus}
            </span>
          </div>
          <Progress
            value={uploadProgress}
            showValue
            className="w-full"
            size="sm"
          />
        </div>
      )}
      <Controller
        name="promoVideoFile"
        control={control}
        // rules={{ required: "El video es obligatorio" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <VideoUploadCard
              value={value}
              // onChange={onChange}
              onChange={async (file) => {
                if (!file) return; // ⬅️ Solución: evita llamar con null
                onChange(file);
                await onPromoVideoUpload(file);
              }}
              title="Video promocional"
              description="Subí un video promocional de tu curso para captar la atención de los estudiantes. Asegurate de que sea claro, breve y muestre el valor de tu contenido."
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

// 🎬 Step 2 – Multimedia Imagen miniatura (thumbnailUrl) Video promocional
//   (promoVideoUrl) (opcional)

// muxPromoAssetId String?  @db.VarChar(255)
// muxPlaybacktId String?  @db.VarChar(255)
