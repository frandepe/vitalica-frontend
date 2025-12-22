import * as React from "react";
import {
  Facebook,
  Linkedin,
  Share2,
  X,
  MessageCircle,
  Copy,
} from "lucide-react";

type Platform = "whatsapp" | "linkedin" | "facebook" | "copy";

export interface SocialLink {
  platform: Platform;
  href: string; // para copy: el texto/link a copiar
}

export interface SocialLinksProps {
  links: SocialLink[];
  showOnMobile?: boolean;
  /**
   * Tailwind class para el botón flotante (mobile)
   * Ej: "bg-slate-700"
   */
  floatingButtonColor?: string;
}

const PLATFORM_STYLES: Record<Platform, any> = {
  whatsapp: {
    label: "Compartir WhatsApp",
    icon: MessageCircle,
    gradient: "from-green-600 to-green-500",
    hoverGradient: "from-green-500 to-green-400",
  },
  linkedin: {
    label: "Compartir en LinkedIn",
    icon: Linkedin,
    gradient: "from-sky-700 to-sky-600",
    hoverGradient: "from-sky-600 to-sky-500",
  },
  facebook: {
    label: "Compartir en Facebook",
    icon: Facebook,
    gradient: "from-blue-700 to-blue-600",
    hoverGradient: "from-blue-600 to-blue-500",
  },
  copy: {
    label: "Copiar link",
    icon: Copy,
    gradient: "from-slate-700 to-slate-600",
    hoverGradient: "from-slate-600 to-slate-500",
  },
};

export const SocialLinks: React.FC<SocialLinksProps> = ({
  links,
  showOnMobile = true,
  floatingButtonColor = "bg-slate-700",
}) => {
  const [hoveredPlatform, setHoveredPlatform] = React.useState<Platform | null>(
    null
  );
  const [mobileDockOpen, setMobileDockOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("No se pudo copiar el link", err);
    }
  };

  const renderAction = (
    platform: Platform,
    href: string,
    className: string,
    Icon: any,
    style: any
  ) => {
    if (platform === "copy") {
      return (
        <button
          onClick={() => handleCopy(href)}
          className={className}
          type="button"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r ${
              hoveredPlatform === platform
                ? style.hoverGradient
                : style.gradient
            } opacity-90 transition-all duration-500`}
          />
          <span className="relative z-10 text-white font-semibold text-sm">
            {copied ? "Copiado ✓" : style.label}
          </span>
          <Icon size={22} className="relative z-10 text-white" />
        </button>
      );
    }

    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            hoveredPlatform === platform ? style.hoverGradient : style.gradient
          } opacity-90 transition-all duration-500`}
        />
        <span className="relative z-10 text-white font-semibold text-sm">
          {style.label}
        </span>
        <Icon size={22} className="relative z-10 text-white" />
      </a>
    );
  };

  return (
    <>
      {/* ===== Desktop ===== */}
      <div className="hidden lg:flex flex-col fixed top-[35%] left-0 z-40">
        <ul className="space-y-3">
          {links.map(({ platform, href }) => {
            const style = PLATFORM_STYLES[platform];
            const Icon = style.icon;

            return (
              <li
                key={platform}
                onMouseEnter={() => setHoveredPlatform(platform)}
                onMouseLeave={() => setHoveredPlatform(null)}
                className="group"
              >
                {renderAction(
                  platform,
                  href,
                  "relative flex items-center justify-between w-56 h-14 px-4 ml-[-170px] group-hover:ml-[-10px] transition-all duration-500 ease-out rounded-r-xl overflow-hidden border border-border bg-[hsl(var(--card))] shadow-md hover:shadow-lg",
                  Icon,
                  style
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* ===== Mobile ===== */}
      {showOnMobile && (
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          {mobileDockOpen && (
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileDockOpen(false)}
            />
          )}

          <div className="relative">
            <div
              className={`absolute bottom-20 right-0 flex flex-col-reverse gap-3 transition-all duration-500 ${
                mobileDockOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 pointer-events-none"
              }`}
            >
              {links.map(({ platform, href }, index) => {
                const style = PLATFORM_STYLES[platform];
                const Icon = style.icon;

                return (
                  <button
                    key={platform}
                    onClick={() =>
                      platform === "copy"
                        ? handleCopy(href)
                        : window.open(href, "_blank")
                    }
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${style.gradient}
                                flex items-center justify-center shadow-lg hover:scale-110
                                transition-transform duration-300 border border-border`}
                    style={{
                      transitionDelay: mobileDockOpen
                        ? `${index * 50}ms`
                        : "0ms",
                    }}
                    type="button"
                  >
                    <Icon size={22} className="text-white" />
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setMobileDockOpen(!mobileDockOpen)}
              className={`flex items-center justify-center w-16 h-16 rounded-full shadow-2xl active:scale-95
                          transition-all duration-300 border border-border ${floatingButtonColor}`}
              aria-label="Compartir"
              type="button"
            >
              {mobileDockOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Share2 size={24} className="text-white" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialLinks;
