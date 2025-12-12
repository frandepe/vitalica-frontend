import { Skeleton } from "../ui/skeleton";

export const InstructorMyCoursesSkeleton = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold pt-6 mb-4">Mis Cursos</h2>

      {/* SKELETON LISTA */}
      <div className="flex-1 grid gap-6 mx-auto">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex w-full items-center rounded-xl bg-white p-3 gap-4 shadow-sm"
          >
            {/* Imagen */}
            <Skeleton className="w-40 h-32 rounded-lg" />

            {/* Texto */}
            <div className="flex flex-col flex-1 gap-3">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
