import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/utils/cn";
import { Card } from "./card";
import { CheckCircle, Circle } from "lucide-react";

interface Vo2MaxCardProps {
  title: string;
  value: number;
  status: string;
  description: React.ReactNode;
  progress: number;
  icon: React.ReactNode;
  className?: string;
  profileSteps: {
    name: string;
    completed: boolean;
  }[];
}

export const ProgressCard: React.FC<Vo2MaxCardProps> = ({
  title,
  value,
  status,
  description,
  progress,
  icon,
  className,
  profileSteps,
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const progressValue = useMotionValue(0);

  React.useEffect(() => {
    const valueAnimation = animate(count, value, {
      duration: 1.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    });

    const progressAnimation = animate(progressValue, progress, {
      duration: 1.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    });

    return () => {
      valueAnimation.stop();
      progressAnimation.stop();
    };
  }, [value, progress, count, progressValue]);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useTransform(
    progressValue,
    (v) => circumference - (v / 100) * circumference
  );

  // Lista de pasos de perfil

  return (
    <Card
      className={cn(
        "relative flex flex-col 2xl:flex-row w-full p-6 gap-6 bg-gradient-to-br from-white to-primary/20",
        className
      )}
    >
      {/* Glow decorativo */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />

      {/* Left: Radial + info */}
      <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start gap-6">
        <div className="relative flex h-44 w-44 items-center justify-center flex-shrink-0">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="-rotate-90"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <circle
              cx="100"
              cy="100"
              r={radius}
              strokeWidth="12"
              fill="transparent"
              className="stroke-primary/10"
              strokeDasharray="8 12"
              strokeLinecap="round"
            />
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              strokeWidth="12"
              fill="transparent"
              className="stroke-primary"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeLinecap="round"
              style={{ strokeDashoffset }}
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <motion.span className="text-5xl lg:text-6xl font-bold tracking-tighter">
              {rounded}
            </motion.span>
            <p className="text-lg lg:text-xl font-medium text-muted-foreground">
              {status}
            </p>
          </div>
        </div>

        {/* Title + Description */}
        <div className="flex-1 flex flex-col gap-2 text-center lg:text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-muted-foreground">
              {title}
            </h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {icon}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>

      {/* Right: Pasos del perfil */}
      <div className="mt-6 lg:mt-0 flex flex-col gap-3 flex-shrink-0 min-w-[220px]">
        {profileSteps.map((step) => (
          <div
            key={step.name}
            className="flex items-center justify-between border-b border-slate-200 pb-1"
          >
            <span className="text-sm font-medium text-slate-700">
              {step.name}
            </span>
            {step.completed ? (
              <CheckCircle className="text-green-500 w-5 h-5" />
            ) : (
              <Circle className="text-slate-300 w-5 h-5" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
