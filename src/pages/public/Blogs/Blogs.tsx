import { BlogGrid } from "@/components/Blog/BlogGrid";
import { MobileBlogNav } from "@/components/Blog/BlogMobileNav";
import { BlogSidebar } from "@/components/Blog/BlogSidebar";
import { useState } from "react";

export default function BlogLandingPage() {
  const [activeCategory, setActiveCategory] = useState<string>("");

  return (
    <main className="min-h-screen bg-background">
      {/* Mobile Navigation */}
      <MobileBlogNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block ">
            <div className="sticky top-8">
              <BlogSidebar
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="pt-12 lg:pt-0">
            <BlogGrid />
          </div>
        </div>
      </div>
    </main>
  );
}
