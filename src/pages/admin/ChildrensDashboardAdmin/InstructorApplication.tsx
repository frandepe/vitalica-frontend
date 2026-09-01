import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  approveInstructorCredentialAdmin,
  getInstructorApplicationById,
  rejectInstructorCredentialAdmin,
} from "@/api/adminEndpoints";
import {
  InstructorApplication,
  InstructorCertification,
  InstructorCredential,
  InstructorCredentialType,
  InstructorSpecialtyRequest,
} from "@/types/instructor.types";
import { FeedbackApplicationForm } from "@/components/Admin/FeedbackApplicationForm";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

import { statusColorsInstructorApplication } from "@/constants";
import { t } from "@/utils/translations";

const credentialTypeLabels: Record<InstructorCredentialType, string> = {
  PROFESSIONAL_DEGREE: "Titulo profesional",
  PROFESSIONAL_LICENSE: "Matricula profesional",
  INSTRUCTOR_CERTIFICATION: "Certificacion como instructor",
  COMPLEMENTARY_TRAINING: "Formacion complementaria",
  PROFESSIONAL_EXPERIENCE: "Experiencia profesional",
  TEACHING_EXPERIENCE: "Experiencia docente",
};

const specialtyRequestStatusLabels: Record<
  InstructorSpecialtyRequest["status"],
  { text: string; className: string }
> = {
  SUBMITTED: {
    text: "Enviada",
    className: "bg-blue-100 text-blue-800",
  },
  UNDER_REVIEW: {
    text: "En revision",
    className: "bg-amber-100 text-amber-800",
  },
  APPROVED: {
    text: "Aprobada",
    className: "bg-green-100 text-green-800",
  },
  REJECTED: {
    text: "Rechazada",
    className: "bg-red-100 text-red-800",
  },
};

const credentialStatusLabels: Record<
  InstructorCredential["status"],
  { text: string; className: string }
> = {
  PENDING: {
    text: "Pendiente",
    className: "bg-amber-100 text-amber-800",
  },
  APPROVED: {
    text: "Aprobada",
    className: "bg-green-100 text-green-800",
  },
};

const formatNullableDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString() : null;

const formatSentAt = (value: string) =>
  new Date(value).toLocaleString("es-AR");

const legacyCertificationToCredential = (
  certification: InstructorCertification,
): InstructorCredential => ({
  id: certification.id,
  applicationId: certification.applicationId,
  type: "INSTRUCTOR_CERTIFICATION",
  title: certification.certificationType,
  organization: certification.issuer,
  credentialNumber: certification.credentialNumber,
  jurisdiction: null,
  issuedAt: certification.issuedAt,
  expiresAt: certification.expiresAt,
  roleOrArea: null,
  startDate: null,
  endDate: null,
  currentlyActive: false,
  description: null,
  imageUrls: certification.imageUrls,
  imageUrlIds: certification.imageUrlIds,
  status: "APPROVED",
  approvedAt: null,
  createdAt: certification.createdAt,
  updatedAt: certification.updatedAt,
});

const CredentialField = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => {
  if (!value) return null;

  return (
    <p>
      <span className="font-medium">{label}:</span> {value}
    </p>
  );
};

const InstructorApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [dataApp, setDataApp] = useState<InstructorApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingCredentialId, setProcessingCredentialId] = useState<
    string | null
  >(null);

  const getAppById = useCallback(async () => {
    try {
      if (!id) return;
      const resp = await getInstructorApplicationById(id);
      setDataApp(resp.data);
    } catch (error) {
      console.error("Error al obtener la aplicacion:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) getAppById();
  }, [getAppById, id]);

  const handleApproveCredential = async (credentialId: string) => {
    if (!id) return;

    setProcessingCredentialId(credentialId);
    try {
      const response = await approveInstructorCredentialAdmin(id, credentialId);
      if (!response.success) {
        showToast(
          response.message || "No se pudo aprobar la credencial",
          "error",
          "bottom-right",
        );
        return;
      }

      showToast("Credencial aprobada", "success", "bottom-right");
      await getAppById();
    } catch (error) {
      console.error("Error al aprobar credencial:", error);
      showToast("No se pudo aprobar la credencial", "error", "bottom-right");
    } finally {
      setProcessingCredentialId(null);
    }
  };

  const handleRejectCredential = async (credentialId: string) => {
    if (!id) return;

    setProcessingCredentialId(credentialId);
    try {
      const response = await rejectInstructorCredentialAdmin(id, credentialId);
      if (!response.success) {
        showToast(
          response.message || "No se pudo rechazar la credencial",
          "error",
          "bottom-right",
        );
        return;
      }

      showToast("Credencial rechazada", "success", "bottom-right");
      await getAppById();
    } catch (error) {
      console.error("Error al rechazar credencial:", error);
      showToast("No se pudo rechazar la credencial", "error", "bottom-right");
    } finally {
      setProcessingCredentialId(null);
    }
  };

  if (!id) return <div>No se encontro el ID de la aplicacion</div>;

  if (loading) return <div>Cargando datos...</div>;

  if (!dataApp) return <div>No se encontro la aplicacion</div>;

  const {
    status,
    dniNumber,
    dniCountry,
    requestedSpecialties,
    reviewedAt,
    reviewedBy,
    reviewerNotes,
    documents,
    certifications,
    credentials,
    specialtyRequests = [],
    user,
  } = dataApp;
  const credentialsToDisplay =
    credentials?.length > 0
      ? credentials
      : certifications.map(legacyCertificationToCredential);
  const pendingCredentialRequests = specialtyRequests.filter(
    (request) => request.credential?.status === "PENDING",
  );

  return (
    <div className="min-h-screen pt-6">
      <h1 className="text-2xl font-semibold mb-4">
        Detalles de la aplicacion del instructor
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
              statusColorsInstructorApplication[status] ?? "bg-gray-400",
            )}
          >
            {t("application", status)}
          </span>
        </p>
        <p>
          <span className="font-medium">Pais del DNI:</span> {dniCountry}
        </p>
        <p>
          <span className="font-medium">Numero de DNI:</span> {dniNumber}
        </p>
        <div>
          <span className="font-medium">Especialidades solicitadas:</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {requestedSpecialties?.length ? (
              requestedSpecialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 text-xs rounded-full bg-slate-200 text-slate-700"
                >
                  {t("courseSpecialty", specialty)}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">
                No especificadas por el solicitante
              </span>
            )}
          </div>
        </div>

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

      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">DNI</h2>
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

          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">Credenciales</h2>
        {credentialsToDisplay.length === 0 && (
          <p>No hay credenciales cargadas.</p>
        )}

        <div className="space-y-5">
          {credentialsToDisplay.map((credential, index) => (
            <div key={credential.id} className="rounded-lg border p-4">
              <div className="mb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-semibold">
                    {credentialTypeLabels[credential.type]}
                  </h3>
                  <span
                    className={cn(
                      "w-fit rounded-full px-2 py-1 text-xs font-medium",
                      credentialStatusLabels[credential.status].className,
                    )}
                  >
                    {credentialStatusLabels[credential.status].text}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Credencial {index + 1}
                </p>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <CredentialField label="Titulo" value={credential.title} />
                <CredentialField
                  label={
                    credential.type === "PROFESSIONAL_LICENSE"
                      ? "Organismo / colegio"
                      : "Institucion / entidad"
                  }
                  value={credential.organization}
                />
                <CredentialField
                  label="Numero de credencial"
                  value={credential.credentialNumber}
                />
                <CredentialField
                  label="Jurisdiccion"
                  value={credential.jurisdiction}
                />
                <CredentialField
                  label="Funcion / area"
                  value={credential.roleOrArea}
                />
                <CredentialField
                  label="Fecha de emision"
                  value={formatNullableDate(credential.issuedAt)}
                />
                <CredentialField
                  label="Fecha de vencimiento"
                  value={
                    credential.expiresAt
                      ? formatNullableDate(credential.expiresAt)
                      : credential.issuedAt
                        ? "No tiene vencimiento"
                        : null
                  }
                />
                <CredentialField
                  label="Fecha de inicio"
                  value={formatNullableDate(credential.startDate)}
                />
                <CredentialField
                  label="Fecha de fin"
                  value={
                    credential.currentlyActive
                      ? "Actualmente activo"
                      : formatNullableDate(credential.endDate)
                  }
                />
                <CredentialField
                  label="Descripcion"
                  value={credential.description}
                />
              </div>

              {credential.imageUrls.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium">Imagenes:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {credential.imageUrls.map((url, imageIndex) => (
                      <img
                        key={url}
                        src={url}
                        alt={`Credencial ${index + 1} imagen ${
                          imageIndex + 1
                        }`}
                        className="max-w-sm border rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">
          Solicitudes de nuevas credenciales
        </h2>
        {pendingCredentialRequests.length === 0 && (
          <p>No hay solicitudes de nuevas credenciales.</p>
        )}

        <div className="space-y-4">
          {pendingCredentialRequests.map((request) => {
            const credential = request.credential;
            if (!credential) return null;

            return (
            <div key={request.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">
                    {credential.type
                      ? t("credentialType", credential.type)
                      : "Credencial"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Enviada el {formatSentAt(request.createdAt)}
                  </p>
                </div>
                <span
                  className={cn(
                    "w-fit rounded-full px-2 py-1 text-xs font-medium",
                    specialtyRequestStatusLabels[request.status].className,
                  )}
                >
                  {specialtyRequestStatusLabels[request.status].text}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                <CredentialField label="Titulo" value={credential.title} />
                <CredentialField
                  label={
                    credential.type === "PROFESSIONAL_LICENSE"
                      ? "Organismo / colegio"
                      : "Institucion / entidad"
                  }
                  value={credential.organization}
                />
                <CredentialField
                  label="Numero de credencial"
                  value={credential.credentialNumber}
                />
                <CredentialField
                  label="Jurisdiccion"
                  value={credential.jurisdiction}
                />
                <CredentialField
                  label="Funcion / area"
                  value={credential.roleOrArea}
                />
                <CredentialField
                  label="Fecha de emision"
                  value={formatNullableDate(credential.issuedAt)}
                />
                <CredentialField
                  label="Fecha de vencimiento"
                  value={
                    credential.expiresAt
                      ? formatNullableDate(credential.expiresAt)
                      : credential.issuedAt
                        ? "No tiene vencimiento"
                        : null
                  }
                />
                <CredentialField
                  label="Fecha de inicio"
                  value={formatNullableDate(credential.startDate)}
                />
                <CredentialField
                  label="Fecha de fin"
                  value={
                    credential.currentlyActive
                      ? "Actualmente activo"
                      : formatNullableDate(credential.endDate)
                  }
                />
                <CredentialField
                  label="Descripcion"
                  value={credential.description}
                />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Especialidades solicitadas
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {request.requestedSpecialties.length > 0 ? (
                    request.requestedSpecialties.map((specialty) => (
                      <span
                        key={`${request.id}-${specialty}`}
                        className="px-2 py-1 text-xs rounded-full bg-slate-200 text-slate-700"
                      >
                        {t("courseSpecialty", specialty)}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No solicito especialidades nuevas
                    </span>
                  )}
                </div>
              </div>

              {credential.imageUrls.length > 0 && (
                <div>
                  <p className="font-medium">Documentacion respaldatoria:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {credential.imageUrls.map((url, imageIndex) => (
                      <img
                        key={url}
                        src={url}
                        alt={`Solicitud de credencial imagen ${imageIndex + 1}`}
                        className="max-w-sm border rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => handleApproveCredential(credential.id)}
                  disabled={processingCredentialId === credential.id}
                >
                  Aprobar credencial
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRejectCredential(credential.id)}
                  disabled={processingCredentialId === credential.id}
                >
                  Rechazar credencial
                </Button>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      <FeedbackApplicationForm
        applicationId={id}
        requestedSpecialties={requestedSpecialties || []}
      />
    </div>
  );
};

export default InstructorApplicationPage;
