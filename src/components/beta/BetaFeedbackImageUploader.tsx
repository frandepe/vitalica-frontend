import { ImageUp, X } from "lucide-react";
import { useRef, useState } from "react";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type BetaFeedbackImage = {
  id: string;
  file: File;
  preview: string;
};

type BetaFeedbackImageUploaderProps = {
  value: BetaFeedbackImage[];
  onChange: (images: BetaFeedbackImage[]) => void;
  disabled?: boolean;
};

export function BetaFeedbackImageUploader({
  value,
  onChange,
  disabled = false,
}: BetaFeedbackImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (files: FileList | File[]) => {
    const selectedFiles = Array.from(files);
    setError(null);

    if (value.length >= MAX_IMAGES) {
      setError(`Podés adjuntar hasta ${MAX_IMAGES} imágenes.`);
      return;
    }

    if (value.length + selectedFiles.length > MAX_IMAGES) {
      setError(`Podés adjuntar hasta ${MAX_IMAGES} imágenes.`);
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) =>
        !ALLOWED_IMAGE_TYPES.includes(file.type) ||
        file.size > MAX_IMAGE_SIZE_BYTES,
    );

    if (invalidFile) {
      setError("Las imágenes deben ser JPG, PNG o WEBP y pesar hasta 5 MB.");
      return;
    }

    const nextImages = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    onChange([...value, ...nextImages]);
  };

  const removeImage = (id: string) => {
    const image = value.find((item) => item.id === id);
    if (image) URL.revokeObjectURL(image.preview);
    setError(null);
    onChange(value.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-border-input bg-background px-4 py-8 text-center outline-none transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-primary/40 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ImageUp className="h-8 w-8 text-primary" />
        <span className="mt-3 text-sm font-medium text-foreground">
          Agregar imágenes
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          JPG, PNG o WEBP. Hasta 5 MB cada una. {value.length}/{MAX_IMAGES}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        disabled={disabled}
        className="hidden"
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {value.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            >
              <img
                src={image.preview}
                alt={`Imagen adjunta ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeImage(image.id)}
                aria-label={`Quitar imagen ${index + 1}`}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/95 text-foreground shadow-sm outline-none transition-colors duration-200 hover:bg-destructive hover:text-destructive-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
