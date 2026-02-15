import { motion } from "framer-motion";

interface BlogCardProps {
  image: string;
  category: string;
  categoryColor?: "blue" | "orange";
  title: string;
  excerpt: string;
  href?: string;
}

export function BlogCard({
  image,
  category,
  categoryColor = "blue",
  title,
  excerpt,
  href = "#",
}: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group cursor-pointer"
    >
      <a href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-3">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            categoryColor === "blue" ? "text-sky-600" : "text-amber-600"
          }`}
        >
          {category}
        </span>
        <h3 className="mt-1 text-lg font-semibold text-foreground leading-tight group-hover:text-sky-600 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {excerpt}
        </p>
      </a>
    </motion.article>
  );
}
