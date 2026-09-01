import { ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";
import { t } from "@/utils/translations";
import type { InstructorCredentialType } from "@/types/instructor.types";

export interface PublicInstructorCredential {
  id: string;
  type: InstructorCredentialType;
  title: string | null;
  organization: string | null;
  jurisdiction: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  roleOrArea: string | null;
  startDate: string | null;
  endDate: string | null;
  currentlyActive: boolean;
  description: string | null;
}

interface InstructorCredentialCardProps {
  credential: PublicInstructorCredential;
  className?: string;
}

const credentialImage = {
  PROFESSIONAL_DEGREE: "/Icons/titulo-profesional.png",
  PROFESSIONAL_LICENSE: "/Icons/matricula-profesional.png",
  INSTRUCTOR_CERTIFICATION: "/Icons/certificacion-como-instructor.png",
  COMPLEMENTARY_TRAINING: "/Icons/formacion-complementaria.png",
  PROFESSIONAL_EXPERIENCE: "/Icons/experiencia-profesional.png",
  TEACHING_EXPERIENCE: "/Icons/experiencia-docente.png",
} satisfies Record<InstructorCredentialType, string>;

const getYear = (value: string | null) =>
  value ? new Date(value).getFullYear() : null;

const formatIssuedYear = (value: string | null) => {
  const year = getYear(value);
  return year ? `Emitida en ${year}` : null;
};

const formatExperienceRange = (credential: PublicInstructorCredential) => {
  const startYear = getYear(credential.startDate);
  const endYear = credential.currentlyActive
    ? "Actualidad"
    : getYear(credential.endDate);

  if (startYear && endYear) return `${startYear} - ${endYear}`;
  if (startYear) return `Desde ${startYear}`;
  if (endYear) return `Hasta ${endYear}`;
  return null;
};

const getPrimaryText = (credential: PublicInstructorCredential) => {
  if (
    credential.type === "PROFESSIONAL_EXPERIENCE" ||
    credential.type === "TEACHING_EXPERIENCE"
  ) {
    return (
      credential.roleOrArea ||
      credential.title ||
      t("credentialType", credential.type)
    );
  }

  return credential.title || t("credentialType", credential.type);
};

const getDetailText = (credential: PublicInstructorCredential) => {
  if (credential.type === "PROFESSIONAL_LICENSE") {
    return credential.jurisdiction || credential.organization;
  }

  return credential.organization || credential.jurisdiction;
};

const getSecondaryText = (credential: PublicInstructorCredential) => {
  if (
    credential.type === "PROFESSIONAL_EXPERIENCE" ||
    credential.type === "TEACHING_EXPERIENCE"
  ) {
    return formatExperienceRange(credential);
  }

  return formatIssuedYear(credential.issuedAt);
};

export function InstructorCredentialCard({
  credential,
  className,
}: InstructorCredentialCardProps) {
  const imageSrc = credentialImage[credential.type];
  const detail = getDetailText(credential);
  const secondary = getSecondaryText(credential);

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border border-border bg-white p-5 shadow-sm transition-shadow duration-200 ease-out hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center">
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-contain"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            {t("credentialType", credential.type)}
          </p>

          <h3 className="mt-2 text-base font-semibold leading-6 text-foreground">
            {getPrimaryText(credential)}
          </h3>

          {detail ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {detail}
            </p>
          ) : null}
        </div>
      </div>

      {(secondary || credential.description) && (
        <div className="mt-4 space-y-2 text-sm leading-6 text-gray-700">
          {secondary ? <p>{secondary}</p> : null}

          {credential.description ? (
            <p className="line-clamp-2 text-muted-foreground">
              {credential.description}
            </p>
          ) : null}
        </div>
      )}

      <div className="mt-auto pt-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Documentación revisada
        </div>
      </div>
    </article>
  );
}
