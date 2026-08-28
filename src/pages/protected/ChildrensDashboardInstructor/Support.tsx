import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ChevronDown,
  ChevronUp,
  LifeBuoy,
  MessageCircle,
  Send,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import {
  getInstructorSupportRequests,
  sendInstructorSupportRequest,
} from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import type {
  InstructorSupportPayload,
  InstructorSupportReason,
  InstructorSupportStatus,
  InstructorSupportTicket,
} from "@/types/instructor-support.types";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/formatDate";

const SUPPORT_REASON_OPTIONS: Array<{
  value: InstructorSupportReason;
  label: string;
}> = [
  { value: "PROBLEM", label: "Tengo un problema" },
  { value: "QUESTION", label: "Tengo una consulta" },
  { value: "SUGGESTION", label: "Quiero hacer una sugerencia" },
  { value: "OTHER", label: "Otro" },
];

const reasonLabels: Record<InstructorSupportReason, string> = {
  PROBLEM: "Tengo un problema",
  QUESTION: "Tengo una consulta",
  SUGGESTION: "Quiero hacer una sugerencia",
  OTHER: "Otro",
};

const statusLabels: Record<InstructorSupportStatus, string> = {
  PENDING: "Pendiente",
  ANSWERED: "Respondida",
};

const statusBadgeClasses: Record<InstructorSupportStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  ANSWERED: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const DEFAULT_VALUES: InstructorSupportPayload = {
  reason: "QUESTION",
  subject: "",
  message: "",
};

const SUPPORT_TABS = ["contactar", "consultas"] as const;
type SupportTab = (typeof SUPPORT_TABS)[number];

const resolveSupportTab = (value: string | null): SupportTab =>
  SUPPORT_TABS.includes(value as SupportTab)
    ? (value as SupportTab)
    : "contactar";

