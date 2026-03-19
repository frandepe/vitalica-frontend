import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  cancelInstructorPracticeRequest,
  completeInstructorPracticeRequest,
  getInstructorPracticeRequests,
} from "@/api";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { PracticeRequestInstructorView } from "@/types/practice.types";
import { formatDate } from "@/utils/formatDate";

type StatusFilter = "ALL" | "PENDING" | "COMPLETED" | "CANCELLED";

const STATUS_META = {
  PENDING: { label: "Pendiente", variant: "info" as const },
  COMPLETED: { label: "Completada", variant: "success" as const },
  CANCELLED: { label: "Cancelada", variant: "warning" as const },
};

const CONTACT_METHOD_META = {
  DIRECT_CONTACT: "Contacto directo",
  REQUEST_CONTACT: "El instructor contacta al alumno",
} as const;

function formatFullName(firstName?: string | null, lastName?: string | null) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Alumno";
}

export default function PracticeRequests() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<PracticeRequestInstructorView[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [submittingAction, setSubmittingAction] = useState<
    "complete" | "cancel" | null
  >(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const response = await getInstructorPracticeRequests();

      if (!response.success || !Array.isArray(response.data)) {
        showToast(
          response.message ??
            "No se pudieron cargar las solicitudes de practica",
          "error",
          "top-right",
        );
        return;
      }

      const nextRequests = response.data as PracticeRequestInstructorView[];
      setRequests(nextRequests);

      if (nextRequests.length === 0) {
        setSelectedRequestId(null);
        return;
      }

      setSelectedRequestId((current) => {
        if (current && nextRequests.some((request) => request.id === current)) {
          return current;
        }

        return nextRequests[0].id;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    if (filter === "ALL") return requests;
    return requests.filter((request) => request.status === filter);
  }, [filter, requests]);

  const selectedRequest = useMemo(
    () =>
      filteredRequests.find((request) => request.id === selectedRequestId) ||
      filteredRequests[0] ||
      null,
    [filteredRequests, selectedRequestId],
  );

  const stats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((request) => request.status === "PENDING")
        .length,
      completed: requests.filter((request) => request.status === "COMPLETED")
        .length,
      cancelled: requests.filter((request) => request.status === "CANCELLED")
        .length,
    }),
    [requests],
  );

  const resolveRequest = async (
    requestId: string,
    action: "complete" | "cancel",
  ) => {
    setSubmittingAction(action);

    const response =
      action === "complete"
        ? await completeInstructorPracticeRequest(requestId)
        : await cancelInstructorPracticeRequest(requestId);

    if (!response.success) {
      showToast(
        response.message ??
          (action === "complete"
            ? "No se pudo completar la practica"
            : "No se pudo cancelar la solicitud"),
        "error",
        "top-right",
      );
      setSubmittingAction(null);
      return;
    }

    showToast(
      action === "complete"
        ? "Solicitud marcada como completada"
        : "Solicitud cancelada",
      "success",
      "top-right",
    );
    await loadRequests();
    setSubmittingAction(null);
  };

  return (
    <div className="space-y-8 py-6 lg:space-y-10 lg:py-8">
      <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-background via-background to-primary/5 shadow-sm">
        <CardContent className="px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <Badge variant="outline" size="sm" className="w-fit">
                Panel de gestion
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Solicitudes de practica
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
                  Gestiona las practicas asignadas a tu perfil. Desde aqui
                  puedes revisar el detalle de cada alumno, completar
                  solicitudes pendientes o cancelarlas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px] sm:grid-cols-4">
              <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 backdrop-blur">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Total
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 backdrop-blur">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Pendientes
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {stats.pending}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 backdrop-blur">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Completadas
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {stats.completed}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 backdrop-blur">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Canceladas
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {stats.cancelled}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">
              Filtrar solicitudes
            </h2>
            <p className="text-sm text-muted-foreground">
              Cambia la vista para revisar pendientes, completadas o canceladas.
            </p>
          </div>

          <Badge variant="outline" size="sm" className="w-fit">
            {filteredRequests.length} visibles
          </Badge>
        </div>

        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as StatusFilter)}
          className="space-y-6"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl border border-border/70 bg-muted/40 p-1.5">
            <TabsTrigger value="ALL" className="rounded-xl px-4">
              Todas
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="rounded-xl px-4">
              Pendientes
            </TabsTrigger>
            <TabsTrigger value="COMPLETED" className="rounded-xl px-4">
              Completadas
            </TabsTrigger>
            <TabsTrigger value="CANCELLED" className="rounded-xl px-4">
              Canceladas
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <Card className="border-dashed">
          <CardContent className="px-6 py-14 text-center text-sm text-muted-foreground">
            Cargando solicitudes de practica...
          </CardContent>
        </Card>
      ) : filteredRequests.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="px-6 py-14 text-center">
            <div className="mx-auto max-w-md space-y-2">
              <p className="text-base font-medium text-foreground">
                No hay solicitudes en el estado seleccionado
              </p>
              <p className="text-sm text-muted-foreground">
                Prueba con otro filtro para revisar el resto de tus practicas.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
          <aside>
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/70 px-5 py-4">
                <CardTitle className="text-base font-semibold tracking-tight">
                  Solicitudes
                </CardTitle>
                <CardDescription>
                  Selecciona una tarjeta para ver el detalle completo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                {filteredRequests.map((request) => {
                  const isSelected = selectedRequest?.id === request.id;

                  return (
                    <button
                      key={request.id}
                      type="button"
                      onClick={() => setSelectedRequestId(request.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary/30 bg-primary/5 shadow-sm"
                          : "border-border/70 bg-card hover:border-primary/20 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {formatFullName(
                              request.student.firstName,
                              request.student.lastName,
                            )}
                          </p>
                          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
                            {request.course.title || "Curso sin titulo"}
                          </p>
                        </div>
                        <Badge
                          variant={STATUS_META[request.status].variant}
                          size="sm"
                          className="shrink-0"
                        >
                          {STATUS_META[request.status].label}
                        </Badge>
                      </div>

                      <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDate(request.requestedAt, {
                            showTime: false,
                          })}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
                          <MapPin className="h-3.5 w-3.5" />
                          {CONTACT_METHOD_META[request.contactMethod]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </aside>

          <main>
            {!selectedRequest ? (
              <Card className="border-dashed">
                <CardContent className="px-6 py-14 text-center">
                  <div className="mx-auto max-w-md space-y-2">
                    <p className="text-base font-medium text-foreground">
                      Selecciona una solicitud para ver el detalle
                    </p>
                    <p className="text-sm text-muted-foreground">
                      El panel derecho muestra datos del alumno, estado y
                      acciones disponibles.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <CardHeader className="space-y-4 border-b border-border/70 bg-muted/20 px-6 py-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={STATUS_META[selectedRequest.status].variant}
                          size="sm"
                        >
                          {STATUS_META[selectedRequest.status].label}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {CONTACT_METHOD_META[selectedRequest.contactMethod]}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                          {selectedRequest.course.title || "Curso sin titulo"}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Alumno asignado:{" "}
                          <span className="font-medium text-foreground">
                            {formatFullName(
                              selectedRequest.student.firstName,
                              selectedRequest.student.lastName,
                            )}
                          </span>
                        </p>
                      </div>
                    </div>

                    {selectedRequest.status === "PENDING" && (
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="min-w-[180px]">
                              Marcar completada
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmas que la practica del alumno fue
                                realizada?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Al confirmarla, la solicitud se cerrara y el
                                certificado practico quedara habilitado para el
                                alumno.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Volver</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  resolveRequest(selectedRequest.id, "complete")
                                }
                                disabled={submittingAction === "complete"}
                              >
                                {submittingAction === "complete"
                                  ? "Completando..."
                                  : "Confirmar"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="min-w-[140px]">
                              Cancelar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancelar solicitud
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                La solicitud quedara cerrada y el alumno podra
                                generar una nueva si corresponde.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Volver</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() =>
                                  resolveRequest(selectedRequest.id, "cancel")
                                }
                                disabled={submittingAction === "cancel"}
                              >
                                {submittingAction === "cancel"
                                  ? "Cancelando..."
                                  : "Confirmar"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-8 px-6 py-6">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-border/70 bg-background px-4 py-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        Solicitada
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {formatDate(selectedRequest.requestedAt, {
                          showTime: false,
                        })}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background px-4 py-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        Estado final
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {selectedRequest.completedAt
                          ? `Completada el ${formatDate(
                              selectedRequest.completedAt,
                              { showTime: false },
                            )}`
                          : selectedRequest.cancelledAt
                            ? `Cancelada el ${formatDate(
                                selectedRequest.cancelledAt,
                                { showTime: false },
                              )}`
                            : "Pendiente"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background px-4 py-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        Slug del curso
                      </p>
                      <p className="mt-2 break-all text-sm font-semibold text-foreground">
                        {selectedRequest.course.slug}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background px-4 py-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        Review
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {selectedRequest.review
                          ? `${selectedRequest.review.rating}/5`
                          : "Sin review"}
                      </p>
                    </div>
                  </div>

                  <section className="space-y-4">
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold tracking-tight">
                        Alumno
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Informacion de contacto y mensaje asociado a la
                        solicitud.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-border/70 bg-background p-5 shadow-sm">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <UserRound className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-foreground">
                              {formatFullName(
                                selectedRequest.student.firstName,
                                selectedRequest.student.lastName,
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ID: {selectedRequest.student.id}
                            </p>
                          </div>
                        </div>

                        <Badge variant="outline" size="sm" className="w-fit">
                          {CONTACT_METHOD_META[selectedRequest.contactMethod]}
                        </Badge>
                      </div>

                      <Separator className="my-5" />

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-4">
                          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                            WhatsApp
                          </p>
                          <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                            <Phone className="h-4 w-4 text-primary" />
                            {selectedRequest.studentContact.studentWhatsapp ||
                              "No informado"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-4">
                          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                            Email
                          </p>
                          <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                            <Mail className="h-4 w-4 text-primary" />
                            {selectedRequest.studentContact.studentEmail ||
                              "No informado"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-2xl border border-border/70 bg-muted/20 px-4 py-4">
                        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                          Mensaje del alumno
                        </p>
                        <p className="mt-3 inline-flex items-start gap-2 text-sm leading-6 text-foreground">
                          <MessageSquare className="mt-1 h-4 w-4 shrink-0 text-primary" />
                          <span>
                            {selectedRequest.studentMessage ||
                              "El alumno no dejo mensaje adicional."}
                          </span>
                        </p>
                      </div>
                    </div>
                  </section>

                  {selectedRequest.review && (
                    <section className="space-y-4">
                      <div className="space-y-1">
                        <h2 className="text-lg font-semibold tracking-tight">
                          Review recibida
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Valoracion y comentario enviados por el alumno.
                        </p>
                      </div>

                      <div className="rounded-3xl border border-primary/10 bg-primary/5 p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="success" size="sm">
                            {selectedRequest.review.rating}/5
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            Enviada el{" "}
                            {formatDate(selectedRequest.review.createdAt, {
                              showTime: false,
                            })}
                          </p>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-foreground">
                          {selectedRequest.review.comment ||
                            "El alumno no dejo comentario adicional."}
                        </p>
                      </div>
                    </section>
                  )}

                  {selectedRequest.status === "PENDING" && (
                    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
                      {selectedRequest.contactMethod === "REQUEST_CONTACT" ? (
                        <p>
                          El flujo activo es de contacto solicitado: el alumno
                          espera que lo contactes usando los datos que figuran
                          arriba.
                        </p>
                      ) : (
                        <p>
                          El flujo activo es de contacto directo: la solicitud
                          sirve como registro y seguimiento hasta que marques la
                          practica como completada o la canceles.
                        </p>
                      )}
                    </div>
                  )}

                  {selectedRequest.status === "COMPLETED" && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                      <p className="inline-flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        La practica ya fue completada.
                      </p>
                    </div>
                  )}

                  {selectedRequest.status === "CANCELLED" && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      <p className="inline-flex items-center gap-2 font-medium">
                        <XCircle className="h-4 w-4" />
                        La solicitud fue cancelada.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
