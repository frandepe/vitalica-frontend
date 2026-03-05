import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "../ui/button";
import { CirclesImg } from "../Banners/HeaderBanner";
import mask01 from "@/assets/Masks/mask-15.svg";
import { useFormContext } from "react-hook-form";

// =========================================
// 1. TYPES
// =========================================

export type ProductId = "STUDENT" | "PROFESSIONAL";

export interface ProductData {
  id: ProductId;
  label: string;
  title: string;
  description: string;
  image: string;
  colors: {
    gradient: string;
    glow: string;
    ring: string;
  };
  stats: {
    connectionStatus: string;
  };
  redirect: number;
}

// =========================================
// 2. DATA – VITALICA
// =========================================

const PRODUCT_DATA: Record<ProductId, ProductData> = {
  STUDENT: {
    id: "STUDENT",
    label: "Alumno",
    title: "Aprender para actuar con criterio",
    description:
      "Para quienes quieren capacitarse accediendo a cursos dictados por instructores certificados.",
    image: "/alumno.jpg",
    colors: {
      gradient: "from-primary to-primary-dark",
      glow: "bg-primary",
      ring: "border-primary/30",
    },
    stats: {
      connectionStatus: "Ruta de aprendizaje",
    },
    redirect: 2,
  },

  PROFESSIONAL: {
    id: "PROFESSIONAL",
    label: "Instructor",
    title: "Enseñar con respaldo profesional",
    description:
      "Solo para instructores o profesionales certificados. Permite crear cursos, organizar contenidos y gestionar alumnos en Vitalica.",
    image: "/profesor.jpg",
    colors: {
      gradient: "from-secondary to-teal-700",
      glow: "bg-secondary",
      ring: "border-secondary/30",
    },
    stats: {
      connectionStatus: "Perfil profesional",
    },
    redirect: 3,
  },
};

// =========================================
// 3. ANIMATIONS
// =========================================

const ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    exit: { opacity: 0 },
  },
  item: {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 120, damping: 20 },
    },
    exit: { opacity: 0, y: -10, filter: "blur(6px)" },
  },
  image: (isStudent: boolean): Variants => ({
    initial: {
      opacity: 0,
      scale: 1.4,
      rotate: isStudent ? -25 : 25,
      x: isStudent ? -80 : 80,
      filter: "blur(15px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      x: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 260, damping: 22 },
    },
    exit: {
      opacity: 0,
      scale: 0.7,
      filter: "blur(20px)",
      transition: { duration: 0.25 },
    },
  }),
};

// =========================================
// 4. SUBCOMPONENTS
// =========================================

const BackgroundGradient = ({ isStudent }: { isStudent: boolean }) => (
  <div className="fixed inset-0 pointer-events-none">
    <motion.div
      animate={{
        background: isStudent
          ? "radial-gradient(circle at 0% 50%, rgba(32,171,159,0.08), transparent 55%)"
          : "radial-gradient(circle at 100% 50%, rgba(16,185,129,0.08), transparent 55%)",
      }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
    />
  </div>
);

const ProductVisual = ({ data }: { data: ProductData }) => (
  <motion.div layout className="relative shrink-0">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className={`absolute inset-[-20%] rounded-full border border-dashed border-black/10 ${data.colors.ring}`}
    />

    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute inset-0 rounded-full bg-gradient-to-br ${data.colors.gradient} blur-2xl opacity-30`}
    />

    <div className="relative h-80 w-80 md:h-[450px] md:w-[450px] rounded-full border border-black/10 bg-black/5 backdrop-blur-sm flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <CirclesImg maskSrc={mask01} imgCircles={data.image} />
      </AnimatePresence>
    </div>

    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-600 bg-white/80 px-4 py-2 rounded-full border border-black/10 backdrop-blur">
        <span
          className={`h-1.5 w-1.5 rounded-full ${data.colors.glow} animate-pulse`}
        />
        {data.stats.connectionStatus}
      </div>
    </div>
  </motion.div>
);

const ProductDetails = ({
  data,
  isStudent,
  setStep,
  setUserType,
}: {
  data: ProductData;
  isStudent: boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setUserType: (type: ProductId) => void;
}) => {
  const align = isStudent ? "items-start text-left" : "items-end text-right";

  const handleChoose = () => {
    setUserType(data.id); // actualiza userType en el formulario
    setStep(data.redirect); // avanza al step indicado
  };

  return (
    <motion.div
      variants={ANIMATIONS.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${align}`}
    >
      <motion.h2
        variants={ANIMATIONS.item}
        className="text-sm uppercase tracking-[0.25em] text-zinc-500 mb-2"
      >
        {data.label}
      </motion.h2>

      <motion.h1
        variants={ANIMATIONS.item}
        className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4"
      >
        {data.title}
      </motion.h1>

      <motion.p
        variants={ANIMATIONS.item}
        className={`text-zinc-600 max-w-sm mb-8 leading-relaxed ${
          isStudent ? "mr-auto" : "ml-auto"
        }`}
      >
        {data.description}
      </motion.p>

      <motion.div variants={ANIMATIONS.item}>
        <Button onClick={handleChoose}>
          Elegir ruta de {data.label.toLowerCase()}
        </Button>
      </motion.div>
    </motion.div>
  );
};

// =========================================
// 5. MAIN
// =========================================

export default function Step2({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  // obtener funciones de react-hook-form
  const { setValue, getValues } = useFormContext<{ userType?: ProductId }>();
  const [active, setActive] = useState<ProductId>(
    () => getValues("userType") || "STUDENT",
  );

  const data = PRODUCT_DATA[active];
  const isStudent = active === "STUDENT";

  const setUserType = (type: ProductId) => {
    setValue("userType", type);
  };

  return (
    <div className="relative min-h-screen text-zinc-900 flex items-center justify-center overflow-hidden">
      <BackgroundGradient isStudent={isStudent} />

      <main className="relative z-10 max-w-7xl w-full px-6 py-8">
        <div
          className={`flex flex-col md:flex-row items-center justify-center gap-16 ${
            isStudent ? "" : "md:flex-row-reverse"
          }`}
        >
          <ProductVisual data={data} />

          <div className="max-w-md w-full">
            <AnimatePresence mode="wait">
              <ProductDetails
                key={active}
                data={data}
                isStudent={isStudent}
                setStep={setStep}
                setUserType={setUserType} // ahora setea el formulario
              />
            </AnimatePresence>
          </div>
        </div>

        <div className="fixed bottom-20 inset-x-0 flex justify-center gap-2">
          {(["STUDENT", "PROFESSIONAL"] as ProductId[]).map((id) => (
            <Button
              variant={active === id ? "default" : "outline"}
              key={id}
              onClick={() => setActive(id)}
              className={`px-6 py-3 text-sm font-semibold transition`}
            >
              {PRODUCT_DATA[id].label}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}
