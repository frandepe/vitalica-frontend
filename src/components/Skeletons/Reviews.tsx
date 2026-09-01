import { Skeleton } from "../ui/skeleton";

export function ReviewsLoadingState() {
  return (
    <div className="space-y-8 py-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-5 w-[32rem] max-w-full" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="grid gap-0 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="space-y-3 px-6 py-5 md:not-last:border-r md:not-last:border-slate-200"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,280px)_1fr]">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-11 w-72 max-w-full" />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {Array.from({ length: 2 }).map((_, groupIndex) => (
          <div
            key={groupIndex}
            className="rounded-2xl border border-slate-200 bg-white"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {Array.from({ length: 2 }).map((_, reviewIndex) => (
                <div key={reviewIndex} className="space-y-4 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
