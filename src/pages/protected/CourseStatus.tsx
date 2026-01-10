import type React from "react";
import { useEffect, useState } from "react";
import { AnimatedSignalBadge } from "@/components/AnimatedSignalBadge";
import { getCourseStatus } from "@/api";
import { cn } from "@/utils/cn";
import { t } from "@/utils/translations";
import { faqsCourseStatus, statusColorsCourse } from "@/constants";
import { useParams } from "react-router-dom";
import {
  CourseStatus as ICourseStatus,
  IStatusVersion,
} from "@/types/course.types";
import { Alert } from "@/components/ui/alert";
import { Edit2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FAQ } from "@/components/Accordion/FAQ";

export interface IStatusVersionsProps {
  status: ICourseStatus; // status del curso actual (padre)
  title: string | null;
  versions: IStatusVersion[]; // hijo (draft). Máx 1, pero Prisma lo da como array
}

function CourseStatus() {
  const [hasEntered, setHasEntered] = useState(false);
  const [statusData, setStatusData] = useState<IStatusVersionsProps | null>(
    null
  );
  const { courseId } = useParams();

  useEffect(() => {
    if (typeof window === "undefined") {
      setHasEntered(true);
      return;
    }

    let timeout: number | undefined;
    const onLoad = () => {
      timeout = window.setTimeout(() => setHasEntered(true), 120);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onLoad);
      if (typeof timeout !== "undefined") window.clearTimeout(timeout);
    };
  }, []);

  const getApplication = async () => {
    try {
      const response = await getCourseStatus(courseId!);
      if (response.success && response.data) {
        setStatusData(response.data);
      }
    } catch (error) {
      console.error("Error fetching course status:", error);
    }
  };

  useEffect(() => {
    getApplication();
  }, []);

  if (!statusData) {
    return null;
  }
  const latestEditableVersion = (() => {
    if (!statusData?.versions?.length) return null;

    const priority = ["SUBMITTED", "UNDER_REVIEW", "NEEDS_CORRECTION", "DRAFT"];

    // primero buscamos una activa
    const active = statusData.versions.find((v) => priority.includes(v.status));

    return active || statusData.versions[0];
  })();
  console.log("statusData", statusData);

  return (
    <div className="container mx-auto text-neutral-900 transition-colors duration-700">
      <section
        className={`relative z-10 flex flex-col gap-12 px-6 py-24 lg:px-12 ${
          hasEntered ? "faq1-fade--ready" : "faq1-fade"
        }`}
      >
        <AnimatedSignalBadge text={t("statusCourse", statusData.status)} />

        <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
              Estado del curso
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-5xl">
              Estado y revisión del curso - {statusData.title}
            </h1>
            <p className="max-w-xl text-base text-neutral-600">
              Consultá el estado actual de tu curso y encontrá respuestas a las
              preguntas más comunes sobre el proceso de revisión, aprobación y
              publicación.
            </p>
            <span className="text-base text-neutral-600">
              {t("courseStatusDescription", statusData.status)}
            </span>
            {latestEditableVersion && (
              <Alert variant="info" icon={Edit2} className="mt-4">
                <p className="max-w-xl text-base font-bold">
                  Estado de la edición:{" "}
                  {t("statusCourse", latestEditableVersion.status)}
                </p>

                {latestEditableVersion.revewedBy && (
                  <p className="text-base">
                    Administrador: {latestEditableVersion.revewedBy}
                  </p>
                )}
                <Separator />

                {latestEditableVersion.reviewerNotes && (
                  <>
                    <p className="text-base">
                      {latestEditableVersion.reviewerNotes}
                    </p>
                  </>
                )}
              </Alert>
            )}
          </div>

          <div className="inline-flex h-11 items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900">
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="pointer-events-none absolute inset-0 rounded-full border border-neutral-400/50 opacity-40" />
              <span
                className={cn(
                  "h-3 w-3 rounded-full transition-all duration-500",
                  statusColorsCourse[statusData.status]
                )}
              />
            </span>
            <span className="w-18">{t("statusCourse", statusData.status)}</span>
          </div>
        </header>

        <FAQ faqs={faqsCourseStatus} />
      </section>
    </div>
  );
}

export default CourseStatus;