export default function Support() {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() =>
    resolveSupportTab(searchParams.get("tab")),
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [tickets, setTickets] = useState<InstructorSupportTicket[]>([]);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [ticketsError, setTicketsError] = useState("");

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InstructorSupportPayload>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const loadTickets = useCallback(async () => {
    setIsLoadingTickets(true);
    setTicketsError("");

    try {
      const response = await getInstructorSupportRequests();

      if (!response.success || !response.data) {
        setTickets([]);
        setTicketsError(response.message || "No pudimos cargar tus consultas.");
        return;
      }

      setTickets(response.data);
    } catch (error) {
      console.error("Error cargando consultas de soporte:", error);
      setTickets([]);
      setTicketsError("No pudimos cargar tus consultas.");
    } finally {
      setIsLoadingTickets(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== "consultas") return;
    void loadTickets();
  }, [activeTab, loadTickets]);

  useEffect(() => {
    setActiveTab(resolveSupportTab(searchParams.get("tab")));
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    const nextTab = resolveSupportTab(value);
    setActiveTab(nextTab);
    setSearchParams(nextTab === "contactar" ? {} : { tab: nextTab });
  };

  const onSubmit = async (values: InstructorSupportPayload) => {
    setIsSuccess(false);

    const response = await sendInstructorSupportRequest({
      reason: values.reason,
      subject: values.subject.trim(),
      message: values.message.trim(),
    });

    if (!response.success) {
      if (response.errors?.length) {
        response.errors.forEach((error) => {
          if (["reason", "subject", "message"].includes(error.field)) {
            setError(error.field as keyof InstructorSupportPayload, {
              type: "server",
              message: error.message,
            });
          }
        });
      }

      showToast(
        response.message || "No pudimos enviar tu mensaje en este momento.",
        "error",
        "top-right",
      );
      return;
    }

    reset(DEFAULT_VALUES);
    setIsSuccess(true);
    showToast("Mensaje enviado correctamente", "success", "top-right");

    if (activeTab === "consultas") {
      await loadTickets();
    }
  };

  return (
    <section className="mx-auto container py-8 md:py-10">
      <div className="mb-8 grid gap-5 rounded-xl border border-primary/15 bg-gradient-to-br from-primary/8 via-white to-secondary/10 p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <LifeBuoy className="h-3.5 w-3.5" />
            Soporte para instructores
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            ¿Necesitás ayuda?
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Escribinos si tenés una consulta, encontraste un problema o querés
            hacernos una sugerencia.
          </p>
        </div>

        <div className="hidden h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary shadow-sm md:flex">
          <MessageCircle className="h-8 w-8" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6 grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="contactar" className="h-8 py-0">
            Contactar
          </TabsTrigger>
          <TabsTrigger value="consultas" className="h-8 py-0">
            Mis consultas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contactar">
          <ContactForm
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            onSubmit={onSubmit}
            register={register}
          />
        </TabsContent>

        <TabsContent value="consultas">
          <MySupportTickets
            expandedTicketId={expandedTicketId}
            isLoading={isLoadingTickets}
            onToggleTicket={(ticketId) =>
              setExpandedTicketId((current) =>
                current === ticketId ? null : ticketId,
              )
            }
            tickets={tickets}
            ticketsError={ticketsError}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function ContactForm({
  control,
  errors,
  handleSubmit,
  isSubmitting,
  isSuccess,
  onSubmit,
  register,
}: {
  control: ReturnType<typeof useForm<InstructorSupportPayload>>["control"];
  errors: ReturnType<
    typeof useForm<InstructorSupportPayload>
  >["formState"]["errors"];
  handleSubmit: ReturnType<
    typeof useForm<InstructorSupportPayload>
  >["handleSubmit"];
  isSubmitting: boolean;
  isSuccess: boolean;
  onSubmit: (values: InstructorSupportPayload) => Promise<void>;
  register: ReturnType<typeof useForm<InstructorSupportPayload>>["register"];
}) {
  return (
    <Card className="rounded-xl border-slate-200 shadow-sm">
      <CardContent className="p-6 md:p-8">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event);
          }}
          noValidate
        >
          <FormField
            label="Motivo"
            htmlFor="reason"
            error={errors.reason?.message}
            required
          >
            <Controller
              name="reason"
              control={control}
              rules={{ required: "Seleccioná un motivo" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="reason"
                    aria-invalid={!!errors.reason}
                    aria-describedby={
                      errors.reason ? "reason-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Seleccioná un motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORT_REASON_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField
            label="Asunto"
            htmlFor="subject"
            error={errors.subject?.message}
            required
          >
            <Input
              id="subject"
              placeholder="Ej: No puedo publicar mi curso"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "subject-error" : undefined}
              disabled={isSubmitting}
              {...register("subject", {
                required: "Escribí un asunto",
                minLength: {
                  value: 3,
                  message: "El asunto debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 120,
                  message: "El asunto no puede superar los 120 caracteres",
                },
              })}
            />
          </FormField>

          <FormField
            label="Mensaje"
            htmlFor="message"
            error={errors.message?.message}
            required
          >
            <Textarea
              id="message"
              className="min-h-40 resize-y"
              placeholder="Contanos qué necesitás o qué está pasando..."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              disabled={isSubmitting}
              {...register("message", {
                required: "Escribí tu mensaje",
                minLength: {
                  value: 10,
                  message: "El mensaje debe tener al menos 10 caracteres",
                },
                maxLength: {
                  value: 2000,
                  message: "El mensaje no puede superar los 2000 caracteres",
                },
              })}
            />
          </FormField>

          {isSuccess ? (
            <div
              role="status"
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              Recibimos tu mensaje. La administración lo va a revisar.
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-500">
              No hace falta que agregues datos técnicos. Con una explicación
              clara alcanza para que podamos ayudarte.
            </p>
            <Button
              type="submit"
              className="min-w-44"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting
                ? "Enviando..."
                : isSuccess
                  ? "Mensaje enviado"
                  : "Enviar mensaje"}
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function MySupportTickets({
  expandedTicketId,
  isLoading,
  onToggleTicket,
  tickets,
  ticketsError,
}: {
  expandedTicketId: string | null;
  isLoading: boolean;
  onToggleTicket: (ticketId: string) => void;
  tickets: InstructorSupportTicket[];
  ticketsError: string;
}) {
  if (isLoading) {
    return (
      <p className="py-8 text-sm text-muted-foreground">
        Cargando consultas...
      </p>
    );
  }

  if (ticketsError) {
    return (
      <div role="alert" className="rounded-lg border p-4 text-sm text-red-700">
        {ticketsError}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardContent className="p-6 md:p-8">
          <p className="font-medium text-slate-900">
            Todavía no realizaste ninguna consulta.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Cuando envíes una consulta, vas a poder seguir su estado desde acá.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => {
        const isExpanded = expandedTicketId === ticket.id;

        return (
          <Card
            key={ticket.id}
            className="overflow-hidden rounded-xl border-slate-200 shadow-sm"
          >
            <button
              type="button"
              onClick={() => onToggleTicket(ticket.id)}
              className="flex w-full flex-col gap-3 p-5 text-left transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              aria-expanded={isExpanded}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0",
                      statusBadgeClasses[ticket.status],
                    )}
                  >
                    {statusLabels[ticket.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(ticket.createdAt, { locale: "es" })}
                  </span>
                </div>
                <p className="mt-3 truncate text-base font-semibold text-slate-950">
                  {ticket.subject}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {reasonLabels[ticket.reason]}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-primary">
                {isExpanded ? "Cerrar" : "Ver consulta"}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </button>

            {isExpanded ? <TicketDetail ticket={ticket} /> : null}
          </Card>
        );
      })}
    </div>
  );
}

function TicketDetail({ ticket }: { ticket: InstructorSupportTicket }) {
  return (
    <div className="space-y-5 border-t border-slate-200 p-5">
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Tu consulta
        </h3>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <InfoTerm label="Asunto" value={ticket.subject} />
          <InfoTerm label="Motivo" value={reasonLabels[ticket.reason]} />
          <InfoTerm
            label="Fecha"
            value={formatDate(ticket.createdAt, { locale: "es" })}
          />
        </dl>
        <div className="mt-4 whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm leading-7 text-slate-700">
          {ticket.message}
        </div>
      </section>

      {ticket.status === "ANSWERED" && ticket.adminResponse ? (
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-800">
            Respuesta de administración
          </h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-emerald-950">
            {ticket.adminResponse}
          </p>
          {ticket.respondedAt ? (
            <p className="mt-3 text-xs text-emerald-800">
              Respondida el {formatDate(ticket.respondedAt, { locale: "es" })}
            </p>
          ) : null}
        </section>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Todavía no recibiste una respuesta.
        </div>
      )}
    </div>
  );
}

function InfoTerm({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-slate-900">{value}</dd>
    </div>
  );
}

interface FormFieldProps {
  children: ReactNode;
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
}

function FormField({
  children,
  label,
  htmlFor,
  error,
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-slate-800">
        {label} {required ? <span className="text-red-700">*</span> : null}
      </Label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-sm text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
