import type { FormEventHandler } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  UserRound,
} from "lucide-react";
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
import type { PracticeInstructor } from "@/types/practice.types";
import { formatFullName } from "@/utils/format-fullname";
import { formatLocation } from "@/utils/format-location";
import { CONTACT_METHOD_LABELS } from "./student-practice-panel.helpers";

export interface PracticeRequestFormValues {
  studentWhatsapp: string;
  studentEmail: string;
  studentMessage: string;
}

interface StudentPracticeRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructorsLoading: boolean;
  instructors: PracticeInstructor[];
  selectedInstructorId: string;
  selectedInstructor: PracticeInstructor | null;
  control: Control<PracticeRequestFormValues>;
  errors: FieldErrors<PracticeRequestFormValues>;
  submitting: boolean;
  onSelectInstructor: (instructorId: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const normalizeWhatsappHref = (value: string) => {
  const normalized = value.replace(/[^\d+]/g, "");

  if (!normalized) return null;

  return `https://wa.me/${normalized.replace(/^\+/, "")}`;
};

const normalizeExternalHref = (value: string) => {
  if (!value.trim()) return null;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
};

export function StudentPracticeRequestModal({
  open,
  onOpenChange,
  instructorsLoading,
  instructors,
  selectedInstructorId,
  selectedInstructor,
  control,
  errors,
  submitting,
  onSelectInstructor,
  onSubmit,
}: StudentPracticeRequestModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent side="bottom" className="max-h-[90vh] lg:max-w-4xl">
        <ModalHeader>
          <ModalTitle>Solicitar practica</ModalTitle>
          <ModalDescription>
            Elige instructor y completa el flujo segun el tipo de contacto.
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
                      onClick={() => onSelectInstructor(instructor.id)}
                      className={`w-full cursor-pointer rounded-2xl border px-4 py-4 text-left transition-colors ${
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
                              "Instructor disponible para practica"}
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
                  {selectedInstructor.contactMethod === "DIRECT_CONTACT" && (
                    <div className="mt-4 space-y-3">
                      {selectedInstructor.publicContact?.practiceWhatsapp && (
                        <a
                          href={normalizeWhatsappHref(
                            selectedInstructor.publicContact.practiceWhatsapp,
                          ) ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-start gap-2 rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-background"
                        >
                          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>
                            <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              WhatsApp
                            </span>
                            {selectedInstructor.publicContact.practiceWhatsapp}
                          </span>
                        </a>
                      )}
                      {selectedInstructor.publicContact?.practiceEmail && (
                        <a
                          href={`mailto:${selectedInstructor.publicContact.practiceEmail}`}
                          className="flex items-start gap-2 rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-background"
                        >
                          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>
                            <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Email de practicas
                            </span>
                            {selectedInstructor.publicContact.practiceEmail}
                          </span>
                        </a>
                      )}
                      {selectedInstructor.publicContact?.instagramUrl && (
                        <a
                          href={normalizeExternalHref(
                            selectedInstructor.publicContact.instagramUrl,
                          ) ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-start gap-2 rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-background"
                        >
                          <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>
                            <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Instagram
                            </span>
                            {selectedInstructor.publicContact.instagramUrl}
                          </span>
                        </a>
                      )}
                      {selectedInstructor.publicContact?.linkedinUrl && (
                        <a
                          href={normalizeExternalHref(
                            selectedInstructor.publicContact.linkedinUrl,
                          ) ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-start gap-2 rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-background"
                        >
                          <Linkedin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>
                            <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              LinkedIn
                            </span>
                            {selectedInstructor.publicContact.linkedinUrl}
                          </span>
                        </a>
                      )}
                      {selectedInstructor.publicContact?.websiteUrl && (
                        <a
                          href={normalizeExternalHref(
                            selectedInstructor.publicContact.websiteUrl,
                          ) ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-start gap-2 rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-background"
                        >
                          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>
                            <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Sitio web
                            </span>
                            {selectedInstructor.publicContact.websiteUrl}
                          </span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ModalContent>
    </Modal>
  );
}
