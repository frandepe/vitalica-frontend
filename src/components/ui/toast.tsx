// ToastProvider.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleCheck, AlertCircle, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";
type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType,
    position?: ToastPosition
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<
    { toast: Toast; position: ToastPosition }[]
  >([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.toast.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
      position: ToastPosition = "bottom-right"
    ) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [
        ...prev,
        { toast: { id, message, type }, position },
      ]);

      setTimeout(() => removeToast(id), 5000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {["top-left", "top-right", "bottom-left", "bottom-right", "center"].map(
        (position) => (
          <ToastContainer
            key={position}
            toasts={toasts.filter((t) => t.position === position)}
            position={position as ToastPosition}
            onClose={removeToast}
          />
        )
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

interface ToastContainerProps {
  toasts: { toast: Toast; position: ToastPosition }[];
  position: ToastPosition;
  onClose: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position,
  onClose,
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "center":
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
      default:
        return "";
    }
  };

  const getInitialY = () => (position.startsWith("top") ? -50 : 50);

  return (
    <div
      className={`fixed ${getPositionClasses()} w-full max-w-full sm:max-w-sm px-4 sm:px-0 space-y-2`}
    >
      <AnimatePresence>
        {toasts.map(({ toast }) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: getInitialY() }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: getInitialY() }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ToastComponent {...toast} onClose={() => onClose(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastProps extends Toast {
  onClose: () => void;
}

const ToastComponent: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const typeConfig = {
    success: {
      icon: CircleCheck,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-200",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-200",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
    },
  };

  const { icon: Icon, bgColor, textColor, borderColor } = typeConfig[type];

  return (
    <div
      onClick={onClose}
      className={`${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 flex items-center cursor-pointer max-w-full`}
    >
      <Icon className={`${textColor} w-5 h-5`} />
      <p className={`${textColor} font-medium ml-2`}>{message}</p>
    </div>
  );
};
