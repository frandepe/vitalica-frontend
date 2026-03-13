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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Solicitudes de practica</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las practicas asignadas a tu perfil. Desde aqui puedes
          revisar el detalle de cada alumno, completar solicitudes pendientes o
          cancelarlas.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="px-5 py-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Total
            </p>
            <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-5 py-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Pendientes
            </p>
            <p className="mt-2 text-2xl font-semibold">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-5 py-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Completadas
            </p>
            <p className="mt-2 text-2xl font-semibold">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-5 py-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Canceladas
            </p>
            <p className="mt-2 text-2xl font-semibold">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as StatusFilter)}
        className="space-y-6"
      >
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="ALL">Todas</TabsTrigger>
          <TabsTrigger value="PENDING">Pendientes</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completadas</TabsTrigger>
          <TabsTrigger value="CANCELLED">Canceladas</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <Card>
          <CardContent className="px-6 py-10 text-sm text-muted-foreground">
            Cargando solicitudes de practica...
          </CardContent>
        </Card>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="px-6 py-10 text-sm text-muted-foreground">
            No hay solicitudes en el estado seleccionado.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
          <aside className="space-y-3">
            {filteredRequests.map((request) => {
              const isSelected = selectedRequest?.id === request.id;

              return (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => setSelectedRequestId(request.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">
                      {formatFullName(
                        request.student.firstName,
                        request.student.lastName,
                      )}
                    </p>
                    <Badge
                      variant={STATUS_META[request.status].variant}
                      size="sm"
                    >
                      {STATUS_META[request.status].label}
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {request.course.title || "Curso sin titulo"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDate(request.requestedAt, { showTime: false })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {CONTACT_METHOD_META[request.contactMethod]}
                    </span>
                  </div>
                </button>
              );
            })}
          </aside>

          <main>
            {!selectedRequest ? (
              <Card>
                <CardContent className="px-6 py-10 text-sm text-muted-foreground">
                  Selecciona una solicitud para ver el detalle.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="space-y-3 px-6 pt-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
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
                      <CardTitle className="text-xl font-semibold">
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

                    {selectedRequest.status === "PENDING" && (
                      <div className="flex flex-wrap gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button>Marcar completada</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Confirmás que la práctica del alumno fue
                                realizada?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Al confirmarla, la solicitud se cerrará y el
                                certificado práctico quedará habilitado para el
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
                            <Button variant="outline">Cancelar</Button>
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

                <CardContent className="space-y-6 px-6 pb-6">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border bg-background px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Solicitada
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {formatDate(selectedRequest.requestedAt, {
                          showTime: false,
                        })}
                      </p>
                    </div>
                    <div className="rounded-xl border bg-background px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Estado final
                      </p>
                      <p className="mt-1 text-sm font-medium">
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
                    <div className="rounded-xl border bg-background px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Slug del curso
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {selectedRequest.course.slug}
                      </p>
                    </div>
                    <div className="rounded-xl border bg-background px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Review
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {selectedRequest.review
                          ? `${selectedRequest.review.rating}/5`
                          : "Sin review"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Alumno</h2>
                    <div className="rounded-2xl border bg-background p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <UserRound className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">
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

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            WhatsApp
                          </p>
                          <p className="mt-1 inline-flex items-center gap-2 text-sm font-medium">
                            <Phone className="h-4 w-4 text-primary" />
                            {selectedRequest.studentContact.studentWhatsapp ||
                              "No informado"}
                          </p>
                        </div>
                        <div className="rounded-xl border px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Email
                          </p>
                          <p className="mt-1 inline-flex items-center gap-2 text-sm font-medium">
                            <Mail className="h-4 w-4 text-primary" />
                            {selectedRequest.studentContact.studentEmail ||
                              "No informado"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Mensaje del alumno
                        </p>
                        <p className="mt-2 inline-flex items-start gap-2 text-sm text-foreground">
                          <MessageSquare className="mt-0.5 h-4 w-4 text-primary" />
                          <span>
                            {selectedRequest.studentMessage ||
                              "El alumno no dejo mensaje adicional."}
                          </span>
                        </p>
                      </div>
                    </div>
                  </section>

                  {selectedRequest.review && (
                    <>
                      <Separator />
                      <section className="space-y-3">
                        <h2 className="text-lg font-semibold">
                          Review recibida
                        </h2>
                        <div className="rounded-2xl border bg-primary/5 p-4">
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
                          <p className="mt-3 text-sm text-foreground">
                            {selectedRequest.review.comment ||
                              "El alumno no dejo comentario adicional."}
                          </p>
                        </div>
                      </section>
                    </>
                  )}

                  {selectedRequest.status === "PENDING" && (
                    <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
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
