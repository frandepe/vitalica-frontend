import { deleteLessonMaterial, requestMaterialUploadUrl } from "@/api";
import { Button } from "@/components/ui/button";
import { LessonMaterial } from "@/types/course.types";
import { FormEvent, useMemo, useRef, useState } from "react";

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const MAX_TOTAL_SIZE_BYTES = 50 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "docx",
  "xlsx",
  "pptx",
  "zip",
]);

const ACCEPT_ATTRIBUTE =
  ".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.pptx,.zip";

type UploadFileState = {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
};

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const getFileExtension = (fileName: string) =>
  fileName.split(".").pop()?.toLowerCase() ?? "";

export default function UploadMaterial({
  lessonId,
  existingMaterials,
  onMaterialsChange,
}: {
  lessonId: string;
  existingMaterials: LessonMaterial[];
  onMaterialsChange: (materials: LessonMaterial[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<UploadFileState[]>([]);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [generalSuccess, setGeneralSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currentTotalSize = useMemo(
    () => existingMaterials.reduce((sum, material) => sum + material.sizeBytes, 0),
    [existingMaterials],
  );

  const validateSelection = (files: File[]) => {
    const nextErrors: string[] = [];

    if (existingMaterials.length + files.length > MAX_FILES) {
      nextErrors.push("No podés superar los 5 archivos por lección.");
    }

    const nextTotalSize =
      currentTotalSize + files.reduce((sum, file) => sum + file.size, 0);

    if (nextTotalSize > MAX_TOTAL_SIZE_BYTES) {
      nextErrors.push("La lección no puede superar 50 MB en total.");
    }

    for (const file of files) {
      const extension = getFileExtension(file.name);

      if (!ALLOWED_EXTENSIONS.has(extension)) {
        nextErrors.push(
          `${file.name}: tipo no permitido. Solo se aceptan PDF, JPG, JPEG, PNG, DOCX, XLSX, PPTX y ZIP.`,
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        nextErrors.push(`${file.name}: supera el máximo de 20 MB.`);
      }
    }

    return nextErrors;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    setGeneralError(null);
    setGeneralSuccess(null);

    if (files.length === 0) {
      setSelectedFiles([]);
      return;
    }

    const validationErrors = validateSelection(files);

    if (validationErrors.length > 0) {
      setSelectedFiles(
        files.map((file) => ({
          file,
          status: "error",
          error:
            validationErrors.find((message) => message.startsWith(`${file.name}:`)) ??
            "Selección inválida",
        })),
      );
      setGeneralError(validationErrors.join(" "));
      return;
    }

    setSelectedFiles(
      files.map((file) => ({
        file,
        status: "pending",
      })),
    );
  };

  const resetSelection = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      setDeletingId(materialId);
      setGeneralError(null);
      setGeneralSuccess(null);

      const response = await deleteLessonMaterial(materialId);
      if (!response.success) {
        throw new Error(response.message || "No se pudo eliminar el material");
      }

      onMaterialsChange(
        existingMaterials.filter((material) => material.id !== materialId),
      );
      setGeneralSuccess("Material eliminado correctamente.");
    } catch (error: unknown) {
      setGeneralError(
        error instanceof Error ? error.message : "Error eliminando material",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || loading) return;

    setLoading(true);
    setGeneralError(null);
    setGeneralSuccess(null);

    let successCount = 0;
    let failureCount = 0;
    let nextMaterials = [...existingMaterials];
    const nextSelected = [...selectedFiles];

    for (let index = 0; index < nextSelected.length; index += 1) {
      const entry = nextSelected[index];
      nextSelected[index] = { ...entry, status: "uploading", error: undefined };
      setSelectedFiles([...nextSelected]);

      let createdMaterialId: string | null = null;

      try {
        const response = await requestMaterialUploadUrl(lessonId, entry.file);

        if (!response.success || !response.data || !response.data.material) {
          throw new Error(response.message || "Error generando URL de subida");
        }

        createdMaterialId = response.data.material.id;

        const uploadRes = await fetch(response.data.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": entry.file.type,
          },
          body: entry.file,
        });

        if (!uploadRes.ok) {
          throw new Error("Error subiendo archivo");
        }

        nextMaterials = [...nextMaterials, response.data.material as LessonMaterial]
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        onMaterialsChange(nextMaterials);
        nextSelected[index] = { ...entry, status: "success" };
        successCount += 1;
      } catch (error: unknown) {
        if (createdMaterialId) {
          await deleteLessonMaterial(createdMaterialId);
        }

        nextSelected[index] = {
          ...entry,
          status: "error",
          error: error instanceof Error ? error.message : "Error subiendo archivo",
        };
        failureCount += 1;
      }

      setSelectedFiles([...nextSelected]);
    }

    if (successCount > 0 && failureCount === 0) {
      setGeneralSuccess(
        successCount === 1
          ? "Archivo subido correctamente."
          : `${successCount} archivos subidos correctamente.`,
      );
      resetSelection();
    } else if (successCount > 0 && failureCount > 0) {
      setGeneralSuccess(`${successCount} archivos subidos correctamente.`);
      setGeneralError(`${failureCount} archivos no se pudieron subir.`);
    } else if (failureCount > 0) {
      setGeneralError(
        failureCount === 1
          ? "No se pudo subir el archivo seleccionado."
          : `No se pudieron subir ${failureCount} archivos.`,
      );
    }

    setLoading(false);
  };

  const remainingSlots = MAX_FILES - existingMaterials.length;
  const remainingBytes = Math.max(0, MAX_TOTAL_SIZE_BYTES - currentTotalSize);
  const canSubmit = selectedFiles.some((entry) => entry.status === "pending");

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-border bg-background p-5"
      >
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-lg border border-dashed border-muted-foreground/40 p-6 text-center transition hover:border-muted-foreground"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPT_ATTRIBUTE}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="space-y-1">
            <p className="text-sm font-medium">
              Subir materiales complementarios de la lección
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, JPG, JPEG, PNG, DOCX, XLSX, PPTX o ZIP
            </p>
            <p className="text-xs text-muted-foreground">
              Hasta {remainingSlots} archivos más · {formatBytes(remainingBytes)} disponibles
            </p>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2 rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Archivos seleccionados
            </p>
            <ul className="space-y-2">
              {selectedFiles.map((entry) => (
                <li
                  key={`${entry.file.name}-${entry.file.size}-${entry.file.lastModified}`}
                  className="rounded-md border border-border/60 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {entry.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(entry.file.size)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {entry.status === "pending" && "Listo para subir"}
                      {entry.status === "uploading" && "Subiendo..."}
                      {entry.status === "success" && "Subido"}
                      {entry.status === "error" && "Error"}
                    </span>
                  </div>
                  {entry.error && (
                    <p className="mt-1 text-xs text-red-600">{entry.error}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2 rounded-md border border-border p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Materiales cargados
          </p>

          {existingMaterials.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Esta lección no tiene materiales complementarios.
            </p>
          ) : (
            <ul className="space-y-2">
              {existingMaterials.map((material) => (
                <li
                  key={material.id}
                  className="flex flex-col gap-3 rounded-md border border-border/60 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {material.originalName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {material.type} · {formatBytes(material.sizeBytes)}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={deletingId === material.id || loading}
                    onClick={() => handleDeleteMaterial(material.id)}
                  >
                    {deletingId === material.id ? "Eliminando..." : "Eliminar"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full"
            size="sm"
          >
            {loading ? "Subiendo archivos..." : "Subir archivos"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading || selectedFiles.length === 0}
            onClick={resetSelection}
          >
            Limpiar
          </Button>
        </div>

        {generalSuccess && (
          <p className="text-xs text-green-600">{generalSuccess}</p>
        )}

        {generalError && <p className="text-xs text-red-600">{generalError}</p>}
      </form>
    </div>
  );
}
