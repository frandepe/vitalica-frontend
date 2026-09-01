import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadIcon } from "lucide-react";
import { cn } from "@/utils/cn";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const FileUpload = ({
  onChange,
  onThumbnailReady,
  existingUrl,
}: {
  onChange?: (files: File[]) => void;
  onThumbnailReady?: (base64: string) => void;
  existingUrl?: string | null;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (newFiles: File[]) => {
    const firstImage = newFiles[0];
    if (!firstImage) return;

    setFiles([firstImage]);
    onChange?.([firstImage]);

    if (onThumbnailReady) {
      const base64 = await convertToBase64(firstImage);
      onThumbnailReady(base64);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // --- Drag & Drop handlers ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      // opcional: validar tipo (solo imágenes)
      const validFiles = droppedFiles.filter((f) =>
        f.type.startsWith("image/")
      );
      handleFileChange(validFiles);
    }
  };

  return (
    <div
      className="w-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="image/*"
          multiple={false}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="relative w-full mt-10 max-w-xl mx-auto">
          {/* SI SUBIÓ UNA IMAGEN → mostrar esa */}
          {files.length > 0 && (
            <motion.div
              key={"file-preview"}
              layoutId="file-upload"
              className={cn(
                "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start p-4 mt-4 w-full mx-auto rounded-md",
                "shadow-sm"
              )}
            >
              <div className="flex justify-center w-full items-center">
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={URL.createObjectURL(files[0])}
                  alt="Preview"
                  width={150}
                  height={150}
                  className="rounded-lg"
                />
              </div>

              <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                <motion.p className="text-base truncate max-w-xs">
                  {files[0].name}
                </motion.p>
                <motion.p className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800">
                  {files[0].type}
                </motion.p>
                <motion.p className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm">
                  {(files[0].size / (1024 * 1024)).toFixed(2)} MB
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* SI NO SUBIÓ nada pero EXISTE en DB → mostrar existingUrl */}
          {!files.length && existingUrl && (
            <motion.div
              layoutId="file-upload"
              className="relative overflow-hidden z-40 bg-white dark:bg-neutral-900 p-4 mt-4 w-full mx-auto rounded-md shadow-sm"
            >
              <div className="flex justify-center w-full items-center">
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={existingUrl}
                  alt="Thumbnail guardado"
                  width={150}
                  height={150}
                  className="rounded-lg"
                />
              </div>
            </motion.div>
          )}

          {/* SI NO SUBIÓ nada y NO HAY existingUrl → placeholder */}
          {!files.length && !existingUrl && (
            <>
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <UploadIcon className="h-4 w-4" />
                  </motion.p>
                ) : (
                  <UploadIcon className="h-4 w-4" />
                )}
              </motion.div>

              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              />
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
