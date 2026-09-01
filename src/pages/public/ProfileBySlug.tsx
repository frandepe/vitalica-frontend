import { getCoursesByInstructor, getProfileBySlug } from "@/api";
import {
  InstructorCredentialCard,
  PublicInstructorCredential,
} from "@/components/CardsAnimated/InstructorCredentialCard";
import { PublicCourseCard } from "@/components/CardsAnimated/PublicCourseCard";
import { MainCarousel } from "@/components/Carousel/MainCarousel";
import { FoundingInstructorBadge } from "@/components/FoundingInstructorBadge";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";
import { OptimizedAvatarImage } from "@/components/user/OptimizedAvatarImage";
import { Badge } from "@/components/ui/badge";
import { ISpecialty } from "@/types/course.types";
import { t } from "@/utils/translations";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  MapPin,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { NotFound } from "./404Page";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface InstructorProfile {
  id: string;
  bio: string;
  headline: string;
  specialties: ISpecialty[];
  approvedAt: string;
  isFoundingInstructor: boolean;
  city: string;
  state: string;
  credentials: PublicInstructorCredential[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  avgTheoreticalRating: number;
  totalStudents: number;
  specialty: ISpecialty;
  price: number;
  muxPlaybackId: string | null;
}

interface Enrollment {
  course: Course;
}

interface InstructorProfileStats {
  uniqueStudents: number;
  publishedCourses: number;
  theory: {
    averageRating: number | null;
    reviewCount: number;
  };
  practice: {
    averageRating: number | null;
    reviewCount: number;
  };
}

type IInstructorCourse = Course;

interface Profile {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: "INSTRUCTOR" | "USER" | "ADMIN";
  enrollments: Enrollment[];
  discoveryCourses: Course[];
  instructorProfile: InstructorProfile | null;
  stats: InstructorProfileStats | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const reviewCountLabel = (count: number) =>
  `${count} ${count === 1 ? "reseña" : "reseñas"}`;

const ReputationSummary = ({
  title,
  averageRating,
  reviewCount,
  icon,
}: {
  title: string;
  averageRating: number | null;
  reviewCount: number;
  icon: ReactNode;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary-light text-primary">
        {icon}
      </span>
      {title}
    </div>

    {averageRating === null ? (
      <div>
        <p className="text-lg font-semibold text-gray-900">Sin calificaciones</p>
        <p className="mt-1 text-sm text-gray-500">Sin reseñas</p>
      </div>
    ) : (
      <div>
        <div
          className="flex items-center gap-2"
          aria-label={`Calificación ${averageRating.toFixed(1)} de 5`}
        >
          <Star
            aria-hidden="true"
            className="size-5 fill-amber-400 text-amber-400"
          />
          <span className="text-3xl font-bold tracking-tight text-gray-900">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">de 5</span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {reviewCountLabel(reviewCount)}
        </p>
      </div>
    )}
  </div>
);

const ProfileBySlug = () => {
  const { slug } = useParams();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [instructorCourses, setInstructorCourses] = useState<
    IInstructorCourse[]
  >([]);
  const [loading, setLoading] = useState(true);

  const getInstructorCourses = async (instructorId: string) => {
    try {
      const response = await getCoursesByInstructor(instructorId, 1, 6, "");

      setInstructorCourses(response.data);
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
    }
  };

  const getProfile = async () => {
    try {
      const response = await getProfileBySlug(slug!);
      setProfileData(response.data);

      const instructorId = response.data?.instructorProfile?.id;
      if (instructorId) {
        getInstructorCourses(instructorId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const id = profileData?.instructorProfile?.id;
  //   if (!id) return;

  //   getCoursesInstructor(id);
  // }, [profileData?.instructorProfile?.id]);

  useEffect(() => {
    if (slug) getProfile();
  }, [slug]);

  if (loading)
    return (
      <div className="p-10">
        <GlobalLoading text="Obteniendo usuario..." />
      </div>
    );
  if (!profileData) return <NotFound />;

  const {
    firstName,
    lastName,
    avatarUrl,
    role,
    enrollments,
    instructorProfile,
    stats,
  } = profileData;

  const approvedDate =
    instructorProfile?.approvedAt &&
    format(new Date(instructorProfile.approvedAt), "d 'de' MMMM 'de' yyyy", {
      locale: es,
    });
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-primary-light py-16">
        <div className="container mx-auto px-6 flex flex-col text-center items-center md:text-start md:flex-row md:justify-between md:items-center gap-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm uppercase text-gray-600 mb-2">
              {role === "INSTRUCTOR"
                ? "Instructor"
                : role === "USER"
                  ? "Alumno"
                  : "Administrador"}
            </p>

            <h1 className="text-3xl md:text-4xl font-bold">
              {firstName} {lastName}
            </h1>

            {role === "INSTRUCTOR" && instructorProfile && (
              <>
                {instructorProfile.isFoundingInstructor && (
                  <div className="mt-3 flex justify-center md:justify-start">
                    <FoundingInstructorBadge />
                  </div>
                )}

                <p className="mt-2 text-gray-700">
                  {instructorProfile.headline}
                </p>

                <div className="mt-3 flex flex-col text-center gap-3 text-sm text-gray-600">
                  {instructorProfile.city && (
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <MapPin size={16} />
                      {instructorProfile.city}, {instructorProfile.state}
                    </div>
                  )}

                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Calendar size={16} />
                    Instructor desde el {approvedDate}
                  </div>
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <OptimizedAvatarImage
              source={avatarUrl}
              fallbackSource="/Placeholders/no-image-profile.jpg"
              displaySize={160}
              alt="avatar"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg"
            />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* ================= INSTRUCTOR ================= */}
        {role === "INSTRUCTOR" && instructorProfile && (
          <>
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-12"
              aria-labelledby="instructor-stats-title"
            >
              <h2 id="instructor-stats-title" className="sr-only">
                Alcance y reputación del instructor
              </h2>

              <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-r border-gray-200 p-4 sm:p-6">
                  <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary sm:flex">
                    <Users aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {stats?.uniqueStudents ?? 0}
                    </p>
                    <p className="text-sm text-gray-600">Estudiantes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 sm:p-6">
                  <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary sm:flex">
                    <BookOpen aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {stats?.publishedCourses ?? 0}
                    </p>
                    <p className="text-sm text-gray-600">Cursos publicados</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Reputación
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <ReputationSummary
                    title="Teoría"
                    averageRating={stats?.theory.averageRating ?? null}
                    reviewCount={stats?.theory.reviewCount ?? 0}
                    icon={<BookOpen aria-hidden="true" className="size-4" />}
                  />
                  <ReputationSummary
                    title="Prácticas"
                    averageRating={stats?.practice.averageRating ?? null}
                    reviewCount={stats?.practice.reviewCount ?? 0}
                    icon={
                      <Stethoscope aria-hidden="true" className="size-4" />
                    }
                  />
                </div>
              </div>
            </motion.section>

            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Sobre mí</h2>
              {instructorProfile.bio ? (
                <>
                  <p className="text-gray-700 whitespace-pre-line">
                    {instructorProfile.bio}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 italic">
                  El instructor no ha agregado una biografía.
                </p>
              )}
            </motion.section>

            {instructorProfile.credentials?.length > 0 && (
              <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="mt-10"
              >
                <h2 className="text-2xl font-semibold mb-4">
                  Credenciales y experiencia
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {instructorProfile.credentials.map((credential) => (
                    <InstructorCredentialCard
                      key={credential.id}
                      credential={credential}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mt-10"
            >
              {instructorProfile.specialties?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {instructorProfile.specialties.map((spec, index) => (
                      <Badge key={index}>{t("courseSpecialty", spec)}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>

            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              {instructorCourses.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">
                    Todos los cursos del instructor
                  </h3>
                  <div className="flex overflow-x-auto gap-4">
                    {instructorCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        className="group w-[300px] flex-shrink-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <PublicCourseCard
                          course={course}
                          href={`/cursos/${course.slug}`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          </>
        )}

        {/* ================= USER ================= */}
        {role === "USER" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.3 }}
          >
            {enrollments.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-6">
                  Formación en Vitalica
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.map((enrollment, index) => (
                    <motion.div
                      key={enrollment.course.id}
                      className="group w-[300px] flex-shrink-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <PublicCourseCard
                        course={enrollment.course}
                        href={`/cursos/${enrollment.course.slug}`}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            <MainCarousel
              title={
                enrollments.length > 0
                  ? "Continuá aprendiendo"
                  : "Empezá tu formación"
              }
              subtitle={
                enrollments.length > 0
                  ? "Explorá otros cursos disponibles en Vitalica."
                  : "Explorá los últimos cursos disponibles y elegí por dónde comenzar."
              }
              items={profileData.discoveryCourses}
              renderItem={(course) => (
                <PublicCourseCard
                  course={course}
                  href={`/cursos/${course.slug}`}
                />
              )}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileBySlug;
