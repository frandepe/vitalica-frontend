import { useState } from "react";
import { updateAvatarProfile } from "@/api";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ImagePlus, Loader2 } from "lucide-react";
import { fileToBase64 } from "@/utils/file-utils";
import { useToast } from "../ui/toast";

function Avatar({ defaultImage }: { defaultImage?: string }) {
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } =
    useImageUpload();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (imageData: string) => {
    try {
      setIsLoading(true);
      await updateAvatarProfile({ avatarBase64: imageData });

      showToast("Imagen actualizada", "success", "bottom-right");
    } catch {
      showToast("No se pudo actualizar la imagen", "error", "bottom-right");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChangeWithConversion = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      await onSubmit(base64);
      handleFileChange(e);
    } catch {
      showToast(
        "Error. Asegúrate de subir un archivo válido.",
        "error",
        "top-right"
      );
      setIsLoading(false);
    }
  };

  const currentImage = previewUrl || defaultImage;

  return (
    <div className="-mt-16 px-6">
      <div className="relative flex size-36 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm shadow-black/10">
        {currentImage && (
          <img
            src={currentImage}
            className="h-full w-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}

        {/* Loader overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="size-8 animate-spin text-white" />
          </div>
        )}

        <button
          type="button"
          disabled={isLoading}
          className="absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-offset-2 transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleThumbnailClick}
          aria-label="Change profile picture"
        >
          <ImagePlus size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChangeWithConversion}
          className="hidden"
          accept="image/*"
          aria-label="Upload profile picture"
        />
      </div>
    </div>
  );
}

export default Avatar;
