import { useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";

const MESSAGE_OPINIONS = [
  {
    value: "not-interested",
    emoji: "😐",
    label: "No me interesa",
  },
  {
    value: "neutral",
    emoji: "🤔",
    label: "Me da igual",
  },
  {
    value: "interested",
    emoji: "🙂",
    label: "Me interesa",
  },
  {
    value: "love-it",
    emoji: "😍",
    label: "Me encanta",
  },
] as const;

type MessageOpinion = (typeof MESSAGE_OPINIONS)[number]["value"];

export default function Messages() {
  const [selectedOpinion, setSelectedOpinion] = useState<MessageOpinion | null>(
    null,
  );

  return (
    <section className="mx-auto container py-8 md:py-10">
      <div className="mb-8 grid gap-5 rounded-xl border border-primary/15 bg-gradient-to-br from-primary/8 via-white to-secondary/10 p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <MessageCircle className="h-3.5 w-3.5" />
            Mensajes
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Mensajes
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Próximamente queremos incorporar un espacio para que puedas
            comunicarte directamente con tus alumnos desde Vitalica.
          </p>
        </div>

        <div className="hidden h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary shadow-sm md:flex">
          <Sparkles className="h-8 w-8" />
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6 md:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              Funcionalidad futura
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              ¿Qué te parece la idea?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Nos interesa entender si este canal directo entre instructores y
              alumnos te resultaría útil dentro de tu trabajo diario.
            </p>
          </div>

          <div
            className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            role="radiogroup"
            aria-label="Opinión sobre mensajes entre instructores y alumnos"
          >
            {MESSAGE_OPINIONS.map((option) => {
              const isSelected = selectedOpinion === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedOpinion(option.value)}
                  className={cn(
                    "flex min-h-24 flex-col items-start justify-between rounded-xl border bg-slate-50 px-4 py-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isSelected
                      ? "border-primary bg-primary/8 text-slate-950 shadow-sm ring-1 ring-primary/20"
                      : "border-slate-200 text-slate-700 hover:border-primary/40 hover:bg-white",
                  )}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {option.emoji}
                  </span>
                  <span className="mt-3 flex w-full items-center justify-between gap-2">
                    <span className="text-sm font-semibold">
                      {option.label}
                    </span>
                    {isSelected ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">
                        Elegida
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedOpinion ? (
            <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              Gracias por tu opinión.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
