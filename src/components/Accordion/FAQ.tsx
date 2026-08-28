import React, { useState } from "react";

interface Props {
  faqs: {
    question: string;
    answer: React.ReactNode;
    meta?: string;
  }[];
  idPrefix?: string;
}

export const FAQ = ({ faqs, idPrefix = "faq" }: Props) => {
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
      {faqs.map((item, index) => {
        const open = activeIndex === index;
        const panelId = `${idPrefix}-panel-${index}`;
        const buttonId = `${idPrefix}-trigger-${index}`;

        return (
          <li
            key={item.question}
            className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white/70 shadow-[0_36px_120px_-70px_rgba(15,15,15,0.18)] backdrop-blur-xl transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-primary/30 focus-within:border-primary/40"
            onMouseMove={setCardGlow}
            onMouseLeave={clearCardGlow}
          >
            <div
              className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
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
                  "--faq-outline": "rgba(17,17,17,0.25)",
                } as React.CSSProperties & { "--faq-outline": string }
              }
              className="relative flex w-full items-start gap-6 px-8 py-7 text-left transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[var(--faq-outline)]"
            >
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-neutral-900/5 transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:border-primary/40">
                <span
                  className="pointer-events-none absolute inset-0 rounded-full border border-neutral-300 opacity-30"
                />
                <svg
                  className={`relative h-5 w-5 text-neutral-900 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
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
                  <h3 className="text-lg font-medium leading-tight text-neutral-900 sm:text-xl">
                    {item.question}
                  </h3>
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
                  className={`overflow-hidden text-sm leading-relaxed text-neutral-600 transition-[max-height] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
                    open ? "max-h-[32rem]" : "max-h-0"
                  }`}
                >
                  <div className="pr-2">{item.answer}</div>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
