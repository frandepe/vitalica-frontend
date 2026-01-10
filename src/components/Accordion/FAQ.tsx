import React, { useState } from "react";

interface Props {
  faqs: {
    question: string;
    answer: string;
    meta?: string;
  }[];
}

export const FAQ = ({ faqs }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const toggleQuestion = (index: number) =>
    setActiveIndex((prev) => (prev === index ? -1 : index));

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
  return (
    <ul className="space-y-4">
      {faqs.map((item: any, index: any) => {
        const open = activeIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-trigger-${index}`;

        return (
          <li
            key={item.question}
            className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white/70 shadow-[0_36px_120px_-70px_rgba(15,15,15,0.18)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 focus-within:-translate-y-0.5"
            onMouseMove={setCardGlow}
            onMouseLeave={clearCardGlow}
          >
            <div
              className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
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
  );
};
