import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { type BlogAudience, type BlogPost } from "@/content/blogs";
import { Button } from "../ui/button";
import { BlogCard } from "./BlogCard";

interface Props {
  audience: BlogAudience;
  title: string;
  blogs: BlogPost[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function BlogBoxTres({ audience, title, blogs }: Props) {
  const navigate = useNavigate();
  const audienceHref = `/blogs?audience=${audience}`;

  return (
    <section>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Encontrá las guías definitivas pensadas para vos
          </p>
        </div>
        <Button
          variant="link"
          className="rounded-lg text-muted-foreground hover:text-foreground text-sm md:text-base"
          onClick={() => navigate(audienceHref)}
        >
          Ver más guías
        </Button>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {blogs.map((blog) => (
          <motion.div key={blog.id} variants={cardVariants}>
            <BlogCard post={blog} href={`/blog/${blog.slug}`} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
