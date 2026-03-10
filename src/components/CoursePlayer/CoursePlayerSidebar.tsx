import { Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ModulesAccordionCoursePlayer } from "@/components/Accordion/ModulesAccordionCoursePlayer";
import { t } from "@/utils/translations";
import { ICourseProgressResponse } from "@/types/courseProgress.types";

interface CoursePlayerSidebarProps {
  course: ICourseProgressResponse;
  isMobile: boolean;
}

export function CoursePlayerSidebar({
  course,
  isMobile,
}: CoursePlayerSidebarProps) {
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild className="absolute top-6 left-6 z-50">
          <Menu />
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle>{course.title}</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              <ModulesAccordionCoursePlayer modules={course.modules!} />
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold mb-4">{course.title}</h1>

        <div className="flex gap-2 mb-4 flex-wrap">
          <Badge variant="primary">
            {t("courseSpecialty", course.specialty!)}
          </Badge>
          <Badge variant="outline">{t("courseLevel", course.level!)}</Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          <ModulesAccordionCoursePlayer modules={course.modules!} />
        </div>
      </ScrollArea>
    </div>
  );
}
