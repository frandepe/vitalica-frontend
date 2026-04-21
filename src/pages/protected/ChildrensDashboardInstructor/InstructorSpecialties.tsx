import SpecialtyChecks from "@/components/instructor/Forms/Profile/SpecialtyChecks";
import ImagesUpload from "@/components/Uploads/ImagesUpload";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  createInstructorSpecialtyRequest,
  getInstructorSpecialtyRequests,
} from "@/api";
import { specialties } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import { ISpecialty } from "@/types/course.types";
import { InstructorSpecialtyRequest } from "@/types/instructor.types";
import { filesToBase64Array } from "@/utils/file-utils";
import { t } from "@/utils/translations";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

type SpecialtyRequestFormValues = {
  requestedSpecialties: ISpecialty[];
};

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

export default function InstructorSpecialties() {
  const { instructor } = useAuth();
  const { showToast } = useToast();
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requests, setRequests] = useState<InstructorSpecialtyRequest[]>([]);
  const [certificateImages, setCertificateImages] = useState<{
    existing: string[];
    new: File[];
  }>({
    existing: [],
    new: [],
  });

  const approvedSpecialties = instructor?.specialties ?? [];

  const selectableSpecialties = useMemo(
    () =>
      specialties.filter(
        (specialty) => !approvedSpecialties.includes(specialty.value as ISpecialty),
      ),
    [approvedSpecialties],
  );

  const form = useForm<SpecialtyRequestFormValues>({
    defaultValues: {
      requestedSpecialties: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const loadRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const response = await getInstructorSpecialtyRequests();
      if (response.success && response.data) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error("Error al obtener solicitudes de especialidades:", error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    if (!data.requestedSpecialties || data.requestedSpecialties.length === 0) {
      showToast(
        "Selecciona al menos una especialidad para enviar la solicitud",
        "warning",
        "bottom-right",
      );
      return;
    }

    if (
      certificateImages.existing.length === 0 &&
      certificateImages.new.length === 0
    ) {
      showToast(
        "Debes adjuntar al menos una imagen de certificado",
        "warning",
        "bottom-right",
      );
      return;
    }

    try {
      const newCertificatesBase64 = await filesToBase64Array(
        certificateImages.new,
      );
      const certificatesPayload = [
        ...certificateImages.existing,
        ...newCertificatesBase64,
      ];

      const response = await createInstructorSpecialtyRequest(
        data.requestedSpecialties,
        certificatesPayload,
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
        "Solicitud de especialidades enviada correctamente",
        "success",
        "bottom-right",
      );

      reset({ requestedSpecialties: [] });
      setCertificateImages({ existing: [], new: [] });
      loadRequests();
    } catch (error: unknown) {
      showToast(
        (axios.isAxiosError(error) ? error.response?.data?.message : undefined) ||
          "No se pudo enviar la solicitud de especialidades",
        "error",
        "bottom-right",
      );
    }
  });

  return (
    <div className="my-8 space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl font-semibold">Solicitar nuevas especialidades</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Este flujo es independiente de tu perfil. Las especialidades solicitadas
          seran revisadas por un administrador y no se aprueban automaticamente.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold">Especialidades aprobadas actuales</h3>
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
              Aun no tienes especialidades aprobadas.
            </p>
          )}
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Nueva solicitud</h3>
        <p className="text-sm text-muted-foreground">
          Debes adjuntar una o mas imagenes de certificados o constancias para
          respaldar las especialidades solicitadas.
        </p>

        {selectableSpecialties.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ya tienes aprobadas todas las especialidades disponibles.
          </p>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <SpecialtyChecks
                control={control}
                name="requestedSpecialties"
                options={selectableSpecialties}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium">Certificados de respaldo</p>
                <ImagesUpload
                  value={certificateImages.existing}
                  onChange={setCertificateImages}
                  multiple={true}
                  maxFiles={10}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando solicitud...
                  </span>
                ) : (
                  "Enviar solicitud"
                )}
              </Button>
            </form>
          </Form>
        )}
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Ultimas solicitudes</h3>

        {isLoadingRequests ? (
          <p className="text-sm text-muted-foreground">Cargando solicitudes...</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No has enviado solicitudes de nuevas especialidades aun.
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
                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusLabel[request.status].className}`}
                  >
                    {statusLabel[request.status].text}
                  </span>
                </div>

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

                {request.certificateUrls?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Certificados adjuntos
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
                            alt={`Certificado ${index + 1}`}
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
