import type { InstructorApplication } from "@/types/instructor.types";
import { useEffect, useState } from "react";
import { AnimatedSignalBadge } from "@/components/AnimatedSignalBadge";
import { getInstructorApplication } from "@/api";
import { cn } from "@/utils/cn";
import { t } from "@/utils/translations";
import {
  faqsApplicationStatus,
  statusColorsInstructorApplication,
} from "@/constants";
import { FAQ } from "@/components/Accordion/FAQ";

function ApplicationStatus() {
  const [hasEntered, setHasEntered] = useState(false);
  const [applicationData, setApplicationData] =
    useState<InstructorApplication | null>(null);

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
      const response = await getInstructorApplication();
      if (response.success && response.data) {
        setApplicationData(response.data as InstructorApplication);
      }
    } catch (error) {
      console.error("Error fetching instructor application:", error);
    }
  };

  useEffect(() => {
    getApplication();
  }, []);

  if (!applicationData) {
    return null;
  }

  return (
    <div className="container mx-auto text-neutral-900 transition-colors duration-700">
      <section
        className={`relative z-10  flex  flex-col gap-12 px-6 py-24  lg:px-12 ${
          hasEntered ? "faq1-fade--ready" : "faq1-fade"
        }`}
      >
        <AnimatedSignalBadge text={t("application", applicationData.status)} />

        <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">
              Solicitud de instructor
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-5xl">
              Preguntas frecuentes sobre el proceso de revisión
            </h1>
            <p className="max-w-xl text-base text-neutral-600">
              Aquí encontrarás respuestas a las preguntas más comunes sobre el
              proceso de revisión de solicitudes para convertirte en instructor.
              Si tienes alguna otra duda, no dudes en contactarnos.
            </p>
          </div>

          <div className="inline-flex h-11 items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900">
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="pointer-events-none absolute inset-0 rounded-full border border-neutral-400/50 opacity-40" />
              <span
                className={cn(
                  "h-3 w-3 rounded-full transition-all duration-500",
                  statusColorsInstructorApplication[applicationData.status]
                )}
              />
            </span>
            <span className="w-18">
              {t("application", applicationData.status)}
            </span>
          </div>
        </header>

        <FAQ faqs={faqsApplicationStatus} />
      </section>
    </div>
  );
}

export default ApplicationStatus;
