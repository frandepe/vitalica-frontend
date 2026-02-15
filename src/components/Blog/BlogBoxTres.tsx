import { motion, type Variants } from "framer-motion";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface IPropGuide {
  id: number;
  title: string;
  image: string;
  slug: string;
}

interface Props {
  role: string;
  blogs: IPropGuide[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function BlogBoxTres({ role, blogs }: Props) {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/blogs");
  };
  const handleNavigateBySlug = (role: string, slug: string) => {
    navigate(`/blogs/${role}/${slug}`);
  };
  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl text-foreground">
          Guías pensadas para {role}
        </h2>
        <Button
          variant="link"
          className="text-muted-foreground hover:text-foreground text-sm md:text-base"
          onClick={handleNavigate}
        >
          Ver más guías
        </Button>
      </div>

      {/* Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {blogs.map((blog) => (
          <motion.article
            key={blog.id}
            variants={cardVariants}
            transition={{ duration: 0.2 }}
            className="group cursor-pointer"
            onClick={() => handleNavigateBySlug(role, blog.slug)}
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
              <img
                src={blog.image || "/placeholder.svg"}
                alt={blog.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Title */}
            <h3 className="text-foreground font-medium leading-snug group-hover:text-primary transition-colors">
              {blog.title}
            </h3>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
