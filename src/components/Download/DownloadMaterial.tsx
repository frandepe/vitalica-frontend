import { requestMaterialDownloadUrl } from "@/api";
import { useState } from "react";
import { Button } from "../ui/button";

interface Material {
  key: string;
  originalName: string;
}

export const DownloadMaterial = ({ materials }: { materials: Material[] }) => {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (material: Material) => {
    try {
      setLoadingKey(material.key);
      setError(null);

      const response = await requestMaterialDownloadUrl(material.key);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error generando URL de descarga");
      }

      // Descarga directa
      window.location.href = response.data.url;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error descargando archivo");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        El siguiente material es exclusivo de esta lección
      </h2>

      <ul className="space-y-2 max-w-sm">
        {materials.map((material) => (
          <li
            key={material.key}
            className="flex items-center justify-between border border-foreground/20 p-2 rounded-md"
          >
            <span className="text-sm truncate">{material.originalName}</span>

            <Button
              onClick={() => handleDownload(material)}
              disabled={loadingKey === material.key}
              size="sm"
            >
              {loadingKey === material.key ? "Descargando..." : "Descargar"}
            </Button>
          </li>
        ))}
      </ul>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};
