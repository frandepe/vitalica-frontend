import { FoundingInstructorBadge } from "@/components/FoundingInstructorBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

const FALLBACK_AVATAR = "/Placeholders/no-image-profile.jpg";

interface InstructorProfileCardProps {
  name: string;
  headline: string;
  avatarUrl?: string | null;
  specialties: string[];
  extraSpecialtiesCount?: number;
  location: string;
  reviewLabel: string;
  totalCourses: number;
  totalStudents: number;
  courseLabel: string;
  studentLabel: string;
  approvedLabel: string;
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
  reviewLabel,
  totalCourses,
  totalStudents,
  courseLabel,
  studentLabel,
  approvedLabel,
  profileHref,
  isFoundingInstructor = false,

  className,
}: InstructorProfileCardProps) {
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
            <img
              src={avatarUrl || FALLBACK_AVATAR}
              alt={name}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_AVATAR;
              }}
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
              +{extraSpecialtiesCount} mas
            </Badge>
          ) : null}
        </div>

        <div className="mt-5 space-y-3 rounded-xl border border-border bg-background/80 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Star className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="leading-6">{reviewLabel}</span>
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
