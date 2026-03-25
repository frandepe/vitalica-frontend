import { type BlogPost } from "@/content/blogs";
import { BlogCard } from "./BlogCard";

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} href={`/blog/${post.slug}`} />
      ))}
    </div>
  );
}
