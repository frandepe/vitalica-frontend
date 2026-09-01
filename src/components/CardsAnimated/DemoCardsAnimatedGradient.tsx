import React from "react";
import { motion } from "framer-motion";
import { CardsAnimatedGradient } from "./CardsAnimatedGradient";
import { useNavigate } from "react-router-dom";
import { INSTRUCTOR_ROUTES } from "@/constants";
import {
  BarChart3,
  BookOpen,
  Star,
  UserRoundPen,
  ChartNoAxesCombined,
} from "lucide-react";

interface BentoCardProps {
  colors: string[];
  delay: number;
  redirectUrl: string;
}

const urlMapping: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  [INSTRUCTOR_ROUTES.DASHBOARD]: {
    title: "Panel de Instructor",
    subtitle:
      "Visualiza métricas, administra cursos, revisa estudiantes, reseñas y actualiza tu perfil",
    icon: BarChart3,
  },

  [INSTRUCTOR_ROUTES.PROFILE]: {
    title: "Perfil del Instructor",
    subtitle: "Visualiza y edita tu información personal",
    icon: UserRoundPen,
  },
  [INSTRUCTOR_ROUTES.ANALYTICS]: {
    title: "Analíticas",
    subtitle: "Estadísticas y desempeño",
    icon: ChartNoAxesCombined,
  },
  [INSTRUCTOR_ROUTES.COURSES]: {
    title: "Cursos Activos",
    subtitle: "Gestión de cursos disponibles",
    icon: BookOpen,
  },
  [INSTRUCTOR_ROUTES.REVIEWS]: {
    title: "Satisfacción del Cliente",
    subtitle: "Reseñas y feedback de usuarios",
    icon: Star,
  },
};

const BentoCard: React.FC<BentoCardProps> = ({
  colors,
  delay,
  redirectUrl,
}) => {
  const navigate = useNavigate();
  const { title, subtitle, icon: Icon } = urlMapping[redirectUrl];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay + 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="relative overflow-hidden h-full bg-background dark:bg-background/50 cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      onClick={() => navigate(redirectUrl)}
    >
      <CardsAnimatedGradient colors={colors} speed={0.05} blur="medium" />
      <motion.div
        className="relative z-10 p-5 md:p-8 text-foreground backdrop-blur-sm flex flex-col items-start"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Icon className="h-8 w-8 text-foreground mb-3" />
        <motion.h3
          className="text-lg md:text-xl font-semibold text-foreground mb-1"
          variants={item}
        >
          {title}
        </motion.h3>
        <motion.p className="text-sm text-foreground/80" variants={item}>
          {subtitle}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const AnimatedGradientDemo: React.FC = () => {
  return (
    <div className="w-full bg-background h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <div className="md:col-span-2">
          <BentoCard
            colors={["#189cf4", "#60A5FA", "#93C5FD"]}
            delay={0.2}
            redirectUrl={INSTRUCTOR_ROUTES.DASHBOARD}
          />
        </div>
        <BentoCard
          colors={["#adebf3", "#34D399", "#93C5FD"]}
          delay={0.4}
          redirectUrl={INSTRUCTOR_ROUTES.PROFILE}
        />
        <BentoCard
          colors={["#20ab9f", "#A78BFA", "#FCD34D"]}
          delay={0.6}
          redirectUrl={INSTRUCTOR_ROUTES.ANALYTICS}
        />
        <div className="md:col-span-2">
          <BentoCard
            colors={["#3B82F6", "#A78BFA", "#FBCFE8"]}
            delay={0.8}
            redirectUrl={INSTRUCTOR_ROUTES.COURSES}
          />
        </div>
        <div className="md:col-span-3">
          <BentoCard
            colors={["#72d0ba", "#F472B6", "#20ab9f"]}
            delay={1}
            redirectUrl={INSTRUCTOR_ROUTES.REVIEWS}
          />
        </div>
      </div>
    </div>
  );
};

export { AnimatedGradientDemo };
