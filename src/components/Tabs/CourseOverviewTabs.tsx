import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICourse } from "@/types/course.types";

import { BookOpen, MessageSquare } from "lucide-react";
import { ModulesAccordion } from "../Accordion/ModulesAccordion";
import { InstructorModalCard } from "../CardsAnimated/InstructorModalCard";
import { Reviews } from "../Reviews/Reviews";

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
          Reseñas
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
            <InstructorModalCard
              name={
                course.instructor.user.firstName +
                " " +
                course.instructor.user.lastName
              }
              headline={course.instructor.headline}
              bio={course.instructor.bio}
              imageUrl={
                course.instructor.user.avatarUrl ||
                "/Placeholders/no-image-profile.jpg"
              }
              href={`/perfil/${course.instructor.user.slug}`}
            />
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
        <Reviews courseId={course.id} />
      </TabsContent>
    </Tabs>
  );
}

export { CourseOverviewTabs };
