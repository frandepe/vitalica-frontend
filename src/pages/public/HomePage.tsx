import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, getUserOnboarding } from "@/api";
import { MainCarousel } from "@/components/Carousel/MainCarousel";
import { CourseCardProps } from "@/components/CardsAnimated/CoursePublic";
import { MainCarouselSkeleton } from "@/components/Skeletons/MainCarouselSkeleton";
import MuxPlayer from "@mux/mux-player-react";
import { useAuth } from "@/hooks/useAuth";
import { BlogTabsRole } from "@/components/Blog/BlogTabsRole";
import {
  FocusRailItem,
  HeroCarousel,
} from "@/components/Carousel/HeroCarousel";
import { motion } from "framer-motion";

const DEMO_ITEMS: FocusRailItem[] = [
  {
    id: 1,
    title: "RCP",
    alt: "Persona realizando RCP en un entrenamiento de reanimación cardiopulmonar",
    meta: "Actuar ante un paro cardíaco",
    imageSrc: "/HeroCarousel/rcp2.jpg",
  },
  {
    id: 2,
    title: "Emergencias",
    alt: "Persona aplicando maniobra de Heimlich en situación de emergencia por obstrucción",
    meta: "Resolver obstrucciones en segundos",
    imageSrc: "/HeroCarousel/heimlich.jpg",
  },
  {
    id: 3,
    title: "Primeros Auxilios",
    alt: "Atención de primeros auxilios aplicando gasa sobre una herida",
    meta: "Tratamiento inmediato de lesiones",
    imageSrc: "/HeroCarousel/gaza.jpg",
  },
  {
    id: 4,
    title: "Lesiones",
    alt: "Atención de lesión deportiva durante una actividad física",
    meta: "Actuación inmediata",
    imageSrc: "/HeroCarousel/sport.jpg",
  },
  {
    id: 5,
    title: "Protocolos de emergencia",
    alt: "Respuesta de primeros auxilios ante un accidente en entorno laboral",
    meta: "Respuesta en entornos laborales",
    imageSrc: "/HeroCarousel/job.jpg",
  },
];

const HomePage = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseCardProps[]>([]);
  const [loadingCarousel, setLoadingCarousel] = useState(false);
  const { user } = useAuth();

  // EN MODO DESARROLLOR: Esto se ejecuta dos veces por el modo estricto de react
  useEffect(() => {
    const checkOnboarding = async () => {
      if (sessionStorage.getItem("onboardingToastShown")) return;

      const res = await getUserOnboarding();
      console.log(
        "res.data.onboarding.hasCompletedOnboarding",
        res.data.onboarding.hasCompletedOnboarding,
      );

      if (!res.data.onboarding || !res.data.onboarding.hasCompletedOnboarding) {
        showToast("Completá tus primeros pasos", "info", "bottom-right", {
          label: "Comenzar",
          onClick: () => navigate("/primeros-pasos"),
        });
        sessionStorage.setItem("onboardingToastShown", "true");
      }
    };

    checkOnboarding();
  }, []);

  const getCoursesFunction = async () => {
    setLoadingCarousel(true); // inicio carga
    try {
      const res = await getCourses(1, 8, "");
      setCourses(res.data);
    } finally {
      setLoadingCarousel(false); // fin carga
    }
  };

  useEffect(() => {
    getCoursesFunction();
  }, []);

  return (
    <section>
      <motion.div
        className="py-10 lg:py-0 lg:mt-10 px-6 lg:px-0"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
      >
        <div className="flex-1 text-center space-y-6 z-10 mx-auto container my-30">
          <motion.h1
            className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1], // easing premium
                },
              },
            }}
          >
            Formación avanzada en
            <span className="text-primary"> emergencias médicas</span>
          </motion.h1>

          <motion.p
            className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 lg:mx-0"
            variants={{
              hidden: { opacity: 0, y: 25 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            Conocimiento y criterio para actuar con seguridad en{" "}
            <span className="font-semibold">situaciones críticas</span>.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center py-4"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {/* TODO:
            Depende el onboarding del usuario, mostrar un botón u otro. Si no hizo el onboarding, mostrar "Comenzar primeros pasos" que lo lleve al onboarding.
            Si ya lo hizo y eligió alumno, mostrar "Ver cursos" que lo lleve al catálogo de cursos.
            Si ya lo hizo y eligió instructor, mostrar "Enseña en Vitalica".
            Si ya tiene el Rol de instructor, mostrar "Panel de instructor".
            */}
            <Button onClick={() => navigate("/buscar?search=&page=1&limit=10")}>
              Ver cursos
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="my-20"
          variants={{
            hidden: { opacity: 0, y: 60, scale: 0.98 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              },
            },
          }}
        >
          <HeroCarousel items={DEMO_ITEMS} autoPlay={false} loop={true} />
        </motion.div>
      </motion.div>

      <div className="mb-20">
        {loadingCarousel ? (
          <MainCarouselSkeleton />
        ) : (
          <MainCarousel
            title="Cursos disponibles"
            subtitle="Lo mínimo que deberías saber para responder ante una emergencia."
            courses={courses}
          />
        )}
      </div>
      <div className="container mx-auto px-4 lg:px-0 mb-30">
        <h2 className="text-3xl mb-10">Cómo funciona Vitalica</h2>
        <div className=" aspect-video rounded-xl overflow-hidden">
          {/* <MuxPlayer
            playbackId={"demo_playback_id"}
            className="w-full h-full mux-custom "
            metadata={{
              video_id: "demo_playback_id",
              video_title: "Video promocional del curso",
              viewer_user_id: user?.id?.toString() || "no-user-id",
            }}
            accentColor="#20ab9f"
          /> */}
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-0">
        <h2 className="text-3xl mb-4">Guías para</h2>
        <BlogTabsRole />
      </div>
      {/* All: video de como funciona vitalica */}
      {/* All: validamos instructores de las siguientes instituciones... */}
      {/* Rol no instructor: ¿Sos instructor? */}
      {/* Centro de conocimiento (dos tabs, instructor y alumno) Blogs para cada uno */}
      {/* FAQ */}
    </section>
  );
};

export default HomePage;
// Soporte las 24 horas, todos los días
// Pago seguro
