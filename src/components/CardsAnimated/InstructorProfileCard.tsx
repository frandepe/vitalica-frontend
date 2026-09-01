import { FoundingInstructorBadge } from "@/components/FoundingInstructorBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { InstructorCredentialType } from "@/types/instructor.types";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { OptimizedAvatarImage } from "@/components/user/OptimizedAvatarImage";

const FALLBACK_AVATAR = "/Placeholders/no-image-profile.jpg";

const CREDENTIAL_BADGES: Record<
  InstructorCredentialType,
  { label: string; icon: string }
> = {
  PROFESSIONAL_DEGREE: {
    label: "Título profesional",
    icon: "/Icons/titulo-profesional.png",
  },
  PROFESSIONAL_LICENSE: {
    label: "Matrícula profesional",
    icon: "/Icons/matricula-profesional.png",
  },
  INSTRUCTOR_CERTIFICATION: {
    label: "Certificación como instructor",
    icon: "/Icons/certificacion-como-instructor.png",
  },
  COMPLEMENTARY_TRAINING: {
    label: "Formación complementaria",
    icon: "/Icons/formacion-complementaria.png",
  },
  PROFESSIONAL_EXPERIENCE: {
    label: "Experiencia profesional",
    icon: "/Icons/experiencia-profesional.png",
  },
  TEACHING_EXPERIENCE: {
    label: "Experiencia docente",
    icon: "/Icons/experiencia-docente.png",
  },
};

const CREDENTIAL_ORDER: InstructorCredentialType[] = [
  "PROFESSIONAL_DEGREE",
  "PROFESSIONAL_LICENSE",
  "INSTRUCTOR_CERTIFICATION",
  "COMPLEMENTARY_TRAINING",
  "PROFESSIONAL_EXPERIENCE",
  "TEACHING_EXPERIENCE",
];

interface InstructorProfileCardProps {
  name: string;
  headline: string;
  avatarUrl?: string | null;
  specialties: string[];
  extraSpecialtiesCount?: number;
  location: string;
  theoryRating: number | null;
  theoryReviewCount: number;
  practiceRating: number | null;
  practiceReviewCount: number;
  totalCourses: number;
  totalStudents: number;
  courseLabel: string;
  studentLabel: string;
  approvedLabel: string;
  credentialTypes?: InstructorCredentialType[];
  profileHref: string;
  isFoundingInstructor?: boolean;
  enableAnimations?: boolean;
  className?: string;
}

export function InstructorProfileCard({
  name,
  headline,
  avatarUrl,
  specialties,
  extraSpecialtiesCount = 0,
  location,
  theoryRating,
  theoryReviewCount,
  practiceRating,
  practiceReviewCount,
  totalCourses,
  totalStudents,
  courseLabel,
  studentLabel,
  approvedLabel,
  credentialTypes = [],
  profileHref,
  isFoundingInstructor = false,

  className,
}: InstructorProfileCardProps) {
  const visibleCredentialTypes = CREDENTIAL_ORDER.filter((credentialType) =>
    credentialTypes.includes(credentialType),
  );
  const formatReputation = (rating: number | null, reviewCount: number) => {
    if (rating === null || reviewCount === 0) return "Sin reseñas";

    return `${rating.toFixed(1)} · ${reviewCount} ${reviewCount === 1 ? "reseña" : "reseñas"}`;
  };

  return (
    <motion.article
      initial={false}
      whileHover={undefined}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(32,171,159,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(32,171,159,0.08),transparent_28%)]"
      />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm">
            <OptimizedAvatarImage
              source={avatarUrl}
              fallbackSource={FALLBACK_AVATAR}
              displaySize={80}
              alt={name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-900/25 to-transparent" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                {name}
              </h2>
              {isFoundingInstructor ? (
                <FoundingInstructorBadge compact className="mt-0.5" />
              ) : (
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
              )}
            </div>

            <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">
              {headline}
            </p>

          </div>
        </div>

        {visibleCredentialTypes.length > 0 ? (
          <TooltipProvider delayDuration={250}>
            <div
              className="mt-4 flex flex-wrap items-center justify-start gap-2"
              aria-label="Credenciales profesionales verificadas"
            >
              {visibleCredentialTypes.map((credentialType) => {
                const credential = CREDENTIAL_BADGES[credentialType];

                return (
                  <Tooltip key={credentialType}>
                    <TooltipTrigger asChild>
                      <span
                        tabIndex={0}
                        aria-label={credential.label}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/15 bg-background/85 shadow-sm outline-none transition-colors hover:border-primary/35 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        <img
                          src={credential.icon}
                          alt=""
                          aria-hidden="true"
                          className="h-7 w-7 object-contain"
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {credential.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <Badge
              key={`${name}-${specialty}`}
              size="sm"
              className="border-primary/15 bg-primary/8 text-primary hover:bg-primary/12"
            >
              {specialty}
            </Badge>
          ))}
          {extraSpecialtiesCount > 0 ? (
            <Badge variant="outline" size="sm" className="border-border">
              +{extraSpecialtiesCount} más
            </Badge>
          ) : null}
        </div>

        <div className="mt-5 space-y-3 rounded-xl border border-border bg-background/80 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{location}</span>
          </div>

          <div className="border-t border-border pt-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Star className="h-3.5 w-3.5 text-primary" />
              Reputación
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="font-medium text-foreground">Teoría</dt>
                <dd className="text-right text-muted-foreground">
                  {formatReputation(theoryRating, theoryReviewCount)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="font-medium text-foreground">Prácticas</dt>
                <dd className="text-right text-muted-foreground">
                  {formatReputation(practiceRating, practiceReviewCount)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-background/85 p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Cursos
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
              {totalCourses}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{courseLabel}</p>
          </div>

          <div className="rounded-xl border border-border bg-background/85 p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Users className="h-3.5 w-3.5 text-primary" />
              Estudiantes
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
              {totalStudents}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{studentLabel}</p>
          </div>
        </div>

        <div className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {approvedLabel}
        </div>

        <div className="mt-auto pt-5">
          <Button asChild className="w-full">
            <Link to={profileHref}>
              Ver perfil publico
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
