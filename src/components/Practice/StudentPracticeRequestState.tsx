import { MapPin, UserRound } from "lucide-react";
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
import type {
  PracticeReview,
  PracticeRequestStudentView,
} from "@/types/practice.types";
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
  onReviewCreated: (review: PracticeReview) => void;
}

export function StudentPracticeRequestState({
  practiceUnlockedAt,
  requestLoading,
  request,
  cancelling,
  onOpenRequestModal,
  onCancel,
  onReviewCreated,
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

          <aside className="space-y-4 rounded-2xl border bg-background px-5 py-5">
            {request.contactMethod === "DIRECT_CONTACT" && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Coordinacion por contacto directo
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  La solicitud ya esta creada. Si el instructor publico canales
                  de contacto, usalos para coordinar tu practica.
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
                      Email: {request.instructor.publicContact.practiceEmail}
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
                    {request.studentContact.studentWhatsapp || "No informado"}
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
  );
}
