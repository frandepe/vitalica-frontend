import { useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  ExternalLink,
  Link,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { XIcon } from "@/assets/Icons/x";

interface Social {
  name: string;
  url: string;
  icon: React.ElementType;
  color?: string;
}

interface ShareCourseProps {
  courseUrl: string;
  titleCourse: string;
}

export default function ShareCourse({
  courseUrl,
  titleCourse,
}: ShareCourseProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(courseUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const socials: Social[] = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        courseUrl
      )}`,
      icon: Facebook,
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        courseUrl
      )}`,
      icon: Twitter,
      color: "text-blue-400",
    },
    {
      name: "Instagram",
      url: `https://www.instagram.com/?url=${encodeURIComponent(courseUrl)}`,
      icon: Instagram,
      color: "text-pink-500",
    },
    {
      name: "TikTok",
      url: `https://www.tiktok.com/share/video?url=${encodeURIComponent(
        courseUrl
      )}`,
      icon: XIcon,
      color: "text-black",
    }, // icono temporal
  ];

  return (
    <div className="space-y-4 py-4">
      {/* Copiar link */}
      <div className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
        <p className="truncate max-w-xs">{courseUrl}</p>
        <button
          onClick={handleCopy}
          aria-label={copied ? "Copiado" : "Copiar link"}
          disabled={copied}
          className="flex items-center cursor-pointer"
        >
          {copied ? (
            <CheckIcon className="text-primary h-5 w-5" />
          ) : (
            <CopyIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Botones principales */}
      <div className="flex gap-2 flex-wrap">
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
          <a href={courseUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Ver curso
          </a>
        </Button>
      </div>

      {/* Dock de redes sociales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center gap-4 mt-4"
      >
        {socials.map((social) => (
          <motion.a
            key={social.name}
            href={social.url + `?ref=${encodeURIComponent(titleCourse)}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors`}
            aria-label={social.name}
          >
            <social.icon className="h-6 w-6" />
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
