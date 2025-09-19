import { ReactNode, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface AppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
}

export const AppModal = ({
  open,
  onOpenChange,
  title,
  children,
}: AppModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Cerrar modal al hacer click fuera
  const handleClickOutside = (e: MouseEvent) => {
    if (overlayRef.current && e.target === overlayRef.current) {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={cn(
              "relative w-full max-w-lg mx-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6"
            )}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition"
              onClick={() => onOpenChange(false)}
              aria-label="Close modal"
              type="button"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            {title && (
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                {title}
              </h2>
            )}

            {/* Modal Content */}
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
