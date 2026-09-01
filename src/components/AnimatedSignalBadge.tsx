import { useEffect, useState } from "react";
const INTRO_STYLE_ID = "faq1-animations";

interface Props {
  text: string;
}

export const AnimatedSignalBadge = ({ text }: Props) => {
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(INTRO_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = INTRO_STYLE_ID;
    style.innerHTML = `
            @keyframes faq1-fade-up {
              0% { transform: translate3d(0, 20px, 0); opacity: 0; filter: blur(6px); }
              60% { filter: blur(0); }
              100% { transform: translate3d(0, 0, 0); opacity: 1; filter: blur(0); }
            }
            @keyframes faq1-beam-spin {
              0% { transform: rotate(0deg) scale(1); }
              100% { transform: rotate(360deg) scale(1); }
            }
            @keyframes faq1-pulse {
              0% { transform: scale(0.7); opacity: 0.55; }
              60% { opacity: 0.1; }
              100% { transform: scale(1.25); opacity: 0; }
            }
            @keyframes faq1-meter {
              0%, 20% { transform: scaleX(0); transform-origin: left; }
              45%, 60% { transform: scaleX(1); transform-origin: left; }
              80%, 100% { transform: scaleX(0); transform-origin: right; }
            }
            @keyframes faq1-tick {
              0%, 30% { transform: translateX(-6px); opacity: 0.4; }
              50% { transform: translateX(2px); opacity: 1; }
              100% { transform: translateX(20px); opacity: 0; }
            }
            .faq1-intro {
              position: relative;
              display: flex;
              align-items: center;
              gap: 0.85rem;
              padding: 0.85rem 1.4rem;
              border-radius: 9999px;
              overflow: hidden;
              border: 1px solid rgba(17, 17, 17, 0.12);
              background: rgba(248, 250, 252, 0.88);
              color: rgba(15, 23, 42, 0.78);
              text-transform: uppercase;
              letter-spacing: 0.35em;
              font-size: 0.65rem;
              width: 100%;
              max-width: 24rem;
              margin: 0 auto;
              mix-blend-mode: multiply;
              opacity: 0;
              transform: translate3d(0, 12px, 0);
              filter: blur(8px);
              transition: opacity 720ms ease, transform 720ms ease, filter 720ms ease;
              isolation: isolate;
            }
            .faq1-intro--active {
              opacity: 1;
              transform: translate3d(0, 0, 0);
              filter: blur(0);
            }
            .faq1-intro__beam,
            .faq1-intro__pulse {
              position: absolute;
              inset: -110%;
              pointer-events: none;
              border-radius: 50%;
            }
            .faq1-intro__beam {
              background: conic-gradient(from 180deg, rgba(15, 23, 42, 0.18), transparent 30%, rgba(71, 85, 105, 0.18) 58%, transparent 80%, rgba(15, 23, 42, 0.14));
              animation: faq1-beam-spin 18s linear infinite;
              opacity: 0.55;
            }
            .faq1-intro__pulse {
              border: 1px solid currentColor;
              opacity: 0.25;
              animation: faq1-pulse 3.4s ease-out infinite;
            }
            .faq1-intro__label {
              position: relative;
              z-index: 1;
              font-weight: 600;
              letter-spacing: 0.4em;
            }
            .faq1-intro__meter {
              position: relative;
              z-index: 1;
              flex: 1 1 auto;
              height: 1px;
              background: linear-gradient(90deg, transparent, currentColor 35%, transparent 85%);
              transform: scaleX(0);
              transform-origin: left;
              animation: faq1-meter 5.8s ease-in-out infinite;
              opacity: 0.7;
            }
            .faq1-intro__tick {
              position: relative;
              z-index: 1;
              width: 0.55rem;
              height: 0.55rem;
              border-radius: 9999px;
              background: currentColor;
              box-shadow: 0 0 0 4px rgba(15, 15, 15, 0.08);
              animation: faq1-tick 3.2s ease-in-out infinite;
            }
            .faq1-fade {
              opacity: 0;
              transform: translate3d(0, 24px, 0);
              filter: blur(12px);
              transition: opacity 700ms ease, transform 700ms ease, filter 700ms ease;
            }
            .faq1-fade--ready {
              animation: faq1-fade-up 860ms cubic-bezier(0.22, 0.68, 0, 1) forwards;
            }
          `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") {
      setIntroReady(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => setIntroReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return (
    <div className={`faq1-intro ${introReady ? "faq1-intro--active" : ""}`}>
      <span className="faq1-intro__beam" aria-hidden="true" />
      <span className="faq1-intro__pulse" aria-hidden="true" />
      <span className="faq1-intro__label">{text}</span>
      <span className="faq1-intro__meter" aria-hidden="true" />
      <span className="faq1-intro__tick" aria-hidden="true" />
    </div>
  );
};
