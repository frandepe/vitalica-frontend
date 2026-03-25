import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, getMyCoursesEnrrolled, getUserOnboarding } from "@/api";
import { MainCarousel } from "@/components/Carousel/MainCarousel";
import { CourseCardProps } from "@/components/CardsAnimated/CoursePublic";
import { MainCarouselSkeleton } from "@/components/Skeletons/MainCarouselSkeleton";
import { BlogTabsRole } from "@/components/Blog/BlogTabsRole";
import { HeroCarousel } from "@/components/Carousel/HeroCarousel";
import { motion } from "framer-motion";
import { MainCourseCard } from "@/components/CardsAnimated/MainCourseCard";
import { DEMO_ITEMS } from "@/components/Carousel/utils/demo-items";
import { PublicCourseCard } from "@/components/CardsAnimated/PublicCourseCard";

type HomeMyCourse = CourseCardProps & {
  completed?: boolean | null;
  completedAt?: string | null;
  requiresPractice?: boolean;
  practiceUnlockedAt?: string | null;
  progress?:
    | number
    | {
        percentage?: number | null;
      }
    | null;
};

const getTheoreticalProgressPercentage = (course: HomeMyCourse) => {
  if (typeof course.progress === "number") {
    return course.progress;
  }

  if (
    course.progress &&
    typeof course.progress === "object" &&
    typeof course.progress.percentage === "number"
  ) {
    return course.progress.percentage;
  }

  return null;
};

const hasCompletedTheoreticalCourse = (course: HomeMyCourse) => {
  if (course.completed === true || Boolean(course.completedAt)) {
    return true;
  }

  const progressPercentage = getTheoreticalProgressPercentage(course);

  if (progressPercentage === 100) {
    return true;
  }

  if (course.requiresPractice && Boolean(course.practiceUnlockedAt)) {
    return true;
  }

  return false;
};

const HomePage = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseCardProps[]>([]);
  const [coursesMy, setCoursesMy] = useState<HomeMyCourse[]>([]);
  const [loadingCarousel, setLoadingCarousel] = useState(false);
  const [loadingMyCoursesCarousel, setLoadingMyCoursesCarousel] =
    useState(false);

  // EN MODO DESARROLLO: Esto se ejecuta dos veces por el modo estricto de react
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

  const getMyCourses = async () => {
    setLoadingMyCoursesCarousel(true);

    try {
      const res = await getMyCoursesEnrrolled(1, 8, "");

      const myCourses = Array.isArray(res?.data) ? res.data : [];

      setCoursesMy(myCourses);
    } catch (error) {
      console.error("Error loading my courses:", error);
      setCoursesMy([]);
    } finally {
      setLoadingMyCoursesCarousel(false);
    }
  };

  useEffect(() => {
    getMyCourses();
  }, []);

  useEffect(() => {
    getCoursesFunction();
  }, []);

  const coursesMyInProgress = Array.isArray(coursesMy)
    ? coursesMy.filter((course) => !hasCompletedTheoreticalCourse(course))
    : [];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f5fffc_0%,#ffffff_24%,#ffffff_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-7rem] top-14 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
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
            Formación híbrida en
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
        {loadingMyCoursesCarousel ? (
          <MainCarouselSkeleton />
        ) : coursesMyInProgress.length > 0 ? (
          <MainCarousel
            title="Seguir aprendiendo"
            subtitle="Continuá con tu formación"
            items={coursesMyInProgress}
            renderItem={(course) => (
              <PublicCourseCard
                course={course}
                href={`/mis-cursos/${course.slug}`} // TODO: redireccionar a la ultima leccion que visito el usuario de ese curso
              />
            )}
          />
        ) : null}
      </div>

      <div className="mb-20">
        {loadingCarousel ? (
          <MainCarouselSkeleton />
        ) : (
          <MainCarousel
            title="Cursos destacados"
            subtitle="Los más elegidos"
            items={courses}
            renderItem={(course) => <MainCourseCard course={course} />}
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

      <div className="container mx-auto px-4 lg:px-0 mb-10">
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
