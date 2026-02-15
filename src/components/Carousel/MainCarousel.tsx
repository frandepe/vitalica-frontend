import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { MainCourseCard } from "../CardsAnimated/MainCourseCard";
import { CourseCardProps } from "../CardsAnimated/CoursePublic";

export interface SparkItem {
  id: string | number;
  imageSrc: string;
  title: string;
  count: number;
  countLabel: string;
}

// Define the props for the main component
export interface SparksCarouselProps {
  title: string;
  subtitle: string;
  courses: CourseCardProps[];
}

export const MainCarousel = React.forwardRef<
  HTMLDivElement,
  SparksCarouselProps
>(({ title, subtitle, courses }, ref) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = React.useState(true);
  const [isAtEnd, setIsAtEnd] = React.useState(false);

  // Function to scroll the carousel
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll by 80% of the visible width
      const newScrollLeft =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  // Effect to check scroll position and update button states
  React.useEffect(() => {
    const checkScrollPosition = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setIsAtStart(scrollLeft < 10);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
      }
    };

    const currentRef = carouselRef.current;
    if (currentRef) {
      // Initial check
      checkScrollPosition();
      currentRef.addEventListener("scroll", checkScrollPosition);
    }

    // Check again on window resize
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScrollPosition);
      }
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [courses]);

  return (
    <section ref={ref} className="w-full py-8" aria-labelledby="sparks-title">
      <div className="container mx-auto px-4 md:px-0">
        {/* Header Section */}
        <div className="mb-6">
          <h2
            id="sparks-title"
            className="text-2xl md:text-3xl font-bold tracking-tight text-card-foreground"
          >
            {title}
          </h2>
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
        </div>

        {/* Carousel Section */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex w-full space-x-4 overflow-x-auto pb-4 scrollbar-hide"
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                className="group w-[300px] flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MainCourseCard course={course} />
              </motion.div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {!isAtStart && (
            <button
              onClick={() => scroll("left")}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/60 backdrop-blur-sm border text-foreground shadow-md transition-opacity hover:bg-background/80 disabled:opacity-0",
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {!isAtEnd && (
            <button
              onClick={() => scroll("right")}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/60 backdrop-blur-sm border text-foreground shadow-md transition-opacity hover:bg-background/80 disabled:opacity-0",
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
});

MainCarousel.displayName = "MainCarousel";
