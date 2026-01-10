import { requestMaterialUploadUrl } from "@/api";
import { Button } from "@/components/ui/button";
import { FormEvent, useRef, useState } from "react";

type ExistingMaterial = {
  key: string;
  type: string;
  mimeType: string;
};

export default function UploadMaterial({
  lessonId,
  existingMaterial,
}: {
  lessonId: string;
  existingMaterial?: ExistingMaterial | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMaterial = Boolean(existingMaterial);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setSuccess(false);
    setError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError(null);

      const response = await requestMaterialUploadUrl(lessonId, selectedFile);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error generando URL de subida");
      }

      const { uploadUrl } = response.data;

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadRes.ok) {
        throw new Error("Error subiendo archivo");
      }

      setSuccess(true);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };
  // TODO: Poder eliminar el material extra una vez subido
  return (
    <div className="">
      {/* <div className="max-w-lg"> */}
      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-border bg-background p-5 space-y-4"
      >
        {/* Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-lg border border-dashed p-6 text-center transition
            ${
              hasMaterial
                ? "border-amber-400/60 hover:border-amber-500"
                : "border-muted-foreground/40 hover:border-muted-foreground"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.zip,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {hasMaterial
                  ? "Modificar material extra de la lección"
                  : "Subir material extra de la lección (opcional)"}
              </p>

              <p className="text-xs text-muted-foreground">
                {hasMaterial
                  ? "Este archivo reemplazará al material actual"
                  : "PDF, Word, TXT o ZIP"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        {/* Material actual */}
        {hasMaterial && !selectedFile && (
          <div className="rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            Material actual cargado
          </div>
        )}

        {/* Acción */}
        <Button
          type="submit"
          disabled={loading || !selectedFile}
          className="w-full"
          size="sm"
        >
          {loading
            ? hasMaterial
              ? "Reemplazando archivo…"
              : "Subiendo archivo…"
            : hasMaterial
            ? "Reemplazar material"
            : "Subir archivo"}
        </Button>

        {/* Feedback */}
        {success && (
          <p className="text-xs text-green-600">
            {hasMaterial
              ? "Material actualizado correctamente"
              : "Archivo subido correctamente"}
          </p>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}
      </form>
    </div>
  );
}
