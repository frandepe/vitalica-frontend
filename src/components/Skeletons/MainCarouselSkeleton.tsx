const COURSE_SKELETONS = Array.from({ length: 4 });

export function MainCarouselSkeleton() {
  return (
    <div className="container mx-auto flex w-full space-x-4 overflow-x-auto pb-4 scrollbar-hide">
      {COURSE_SKELETONS.map((_, index) => (
        <div
          key={index}
          className="
            flex-shrink-0
            w-full
            sm:w-[300px]
          "
        >
          <div className="w-full rounded-2xl border border-border bg-card p-4 animate-pulse">
            {/* Imagen */}
            <div className="aspect-video w-full rounded-lg bg-muted" />

            {/* Texto */}
            <div className="mt-4 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-muted" />
              <div className="h-3 w-10 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>

            {/* Precio */}
            <div className="mt-4 h-4 w-24 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
