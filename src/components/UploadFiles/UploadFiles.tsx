import { ImageUp } from "lucide-react";
import type React from "react";
import { useState, useRef, useCallback } from "react";

interface FileData {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  preview: string | null;
}

interface ImageUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onFilesSelect?: (files: FileData[]) => void;
  onFilesRemove?: (files: FileData[]) => void;
  disabled?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  accept = "image/*",
  multiple = true,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 10,
  onFilesSelect = () => {},
  onFilesRemove = () => {},
  disabled = false,
  className = "",
}) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string[] => {
    const errors: string[] = [];

    if (file.size > maxSize) {
      errors.push(
        `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`
      );
    }

    if (!file.type.startsWith("image/")) {
      errors.push(`Only image files are allowed`);
    }

    return errors;
  };

  const processFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles: FileData[] = [];
      const fileErrors: string[] = [];

      const remainingSlots = maxFiles - files.length;

      if (remainingSlots <= 0) {
        fileErrors.push(
          `Maximum of ${maxFiles} images allowed. Please remove some images first.`
        );
        setErrors(fileErrors);
        return;
      }

      const filesToProcess = fileArray.slice(0, remainingSlots);

      if (fileArray.length > remainingSlots) {
        fileErrors.push(
          `Only ${remainingSlots} more image(s) can be added (maximum ${maxFiles} total).`
        );
      }

      filesToProcess.forEach((file) => {
        const fileValidationErrors = validateFile(file);
        if (fileValidationErrors.length === 0) {
          validFiles.push({
            file,
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.type.startsWith("image/")
              ? URL.createObjectURL(file)
              : null,
          });
        } else {
          fileErrors.push(`${file.name}: ${fileValidationErrors.join(", ")}`);
        }
      });

      if (!multiple) {
        setFiles(validFiles.slice(0, 1));
        onFilesSelect(validFiles.slice(0, 1));
      } else {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        onFilesSelect(updatedFiles);
      }

      setErrors(fileErrors);
    },
    [files, multiple, maxSize, maxFiles, onFilesSelect]
  );

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesRemove(updatedFiles);

    // Clean up preview URL
    const fileToRemove = files.find((f) => f.id === fileId);
    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
          ${
            isDragOver
              ? "border-ring bg-muted/50"
              : "border-input hover:border-border hover:bg-muted/20"
          }
        `}
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
                ? "Suelta las imágenes para subirlas"
                : "Haz clic o arrastra y suelta imágenes para subirlas"}
            </p>
            <p className="text-xs text-muted-foreground">
              Solo imágenes • Máx. {(maxSize / (1024 * 1024)).toFixed(1)} MB por
              imagen
              {multiple
                ? ` • Hasta ${maxFiles} imágenes (${files.length}/${maxFiles} subidas)`
                : " • Solo una imagen"}
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-xs text-destructive">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Selected images ({files.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-md border bg-muted/20"
              >
                <div className="text-lg">🖼️</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  disabled={disabled}
                  className="text-muted-foreground hover:text-destructive transition-colors duration-200 disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
