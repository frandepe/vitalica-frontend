import { ImageUp, X } from "lucide-react";
import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";

interface FileData {
  file?: File;
  id: string;
  name?: string;
  size?: number;
  type?: string;
  preview: string; // Puede ser base64 o una URL existente
  isExisting?: boolean; // Flag para distinguir imágenes existentes de nuevas
}

interface ImageUploadProps {
  value?: string[]; // URLs existentes o base64
  onChange?: (data: { existing: string[]; new: File[] }) => void; // Retorna URLs existentes y archivos nuevos separados
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange = () => {},
  accept = "image/*",
  multiple = true,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 10,
  disabled = false,
  className = "",
}) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInternalUpdate = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Si es una actualización interna, no hacer nada
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    // Solo inicializar si no se ha hecho antes o si value cambió significativamente
    if (!initializedRef.current || value.length > 0) {
      initializedRef.current = true;
      setFiles(
        value.map((url, i) => ({
          id: `existing-${i}-${url.substring(0, 10)}`,
          preview: url,
          isExisting: true,
          name: `Imagen existente ${i + 1}`,
        }))
      );
    }
  }, [value]);

  const validateFile = (file: File): string[] => {
    const errs: string[] = [];
    if (file.size > maxSize)
      errs.push(
        `El archivo ${file.name} supera ${(maxSize / 1024 / 1024).toFixed(
          1
        )} MB`
      );
    if (!file.type.startsWith("image/"))
      errs.push(`El archivo ${file.name} no es una imagen`);
    return errs;
  };

  const notifyChanges = useCallback(
    (updatedFiles: FileData[]) => {
      const existingUrls = updatedFiles
        .filter((f) => f.isExisting)
        .map((f) => f.preview);

      const newFiles = updatedFiles
        .filter((f) => !f.isExisting && f.file)
        .map((f) => f.file!);

      isInternalUpdate.current = true;
      onChange({ existing: existingUrls, new: newFiles });
    },
    [onChange]
  );

  const processFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles: FileData[] = [];
      const fileErrors: string[] = [];
      const remainingSlots = maxFiles - files.length;

      fileArray.forEach((file) => {
        const validationErrors = validateFile(file);
        if (validationErrors.length > 0) {
          fileErrors.push(...validationErrors);
        }
      });

      // Si hay errores de validación de archivos, mostrarlos y no continuar
      if (fileErrors.length > 0) {
        setErrors(fileErrors);
        return;
      }

      // Ahora verificar la cantidad de archivos
      if (remainingSlots <= 0) {
        setErrors([`Máximo de ${maxFiles} imágenes alcanzado.`]);
        return;
      }

      const filesToProcess = fileArray.slice(0, remainingSlots);
      if (fileArray.length > remainingSlots) {
        fileErrors.push(`Solo puedes agregar ${remainingSlots} más.`);
      }

      filesToProcess.forEach((file) => {
        validFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: URL.createObjectURL(file),
          isExisting: false,
        });
      });

      const updated = [...files, ...validFiles];
      setFiles(updated);
      setErrors(fileErrors);
      notifyChanges(updated);
    },
    [files, maxFiles, notifyChanges, maxSize]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) processFiles(selectedFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(false);
    const dropped = e.dataTransfer.files;
    if (dropped.length > 0) processFiles(dropped);
  };

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove?.preview && fileToRemove.preview.startsWith("blob:")) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(updated);
    setErrors([]);
    notifyChanges(updated);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de subida */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
          ${
            isDragOver
              ? "border-primary bg-muted/50"
              : "border-input hover:border-border hover:bg-muted/20"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        <div className="space-y-3">
          <div className="text-4xl flex justify-center text-primary">
            <ImageUp size={40} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isDragOver
                ? "Suelta las imágenes aquí"
                : "Haz clic o arrastra y suelta imágenes para subir"}
            </p>
            <p className="text-xs text-muted-foreground">
              Máx. {(maxSize / (1024 * 1024)).toFixed(1)} MB • {files.length}/
              {maxFiles}
            </p>
          </div>
        </div>
      </div>

      {/* Errores */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-destructive">
              {err}
            </p>
          ))}
        </div>
      )}

      {/* Vista previa */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {files.map((f) => (
            <div
              key={f.id}
              className="relative w-28 h-28 rounded-md border overflow-hidden group"
            >
              <img
                src={f.preview || "/placeholder.svg"}
                alt={f.name || "imagen"}
                className="object-cover w-full h-full"
              />
              {f.isExisting && (
                <div className="absolute bottom-1 left-1 bg-primary/80 text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                  Guardada
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(f.id);
                }}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
