import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PracticeProgressInfo } from "@/types/practice.types";
import { formatDate } from "@/utils/formatDate";
import { t } from "@/utils/translations";
import type { PracticeStatusCopy } from "./student-practice-panel.helpers";

interface StudentPracticeOverviewCardProps {
  practice: PracticeProgressInfo;
  status: PracticeStatusCopy;
  onOpenRequestModal: () => void;
  onViewCertificate: () => void;
}

export function StudentPracticeOverviewCard({
  practice,
  status,
  onOpenRequestModal,
  onViewCertificate,
}: StudentPracticeOverviewCardProps) {
  const StatusIcon = status.icon;

  return (
    <Card className="border-border bg-gradient-to-br from-primary/[0.04] via-background to-background">
      <CardHeader className="space-y-5 px-6 py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={status.variant} size="sm">
                {status.badge}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Practica presencial
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
              <Button onClick={onOpenRequestModal}>Nueva solicitud</Button>
            )}
            {practice.practiceCertificateAvailable && (
              <Button variant="outline" onClick={onViewCertificate}>
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
              Practica completada
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
              {practice.practiceCertificateAvailable ? "Disponible" : "Aun no"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
