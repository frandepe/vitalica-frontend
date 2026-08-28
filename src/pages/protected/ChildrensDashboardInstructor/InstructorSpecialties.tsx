import {
  createInstructorSpecialtyRequest,
  getInstructorApplication,
  getInstructorSpecialtyRequests,
} from "@/api";
import CredentialFormCard from "@/components/instructor/Credentials/CredentialFormCard";
import { credentialOptions } from "@/components/instructor/Credentials/credential-options";
import {
  credentialRequiresImage,
  emptyCredential,
  emptyToNull,
} from "@/components/instructor/Credentials/credential-utils";
import type { ImageState } from "@/components/instructor/Credentials/types";
import SpecialtyChecks from "@/components/instructor/Forms/Profile/SpecialtyChecks";
import TitleAdminPages from "@/components/Texts/TitleAdminPages";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { specialties } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { ISpecialty } from "@/types/course.types";
import {
  IApplyInstructor,
  InstructorCredential,
  InstructorSpecialtyRequest,
} from "@/types/instructor.types";
import { filesToBase64Array } from "@/utils/file-utils";
import { t } from "@/utils/translations";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

const statusLabel: Record<
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

const isOpenRequest = (request: InstructorSpecialtyRequest) =>
  (request.status === "SUBMITTED" || request.status === "UNDER_REVIEW") &&
  request.credential?.status === "PENDING";

const credentialStatusLabel: Record<
  InstructorCredential["status"],
  { text: string; className: string }
> = {
  PENDING: {
    text: "Pendiente de revision",
    className: "bg-amber-100 text-amber-800",
  },
  APPROVED: {
    text: "Aprobada",
    className: "bg-green-100 text-green-800",
  },
};

const formatCredentialDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("es-AR") : null;

const getRequestCredential = (request: InstructorSpecialtyRequest) =>
  request.credential ?? null;

