import { requestMaterialDownloadUrl } from "@/api";
import { useState } from "react";

interface Material {
  key: string;
  originalName: string;
}

export default function DownloadPageTest() {
  const [materials, setMaterials] = useState<Material[]>([
    {
      key: "courses/COURSE_ID_ACA/1db026eb9ba3352de370547a0526d310a0aa59ca588ef8ec9faa132da3c2291e-CV Franco De Paulo 2025.pdf",
      // key: "courses/COURSE_ID_ACA/9f967522ec8bc889cf0b6adf17202301c2e90746f24bacaad56aa281890f3442-CuponRapipago-b31063a7-9b1a-40bb-b611-aee0974c3956.pdf",
      originalName: "CuponRapipago.pdf",
    },
  ]);

  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (material: Material) => {
    try {
      setLoadingKey(material.key);
      setError(null);

      const response = await requestMaterialDownloadUrl(material.key);
      console.log("response", response);

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
    <div className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Material del curso</h2>

      <ul className="space-y-2">
        {materials.map((material) => (
          <li
            key={material.key}
            className="flex items-center justify-between border p-2 rounded-md"
          >
            <span className="text-sm truncate">{material.originalName}</span>

            <button
              onClick={() => handleDownload(material)}
              disabled={loadingKey === material.key}
              className="bg-green-600 text-white px-3 py-1 rounded-md disabled:opacity-50"
            >
              {loadingKey === material.key ? "Descargando..." : "Descargar"}
            </button>
          </li>
        ))}
      </ul>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
