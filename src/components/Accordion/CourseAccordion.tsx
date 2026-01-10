import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import { ChevronDown, BookOpen, User } from "lucide-react";
import { useState, FC, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useFormattedDate } from "@/hooks/useFormattedDate";
import { t } from "@/utils/translations";
import { AdminCourse } from "@/types/admin.types";
import { Badge } from "../ui/badge";

interface CourseCardsProps {
  projects: AdminCourse[];
}

const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...springTransition, damping: 30, mass: 0.8 },
  },
};

const expandedContentVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.4, staggerChildren: 0.1 },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springTransition },
};

const chevronVariants: Variants = {
  hover: { scale: 1.1, transition: springTransition },
  tap: { scale: 0.95 },
};

const CourseCard: FC<{ project: AdminCourse }> = ({ project }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e?: MouseEvent) => {
    e?.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const isDraft = project.status === "DRAFT";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="border-b border-gray-300 py-4"
      onClick={toggleExpand}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4 flex-1">
          {/* Icon */}
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
            <BookOpen />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <motion.div
              className="flex items-center gap-3 mb-2"
              variants={childVariants}
            >
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {project.title}
              </h3>

              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  isDraft
                    ? "bg-gray-300 text-gray-700"
                    : "bg-[#272D41] text-white"
                }`}
              >
                {t("statusCourse", project.status)}
              </span>
              {project.parentCourseId && (
                <Badge
                  variant="warning"
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                >
                  Edicion de: {project.parentCourseId}
                </Badge>
              )}
            </motion.div>

            <motion.p
              className="text-gray-600 text-sm mb-3"
              variants={childVariants}
            >
              ID: {project.id}
            </motion.p>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  variants={expandedContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="overflow-hidden"
                >
                  <motion.div
                    className="flex flex-col gap-2 text-sm text-gray-600 mb-3"
                    variants={childVariants}
                  >
                    {project.parentCourseId && (
                      <span>ID Curso publicado: ${project.parentCourseId}</span>
                    )}
                    <span>Precio: ${project.price}</span>
                    <span>Alumnos: {project.totalStudents}</span>
                    <span>Creado: {useFormattedDate(project.createdAt)}</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-2 text-sm text-gray-500 mb-3"
                    variants={childVariants}
                  >
                    <User className="w-4 h-4" />
                    <span>
                      {project.instructor.user.firstName}{" "}
                      {project.instructor.user.lastName}
                    </span>
                    <span className="text-xs">
                      ({project.instructor.user.email})
                    </span>
                  </motion.div>

                  <motion.span
                    className="text-primary underline cursor-pointer text-sm"
                    variants={childVariants}
                    onClick={() => navigate(`/admin/curso/${project.id}`)}
                  >
                    Ver curso
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chevron */}
        <motion.button
          variants={chevronVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={toggleExpand}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 ml-3"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={springTransition}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};
// TODO: Las que estan en status archived, el boton del form para modificar el status deberia aparecer como disabled. O bien,
// la BD no deberia ni siquiera traer los cursos con status ARCHIVED
export const AdminCoursesAccordion: FC<CourseCardsProps> = ({ projects }) => (
  <div className="max-w-4xl mx-auto p-6">
    {projects.map((project, index) => (
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          ...springTransition,
          delay: index * 0.08,
        }}
      >
        <CourseCard project={project} />
      </motion.div>
    ))}
  </div>
);
