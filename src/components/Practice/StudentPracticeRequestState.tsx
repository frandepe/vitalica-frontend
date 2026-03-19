import { MapPin, UserRound } from "lucide-react";
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
import type { PracticeRequestStudentView } from "@/types/practice.types";
import { formatDate } from "@/utils/formatDate";
import { formatFullName } from "@/utils/format-fullname";
import { formatLocation } from "@/utils/format-location";
import { t } from "@/utils/translations";
import {
  CONTACT_METHOD_LABELS,
  getAssignedInstructorDescription,
  getPracticeRequestStateLabel,
  getRequestStatusVariant,
} from "./student-practice-panel.helpers";

interface StudentPracticeRequestStateProps {
  practiceUnlockedAt: string | null;
  requestLoading: boolean;
  request: PracticeRequestStudentView | null;
  cancelling: boolean;
  onOpenRequestModal: () => void;
  onCancel: () => Promise<void>;
  onGoToReviews?: () => void;
}

export function StudentPracticeRequestState({
  practiceUnlockedAt,
  requestLoading,
  request,
  cancelling,
  onOpenRequestModal,
  onCancel,
  onGoToReviews,
}: StudentPracticeRequestStateProps) {
  if (requestLoading) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="px-6 py-8 text-sm text-muted-foreground">
          Cargando solicitud de practica...
        </CardContent>
      </Card>
    );
  }

  if (!request) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="space-y-3 px-6 py-8">
          <p className="text-sm font-medium text-foreground">
            Todavia no generaste una solicitud.
          </p>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Cuando la practica este disponible vas a poder elegir instructor y
            seguir todo desde esta seccion.
          </p>
          {practiceUnlockedAt && (
            <Button className="w-fit" onClick={onOpenRequestModal}>
              Elegir instructor
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const requestStatusVariant = getRequestStatusVariant(request.status);

  return (
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
                  "Instructor disponible para practica"}
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
                  <AlertDialogTitle>
                    ¿Querés cancelar esta solicitud de práctica?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Si la cancelás, podrás crear una nueva solicitud más
                    adelante.
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
            <div className="border-l border-primary bg-muted/20 px-5 py-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Instructor asignado
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {getAssignedInstructorDescription(request.contactMethod)}
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
                  Estado actual y datos de coordinacion de tu practica.
                </p>
              </div>

              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Metodo de contacto
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
                    Ubicacion
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
                    {getPracticeRequestStateLabel(request)}
                  </dd>
                </div>
              </dl>
            </section>
          </section>

          <aside className="rounded-2xl border border-border/60 bg-background/80 p-6 backdrop-blur-sm">
            {request.contactMethod === "DIRECT_CONTACT" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full border border-border/60 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
                    Contacto directo
                  </span>

                  <div className="space-y-2">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      Coordiná tu práctica con el instructor
                    </h3>
                    <p className="max-w-[52ch] text-sm leading-6 text-muted-foreground">
                      Tu solicitud ya fue registrada. Si el instructor publicó
                      canales de contacto, podés escribirle directamente para
                      avanzar con la coordinación.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {request.instructor.publicContact?.practiceWhatsapp && (
                    <div className="group flex items-center justify-between gap-4 rounded-xl border-l border-primary bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          WhatsApp
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {request.instructor.publicContact.practiceWhatsapp}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground transition-transform group-hover:translate-x-0.5">
                        Disponible
                      </span>
                    </div>
                  )}

                  {request.instructor.publicContact?.practiceEmail && (
                    <div className="group flex items-center justify-between gap-4 rounded-xl border-l border-primary bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          Email
                        </p>
                        <p className="mt-1 break-all text-sm font-medium text-foreground">
                          {request.instructor.publicContact.practiceEmail}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground transition-transform group-hover:translate-x-0.5">
                        Disponible
                      </span>
                    </div>
                  )}

                  {!request.instructor.publicContact?.practiceWhatsapp &&
                    !request.instructor.publicContact?.practiceEmail && (
                      <div className="rounded-xl border border-dashed border-border/70 px-4 py-4">
                        <p className="text-sm leading-6 text-muted-foreground">
                          El instructor todavía no cargó canales públicos de
                          contacto.
                        </p>
                      </div>
                    )}
                </div>
              </div>
            )}

            {request.contactMethod === "REQUEST_CONTACT" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full border border-border/60 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
                    Solicitud enviada
                  </span>

                  <div className="space-y-2">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      Datos que recibió el instructor
                    </h3>
                    <p className="max-w-[52ch] text-sm leading-6 text-muted-foreground">
                      Esta es la información que compartiste para que pueda
                      contactarte y coordinar la práctica con vos.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-xl border-l border-primary bg-muted/30 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      WhatsApp
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {request.studentContact.studentWhatsapp || "No informado"}
                    </p>
                  </div>

                  <div className="rounded-xl border-l border-primary bg-muted/30 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Email
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-foreground">
                      {request.studentContact.studentEmail || "No informado"}
                    </p>
                  </div>

                  {request.studentMessage && (
                    <div className="rounded-xl border-l border-primary bg-muted/20 px-4 py-4">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Mensaje
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {request.studentMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>

        {request.status === "COMPLETED" && onGoToReviews && (
          <div className="border-t border-border pt-6">
            <div className="border-l border-primary bg-muted/20 px-5 py-5">
              <p className="text-sm font-semibold text-foreground">
                Reseña práctica
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {request.review
                  ? "Tu reseña práctica ahora se encuentra en la pestaña Reseñas, junto con la reseña teórica."
                  : "Ya completaste la práctica. Ahora podés dejar tu reseña práctica desde la pestaña Reseñas, donde también vas a encontrar la reseña teórica."}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={onGoToReviews}
              >
                {request.review ? "Ver reseña práctica" : "Ir a Reseñas"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
