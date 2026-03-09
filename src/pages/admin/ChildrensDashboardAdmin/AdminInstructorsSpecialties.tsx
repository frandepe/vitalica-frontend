import {
  getInstructorsSpecialtyManagement,
  resolveInstructorSpecialtyRequest,
  updateInstructorSpecialties,
} from "@/api/adminEndpoints";
import SpecialtyChecks from "@/components/Instructor/Forms/Profile/SpecialtyChecks";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  AdminInstructorSpecialtyProfile,
  AdminInstructorSpecialtyRequest,
} from "@/types/admin.types";
import { ISpecialty } from "@/types/course.types";
import { t } from "@/utils/translations";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type InstructorSpecialtiesFormValues = {
  specialties: ISpecialty[];
};

const statusBadgeClasses: Record<
  AdminInstructorSpecialtyRequest["status"],
  string
> = {
  SUBMITTED: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function AdminInstructorsSpecialties() {
  const { showToast } = useToast();
  const [instructors, setInstructors] = useState<AdminInstructorSpecialtyProfile[]>(
    [],
  );
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingInstructorSpecialties, setIsSavingInstructorSpecialties] =
    useState(false);
  const [isResolvingRequest, setIsResolvingRequest] = useState(false);
  const [reviewedBy, setReviewedBy] = useState("");
  const [reviewerNotesByRequest, setReviewerNotesByRequest] = useState<
    Record<string, string>
  >({});
  const [approvedSpecialtiesByRequest, setApprovedSpecialtiesByRequest] = useState<
    Record<string, ISpecialty[]>
  >({});

  const specialtiesForm = useForm<InstructorSpecialtiesFormValues>({
    defaultValues: {
      specialties: [],
    },
  });

  const selectedInstructor = useMemo(
    () =>
      instructors.find((instructor) => instructor.id === selectedInstructorId) ||
      null,
    [instructors, selectedInstructorId],
  );

  const loadInstructors = async () => {
    setIsLoading(true);
    try {
      const response = await getInstructorsSpecialtyManagement();
      if (response.success && response.data) {
        const instructorsData = response.data;
        setInstructors(instructorsData);

        if (!selectedInstructorId && instructorsData.length > 0) {
          setSelectedInstructorId(instructorsData[0].id);
        }
      }
    } catch (error) {
      console.error("Error obteniendo instructores:", error);
      showToast("No se pudo obtener la lista de instructores", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  useEffect(() => {
    if (!selectedInstructor) return;

    specialtiesForm.reset({
      specialties: selectedInstructor.specialties || [],
    });

    const initialApprovedByRequest = selectedInstructor.specialtyRequests.reduce(
      (acc, request) => {
        acc[request.id] = request.requestedSpecialties || [];
        return acc;
      },
      {} as Record<string, ISpecialty[]>,
    );

    setApprovedSpecialtiesByRequest(initialApprovedByRequest);
  }, [selectedInstructor, specialtiesForm]);

  const saveInstructorSpecialties = specialtiesForm.handleSubmit(async (data) => {
    if (!selectedInstructor) return;

    setIsSavingInstructorSpecialties(true);
    try {
      const response = await updateInstructorSpecialties(
        selectedInstructor.id,
        data.specialties,
      );

      if (!response.success) {
        showToast(
          response.message || "No se pudieron guardar las especialidades",
          "error",
        );
        return;
      }

      showToast("Especialidades del instructor actualizadas", "success");
      await loadInstructors();
    } catch (error: any) {
      showToast(
        error?.response?.data?.message ||
          "Error al guardar especialidades del instructor",
        "error",
      );
    } finally {
      setIsSavingInstructorSpecialties(false);
    }
  });

  const toggleApprovedSpecialty = (requestId: string, specialty: ISpecialty) => {
    setApprovedSpecialtiesByRequest((prev) => {
      const current = prev[requestId] || [];
      const exists = current.includes(specialty);
      return {
        ...prev,
        [requestId]: exists
          ? current.filter((item) => item !== specialty)
          : [...current, specialty],
      };
    });
  };

  const resolveRequest = async (
    request: AdminInstructorSpecialtyRequest,
    status: "APPROVED" | "REJECTED",
  ) => {
    const approvedSpecialties = approvedSpecialtiesByRequest[request.id] || [];

    if (status === "APPROVED" && approvedSpecialties.length === 0) {
      showToast(
        "Para aprobar debes seleccionar al menos una especialidad",
        "warning",
      );
      return;
    }

    setIsResolvingRequest(true);
    try {
      const response = await resolveInstructorSpecialtyRequest(request.id, {
        status,
        approvedSpecialties,
        reviewedBy: reviewedBy || undefined,
        reviewerNotes: reviewerNotesByRequest[request.id] || undefined,
      });

      if (!response.success) {
        showToast(
          response.message || "No se pudo resolver la solicitud",
          "error",
        );
        return;
      }

      showToast("Solicitud resuelta correctamente", "success");
      await loadInstructors();
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Error al resolver la solicitud",
        "error",
      );
    } finally {
      setIsResolvingRequest(false);
    }
  };

  if (isLoading) {
    return <p className="py-8">Cargando instructores...</p>;
  }

  return (
    <div className="py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Gestion de especialidades de instructores</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Aqui puedes editar el set operativo de especialidades aprobadas de
          instructores existentes y resolver solicitudes posteriores de
          especialidades.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-6">
        <aside className="border rounded-lg p-4 space-y-2 h-fit">
          <h2 className="font-semibold">Instructores</h2>

          {instructors.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay instructores disponibles.
            </p>
          ) : (
            instructors.map((instructor) => (
              <button
                type="button"
                key={instructor.id}
                onClick={() => setSelectedInstructorId(instructor.id)}
                className={`w-full text-left p-3 rounded-md border transition-colors ${
                  selectedInstructorId === instructor.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted"
                }`}
              >
                <p className="font-medium text-sm">
                  {instructor.user.firstName || ""} {instructor.user.lastName || ""}
                </p>
                <p className="text-xs text-muted-foreground">{instructor.user.email}</p>
                <p className="text-xs mt-1">
                  Especialidades: {instructor.specialties.length}
                </p>
              </button>
            ))
          )}
        </aside>

        <main className="space-y-8">
          {!selectedInstructor ? (
            <p className="text-sm text-muted-foreground">
              Selecciona un instructor para gestionar especialidades.
            </p>
          ) : (
            <>
              <section className="border rounded-lg p-5 space-y-4">
                <h2 className="text-lg font-semibold">Set operativo actual</h2>
                <p className="text-sm text-muted-foreground">
                  Define el array final de especialidades aprobadas para este
                  instructor.
                </p>

                <p className="text-sm">
                  Instructor: <strong>{selectedInstructor.user.firstName || ""} {selectedInstructor.user.lastName || ""}</strong>
                </p>

                <Form {...specialtiesForm}>
                  <form onSubmit={saveInstructorSpecialties} className="space-y-4">
                    <SpecialtyChecks control={specialtiesForm.control} name="specialties" />

                    <Button type="submit" disabled={isSavingInstructorSpecialties}>
                      {isSavingInstructorSpecialties
                        ? "Guardando..."
                        : "Guardar set final de especialidades"}
                    </Button>
                  </form>
                </Form>
              </section>

              <Separator />

              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Solicitudes posteriores</h2>

                <div className="max-w-sm">
                  <label className="text-sm font-medium">Revisado por</label>
                  <Input
                    value={reviewedBy}
                    onChange={(e) => setReviewedBy(e.target.value)}
                    placeholder="Nombre del admin (opcional)"
                  />
                </div>

                {selectedInstructor.specialtyRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Este instructor no tiene solicitudes posteriores.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedInstructor.specialtyRequests.map((request) => {
                      const selectedApproved = approvedSpecialtiesByRequest[request.id] || [];

                      return (
                        <article
                          key={request.id}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(request.createdAt).toLocaleString("es-AR")}
                              </p>
                              <p className="text-sm font-medium">Solicitud {request.id}</p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadgeClasses[request.status]}`}
                            >
                              {request.status}
                            </span>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2">
                              Especialidades solicitadas
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {request.requestedSpecialties.map((specialty) => (
                                <span
                                  key={`${request.id}-${specialty}`}
                                  className="px-2 py-1 text-xs rounded-full bg-slate-200 text-slate-700"
                                >
                                  {t("courseSpecialty", specialty)}
                                </span>
                              ))}
                            </div>
                          </div>

                          {request.certificateUrls?.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Certificados adjuntos</p>
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

                          {request.status === "SUBMITTED" ||
                          request.status === "UNDER_REVIEW" ? (
                            <>
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  Especialidades a aprobar (aprobacion parcial)
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {request.requestedSpecialties.map((specialty) => {
                                    const active = selectedApproved.includes(specialty);
                                    return (
                                      <button
                                        key={`${request.id}-approve-${specialty}`}
                                        type="button"
                                        onClick={() =>
                                          toggleApprovedSpecialty(request.id, specialty)
                                        }
                                        className={`px-3 py-1 rounded-full text-xs border ${
                                          active
                                            ? "bg-secondary text-white border-secondary"
                                            : "bg-background text-foreground border-border"
                                        }`}
                                      >
                                        {t("courseSpecialty", specialty)}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <Textarea
                                placeholder="Notas del revisor (opcional)"
                                value={reviewerNotesByRequest[request.id] || ""}
                                onChange={(e) =>
                                  setReviewerNotesByRequest((prev) => ({
                                    ...prev,
                                    [request.id]: e.target.value,
                                  }))
                                }
                              />

                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  disabled={isResolvingRequest}
                                  onClick={() => resolveRequest(request, "APPROVED")}
                                >
                                  Aprobar seleccionadas
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={isResolvingRequest}
                                  onClick={() => resolveRequest(request, "REJECTED")}
                                >
                                  Rechazar solicitud
                                </Button>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Solicitud ya resuelta.
                            </p>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
