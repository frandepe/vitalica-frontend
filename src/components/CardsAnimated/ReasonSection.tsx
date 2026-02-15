import { motion } from "framer-motion";
import { MonitorPlay, Sparkles, Trophy } from "lucide-react";
import type { ReactNode } from "react";

interface ReasonCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
}

function ReasonCard({ icon, title, description, delay }: ReasonCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center px-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      <motion.div
        className="mb-6 text-foreground"
        whileHover={{ scale: 1.1, rotate: 3 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-bold text-foreground mb-2 text-balance">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground max-w-xs text-pretty">
        {description}
      </p>
    </motion.div>
  );
}

const reasons = [
  {
    icon: <MonitorPlay size={64} strokeWidth={1.2} />,
    title: "Enseña a tu manera",
    description:
      "Publica el curso que quieras, como quieras y ten siempre el control de tu propio contenido.",
  },
  {
    icon: <Sparkles size={64} strokeWidth={1.2} />,
    title: "Inspira a los estudiantes",
    description:
      "Enseña lo que sabes y ayuda a los estudiantes a explorar sus intereses, adquirir nuevas habilidades y avanzar en sus carreras.",
  },
  {
    icon: <Trophy size={64} strokeWidth={1.2} />,
    title: "Consigue una recompensa",
    description:
      "Amplía tu red profesional, desarrolla tus conocimientos y gana dinero con cada inscripción de pago.",
  },
];

export default function ReasonsSection() {
  return (
    <section className="container mx-auto py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16 text-balance"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Hay tantas razones para empezar
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reasons.map((reason, index) => (
            <ReasonCard
              key={reason.title}
              icon={reason.icon}
              title={reason.title}
              description={reason.description}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
