import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { OptimizedAvatarImage } from "../user/OptimizedAvatarImage";

export interface ProfileCardProps {
  name?: string;
  headline?: string;
  bio?: string;
  imageUrl?: string;
  href: string;
  className?: string;
}

export function InstructorModalCard(props: ProfileCardProps) {
  const {
    name,
    headline,
    bio,
    imageUrl = "/Placeholders/no-image-profile.jpg",
    href,
    className,
  } = props;
  const navigate = useNavigate();

  return (
    <div className={cn("w-full max-w-5xl mx-auto", className)}>
      {/* Desktop */}
      <div className="hidden md:flex relative items-center">
        {/* Square Image */}
        <div className="w-[380px] h-[380px] rounded-3xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
          <OptimizedAvatarImage
            source={imageUrl}
            displaySize={400}
            alt={name}
            width={380}
            height={380}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        {/* Overlapping Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white dark:bg-card rounded-3xl shadow-2xl p-8 ml-[-80px] z-10 max-w-xl flex-1"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {name}
            </h2>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-500">
              {headline}
            </p>
          </div>

          <p className="text-black dark:text-white text-base leading-relaxed mb-8">
            {bio}
          </p>

          <Button className="w-full" onClick={() => navigate(href)}>
            Ver perfil del instructor
          </Button>
        </motion.div>
      </div>

      {/* Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="md:hidden max-w-sm mx-auto text-center bg-transparent"
      >
        {/* Square Mobile Image */}
        <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-3xl overflow-hidden mb-6 flex items-center justify-center">
          <OptimizedAvatarImage
            source={imageUrl}
            displaySize={400}
            alt={name}
            width={400}
            height={400}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        <div className="px-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {name}
          </h2>

          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">
            {headline}
          </p>

          <p className="text-black dark:text-white text-sm leading-relaxed mb-6">
            {bio}
          </p>

          <Button className="w-full" onClick={() => navigate(href)}>
            Ver perfil del instructor
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
