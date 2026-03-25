import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { type BlogPost } from "@/content/blogs";

interface BlogCardProps {
  post: BlogPost;
  href?: string;
}

const audienceLabel: Record<BlogPost["audience"], string> = {
  ALUMNOS: "Alumnos",
  INSTRUCTORES: "Instructores",
  COMUNIDAD: "Comunidad",
};

const audienceBadgeVariant: Record<BlogPost["audience"], "info" | "warning"> = {
  ALUMNOS: "info",
  INSTRUCTORES: "warning",
  COMUNIDAD: "info",
};

export function BlogCard({ post, href }: BlogCardProps) {
  const content = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden border-b border-slate-200/80 bg-slate-100">
        <img
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant={audienceBadgeVariant[post.audience]}
            appearance="ghost"
            className="rounded-lg border border-current/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]"
          >
            {audienceLabel[post.audience]}
          </Badge>
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            {post.topic}
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold leading-tight text-slate-950 transition-colors group-hover:text-sky-700">
            {post.title}
          </h3>
          <p className="text-sm leading-6 text-slate-600">{post.excerpt}</p>
        </div>
      </div>
    </>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group h-full"
    >
      {href ? (
        <Link
          to={href}
          className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white/90 transition-all duration-300 hover:border-slate-300 hover:shadow-[0_20px_50px_-35px_rgba(15,23,42,0.45)]"
        >
          {content}
        </Link>
      ) : (
        <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white/90">
          {content}
        </div>
      )}
    </motion.article>
  );
}
