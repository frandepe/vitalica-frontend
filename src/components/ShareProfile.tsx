import { useState } from "react";
import { CheckIcon, CopyIcon, ExternalLink, Link } from "lucide-react";
import { Button } from "./ui/button";
import { TooltipIconButton } from "./TooltipIconButton";

export default function ShareProfile() {
  const [copied, setCopied] = useState<boolean>(false);

  const shareUrl = "https://writer.so/app/projects/123?share=true";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-1.5">
        <p className="font-semibold text-gray-700">Compartir perfil</p>

        <div className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
          <p className="truncate max-w-xs">{shareUrl}</p>
          <TooltipIconButton tooltip="Copiar link" side="top">
            <button
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              disabled={copied}
              type="button"
              className="flex items-center cursor-pointer"
            >
              {copied ? (
                <CheckIcon
                  className="text-primary h-4 w-4"
                  aria-hidden="true"
                />
              ) : (
                <CopyIcon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </TooltipIconButton>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button type="button" className="flex-1 gap-2" onClick={handleCopy}>
          <Link className="h-4 w-4" />
          {copied ? "Copiado" : "Copiar link"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 gap-2"
          asChild
        >
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Ver perfil público
          </a>
        </Button>
      </div>
    </div>
  );
}