export default function InstructorSpecialties() {
  const { instructor } = useAuth();
  const { showToast } = useToast();
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requests, setRequests] = useState<InstructorSpecialtyRequest[]>([]);
  const [credentials, setCredentials] = useState<InstructorCredential[]>([]);
  const [isChoosingCredential, setIsChoosingCredential] = useState(false);
  const [credentialImages, setCredentialImages] = useState<ImageState[]>([]);

  const approvedSpecialties = instructor?.specialties ?? [];
  const approvedCredentials = useMemo(
    () => credentials.filter((credential) => credential.status === "APPROVED"),
    [credentials],
  );
  const requestCredentials = useMemo(
    () =>
      requests
        .map(getRequestCredential)
        .filter((credential): credential is InstructorCredential =>
          Boolean(credential),
        ),
    [requests],
  );
  const pendingCredentials = useMemo(
    () =>
      requestCredentials.filter(
        (credential) => credential.status === "PENDING",
      ),
    [requestCredentials],
  );
  const pendingSpecialties = useMemo(
    () =>
      new Set(
        requests
          .filter(isOpenRequest)
          .flatMap((request) => request.requestedSpecialties),
      ),
    [requests],
  );

  const selectableSpecialties = useMemo(
    () =>
      specialties.filter((specialty) => {
        const value = specialty.value as ISpecialty;
        return (
          !approvedSpecialties.includes(value) && !pendingSpecialties.has(value)
        );
      }),
    [approvedSpecialties, pendingSpecialties],
  );

  const form = useForm<IApplyInstructor>({
    defaultValues: {
      dniNumber: "",
      dniCountry: "AR",
      credentials: [],
      requestedSpecialties: [],
      urlDni: null,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "credentials",
    keyName: "fieldId",
  });

  const loadRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const requestsResponse = await getInstructorSpecialtyRequests();
      if (requestsResponse.success && requestsResponse.data) {
        setRequests(requestsResponse.data);
      }
    } catch (error) {
      console.error("Error al obtener solicitudes de credenciales:", error);
    }

    try {
      const applicationResponse = await getInstructorApplication();
      if (applicationResponse.success && applicationResponse.data) {
        setCredentials(applicationResponse.data.credentials ?? []);
      }
    } catch (error) {
      console.error("Error al obtener credenciales aprobadas:", error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const addCredential = (type: (typeof credentialOptions)[number]["type"]) => {
    remove();
    append(emptyCredential(type));
    setCredentialImages([{ existing: [], new: [] }]);
    setIsChoosingCredential(false);
  };

  const removeCredential = () => {
    remove();
    setCredentialImages([]);
  };

  const onSubmit = handleSubmit(async (data) => {
    const credential = data.credentials[0];

    if (!credential) {
      showToast("Debes agregar una credencial", "warning", "bottom-right");
      return;
    }

    const images = credentialImages[0] || { existing: [], new: [] };
    const newImagesBase64 = await filesToBase64Array(images.new);
    const finalImages = [...images.existing, ...newImagesBase64];

    if (credentialRequiresImage(credential.type) && finalImages.length === 0) {
      showToast(
        "La credencial debe tener una documentacion respaldatoria",
        "warning",
        "bottom-right",
      );
      return;
    }

    if (finalImages.length > 1) {
      showToast(
        "Cada credencial puede tener como maximo una imagen",
        "warning",
        "bottom-right",
      );
      return;
    }

    if (
      credential.expiresAt &&
      credential.issuedAt &&
      new Date(credential.expiresAt) < new Date(credential.issuedAt)
    ) {
      showToast(
        "La fecha de vencimiento no puede ser anterior a la fecha de emision",
        "warning",
        "bottom-right",
      );
      return;
    }

    if (
      credential.endDate &&
      credential.startDate &&
      new Date(credential.endDate) < new Date(credential.startDate)
    ) {
      showToast(
        "La fecha de fin no puede ser anterior a la fecha de inicio",
        "warning",
        "bottom-right",
      );
      return;
    }

    try {
      const response = await createInstructorSpecialtyRequest(
        data.requestedSpecialties || [],
        {
          type: credential.type,
          title: emptyToNull(credential.title),
          organization: emptyToNull(credential.organization),
          credentialNumber: emptyToNull(credential.credentialNumber),
          jurisdiction: emptyToNull(credential.jurisdiction),
          issuedAt: credential.issuedAt || null,
          expiresAt: credential.noExpiration
            ? null
            : credential.expiresAt || null,
          roleOrArea: emptyToNull(credential.roleOrArea),
          startDate: credential.startDate || null,
          endDate: credential.currentlyActive
            ? null
            : credential.endDate || null,
          currentlyActive: credential.currentlyActive,
          description: emptyToNull(credential.description),
          images: finalImages,
        },
      );

      if (!response.success) {
        showToast(
          response.message || "No se pudo enviar la solicitud",
          "error",
          "bottom-right",
        );
        return;
      }

      showToast(
        "Solicitud de credencial enviada correctamente",
        "success",
        "bottom-right",
      );

      reset({
        dniNumber: "",
        dniCountry: "AR",
        credentials: [],
        requestedSpecialties: [],
        urlDni: null,
      });
      setCredentialImages([]);
      await loadRequests();
    } catch (error: unknown) {
      showToast(
        (axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined) || "No se pudo enviar la solicitud de credencial",
        "error",
        "bottom-right",
      );
    }
  });

  return (
    <div className="my-8 space-y-8">
      <div>
        <TitleAdminPages title="Credenciales" />
        <p className="text-sm text-muted-foreground mt-2">
          Agregá formación, certificaciones o experiencia a tu perfil
          profesional. Si corresponde, podés solicitar nuevas especialidades
          respaldadas por esa credencial.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold">
          Especialidades aprobadas actuales
        </h3>
        <div className="flex flex-wrap gap-2">
          {approvedSpecialties.length > 0 ? (
            approvedSpecialties.map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 rounded-full text-sm bg-secondary/40 text-secondary-foreground"
              >
                {t("courseSpecialty", specialty)}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Aún no tenés especialidades aprobadas.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Credenciales aprobadas</h3>
        {isLoadingRequests ? (
          <p className="text-sm text-muted-foreground">
            Cargando credenciales...
          </p>
        ) : approvedCredentials.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no tenés credenciales aprobadas.
          </p>
        ) : (
          <ul className="space-y-3">
            {approvedCredentials.map((credential) => (
              <li
                key={credential.id}
                className="rounded-lg border border-border p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {t("credentialType", credential.type)}
                    </p>
                    {credential.title && (
                      <p className="text-sm text-muted-foreground">
                        {credential.title}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${credentialStatusLabel[credential.status].className}`}
                  >
                    {credentialStatusLabel[credential.status].text}
                  </span>
                </div>
                {(credential.issuedAt || credential.expiresAt) && (
                  <p className="text-xs text-muted-foreground">
                    {formatCredentialDate(credential.issuedAt) || "Sin emision"}{" "}
                    -{" "}
                    {formatCredentialDate(credential.expiresAt) ||
                      "Sin vencimiento"}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {pendingCredentials.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">
            Credenciales pendientes de revision
          </h3>
          <ul className="space-y-3">
            {pendingCredentials.map((credential) => (
              <li
                key={credential.id}
                className="rounded-lg border border-border p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {t("credentialType", credential.type)}
                    </p>
                    {credential.title && (
                      <p className="text-sm text-muted-foreground">
                        {credential.title}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${credentialStatusLabel[credential.status].className}`}
                  >
                    {credentialStatusLabel[credential.status].text}
                  </span>
                </div>
                {(credential.issuedAt || credential.expiresAt) && (
                  <p className="text-xs text-muted-foreground">
                    {formatCredentialDate(credential.issuedAt) || "Sin emision"}{" "}
                    -{" "}
                    {formatCredentialDate(credential.expiresAt) ||
                      "Sin vencimiento"}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {pendingSpecialties.size > 0 && (
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Especialidades pendientes</h3>
          <div className="flex flex-wrap gap-2">
            {[...pendingSpecialties].map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800"
              >
                {t("courseSpecialty", specialty)}
              </span>
            ))}
          </div>
        </section>
      )}

      <Separator />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Nueva credencial</h3>
        <p className="text-sm text-muted-foreground">
          Primero elegí el tipo de credencial, completá sus datos y luego
          seleccioná especialidades relacionadas solo si corresponde.
        </p>

        <FormProvider {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              {fields.length === 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsChoosingCredential((current) => !current)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar credencial
                </Button>
              )}

              {isChoosingCredential && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {credentialOptions.map(
                    ({ type, label, description, iconSrc }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addCredential(type)}
                        className="group rounded-lg border bg-background p-4 text-left transition-colors hover:border-primary/60 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                            <img
                              src={iconSrc}
                              alt=""
                              className="h-10 w-10 object-contain"
                            />
                          </span>
                          <span className="space-y-1">
                            <span className="block text-sm font-semibold text-foreground">
                              {label}
                            </span>
                            <span className="block text-sm text-muted-foreground">
                              {description}
                            </span>
                          </span>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              )}

              {fields.map((field, index) => (
                <CredentialFormCard
                  key={field.fieldId}
                  index={index}
                  images={credentialImages[index] || { existing: [], new: [] }}
                  onImagesChange={(images) =>
                    setCredentialImages((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? images : item,
                      ),
                    )
                  }
                  onRemove={removeCredential}
                />
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-base font-semibold">
                  Especialidades relacionadas
                </h4>
                <p className="text-sm text-muted-foreground">
                  Opcional. No selecciones especialidades si la credencial no
                  respalda una nueva area de ensenanza.
                </p>
              </div>

              {selectableSpecialties.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay especialidades disponibles para solicitar en este
                  momento.
                </p>
              ) : (
                <SpecialtyChecks
                  control={control}
                  name="requestedSpecialties"
                  options={selectableSpecialties}
                />
              )}

              {errors.requestedSpecialties && (
                <p className="text-destructive text-sm">
                  {errors.requestedSpecialties.message as string}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || fields.length === 0}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando solicitud...
                </span>
              ) : (
                "Enviar credencial a revision"
              )}
            </Button>
          </form>
        </FormProvider>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Ultimas solicitudes</h3>

        {isLoadingRequests ? (
          <p className="text-sm text-muted-foreground">
            Cargando solicitudes...
          </p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No has enviado credenciales a revision aun.
          </p>
        ) : (
          <ul className="space-y-3">
            {requests.map((request) => (
              <li
                key={request.id}
                className="rounded-lg border border-border p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleString("es-AR")}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      request.credential
                        ? credentialStatusLabel[request.credential.status]
                            .className
                        : statusLabel[request.status].className
                    }`}
                  >
                    {request.credential
                      ? credentialStatusLabel[request.credential.status].text
                      : statusLabel[request.status].text}
                  </span>
                </div>

                {(request.credential || request.credentialType) && (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">
                      {t(
                        "credentialType",
                        request.credential?.type ?? request.credentialType!,
                      )}
                    </p>
                    {(request.credential?.title || request.credentialTitle) && (
                      <p>
                        {request.credential?.title ?? request.credentialTitle}
                      </p>
                    )}
                    {(request.credential?.organization ||
                      request.credentialOrg) && (
                      <p className="text-muted-foreground">
                        {request.credential?.organization ??
                          request.credentialOrg}
                      </p>
                    )}
                    {(request.credential?.issuedAt ||
                      request.credential?.expiresAt ||
                      request.credentialIssuedAt ||
                      request.credentialExpiresAt) && (
                      <p className="text-xs text-muted-foreground">
                        {formatCredentialDate(
                          request.credential?.issuedAt ??
                            request.credentialIssuedAt,
                        ) || "Sin emision"}{" "}
                        -{" "}
                        {formatCredentialDate(
                          request.credential?.expiresAt ??
                            request.credentialExpiresAt,
                        ) || "Sin vencimiento"}
                      </p>
                    )}
                  </div>
                )}

                {request.requestedSpecialties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {request.requestedSpecialties.map((specialty) => (
                      <span
                        key={`${request.id}-${specialty}`}
                        className="px-3 py-1 rounded-full text-xs bg-muted text-foreground"
                      >
                        {t("courseSpecialty", specialty)}
                      </span>
                    ))}
                  </div>
                )}

                {request.certificateUrls?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Documentacion respaldatoria
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {request.certificateUrls.map((certificateUrl, index) => (
                        <a
                          key={`${request.id}-certificate-${index}`}
                          href={certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-20 h-20 rounded-md border overflow-hidden"
                        >
                          <img
                            src={certificateUrl}
                            alt={`Documentacion ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
