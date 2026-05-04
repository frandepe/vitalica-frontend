import { getCoursesByInstructor, getProfileBySlug } from "@/api";
import { PublicCourseCard } from "@/components/CardsAnimated/PublicCourseCard";
import { FoundingInstructorBadge } from "@/components/FoundingInstructorBadge";
import { StatCard } from "@/components/CardsAnimated/StatCard";
import { GlobalLoading } from "@/components/Loadings/GlobalLoading";
import { Badge } from "@/components/ui/badge";
import { ISpecialty } from "@/types/course.types";
import { t } from "@/utils/translations";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NotFound } from "./404Page";

interface InstructorProfile {
  id: string;
  bio: string;
  headline: string;
  specialties: ISpecialty[];
  avgTheoreticalRating: number;
  ratingCount: number;
  totalStudents: number;
  totalCourses: number;
  approvedAt: string;
  isFoundingInstructor: boolean;
  city: string;
  state: string;
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

type IInstructorCourse = Course;

interface Profile {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: "INSTRUCTOR" | "USER";
  enrollments: Enrollment[];
  instructorProfile: InstructorProfile | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

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
  } = profileData;

  const approvedYear =
    instructorProfile?.approvedAt &&
    new Date(instructorProfile.approvedAt).getFullYear();
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
              {role === "INSTRUCTOR" ? "Instructor" : "Alumno"}
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
                    Instructor desde {approvedYear}
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
            <img
              src={avatarUrl || "/Placeholders/no-image-profile.jpg"}
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
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            >
              <StatCard
                title="Estudiantes"
                value={instructorProfile.totalStudents}
              />
              <StatCard title="Cursos" value={instructorProfile.totalCourses} />
              <StatCard
                title="Calificación"
                value={`${instructorProfile.avgTheoreticalRating} ⭐`}
              />
              <StatCard title="Reseñas" value={instructorProfile.ratingCount} />
            </motion.div>

            <motion.div
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
            </motion.div>
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
            <h2 className="text-2xl font-semibold mb-6">
              Cursos en los que está inscripto
            </h2>

            {enrollments.length === 0 ? (
              <p>No está inscripto en ningún curso.</p>
            ) : (
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
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileBySlug;
