import { requestMaterialDownloadUrl } from "@/api";
import { useState } from "react";
import { Button } from "../ui/button";

interface Material {
  id: string;
  originalName: string;
  sizeBytes: number;
  type: string;
}

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

export const DownloadMaterial = ({ materials }: { materials: Material[] }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (material: Material) => {
    try {
      setLoadingId(material.id);
      setError(null);

      const response = await requestMaterialDownloadUrl(material.id);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error generando URL de descarga");
      }

      window.location.href = response.data.url;
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error descargando archivo");
    } finally {
      setLoadingId(null);
    }
  };

  if (materials.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Esta lección no tiene materiales complementarios.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Material complementario de esta lección
      </h2>

      <ul className="space-y-2 max-w-2xl">
        {materials.map((material) => (
          <li
            key={material.id}
            className="flex flex-col gap-3 rounded-md border border-foreground/20 p-3 sm:flex-row sm:items-center sm:justify-between"
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
              onClick={() => handleDownload(material)}
              disabled={loadingId === material.id}
              size="sm"
            >
              {loadingId === material.id ? "Descargando..." : "Descargar"}
            </Button>
          </li>
        ))}
      </ul>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
