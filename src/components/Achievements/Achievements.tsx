import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpenCheck,
  Check,
  CircleDot,
  GraduationCap,
  HeartHandshake,
  Medal,
  Presentation,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type {
  AchievementExperience,
  AchievementKey,
  AchievementsData,
} from "@/types/achievement.types";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/formatDate";

interface MilestoneContent {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface AchievementsProps {
  data: AchievementsData | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const CONTENT: Record<AchievementKey, MilestoneContent> = {
  JOINED_VITALICA: {
    title: "Te sumaste a Vitalica",
    description: "Acá empezó tu recorrido de formación.",
    icon: Sparkles,
  },
  STARTED_FIRST_COURSE: {
    title: "Comenzaste tu primera formación",
    description: "Accediste por primera vez a un curso de Vitalica.",
    icon: BookOpenCheck,
  },
  COMPLETED_FIRST_COURSE: {
    title: "Completaste tu primer curso",
    description: "Finalizaste tu primera formación y su evaluación.",
    icon: GraduationCap,
  },
  COMPLETED_FIRST_PRACTICE: {
    title: "Completaste tu primera práctica",
    description: "Llevaste lo aprendido a una instancia práctica.",
    icon: HeartHandshake,
  },
  COMPLETED_THREE_COURSES: {
    title: "Ampliaste tu formación",
    description: "Completaste tres cursos y consolidaste tu recorrido.",
    icon: Medal,
  },
  BECAME_VERIFIED_INSTRUCTOR: {
    title: "Te verificaste como instructor",
    description: "Vitalica aprobó tu perfil profesional.",
    icon: ShieldCheck,
  },
  PUBLISHED_FIRST_COURSE: {
    title: "Publicaste tu primer curso",
    description: "Compartiste tu primera formación en Vitalica.",
    icon: Presentation,
  },
  RECEIVED_FIRST_STUDENT: {
    title: "Recibiste a tu primer alumno",
    description: "Una persona accedió a una de tus formaciones.",
    icon: Users,
  },
  COMPLETED_FIRST_GUIDED_PRACTICE: {
    title: "Acompañaste tu primera práctica",
    description: "Completaste una instancia práctica con un alumno.",
    icon: Award,
  },
};

const CTA_BY_KEY: Partial<
  Record<AchievementKey, { label: string; href: string }>
> = {
  STARTED_FIRST_COURSE: { label: "Explorar cursos", href: "/cursos" },
  COMPLETED_FIRST_COURSE: { label: "Continuar formación", href: "/mis-cursos" },
  COMPLETED_FIRST_PRACTICE: {
    label: "Ver mis prácticas",
    href: "/mis-cursos?tab=practico",
  },
  COMPLETED_THREE_COURSES: { label: "Explorar cursos", href: "/cursos" },
  PUBLISHED_FIRST_COURSE: {
    label: "Gestionar cursos",
    href: "/instructor/cursos",
  },
  COMPLETED_FIRST_GUIDED_PRACTICE: {
    label: "Ver prácticas",
    href: "/instructor/practicas",
  },
};

const getContent = (experience: AchievementExperience, key: AchievementKey) => {
  if (experience === "INSTRUCTOR" && key === "JOINED_VITALICA") {
    return {
      ...CONTENT[key],
      description: "El inicio de tu recorrido en la comunidad.",
    };
  }
  return CONTENT[key];
};

export function Achievements({
  data,
  isLoading,
  error,
  onRetry,
}: AchievementsProps) {
  if (isLoading) return <AchievementsSkeleton />;

  if (error) {
    return (
      <section
        aria-labelledby="achievements-title"
        className="rounded-3xl border border-border bg-card px-6 py-8 shadow-sm"
      >
        <h2
          id="achievements-title"
          className="text-lg font-semibold text-foreground"
        >
          Tu recorrido en Vitalica
        </h2>
        <p role="alert" className="mt-2 text-sm text-muted-foreground">
          {error}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5 transition-transform duration-150 active:scale-[0.97]"
          onClick={onRetry}
        >
          Reintentar
        </Button>
      </section>
    );
  }

  if (!data?.experience || data.total === 0) return null;

  const experience = data.experience;
  const nextIndex = data.milestones.findIndex(({ achieved }) => !achieved);
  const nextMilestone = data.milestones[nextIndex];
  const cta = nextMilestone ? CTA_BY_KEY[nextMilestone.key] : undefined;
  const isComplete = data.completedCount === data.total;

  return (
    <section
      aria-labelledby="achievements-title"
      className="relative overflow-hidden rounded-3xl border border-primary/15 bg-card px-5 py-7 shadow-sm sm:px-7 sm:py-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/10 to-transparent"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="achievements-title"
            className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Tu recorrido en Vitalica
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Los momentos que marcan tu camino en la plataforma.
          </p>
        </div>
        <div className="shrink-0 sm:text-right">
          <p
            className="text-sm font-medium text-foreground"
            aria-label={`${data.completedCount} de ${data.total} hitos alcanzados`}
          >
            {data.completedCount} de {data.total} hitos
          </p>
          <div className="mt-2 flex gap-1.5" aria-hidden="true">
            {data.milestones.map((item) => (
              <span
                key={item.key}
                className={cn(
                  "h-1.5 w-8 rounded-full transition-colors duration-200",
                  item.achieved ? "bg-primary" : "bg-primary/15",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <ol
        className="relative mt-9 grid gap-0 lg:grid-cols-5"
        aria-label="Hitos de tu recorrido"
      >
        {data.milestones.map((item, index) => {
          const content = getContent(experience, item.key);
          const Icon = content.icon;
          const isNext = index === nextIndex;
          return (
            <li
              key={item.key}
              className="relative grid min-h-32 grid-cols-[3rem_1fr] gap-4 pb-7 last:pb-0 lg:min-h-0 lg:grid-cols-1 lg:gap-3 lg:pb-0 lg:pr-5"
              aria-label={`${content.title}: ${item.achieved ? "alcanzado" : isNext ? "próximo hito sugerido" : "pendiente"}`}
            >
              {index < data.milestones.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[1.45rem] top-12 h-[calc(100%-2.25rem)] w-px bg-primary/15 lg:left-12 lg:right-0 lg:top-6 lg:h-px lg:w-auto"
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex size-12 items-center justify-center rounded-full border transition-[background-color,border-color,color,box-shadow] duration-200",
                  item.achieved &&
                    "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                  isNext &&
                    !item.achieved &&
                    "border-primary bg-primary/10 text-primary ring-4 ring-primary/10",
                  !item.achieved &&
                    !isNext &&
                    "border-primary/20 bg-background text-primary/55",
                )}
              >
                {item.achieved ? (
                  <Check className="size-5" aria-hidden="true" />
                ) : (
                  <Icon className="size-5" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0 lg:pr-2">
                {isNext && (
                  <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-primary">
                    Tu próximo hito
                  </p>
                )}
                <h3
                  className={cn(
                    "text-sm font-semibold leading-snug",
                    item.achieved ? "text-foreground" : "text-foreground/80",
                  )}
                >
                  {content.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {content.description}
                </p>
                <p
                  className={cn(
                    "mt-2 text-xs font-medium",
                    item.achieved ? "text-primary" : "text-muted-foreground/75",
                  )}
                >
                  {item.achieved
                    ? item.achievedAt
                      ? formatDate(item.achievedAt, { showTime: false })
                      : "Logrado"
                    : "Por alcanzar"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {(isComplete || cta) && (
        <div className="relative mt-8 flex flex-col gap-4 rounded-2xl bg-primary/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            {isComplete ? (
              <Trophy
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
            ) : (
              <CircleDot
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isComplete
                  ? "Completaste este recorrido"
                  : "Tu recorrido continúa"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {isComplete
                  ? "Tu historia en Vitalica sigue creciendo."
                  : "Cada experiencia suma a tu trayectoria."}
              </p>
            </div>
          </div>
          {cta && !isComplete && (
            <Button
              asChild
              size="sm"
              className="shrink-0 transition-transform duration-150 active:scale-[0.97]"
            >
              <Link to={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </div>
      )}
    </section>
  );
}

export function AchievementsSkeleton() {
  return (
    <section
      aria-label="Cargando tu recorrido"
      aria-busy="true"
      className="rounded-3xl border border-border bg-card px-5 py-7 sm:px-7 sm:py-8"
    >
      <div className="h-3 w-16 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-8 w-64 max-w-full animate-pulse rounded-lg bg-muted" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-9 grid gap-6 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex gap-4 lg:block">
            <div className="size-12 shrink-0 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 lg:mt-3">
              <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-3 w-full animate-pulse rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
