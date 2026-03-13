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
  PracticeInstructor,
  PracticeProgressInfo,
  PracticeRequestStudentView,
  PracticeReview,
} from "@/types/practice.types";
import { formatDate } from "@/utils/formatDate";
import { t } from "@/utils/translations";
import { useNavigate } from "react-router-dom";
import { formatLocation } from "@/utils/format-location";
import { formatFullName } from "@/utils/format-fullname";

interface StudentPracticePanelProps {
  course: ICourseProgressResponse;
  reloadCourse: (options?: { silent?: boolean }) => Promise<void>;
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

function getStatusCopy(practice: PracticeProgressInfo) {
  if (practice.practiceCompleted) {
    return {
      title: "Práctica completada",
      description:
        "Tu práctica ya fue registrada y el certificado esta disponible.",
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
      title: "Práctica disponible",
      description: "Ya podes elegir instructor y crear tu solicitud.",
      badge: "Disponible",
      variant: "info" as const,
      icon: CheckCircle2,
    };
  }

  return {
    title: "Práctica bloqueada",
    description:
      "La práctica se habilita cuando completes la parte teorica requerida.",
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
  const navigate = useNavigate();
  const [request, setRequest] = useState<PracticeRequestStudentView | null>(
    null,
  );
  const [requestLoading, setRequestLoading] = useState(
    Boolean(practice?.latestPracticeRequestId),
  );
  const [instructors, setInstructors] = useState<PracticeInstructor[]>([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
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

  const selectedInstructor = useMemo(
    () => instructors.find((item) => item.id === selectedInstructorId) ?? null,
    [instructors, selectedInstructorId],
  );

  if (!practice?.requiresPractice) return null;

  const status = getStatusCopy(practice);
  const StatusIcon = status.icon;
  const requestStatusVariant =
    request?.status === "COMPLETED"
      ? "success"
      : request?.status === "CANCELLED"
        ? "warning"
        : "info";

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
        response.message ?? "No se pudo crear la solicitud de práctica",
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
    await reloadCourse({ silent: true });
    showToast("Solicitud de práctica creada", "success", "top-right");
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
    await reloadCourse({ silent: true });
    showToast("Solicitud cancelada", "success", "top-right");
    setCancelling(false);
  };

  const onReviewCreated = (review: PracticeReview) => {
    if (!request) return;
    setRequest({ ...request, review });
  };

  return (
    <div className="space-y-5">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.04] via-background to-background">
        <CardHeader className="space-y-5 px-6 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={status.variant} size="sm">
                  {status.badge}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Práctica presencial
                </span>
              </div>
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold tracking-tight">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <StatusIcon className="h-5 w-5" />
                  </span>
                  <span>{status.title}</span>
                </CardTitle>
                <CardDescription className="max-w-xl text-sm leading-6">
                  {status.description}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              {practice.practiceUnlockedAt && !practice.practiceCompleted && (
                <Button onClick={() => setRequestModalOpen(true)}>
                  Nueva solicitud
                </Button>
              )}
              {practice.practiceCertificateAvailable && (
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/certificado-practico/${practice.enrollmentId}`)
                  }
                >
                  Ver certificado practico
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="border-t px-6 py-5">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Desbloqueo
              </p>
              <p className="text-sm font-medium text-foreground">
                {practice.practiceUnlockedAt
                  ? formatDate(practice.practiceUnlockedAt, { showTime: false })
                  : "Pendiente"}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Solicitud actual
              </p>
              {practice.latestPracticeRequestStatus && (
                <p className="text-sm font-medium text-foreground">
                  {t(
                    "statusPracticeRequest",
                    practice.latestPracticeRequestStatus,
                  )}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Práctica completada
              </p>
              <p className="text-sm font-medium text-foreground">
                {practice.practiceCompletedAt
                  ? formatDate(practice.practiceCompletedAt, {
                      showTime: false,
                    })
                  : "No"}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Certificado
              </p>
              <p className="text-sm font-medium text-foreground">
                {practice.practiceCertificateAvailable
                  ? "Disponible"
                  : "Aun no"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {requestLoading ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="px-6 py-8 text-sm text-muted-foreground">
            Cargando solicitud de práctica...
          </CardContent>
        </Card>
      ) : request ? (
        <Card>
          <CardHeader className="space-y-4 px-6 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <Badge variant={requestStatusVariant} size="sm">
                  {t("statusPracticeRequest", request.status)}
                </Badge>
                <div className="space-y-2">
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    {formatFullName(
                      request.instructor.firstName,
                      request.instructor.lastName,
                    )}
                  </CardTitle>
                  <CardDescription className="max-w-2xl text-sm leading-6">
                    {request.instructor.headline ||
                      "Instructor disponible para práctica"}
                  </CardDescription>
                </div>
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
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
              <section className="space-y-6">
                <div className="rounded-2xl border bg-muted/20 px-5 py-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Instructor asignado
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {CONTACT_METHOD_LABELS[request.contactMethod] ===
                        "Contacto directo"
                          ? "Podés contactar al instructor directamente con los datos disponibles en esta solicitud."
                          : "El instructor se pondrá en contacto con vos usando los datos que compartiste."}
                      </p>
                      <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        {formatLocation(
                          request.instructor.city,
                          request.instructor.state,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <section className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      Detalles de la solicitud
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Estado actual y datos de coordinación de tu práctica.
                    </p>
                  </div>

                  <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Método de contacto
                      </dt>
                      <dd className="text-sm font-medium text-foreground">
                        {CONTACT_METHOD_LABELS[request.contactMethod]}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Solicitada
                      </dt>
                      <dd className="text-sm font-medium text-foreground">
                        {formatDate(request.requestedAt, { showTime: false })}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Ubicación
                      </dt>
                      <dd className="text-sm font-medium text-foreground">
                        {formatLocation(
                          request.instructor.city,
                          request.instructor.state,
                        )}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Estado
                      </dt>
                      <dd className="text-sm font-medium text-foreground">
                        {request.completedAt
                          ? `Completada el ${formatDate(request.completedAt, {
                              showTime: false,
                            })}`
                          : request.cancelledAt
                            ? `Cancelada el ${formatDate(request.cancelledAt, {
                                showTime: false,
                              })}`
                            : "Pendiente de coordinación"}
                      </dd>
                    </div>
                  </dl>
                </section>
              </section>

              <aside className="space-y-4 rounded-2xl border bg-background px-5 py-5">
                {request.contactMethod === "DIRECT_CONTACT" && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">
                      Coordinación por contacto directo
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      La solicitud ya esta creada. Si el instructor publicó
                      canales de contacto, usalos para coordinar tu práctica.
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {request.instructor.publicContact?.practiceWhatsapp && (
                        <p>
                          WhatsApp:{" "}
                          {request.instructor.publicContact.practiceWhatsapp}
                        </p>
                      )}
                      {request.instructor.publicContact?.practiceEmail && (
                        <p>
                          Email:{" "}
                          {request.instructor.publicContact.practiceEmail}
                        </p>
                      )}
                      {!request.instructor.publicContact?.practiceWhatsapp &&
                        !request.instructor.publicContact?.practiceEmail && (
                          <p>No hay canales publicos cargados.</p>
                        )}
                    </div>
                  </div>
                )}

                {request.contactMethod === "REQUEST_CONTACT" && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">
                      Datos enviados al instructor
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        WhatsApp:{" "}
                        {request.studentContact.studentWhatsapp ||
                          "No informado"}
                      </p>
                      <p>
                        Email:{" "}
                        {request.studentContact.studentEmail || "No informado"}
                      </p>
                      {request.studentMessage && (
                        <p className="leading-6">
                          Mensaje: {request.studentMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </aside>
            </div>

            {request.status === "COMPLETED" && (
              <div className="border-t pt-6">
                <PracticeReviewCard
                  practiceRequestId={request.id}
                  existingReview={request.review}
                  onCreated={onReviewCreated}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="space-y-3 px-6 py-8">
            <p className="text-sm font-medium text-foreground">
              Todavía no generaste una solicitud.
            </p>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Cuando la práctica este disponible vas a poder elegir instructor y
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
        <ModalContent side="bottom" className="max-h-[90vh] lg:max-w-4xl">
          <ModalHeader>
            <ModalTitle>Solicitar práctica</ModalTitle>
            <ModalDescription>
              Elegí un instructor y completá el flujo según el tipo de contacto.
            </ModalDescription>
          </ModalHeader>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
            <section className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Instructores disponibles
                </h3>
                <p className="text-sm text-muted-foreground">
                  Selecciona un instructor para ver el flujo de contacto y
                  completar tu solicitud.
                </p>
              </div>
              {instructorsLoading ? (
                <div className="rounded-2xl border border-dashed bg-muted/20 px-4 py-8 text-sm text-muted-foreground">
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
                        className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors cursor-pointer ${
                          selected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-background hover:border-primary/30 hover:bg-muted/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <UserRound className="h-4 w-4 text-primary" />
                              <p className="font-semibold text-foreground">
                                {formatFullName(
                                  instructor.firstName,
                                  instructor.lastName,
                                )}
                              </p>
                            </div>
                            <p className="text-sm leading-6 text-muted-foreground">
                              {instructor.headline ||
                                "Instructor disponible para práctica"}
                            </p>
                          </div>
                          <Badge
                            size="sm"
                            variant={selected ? "primary" : "outline"}
                          >
                            {CONTACT_METHOD_LABELS[instructor.contactMethod]}
                          </Badge>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                          <span className="font-medium">
                            {instructor.practiceRatingCount} reseñas
                          </span>
                          <span aria-hidden="true">/</span>
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {formatLocation(instructor.city, instructor.state)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <Card className="h-fit lg:sticky lg:top-0">
              <CardHeader className="space-y-2 px-6 py-6">
                <CardTitle className="text-lg font-semibold tracking-tight">
                  {selectedInstructor
                    ? formatFullName(
                        selectedInstructor.firstName,
                        selectedInstructor.lastName,
                      )
                    : "Selecciona un instructor"}
                </CardTitle>
                <CardDescription className="text-sm leading-6">
                  {selectedInstructor
                    ? CONTACT_METHOD_LABELS[selectedInstructor.contactMethod]
                    : "El formulario cambia segun el modo de contacto del instructor."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-6 pb-6">
                <form className="space-y-5" onSubmit={onSubmit}>
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
                    <div className="rounded-2xl border bg-primary/5 px-4 py-4 text-sm leading-6 text-muted-foreground">
                      Al crear la solicitud vas a ver los datos públicos del
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
                  <div className="rounded-2xl border bg-muted/20 px-4 py-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Resumen</p>
                    <p className="mt-3 inline-flex items-center gap-2">
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
    </div>
  );
}
