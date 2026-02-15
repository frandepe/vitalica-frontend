import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICourse } from "@/types/course.types";

import { BookOpen, MessageSquare } from "lucide-react";
import { ModulesAccordion } from "../Accordion/ModulesAccordion";

function CourseOverviewTabs(course: ICourse) {
  const hasModuleDescriptions = course.modules?.some((module) =>
    Boolean(module.description),
  );

  return (
    <Tabs defaultValue="tab-1" className="w-full">
      <TabsList className="relative h-auto w-full justify-start gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-black/50">
        <TabsTrigger
          value="tab-1"
          className="rounded-b-none border-b-2 border-transparent px-4 py-2  text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
        >
          Sobre el curso
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="rounded-b-none border-b-2 border-transparent px-4 py-2  text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
        >
          Módulos
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="rounded-b-none border-b-2 border-transparent px-4 py-2  text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
        >
          Testimonios
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tab-1" className="pt-6 space-y-10">
        {/* Descripción del curso */}
        {course.description && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Descripción del curso
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {course.description}
            </div>
          </section>
        )}

        {/* Requisitos y materiales */}
        {course.requirementsAndMaterials && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Requisitos y materiales
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {course.requirementsAndMaterials}
            </div>
          </section>
        )}

        {/* Instructor */}
        {/* Instructor */}
        {course.instructor?.user && (
          <section className="border-t border-black/50 pt-8">
            <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">
              Instructor
            </h2>

            <a
              href={`/perfil/${course.instructor.user.slug}`}
              className="group flex gap-4 rounded-xl border border-border p-4 hover:bg-muted/40 transition-colors"
            >
              {/* Avatar */}
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                {course.instructor.user.avatarUrl ? (
                  <img
                    src={course.instructor.user.avatarUrl}
                    alt={`${course.instructor.user.firstName} ${course.instructor.user.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  `${course.instructor.user.firstName?.[0] ?? ""}${
                    course.instructor.user.lastName?.[0] ?? ""
                  }`
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground group-hover:underline underline-offset-4">
                  {course.instructor.user.firstName}{" "}
                  {course.instructor.user.lastName}
                </p>

                {course.instructor.bio && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                    {course.instructor.bio}
                  </p>
                )}

                <p className="mt-2 text-xs text-muted-foreground">
                  Ver perfil del instructor
                </p>
              </div>
            </a>
          </section>
        )}
      </TabsContent>

      <TabsContent value="tab-2" className="pt-6 space-y-10">
        <ModulesAccordion
          modules={course.modules!}
          courseId={course.id!}
          price={course.price!}
        />

        {hasModuleDescriptions && (
          <section className="border-t border-black/50 pt-8">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-4 w-4" />
              </span>
              ¿Qué aprenderás en cada módulo?
            </h2>

            <ul className="mt-4 space-y-3 text-md text-muted-foreground">
              {course.modules!.map((module, index) =>
                module.description ? (
                  <li key={module.id} className="flex gap-3">
                    <span className="font-medium text-foreground">
                      {index + 1}.
                    </span>
                    <span>
                      <span className="text-foreground font-medium">
                        {module.title}
                      </span>
                      {" — "}
                      {module.description}
                    </span>
                  </li>
                ) : null,
              )}
            </ul>
          </section>
        )}
      </TabsContent>

      <TabsContent value="tab-3" className="pt-6">
        {!course.reviews || course.reviews.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>

            <h3 className="text-base font-semibold text-foreground">
              Este curso aún no tiene reseñas
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Sé uno de los primeros en realizar el curso y compartir tu
              experiencia. Tus comentarios ayudarán a mejorar el contenido y a
              otros estudiantes a decidir.
            </p>

            <p className="mt-4 text-xs text-muted-foreground">
              Las reseñas solo pueden dejarse después de completar una lección.
            </p>
          </div>
        ) : (
          // LISTADO DE REVIEWS (placeholder por ahora)
          <div className="space-y-4">
            {/* {course.reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))} */}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

export { CourseOverviewTabs };
