import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  useForm,
  type FieldErrors,
  type UseFormHandleSubmit,
  type UseFormRegister,
} from "react-hook-form";
import { LifeBuoy, Mail, MessageSquareText, UserRound } from "lucide-react";

import {
  getInstructorSupportTicketAdmin,
  getInstructorSupportTicketsAdmin,
  respondInstructorSupportTicketAdmin,
} from "@/api/adminEndpoints";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  AdminInstructorSupportReason,
  AdminInstructorSupportStatus,
  AdminInstructorSupportTicket,
  AdminInstructorSupportTicketListItem,
} from "@/types/admin.types";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/cn";

type ResponseFormValues = {
  adminResponse: string;
};

const reasonLabels: Record<AdminInstructorSupportReason, string> = {
  PROBLEM: "Tengo un problema",
  QUESTION: "Tengo una consulta",
  SUGGESTION: "Quiero hacer una sugerencia",
  OTHER: "Otro",
};

const statusLabels: Record<AdminInstructorSupportStatus, string> = {
  PENDING: "Pendiente",
  ANSWERED: "Respondido",
};

const statusBadgeClasses: Record<AdminInstructorSupportStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  ANSWERED: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const getInstructorName = (ticket: {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}) => {
  const fullName = [ticket.user.firstName, ticket.user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || ticket.user.email;
};

export default function AdminSupports() {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<AdminInstructorSupportTicketListItem[]>(
    [],
  );
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] =
    useState<AdminInstructorSupportTicket | null>(null);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResponseFormValues>({
    mode: "onBlur",
    defaultValues: {
      adminResponse: "",
    },
  });

  const selectedListItem = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) || null,
    [tickets, selectedTicketId],
  );

  const loadTickets = useCallback(async () => {
    setIsLoadingTickets(true);
    setErrorMessage(null);

    try {
      const response = await getInstructorSupportTicketsAdmin();

      if (!response.success || !response.data) {
        setTickets([]);
        setErrorMessage(
          response.message || "No se pudieron cargar los tickets de soporte",
        );
        return;
      }

      setTickets(response.data);

      setSelectedTicketId((currentTicketId) =>
        currentTicketId ?? response.data?.[0]?.id ?? null,
      );
    } catch (error) {
      console.error("Error cargando tickets de soporte:", error);
      setTickets([]);
      setErrorMessage("No se pudieron cargar los tickets de soporte");
    } finally {
      setIsLoadingTickets(false);
    }
  }, []);

  const loadTicketDetail = useCallback(
    async (ticketId: string) => {
      setIsLoadingDetail(true);
      setSelectedTicket(null);
      reset({ adminResponse: "" });

      try {
        const response = await getInstructorSupportTicketAdmin(ticketId);

        if (!response.success || !response.data) {
          showToast(
            response.message || "No se pudo cargar el detalle del ticket",
            "error",
          );
          return;
        }

        setSelectedTicket(response.data);
      } catch (error) {
        console.error("Error cargando detalle de soporte:", error);
        showToast("No se pudo cargar el detalle del ticket", "error");
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [reset, showToast],
  );

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    if (!selectedTicketId) return;
    void loadTicketDetail(selectedTicketId);
  }, [loadTicketDetail, selectedTicketId]);

  const onSubmit = async (values: ResponseFormValues) => {
    if (!selectedTicket) return;

    const adminResponse = values.adminResponse.trim();

    if (!adminResponse) {
      setError("adminResponse", {
        type: "manual",
        message: "La respuesta es obligatoria",
      });
      return;
    }

    const response = await respondInstructorSupportTicketAdmin(
      selectedTicket.id,
      adminResponse,
    );

    if (!response.success || !response.data) {
      if (response.errors?.length) {
        const responseError = response.errors.find(
          (error) => error.field === "adminResponse",
        );

        if (responseError) {
          setError("adminResponse", {
            type: "server",
            message: responseError.message,
          });
        }
      }

      showToast(
        response.message || "No se pudo guardar la respuesta",
        "error",
      );
      return;
    }

    setSelectedTicket(response.data);
    reset({ adminResponse: "" });
    showToast("Respuesta guardada correctamente", "success");
    await loadTickets();
  };

  if (isLoadingTickets) {
    return <p className="py-8">Cargando soportes...</p>;
  }

  return (
    <div className="py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Soportes</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Revisá los tickets enviados por instructores y guardá una respuesta
          administrativa para cada caso.
        </p>
      </div>

      {errorMessage ? (
        <div role="alert" className="rounded-lg border p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {tickets.length === 0 && !errorMessage ? (
        <Card className="rounded-lg">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Todavía no hay tickets de soporte enviados por instructores.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
          <aside className="space-y-3">
            {tickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicketId;

              return (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={cn(
                    "w-full rounded-lg border p-4 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {ticket.subject}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {getInstructorName(ticket)}
                      </p>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p>{ticket.user.email}</p>
                    <p>{reasonLabels[ticket.reason]}</p>
                    <p>{formatDate(ticket.createdAt, { locale: "es" })}</p>
                  </div>
                </button>
              );
            })}
          </aside>

          <main>
            {!selectedTicketId ? (
              <Card className="rounded-lg">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    Seleccioná un ticket para ver el detalle.
                  </p>
                </CardContent>
              </Card>
            ) : isLoadingDetail ? (
              <p className="py-8">Cargando detalle...</p>
            ) : selectedTicket ? (
              <TicketDetail
                ticket={selectedTicket}
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            ) : selectedListItem ? (
              <Card className="rounded-lg">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    No se pudo cargar el detalle de {selectedListItem.subject}.
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </main>
        </div>
      )}
    </div>
  );
}

function TicketDetail({
  ticket,
  register,
  handleSubmit,
  onSubmit,
  errors,
  isSubmitting,
}: {
  ticket: AdminInstructorSupportTicket;
  register: UseFormRegister<ResponseFormValues>;
  handleSubmit: UseFormHandleSubmit<ResponseFormValues>;
  onSubmit: (values: ResponseFormValues) => Promise<void>;
  errors: FieldErrors<ResponseFormValues>;
  isSubmitting: boolean;
}) {
  const hasResponse = ticket.status === "ANSWERED" || !!ticket.adminResponse;

  return (
    <div className="space-y-6">
      <Card className="rounded-lg">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Ticket de soporte
              </p>
              <h2 className="mt-2 text-xl font-semibold">{ticket.subject}</h2>
            </div>
            <StatusBadge status={ticket.status} />
          </div>

          <section className="grid gap-4 md:grid-cols-2">
            <InfoBlock
              icon={<UserRound className="h-4 w-4" />}
              label="Instructor"
              value={getInstructorName(ticket)}
            />
            <InfoBlock
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={ticket.user.email}
            />
            <InfoBlock
              icon={<LifeBuoy className="h-4 w-4" />}
              label="Motivo"
              value={reasonLabels[ticket.reason]}
            />
            <InfoBlock
              icon={<MessageSquareText className="h-4 w-4" />}
              label="Fecha"
              value={formatDate(ticket.createdAt, { locale: "es" })}
            />
          </section>

          <section>
            <h3 className="text-sm font-semibold">Mensaje del instructor</h3>
            <div className="mt-3 whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm leading-7 text-slate-700">
              {ticket.message}
            </div>
          </section>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardContent className="space-y-5 p-6">
          <div>
            <h3 className="text-lg font-semibold">Responder al instructor</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              La respuesta queda guardada para mostrarla al instructor en una
              próxima fase.
            </p>
          </div>

          {hasResponse ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                  Respuesta guardada
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-emerald-950">
                  {ticket.adminResponse}
                </p>
              </div>
              {ticket.respondedAt ? (
                <p className="text-xs text-muted-foreground">
                  Respondido el {formatDate(ticket.respondedAt, { locale: "es" })}
                </p>
              ) : null}
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                void handleSubmit(onSubmit)(event);
              }}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="adminResponse">Respuesta</Label>
                <Textarea
                  id="adminResponse"
                  className="min-h-40 resize-y"
                  placeholder="Escribí la respuesta que va a quedar asociada a este ticket..."
                  aria-invalid={!!errors.adminResponse}
                  aria-describedby={
                    errors.adminResponse ? "adminResponse-error" : undefined
                  }
                  disabled={isSubmitting}
                  {...register("adminResponse", {
                    required: "La respuesta es obligatoria",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "La respuesta es obligatoria",
                    minLength: {
                      value: 10,
                      message: "La respuesta debe tener al menos 10 caracteres",
                    },
                    maxLength: {
                      value: 2000,
                      message:
                        "La respuesta no puede superar los 2000 caracteres",
                    },
                  })}
                />
                {errors.adminResponse?.message ? (
                  <p
                    id="adminResponse-error"
                    role="alert"
                    className="text-sm text-red-600"
                  >
                    {errors.adminResponse.message}
                  </p>
                ) : null}
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar respuesta"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoBlock({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: AdminInstructorSupportStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("shrink-0", statusBadgeClasses[status])}
    >
      {statusLabels[status]}
    </Badge>
  );
}
