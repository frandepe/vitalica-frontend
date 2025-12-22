import { requestMaterialUploadUrlTest } from "@/api";
import { FormEvent, useState } from "react";

export default function SubirPageTest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setSuccess(false);
    setError(null);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Pedir URL firmada al backend
      const response = await requestMaterialUploadUrlTest(
        "COURSE_ID_ACA",
        selectedFile
      );
      console.log("response", response);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error generando URL de subida");
      }

      const { uploadUrl, key } = response.data;

      // 2️⃣ Subir archivo directo a S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadRes.ok) {
        throw new Error("Error subiendo archivo a S3");
      }

      // 3️⃣ (Opcional) confirmar subida al backend
      // await confirmMaterialUpload("COURSE_ID_ACA", key);

      setSuccess(true);
      console.log("Archivo subido correctamente:", key);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-4">
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="file"
          accept=".pdf,.zip,.doc,.docx,.txt"
          onChange={handleFileChange}
        />

        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="bg-blue-500 p-2 rounded-md text-white disabled:opacity-50"
        >
          {loading ? "Subiendo..." : "Subir archivo"}
        </button>
      </form>

      {success && (
        <p className="text-green-600 text-sm">Archivo subido correctamente</p>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
