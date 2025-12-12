import type { InstructorApplication } from "@/types/instructor.types";
import type React from "react";
import { useEffect, useState } from "react";

import { AnimatedSignalBadge } from "@/components/AnimatedSignalBadge";
import { getInstructorApplication } from "@/api";
import { cn } from "@/utils/cn";
import { statusColors, t } from "@/constants/statusTranslations";

interface Faq {
  question: string;
  answer: string;
  meta?: string;
}

const faqs: Faq[] = [
  {
    question: "¿Qué sucede después de enviar mi aplicación?",
    answer:
      "Una vez enviada, tu aplicación pasa a estado 'En revisión'. Un administrador evaluará tus documentos y experiencia antes de aprobarte como instructor.",
    meta: "Revisión",
  },
  {
    question: "¿Cuánto tarda la aprobación de mi aplicación?",
    answer:
      "El tiempo de revisión puede variar según la carga de aplicaciones y la disponibilidad de los administradores, pero generalmente no supera los 5 días hábiles.",
    meta: "Revisión",
  },
  {
    question: "¿Qué pasa si mi aplicación es rechazada?",
    answer:
      "Si tu aplicación no cumple con los requisitos, será rechazada y recibirás notas del administrador indicando las razones. Podrás corregir la información y volver a enviar tu solicitud.",
    meta: "Revisión",
  },
  {
    question:
      "¿Puedo actualizar mis documentos después de enviar la aplicación?",
    answer:
      "Sí, mientras tu aplicación esté en estado 'Borrador' o 'En revisión', puedes actualizar tus documentos y certificados para mejorar tus posibilidades de aprobación.",
    meta: "Documentación",
  },
  {
    question: "¿Cómo sé el estado de mi aplicación?",
    answer:
      "Podrás ver el estado de tu aplicación en tu perfil de usuario. Los estados posibles son: Borrador, Enviado, En revisión, Aprobado y Rechazado.",
    meta: "Estado",
  },
  {
    question: "¿Qué criterios usan los administradores para aprobarme?",
    answer:
      "Los administradores revisan que tus certificados y experiencia sean válidos y estén respaldados por instituciones reconocidas, como ACES, AIDER, FAC, entre otras. La intención es garantizar que todos los instructores tengan formación profesional y práctica en primeros auxilios y emergencias médicas; cursos gratuitos o no certificados, como los de YouTube, no son suficientes para aprobar la aplicación.",
    meta: "Evaluación",
  },
];

function ApplicationStatus() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [applicationData, setApplicationData] =
    useState<InstructorApplication | null>(null);

  const toggleQuestion = (index: number) =>
    setActiveIndex((prev) => (prev === index ? -1 : index));

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

  const setCardGlow = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--faq-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--faq-y", `${event.clientY - rect.top}px`);
  };

  const clearCardGlow = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    target.style.removeProperty("--faq-x");
    target.style.removeProperty("--faq-y");
  };

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
                  statusColors[applicationData.status]
                )}
              />
            </span>
            <span className="w-18">
              {t("application", applicationData.status)}
            </span>
          </div>
        </header>

        <ul className="space-y-4">
          {faqs.map((item, index) => {
            const open = activeIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-trigger-${index}`;

            return (
              <li
                key={item.question}
                className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/70 shadow-[0_36px_120px_-70px_rgba(15,15,15,0.18)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 focus-within:-translate-y-0.5"
                onMouseMove={setCardGlow}
                onMouseLeave={clearCardGlow}
              >
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                    open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    background: `radial-gradient(240px circle at var(--faq-x, 50%) var(--faq-y, 50%), rgba(15, 15, 15, 0.08), transparent 70%)`,
                  }}
                />

                <button
                  type="button"
                  id={buttonId}
                  aria-controls={panelId}
                  aria-expanded={open}
                  onClick={() => toggleQuestion(index)}
                  style={
                    {
                      ["--faq-outline" as any]: "rgba(17,17,17,0.25)",
                    } as React.CSSProperties
                  }
                  className="relative flex w-full items-start gap-6 px-8 py-7 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[var(--faq-outline)]"
                >
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-neutral-900/5 transition-all duration-500 group-hover:scale-105">
                    <span
                      className={`pointer-events-none absolute inset-0 rounded-full border border-neutral-300 opacity-30 ${
                        open ? "animate-ping" : ""
                      }`}
                    />
                    <svg
                      className={`relative h-5 w-5 text-neutral-900 transition-transform duration-500 ${
                        open ? "rotate-45" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5v14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M5 12h14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>

                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <h2 className="text-lg font-medium leading-tight text-neutral-900 sm:text-xl">
                        {item.question}
                      </h2>
                      {item.meta && (
                        <span className="inline-flex w-fit items-center rounded-full border border-neutral-200 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-neutral-600 transition-opacity duration-300 sm:ml-auto">
                          {item.meta}
                        </span>
                      )}
                    </div>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`overflow-hidden text-sm leading-relaxed text-neutral-600 transition-[max-height] duration-500 ease-out ${
                        open ? "max-h-64" : "max-h-0"
                      }`}
                    >
                      <p className="pr-2">{item.answer}</p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default ApplicationStatus;
