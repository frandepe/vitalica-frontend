import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInstructorApplicationById } from "@/api/adminEndpoints";
import { InstructorApplication } from "@/types/instructor.types";
import { FeedbackApplicationForm } from "@/components/Admin/FeedbackApplicationForm";
import { statusColors, t } from "@/constants/statusTranslations";
import { cn } from "@/utils/cn";

const InstructorApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [dataApp, setDataApp] = useState<InstructorApplication | null>(null);
  const [loading, setLoading] = useState(true);

  const getAppById = async () => {
    try {
      if (!id) return;
      const resp = await getInstructorApplicationById(id);
      setDataApp(resp.data);
    } catch (error) {
      console.error("Error al obtener la aplicación:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getAppById();
  }, [id]);

  if (!id) return <div>No se encontró el ID de la aplicación</div>;

  if (loading) return <div>Cargando datos...</div>;

  if (!dataApp) return <div>No se encontró la aplicación</div>;

  const {
    status,
    dniNumber,
    dniCountry,
    certificateType,
    enrollmentNumber,
    issuedBy,
    issueDate,
    expiryDate,
    reviewedAt,
    reviewedBy,
    reviewerNotes,
    documents,
    user,
  } = dataApp;

  return (
    <div className="min-h-screen pt-6">
      <h1 className="text-2xl font-semibold mb-4">
        Detalles de la aplicación del instructor
      </h1>

      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">ID:</span> {id}
        </p>
        <p>
          <span className="font-medium">Estado:</span>{" "}
          <span
            className={cn(
              "px-2 py-1 rounded text-white",
              statusColors[status] ?? "bg-gray-400"
            )}
          >
            {t("application", status)}
          </span>
        </p>
        <p>
          <span className="font-medium">País del DNI:</span> {dniCountry}
        </p>
        <p>
          <span className="font-medium">Número de DNI:</span> {dniNumber}
        </p>
        <p>
          <span className="font-medium">Tipo de certificado:</span>{" "}
          {certificateType}
        </p>
        <p>
          <span className="font-medium">Matrícula:</span> {enrollmentNumber}
        </p>
        <p>
          <span className="font-medium">Emitido por:</span> {issuedBy}
        </p>
        <p>
          <span className="font-medium">Fecha de emisión:</span>{" "}
          {new Date(issueDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Fecha de expiración:</span>{" "}
          {new Date(expiryDate).toLocaleDateString()}
        </p>
        {reviewedAt && (
          <p>
            <span className="font-medium">Revisado el:</span>{" "}
            {new Date(reviewedAt).toLocaleDateString()}
          </p>
        )}
        {(reviewedBy || reviewerNotes) && (
          <div className="rounded-xl bg-orange-100 border border-orange-300 p-4 shadow-sm">
            <h3 className="text-orange-800 font-semibold mb-2">
              Feedback del revisor
            </h3>

            {reviewedBy && (
              <p className="text-sm text-orange-900">
                <span className="font-medium">Revisado por:</span> {reviewedBy}
              </p>
            )}

            {reviewerNotes && (
              <p className="text-sm text-orange-900 mt-1">
                <span className="font-medium">Notas del revisor:</span>{" "}
                {reviewerNotes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Usuario */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">Datos del usuario</h2>
        <p>
          <span className="font-medium">Nombre y apellido:</span>{" "}
          {user?.firstName} {user.lastName}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user?.email}
        </p>
      </div>

      {/* Documentos */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">Documentos</h2>
        {documents.length === 0 && <p>No hay documentos cargados.</p>}

        {documents.map((doc) => (
          <div key={doc.id} className="mb-4">
            <p className="font-medium">Documento ID: {doc.id}</p>

            {doc.urlDni && (
              <div className="mt-2">
                <p className="font-medium">DNI:</p>
                <img
                  src={doc.urlDni}
                  alt="Documento DNI"
                  className="max-w-sm border rounded-lg mt-1"
                />
              </div>
            )}

            {doc.urlCertificate?.length > 0 && (
              <div className="mt-3">
                <p className="font-medium">Certificados:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {doc.urlCertificate.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Certificado ${i + 1}`}
                      className="max-w-sm border rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <FeedbackApplicationForm applicationId={id} />
    </div>
  );
};

export default InstructorApplicationPage;
