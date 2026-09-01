import {
  cloneElement,
  useMemo,
  useState,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  Building2,
  Clock3,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { motion, useReducedMotion } from "framer-motion";

import { sendContactInquiry } from "@/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIntervalClick } from "@/hooks/useIntervalClick";
import type {
  ContactInquiryPayload,
  ContactReason,
  ContactType,
  OrganizationType,
} from "@/types/contact.types";
import { cn } from "@/utils/cn";

const CONTACT_REASON_OPTIONS: Array<{ value: ContactReason; label: string }> = [
  { value: "CONSULTA_GENERAL", label: "Consulta general" },
  { value: "ALIANZAS_Y_CONVENIOS", label: "Alianzas y convenios" },
  {
    value: "CAPACITACION_PARA_EMPRESAS",
    label: "Capacitación para empresas o instituciones",
  },
  { value: "PRENSA_O_INSTITUCIONAL", label: "Prensa o institucional" },
  { value: "SOPORTE_O_OTRO", label: "Soporte u otro" },
];

const ORGANIZATION_TYPE_OPTIONS: Array<{
  value: OrganizationType;
  label: string;
}> = [
  { value: "EMPRESA", label: "Empresa" },
  { value: "INSTITUCION_EDUCATIVA", label: "Institución educativa" },
  { value: "CENTRO_DE_SALUD", label: "Centro de salud" },
  { value: "ONG", label: "ONG" },
  { value: "ORGANISMO_PUBLICO", label: "Organismo público" },
  { value: "OTRA", label: "Otra" },
];

type ContactFormValues = ContactInquiryPayload;

const DEFAULT_VALUES: ContactFormValues = {
  contactType: "PERSONA",
  fullName: "",
  email: "",
  phone: "",
  reason: "CONSULTA_GENERAL",
  message: "",
  organizationName: "",
  organizationType: undefined,
  jobTitle: "",
  teamSize: "",
};

const ContactPage = () => {
  const { showToast } = useToast();
  const { isResendDisabled, setIsResendDisabled, setTimer, timer } =
    useIntervalClick();
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const contactType = watch("contactType");
  const isOrganization = contactType === "ORGANIZACION";

  const contactTypeDescription = useMemo(
    () =>
      isOrganization
        ? "Contanos de qué organización sos, cuál es tu rol y qué necesitás."
        : "Dejanos tu consulta y te respondemos por mail.",
    [isOrganization],
  );

  const onSubmit = async (values: ContactFormValues) => {
    setServerError("");
    clearErrors();

    const payload: ContactInquiryPayload = {
      contactType: values.contactType,
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone?.trim() || undefined,
      reason: values.reason,
      message: values.message.trim(),
      organizationName: isOrganization
        ? values.organizationName?.trim() || undefined
        : undefined,
      organizationType: isOrganization ? values.organizationType : undefined,
      jobTitle: isOrganization
        ? values.jobTitle?.trim() || undefined
        : undefined,
      teamSize: isOrganization
        ? values.teamSize?.trim() || undefined
        : undefined,
    };

    const response = await sendContactInquiry(payload);

    if (!response?.success) {
      if (response?.errors?.length) {
        response.errors.forEach((error) => {
          const field = error.field as keyof ContactFormValues;
          if (field in DEFAULT_VALUES) {
            setError(field, {
              type: "server",
              message: error.message,
            });
          }
        });
      }

      const message =
        response?.message || "No pudimos enviar tu mensaje en este momento.";
      setServerError(message);
      showToast(message, "error", "top-right");
      return;
    }

    reset(DEFAULT_VALUES);
    setIsSuccess(true);
    setIsResendDisabled(true);
    setTimer(20);
    showToast("Mensaje enviado correctamente", "success", "top-right");
  };

  const selectContactType = (nextType: ContactType) => {
    setValue("contactType", nextType, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setServerError("");

    if (nextType === "PERSONA") {
      setValue("organizationName", "", { shouldValidate: false });
      setValue("organizationType", undefined, { shouldValidate: false });
      setValue("jobTitle", "", { shouldValidate: false });
      setValue("teamSize", "", { shouldValidate: false });
      clearErrors([
        "organizationName",
        "organizationType",
        "jobTitle",
        "teamSize",
      ]);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f5fffc_0%,#ffffff_22%,#ffffff_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-7rem] top-8 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto container px-4 pb-24 pt-16 md:px-0">
        <Reveal className="grid gap-10 border-b border-border/60 pb-16 pt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Contacto
            </div>

            <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              Escribinos
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              Si querés hacer una consulta, una propuesta institucional o
              escribirnos desde una organización, completá el formulario y
              contanos brevemente qué necesitás.
            </p>
          </div>

          <div className="border-l border-primary bg-background/90 px-6 py-6 shadow-[0_24px_80px_-40px_rgba(34,80,69,0.3)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Respuesta
            </p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
              <p>Leemos cada mensaje y respondemos de forma personal.</p>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <span>Solemos responder dentro de 1 a 2 días hábiles.</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-14 py-16 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <Reveal className="space-y-12">
            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Contacto
              </p>

              <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                Podés escribirnos por consultas generales, temas
                institucionales, alianzas o propuestas para empresas e
                instituciones.
              </p>
            </section>

            <section className="space-y-7 border-t border-border/60 pt-8">
              <ContactDetail
                icon={Mail}
                title="Mail"
                description="Si preferís un contacto directo."
                value="vitalicaofficial@gmail.com"
                href="mailto:vitalicaofficial@gmail.com"
              />
              <ContactDetail
                icon={Phone}
                title="Respuesta"
                description="Te respondemos al mail que dejes en el formulario."
                value="Por mail"
              />
            </section>

            <section className="border-t border-border/60 pt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Para agilizar la respuesta
              </p>
              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                <p>
                  Si escribís desde una organización, sumá el tipo de
                  institución, tu rol y el contexto del pedido. Con eso podemos
                  derivarlo mejor y responderte más rápido.
                </p>
              </div>
            </section>
          </Reveal>

          <Reveal
            delay={0.08}
            className="border-l border-primary bg-background/94 px-6 py-8 shadow-[0_28px_80px_-44px_rgba(34,80,69,0.34)] sm:px-8"
          >
            {!isSuccess ? (
              <>
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                    {contactTypeDescription}
                  </p>
                </div>

                <div className="mt-8">
                  <div
                    role="group"
                    aria-labelledby="contact-type-label"
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    <span id="contact-type-label" className="sr-only">
                      Tipo de contacto
                    </span>
                    <button
                      type="button"
                      onClick={() => selectContactType("PERSONA")}
                      aria-pressed={contactType === "PERSONA"}
                      className={cn(
                        "group cursor-pointer border px-4 py-4 text-left transition-all",
                        contactType === "PERSONA"
                          ? "border-primary bg-primary/7 shadow-[0_14px_40px_-30px_rgba(34,80,69,0.35)]"
                          : "border-border/70 bg-background hover:border-primary/25",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-11 w-11 items-center justify-center border border-primary/15 bg-primary/8 text-primary">
                          <UserRound className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            Persona
                          </p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Consulta general.
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectContactType("ORGANIZACION")}
                      aria-pressed={contactType === "ORGANIZACION"}
                      className={cn(
                        "group cursor-pointer border px-4 py-4 text-left transition-all",
                        contactType === "ORGANIZACION"
                          ? "border-primary bg-primary/7 shadow-[0_14px_40px_-30px_rgba(34,80,69,0.35)]"
                          : "border-border/70 bg-background hover:border-primary/25",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-11 w-11 items-center justify-center border border-primary/15 bg-primary/8 text-primary">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            Organización
                          </p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Empresa o institución.
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <form
                  className="mt-8 space-y-7"
                  onSubmit={(event) => {
                    void handleSubmit(onSubmit)(event);
                  }}
                  noValidate
                >
                  <input type="hidden" {...register("contactType")} />

                  <div
                    aria-live="polite"
                    className="border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {isSubmitting
                      ? "Estamos enviando tu mensaje."
                      : "Completá los datos y enviá tu consulta."}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      label="Nombre y apellido"
                      htmlFor="fullName"
                      error={errors.fullName?.message}
                      required
                    >
                      <Input
                        id="fullName"
                        placeholder="Nombre Apellido"
                        {...register("fullName", {
                          required: "Ingresa tu nombre completo",
                          minLength: {
                            value: 2,
                            message:
                              "El nombre debe tener al menos 2 caracteres",
                          },
                          maxLength: {
                            value: 120,
                            message:
                              "El nombre no puede superar los 120 caracteres",
                          },
                        })}
                      />
                    </FormField>

                    <FormField
                      label="Email"
                      htmlFor="email"
                      error={errors.email?.message}
                      required
                    >
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        {...register("email", {
                          required: "Ingresa tu email",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Ingresa un email válido",
                          },
                          maxLength: {
                            value: 255,
                            message:
                              "El email no puede superar los 255 caracteres",
                          },
                        })}
                      />
                    </FormField>
                  </div>

                  <div className="grid gap-6 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
                    <FormField
                      label="Teléfono"
                      htmlFor="phone"
                      error={errors.phone?.message}
                    >
                      <Input
                        id="phone"
                        placeholder="+54 11 5555 5555"
                        {...register("phone", {
                          maxLength: {
                            value: 30,
                            message:
                              "El teléfono no puede superar los 30 caracteres",
                          },
                        })}
                      />
                    </FormField>

                    <FormField
                      label="Motivo"
                      htmlFor="reason"
                      error={errors.reason?.message}
                      required
                    >
                      <Controller
                        name="reason"
                        control={control}
                        rules={{ required: "Selecciona un motivo" }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id="reason"
                              aria-invalid={!!errors.reason}
                            >
                              <SelectValue placeholder="Selecciona un motivo" />
                            </SelectTrigger>
                            <SelectContent>
                              {CONTACT_REASON_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormField>
                  </div>

                  {isOrganization ? (
                    <div className="grid gap-6 border-t border-border/60 pt-7 md:grid-cols-2">
                      <FormField
                        label="Organización"
                        htmlFor="organizationName"
                        error={errors.organizationName?.message}
                        required
                      >
                        <Input
                          id="organizationName"
                          placeholder="Nombre de la organización"
                          {...register("organizationName", {
                            validate: (value) => {
                              if (contactType !== "ORGANIZACION") {
                                return true;
                              }

                              return value?.trim()
                                ? true
                                : "Debés indicar la organización";
                            },
                            maxLength: {
                              value: 160,
                              message:
                                "El nombre de la organización no puede superar los 160 caracteres",
                            },
                          })}
                        />
                      </FormField>

                      <FormField
                        label="Tipo de organización"
                        htmlFor="organizationType"
                        error={errors.organizationType?.message}
                        required
                      >
                        <Controller
                          name="organizationType"
                          control={control}
                          rules={{
                            validate: (value) => {
                              if (contactType !== "ORGANIZACION") {
                                return true;
                              }

                              return value
                                ? true
                                : "Debés indicar el tipo de organización";
                            },
                          }}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                id="organizationType"
                                aria-invalid={!!errors.organizationType}
                              >
                                <SelectValue placeholder="Selecciona una opción" />
                              </SelectTrigger>
                              <SelectContent>
                                {ORGANIZATION_TYPE_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormField>

                      <FormField
                        label="Cargo"
                        htmlFor="jobTitle"
                        error={errors.jobTitle?.message}
                      >
                        <Input
                          id="jobTitle"
                          placeholder="Tu cargo o área"
                          {...register("jobTitle", {
                            maxLength: {
                              value: 120,
                              message:
                                "El cargo no puede superar los 120 caracteres",
                            },
                          })}
                        />
                      </FormField>

                      <FormField
                        label="Tamaño del equipo"
                        htmlFor="teamSize"
                        error={errors.teamSize?.message}
                      >
                        <Input
                          id="teamSize"
                          placeholder="Ej: 50 a 100 personas"
                          {...register("teamSize", {
                            maxLength: {
                              value: 80,
                              message:
                                "El tamaño del equipo no puede superar los 80 caracteres",
                            },
                          })}
                        />
                      </FormField>
                    </div>
                  ) : null}

                  <FormField
                    label="Mensaje"
                    htmlFor="message"
                    error={errors.message?.message}
                    required
                  >
                    <Textarea
                      id="message"
                      className="min-h-36 resize-y"
                      placeholder={
                        isOrganization
                          ? "Contanos qué necesitás, para quién es y el contexto del pedido."
                          : "Contanos en qué te podemos ayudar."
                      }
                      {...register("message", {
                        required: "Escribe tu mensaje",
                        minLength: {
                          value: 10,
                          message:
                            "El mensaje debe tener al menos 10 caracteres",
                        },
                        maxLength: {
                          value: 2000,
                          message:
                            "El mensaje no puede superar los 2000 caracteres",
                        },
                      })}
                    />
                  </FormField>

                  {serverError ? (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {serverError}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                      Te vamos a responder al mail que dejes acá.
                    </p>

                    <Button
                      type="submit"
                      className="min-w-48"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  Mensaje recibido
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Ya lo recibimos.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                  En breve te respondemos por mail. Si necesitás hacer otra
                  consulta, podés abrir un formulario nuevo.
                </p>

                <div
                  aria-live="polite"
                  className="mt-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                >
                  {isResendDisabled
                    ? `Podés abrir otro formulario en ${timer}s.`
                    : "Ya podés abrir otro formulario si hace falta."}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button
                    type="button"
                    disabled={isResendDisabled}
                    onClick={() => {
                      setIsSuccess(false);
                      setServerError("");
                    }}
                  >
                    {isResendDisabled
                      ? `Nuevo formulario en ${timer}s`
                      : "Enviar otro mensaje"}
                  </Button>

                  <Button asChild variant="outline" className="bg-transparent">
                    <Link to="/buscar?search=&page=1&limit=10">
                      Explorar cursos
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

interface FormFieldProps {
  children: ReactElement;
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
  const describedBy = error ? `${htmlFor}-error` : undefined;
  const enhancedChild = cloneElement(
    children as ReactElement<Record<string, unknown>>,
    {
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy,
    },
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label} {required ? <span className="text-red-700">*</span> : null}
      </Label>
      {enhancedChild}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface ContactDetailProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  value: string;
  href?: string;
}

function ContactDetail({
  icon: Icon,
  title,
  description,
  value,
  href,
}: ContactDetailProps) {
  const content = (
    <>
      <div className="inline-flex h-11 w-11 items-center justify-center border border-primary/15 bg-primary/8 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="grid gap-4 border-b border-border/60 pb-7 sm:grid-cols-[3.25rem_minmax(0,1fr)]"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="grid gap-4 border-b border-border/60 pb-7 sm:grid-cols-[3.25rem_minmax(0,1fr)]">
      {content}
    </div>
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

function Reveal({ children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default ContactPage;
