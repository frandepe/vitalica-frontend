import { ListCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ICourseProgressResponse } from "@/types/courseProgress.types";
import { formatDuration } from "@/utils/format-duration";

interface CourseModulesTabProps {
  course: ICourseProgressResponse;
}

export function CourseModulesTab({ course }: CourseModulesTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Contenido</h2>
        <span className="text-sm text-muted-foreground">
          Duración {formatDuration(course.duration)}hs
        </span>
      </div>

      <div className="space-y-3">
        {course.modules!.map((module) => (
          <Card key={module.id} className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div
                  className={`h-20 w-28 rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <Badge className="flex gap-1">{module.order}</Badge>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{module.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {module.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ListCheck className="h-3 w-3" />
                    Lecciones {module.lessons!.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
