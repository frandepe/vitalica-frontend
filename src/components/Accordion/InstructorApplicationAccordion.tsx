import { InstructorApplication } from "@/types/instructor.types";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import { ChevronDown, User } from "lucide-react";
import { useState, FC, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useFormattedDate } from "@/hooks/useFormattedDate";
import { t } from "@/constants/statusTranslations";

interface ProjectCardsProps {
  projects: InstructorApplication[];
}

// ✅ transición tipada correctamente
const springTransition: Transition = {
  type: "spring" as const,
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
  hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.4, staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springTransition },
};

const logoVariants: Variants = {
  hover: { scale: 1.1, rotate: 5, transition: springTransition },
};

const chevronVariants: Variants = {
  hover: {
    scale: 1.1,
    backgroundColor: "#C1C7CD",
    transition: springTransition,
  },
  tap: { scale: 0.95 },
};

const ProjectCard: FC<{ project: InstructorApplication }> = ({ project }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = (e?: MouseEvent) => {
    e?.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const isApproved = project.status === "APPROVED";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="border-b border-gray-300 py-4"
      onClick={toggleExpand}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Logo */}
          <motion.div
            variants={logoVariants}
            whileHover="hover"
            className={`w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-lg font-semibold flex-shrink-0 shadow-sm`}
          >
            <User />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Status */}
            <motion.div
              className="flex items-center gap-3 mb-2"
              variants={childVariants}
            >
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {project.user.firstName} {project.user.lastName}
              </h3>
              <div className="w-px h-3 bg-gray-400" />
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isApproved ? "text-gray-200 shadow-sm" : "text-gray-700"
                }`}
                style={{ backgroundColor: isApproved ? "#272D41" : "#D4DADB" }}
              >
                {t("application", project.status)}
              </motion.span>
            </motion.div>

            {/* Price */}
            <motion.p
              className="text-gray-600 text-sm mb-4 font-medium"
              variants={childVariants}
            >
              ID: {project.id}
            </motion.p>

            {/* Expandable Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  variants={expandedContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="overflow-hidden"
                >
                  {/* Categories */}
                  <motion.div
                    className="flex flex-wrap gap-2 mb-4"
                    variants={childVariants}
                  >
                    <span
                      className="text-primary cursor-pointer underline"
                      onClick={() =>
                        navigate(`/admin/aplicacion/${project.id}`)
                      }
                    >
                      Ver más
                    </span>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    className="text-gray-600 text-sm leading-relaxed mb-4"
                    variants={childVariants}
                  >
                    Última fecha de actualización:{" "}
                    {useFormattedDate(project.updatedAt)}
                  </motion.p>

                  {/* Instructor */}
                  <motion.div
                    className="flex items-center gap-2 text-sm text-gray-500"
                    variants={childVariants}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={springTransition}
                    >
                      <User className="w-4 h-4" />
                    </motion.div>
                    <span className="text-xs font-medium">
                      {project.user.email}
                    </span>
                    <div className="w-px h-3 bg-gray-300 mx-1" />
                    <span className="text-xs">
                      {useFormattedDate(project.createdAt)}
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chevron Button */}
        <motion.button
          variants={chevronVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={toggleExpand}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#272D41] flex-shrink-0 ml-3 shadow-sm"
          style={{ backgroundColor: "#D5D9DD" }}
          aria-label="Expand project details"
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

export const InstructorApplicationAccordion: FC<ProjectCardsProps> = ({
  projects,
}) => (
  <div className="max-w-4xl mx-auto p-6">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {projects?.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ...springTransition,
            stiffness: 300,
            damping: 30,
            delay: index * 0.1 + 0.3,
            mass: 0.8,
          }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  </div>
);
