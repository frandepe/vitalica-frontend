import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  MessageSquare,
  RefreshCcw,
  UserRound,
} from "lucide-react";
import {
  cancelPracticeRequest,
  createPracticeRequest,
  getPracticeCertificate,
  getPracticeInstructors,
  getPracticeRequestById,
} from "@/api";
import { PracticeReviewCard } from "@/components/Practice/PracticeReviewCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { ICourseProgressResponse } from "@/types/courseProgress.types";
import {
  PracticeCertificate,
  PracticeInstructor,
  PracticeProgressInfo,
  PracticeRequestStudentView,
  PracticeReview,
} from "@/types/practice.types";
import { formatDate } from "@/utils/formatDate";

interface StudentPracticePanelProps {
  course: ICourseProgressResponse;
  reloadCourse: () => Promise<void>;
}

interface PracticeRequestFormValues {
  studentWhatsapp: string;
  studentEmail: string;
  studentMessage: string;
}

const CONTACT_METHOD_LABELS = {
  DIRECT_CONTACT: "Contacto directo",
  REQUEST_CONTACT: "El instructor te contacta",
} as const;

function formatFullName(firstName?: string | null, lastName?: string | null) {
  return (
    `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Instructor disponible"
  );
}

function formatLocation(city?: string | null, state?: string | null) {
  return [city, state].filter(Boolean).join(", ") || "Ubicacion no informada";
}

function getStatusCopy(practice: PracticeProgressInfo) {
  if (practice.practiceCompleted) {
    return {
      title: "Practica completada",
      description:
        "Tu practica ya fue registrada y el certificado esta disponible.",
      badge: "Completada",
      variant: "success" as const,
      icon: CheckCircle2,
    };
  }

  if (practice.latestPracticeRequestStatus === "PENDING") {
    return {
      title: "Solicitud en curso",
      description:
        "Tu solicitud ya fue enviada. Desde aca podes seguirla o cancelarla.",
      badge: "Pendiente",
      variant: "info" as const,
      icon: RefreshCcw,
    };
  }

  if (practice.latestPracticeRequestStatus === "CANCELLED") {
    return {
      title: "Solicitud cancelada",
      description: "Podes iniciar una nueva solicitud con otro instructor.",
      badge: "Cancelada",
      variant: "warning" as const,
      icon: AlertCircle,
    };
  }

  if (practice.practiceUnlockedAt) {
    return {
      title: "Practica disponible",
      description: "Ya podes elegir instructor y crear tu solicitud.",
      badge: "Disponible",
      variant: "info" as const,
      icon: CheckCircle2,
    };
  }

  return {
    title: "Practica bloqueada",
    description:
      "La practica se habilita cuando completes la parte teorica requerida.",
    badge: "Bloqueada",
    variant: "warning" as const,
    icon: AlertCircle,
  };
}

export function StudentPracticePanel({
  course,
  reloadCourse,
}: StudentPracticePanelProps) {
  const practice = course.practice;
  const { showToast } = useToast();
  const [request, setRequest] = useState<PracticeRequestStudentView | null>(
    null,
  );
  const [requestLoading, setRequestLoading] = useState(
    Boolean(practice?.latestPracticeRequestId),
  );
  const [instructors, setInstructors] = useState<PracticeInstructor[]>([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificate, setCertificate] = useState<PracticeCertificate | null>(
    null,
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PracticeRequestFormValues>({
    defaultValues: {
      studentWhatsapp: "",
      studentEmail: "",
      studentMessage: "",
    },
  });

  useEffect(() => {
    if (!practice?.latestPracticeRequestId) {
      setRequest(null);
      setRequestLoading(false);
      return;
    }

    let cancelled = false;
    setRequestLoading(true);

    const load = async () => {
      const response = await getPracticeRequestById(
        practice.latestPracticeRequestId!,
      );

      if (cancelled) return;

      if (response.success && response.data) {
        setRequest(response.data as PracticeRequestStudentView);
      }

      setRequestLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [practice?.latestPracticeRequestId]);

  useEffect(() => {
    if (!requestModalOpen || instructors.length > 0) return;

    let cancelled = false;
    setInstructorsLoading(true);

    const load = async () => {
      const response = await getPracticeInstructors();

      if (!cancelled && response.success && Array.isArray(response.data)) {
        setInstructors(response.data as PracticeInstructor[]);
      }

      if (!cancelled) setInstructorsLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [instructors.length, requestModalOpen]);

  useEffect(() => {
    if (
      !certificateModalOpen ||
      !practice?.practiceCertificateAvailable ||
      certificate
    ) {
      return;
    }

    let cancelled = false;
    setCertificateLoading(true);

    const load = async () => {
      const response = await getPracticeCertificate(practice.enrollmentId);

      if (!cancelled && response.success && response.data) {
        setCertificate(response.data as PracticeCertificate);
      }

      if (!cancelled) setCertificateLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    certificate,
    certificateModalOpen,
    practice?.enrollmentId,
    practice?.practiceCertificateAvailable,
  ]);

  const selectedInstructor = useMemo(
    () => instructors.find((item) => item.id === selectedInstructorId) ?? null,
    [instructors, selectedInstructorId],
  );

  if (!practice?.requiresPractice) return null;

  const status = getStatusCopy(practice);
  const StatusIcon = status.icon;

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedInstructor) {
      showToast("Selecciona un instructor", "error", "top-right");
      return;
    }

    setSubmitting(true);
    const response = await createPracticeRequest({
      enrollmentId: practice.enrollmentId,
      instructorId: selectedInstructor.id,
      contactMethod: selectedInstructor.contactMethod,
      studentWhatsapp: values.studentWhatsapp.trim() || undefined,
      studentEmail: values.studentEmail.trim() || undefined,
      studentMessage: values.studentMessage.trim() || undefined,
    });

    if (!response.success || !response.data) {
      showToast(
        response.message ?? "No se pudo crear la solicitud de practica",
        "error",
        "top-right",
      );
      setSubmitting(false);
      return;
    }

    setRequest(response.data as PracticeRequestStudentView);
    reset();
    setSelectedInstructorId("");
    setRequestModalOpen(false);
    await reloadCourse();
    showToast("Solicitud de practica creada", "success", "top-right");
    setSubmitting(false);
  });

  const onCancel = async () => {
    if (!request) return;

    setCancelling(true);
    const response = await cancelPracticeRequest(request.id);

    if (!response.success || !response.data) {
      showToast(
        response.message ?? "No se pudo cancelar la solicitud",
        "error",
        "top-right",
      );
      setCancelling(false);
      return;
    }

    setRequest(response.data as PracticeRequestStudentView);
    await reloadCourse();
    showToast("Solicitud cancelada", "success", "top-right");
    setCancelling(false);
  };

  const onReviewCreated = (review: PracticeReview) => {
    if (!request) return;
    setRequest({ ...request, review });
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/15">
        <CardHeader className="px-6 pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant={status.variant} size="sm">
                  {status.badge}
                </Badge>
                <Badge variant="outline" size="sm">
                  Practica presencial
                </Badge>
              </div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <StatusIcon className="h-5 w-5 text-primary" />
                {status.title}
              </CardTitle>
              <CardDescription>{status.description}</CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              {practice.practiceUnlockedAt && !practice.practiceCompleted && (
                <Button onClick={() => setRequestModalOpen(true)}>
                  Nueva solicitud
                </Button>
              )}
              {practice.practiceCertificateAvailable && (
                <Button
                  variant="outline"
                  onClick={() => setCertificateModalOpen(true)}
                >
                  Ver certificado practico
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 px-6 pb-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Desbloqueo
            </p>
            <p className="mt-1 text-sm font-medium">
              {practice.practiceUnlockedAt
                ? formatDate(practice.practiceUnlockedAt, { showTime: false })
                : "Pendiente"}
            </p>
          </div>
          <div className="rounded-xl border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Solicitud actual
            </p>
            <p className="mt-1 text-sm font-medium">
              {practice.latestPracticeRequestStatus ?? "Sin solicitud"}
            </p>
          </div>
          <div className="rounded-xl border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Practica completada
            </p>
            <p className="mt-1 text-sm font-medium">
              {practice.practiceCompletedAt
                ? formatDate(practice.practiceCompletedAt, { showTime: false })
                : "No"}
            </p>
          </div>
          <div className="rounded-xl border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Certificado
            </p>
            <p className="mt-1 text-sm font-medium">
              {practice.practiceCertificateAvailable ? "Disponible" : "Aun no"}
            </p>
          </div>
        </CardContent>
      </Card>

      {requestLoading ? (
        <Card className="border-dashed">
          <CardContent className="px-6 py-8 text-sm text-muted-foreground">
            Cargando solicitud de practica...
          </CardContent>
        </Card>
      ) : request ? (
        <Card>
          <CardHeader className="px-6 pt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <Badge
                  variant={
                    request.status === "COMPLETED"
                      ? "success"
                      : request.status === "CANCELLED"
                        ? "warning"
                        : "info"
                  }
                  size="sm"
                >
                  {request.status}
                </Badge>
                <CardTitle className="text-lg font-semibold">
                  {formatFullName(
                    request.instructor.firstName,
                    request.instructor.lastName,
                  )}
                </CardTitle>
                <CardDescription>
                  {request.instructor.headline ||
                    "Instructor disponible para practica"}
                </CardDescription>
              </div>

              {request.status === "PENDING" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Cancelar solicitud</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancelar solicitud</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta accion deja libre la cursada para crear una nueva
                        solicitud.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Volver</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={onCancel}
                        disabled={cancelling}
                      >
                        {cancelling ? "Cancelando..." : "Confirmar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Metodo de contacto
                </p>
                <p className="mt-1 text-sm font-medium">
                  {CONTACT_METHOD_LABELS[request.contactMethod]}
                </p>
              </div>
              <div className="rounded-xl border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Solicitada
                </p>
                <p className="mt-1 text-sm font-medium">
                  {formatDate(request.requestedAt, { showTime: false })}
                </p>
              </div>
              <div className="rounded-xl border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Ubicacion
                </p>
                <p className="mt-1 text-sm font-medium">
                  {formatLocation(
                    request.instructor.city,
                    request.instructor.state,
                  )}
                </p>
              </div>
              <div className="rounded-xl border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Estado
                </p>
                <p className="mt-1 text-sm font-medium">
                  {request.completedAt
                    ? `Completada el ${formatDate(request.completedAt, {
                        showTime: false,
                      })}`
                    : request.cancelledAt
                      ? `Cancelada el ${formatDate(request.cancelledAt, {
                          showTime: false,
                        })}`
                      : "Pendiente de coordinacion"}
                </p>
              </div>
            </div>

            {request.contactMethod === "DIRECT_CONTACT" && (
              <div className="rounded-2xl border bg-primary/5 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  Coordinacion por contacto directo
                </p>
                <p className="mt-2">
                  La solicitud ya esta creada. Si el instructor publicó canales
                  de contacto, usalos para coordinar tu practica.
                </p>
                {request.instructor.publicContact?.practiceWhatsapp && (
                  <p className="mt-3">
                    WhatsApp:{" "}
                    {request.instructor.publicContact.practiceWhatsapp}
                  </p>
                )}
                {request.instructor.publicContact?.practiceEmail && (
                  <p>Email: {request.instructor.publicContact.practiceEmail}</p>
                )}
              </div>
            )}

            {request.contactMethod === "REQUEST_CONTACT" && (
              <div className="rounded-2xl border bg-secondary/30 p-4 text-sm">
                <p className="font-medium">Datos enviados al instructor</p>
                <p className="mt-2 text-muted-foreground">
                  WhatsApp:{" "}
                  {request.studentContact.studentWhatsapp || "No informado"}
                </p>
                <p className="text-muted-foreground">
                  Email: {request.studentContact.studentEmail || "No informado"}
                </p>
                {request.studentMessage && (
                  <p className="mt-2 text-muted-foreground">
                    Mensaje: {request.studentMessage}
                  </p>
                )}
              </div>
            )}

            {request.status === "COMPLETED" && (
              <PracticeReviewCard
                practiceRequestId={request.id}
                existingReview={request.review}
                onCreated={onReviewCreated}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="space-y-3 px-6 py-8">
            <p className="text-sm font-medium">
              Todavia no generaste una solicitud.
            </p>
            <p className="text-sm text-muted-foreground">
              Cuando la practica este disponible vas a poder elegir instructor y
              seguir todo desde esta seccion.
            </p>
            {practice.practiceUnlockedAt && (
              <Button
                className="w-fit"
                onClick={() => setRequestModalOpen(true)}
              >
                Elegir instructor
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Modal open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <ModalContent side="bottom" className="max-h-[90vh] max-w-4xl">
          <ModalHeader>
            <ModalTitle>Solicitar practica</ModalTitle>
            <ModalDescription>
              Elige instructor y completa el flujo segun el tipo de contacto.
            </ModalDescription>
          </ModalHeader>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                Instructores disponibles
              </h3>
              {instructorsLoading ? (
                <div className="rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">
                  Cargando instructores...
                </div>
              ) : (
                <div className="space-y-3">
                  {instructors.map((instructor) => {
                    const selected = instructor.id === selectedInstructorId;

                    return (
                      <button
                        key={instructor.id}
                        type="button"
                        onClick={() => setSelectedInstructorId(instructor.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-border bg-background hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4 text-primary" />
                          <p className="font-semibold">
                            {formatFullName(
                              instructor.firstName,
                              instructor.lastName,
                            )}
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {instructor.headline ||
                            "Instructor disponible para practica"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge size="sm" variant="outline">
                            {CONTACT_METHOD_LABELS[instructor.contactMethod]}
                          </Badge>
                          <Badge size="sm" variant="secondary">
                            {instructor.practiceRatingCount} resenas
                          </Badge>
                        </div>
                        <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {formatLocation(instructor.city, instructor.state)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Card className="h-fit">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-base font-semibold">
                  {selectedInstructor
                    ? formatFullName(
                        selectedInstructor.firstName,
                        selectedInstructor.lastName,
                      )
                    : "Selecciona un instructor"}
                </CardTitle>
                <CardDescription>
                  {selectedInstructor
                    ? CONTACT_METHOD_LABELS[selectedInstructor.contactMethod]
                    : "El formulario cambia segun el modo de contacto del instructor."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <form className="space-y-4" onSubmit={onSubmit}>
                  {selectedInstructor?.contactMethod === "REQUEST_CONTACT" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="studentWhatsapp">WhatsApp</Label>
                        <Controller
                          name="studentWhatsapp"
                          control={control}
                          rules={{
                            validate: (value, values) =>
                              value.trim() || values.studentEmail.trim()
                                ? true
                                : "Ingresa WhatsApp o email",
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="studentWhatsapp"
                              placeholder="Ej: +54 11 5555 5555"
                            />
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentEmail">Email</Label>
                        <Controller
                          name="studentEmail"
                          control={control}
                          rules={{
                            validate: (value, values) =>
                              value.trim() || values.studentWhatsapp.trim()
                                ? true
                                : "Ingresa WhatsApp o email",
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="studentEmail"
                              type="email"
                              placeholder="tu@email.com"
                            />
                          )}
                        />
                      </div>
                      {(errors.studentWhatsapp || errors.studentEmail) && (
                        <p className="text-xs text-destructive">
                          {errors.studentWhatsapp?.message ||
                            errors.studentEmail?.message}
                        </p>
                      )}
                    </>
                  )}

                  {selectedInstructor?.contactMethod === "DIRECT_CONTACT" && (
                    <div className="rounded-xl border bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                      Al crear la solicitud vas a ver los datos publicos del
                      instructor para coordinar directamente.
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="studentMessage">Mensaje</Label>
                    <Controller
                      name="studentMessage"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="studentMessage"
                          className="min-h-28 resize-none"
                          placeholder="Disponibilidad, ciudad o detalles utiles"
                        />
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedInstructor || submitting}
                  >
                    {submitting ? "Creando solicitud..." : "Crear solicitud"}
                  </Button>
                </form>

                {selectedInstructor && (
                  <div className="rounded-xl border bg-background px-4 py-3 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Resumen</p>
                    <p className="mt-2 inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {formatLocation(
                        selectedInstructor.city,
                        selectedInstructor.state,
                      )}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      {CONTACT_METHOD_LABELS[selectedInstructor.contactMethod]}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ModalContent>
      </Modal>

      <Modal open={certificateModalOpen} onOpenChange={setCertificateModalOpen}>
        <ModalContent side="bottom" className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>Certificado practico</ModalTitle>
            <ModalDescription>
              Vista previa de los datos emitidos para la practica completada.
            </ModalDescription>
          </ModalHeader>
          {certificateLoading ? (
            <div className="rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">
              Cargando certificado...
            </div>
          ) : certificate ? (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="space-y-4 px-6 py-6">
                <div className="text-center">
                  <Badge size="sm" variant="success">
                    Practica certificada
                  </Badge>
                  <h3 className="mt-3 text-2xl font-semibold">
                    {certificate.studentName}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {certificate.courseName}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border bg-background px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Instructor
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {certificate.instructorName}
                    </p>
                  </div>
                  <div className="rounded-xl border bg-background px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Fecha
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {formatDate(certificate.practiceCompletedAt, {
                        showTime: false,
                      })}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border bg-background px-4 py-3 text-sm text-muted-foreground">
                  Emitido por {certificate.issuedBy || "Vitalica"}.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">
              No se pudo obtener el certificado practico.
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
