import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

import { updateAvatarProfile } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { processAvatarFile } from "@/utils/avatar-processing";
import { useToast } from "../ui/toast";
import { OptimizedAvatarImage } from "./OptimizedAvatarImage";

function Avatar({ defaultImage }: { defaultImage?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(defaultImage);

  useEffect(() => setCurrentImage(defaultImage), [defaultImage]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const avatarBase64 = await processAvatarFile(file);
      const response = await updateAvatarProfile({ avatarBase64 });

      if (!response.success || !response.data?.avatarUrl) {
        throw new Error(response.message || "No se pudo actualizar la imagen");
      }

      setCurrentImage(response.data.avatarUrl);
      setUser({ ...user, ...response.data });
      showToast("Imagen actualizada", "success", "bottom-right");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la imagen",
        "error",
        "top-right",
      );
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="-mt-16 px-6">
      <div className="relative flex size-36 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm shadow-black/10">
        {currentImage && (
          <OptimizedAvatarImage
            source={currentImage}
            displaySize={160}
            className="h-full w-full object-cover"
            alt="Profile image"
          />
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="size-8 animate-spin text-white" />
          </div>
        )}

        <button
          type="button"
          disabled={isLoading}
          className="absolute flex size-8 cursor-pointer border-accent-foreground items-center justify-center rounded-full bg-black/20 text-white outline-offset-2 transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Change profile picture"
        >
          <ImagePlus size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Upload profile picture"
        />
      </div>
    </div>
  );
}

export default Avatar;
