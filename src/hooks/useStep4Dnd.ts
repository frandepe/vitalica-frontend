import {
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CourseModuleFormValues,
  LessonFormValues,
  NewCourseFormValues,
} from "@/types/course.types";
import {
  CSSProperties,
  createElement,
  ReactNode,
} from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

export const MODULES_SORTABLE_ID = "modules-sortable";
export const LESSONS_SORTABLE_PREFIX = "lessons-";

interface SortableItemProps {
  id: string;
  className?: string;
  children: (props: {
    attributes: Record<string, unknown>;
    listeners: Record<string, unknown> | undefined;
    setActivatorNodeRef: (element: HTMLElement | null) => void;
    isDragging: boolean;
  }) => ReactNode;
}

export const SortableItem = ({ id, className, children }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragClassName = className
    ? `${className}${isDragging ? " z-10 opacity-80" : ""}`
    : isDragging
      ? "z-10 opacity-80"
      : undefined;

  return createElement(
    "div",
    {
      ref: setNodeRef,
      style,
      className: dragClassName,
    },
    children({
      attributes: attributes as unknown as Record<string, unknown>,
      listeners: listeners as unknown as Record<string, unknown> | undefined,
      setActivatorNodeRef,
      isDragging,
    }),
  );
};

export const getModuleDragId = (
  module: CourseModuleFormValues,
  moduleIndex: number,
): string => module.id || `module-${moduleIndex}`;

export const getLessonDragId = (
  lesson: LessonFormValues,
  moduleIndex: number,
  lessonIndex: number,
): string => lesson.id || `lesson-${moduleIndex}-${lessonIndex}`;

export const getModuleIndexFromDragId = (
  modulesList: CourseModuleFormValues[],
  dragId: string | number,
): number =>
  modulesList.findIndex(
    (module, index) => getModuleDragId(module, index) === dragId,
  );

type MoveModuleFn = (from: number, to: number) => void;

interface UseStep4DndParams {
  watch: UseFormWatch<NewCourseFormValues>;
  setValue: UseFormSetValue<NewCourseFormValues>;
  moveModule: MoveModuleFn;
}

export const useStep4Dnd = ({
  watch,
  setValue,
  moveModule,
}: UseStep4DndParams) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const onModuleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const activeContainerId = active.data.current?.sortable?.containerId;
    if (activeContainerId !== MODULES_SORTABLE_ID) return;

    const currentModules = (watch("modules") || []) as CourseModuleFormValues[];
    const oldIndex = getModuleIndexFromDragId(currentModules, active.id);

    let newIndex = getModuleIndexFromDragId(currentModules, over.id);
    if (newIndex < 0) {
      const overContainerId = over.data.current?.sortable?.containerId;
      if (
        typeof overContainerId === "string" &&
        overContainerId.startsWith(LESSONS_SORTABLE_PREFIX)
      ) {
        const overModuleDragId = overContainerId.replace(
          LESSONS_SORTABLE_PREFIX,
          "",
        );
        newIndex = getModuleIndexFromDragId(currentModules, overModuleDragId);
      }
    }

    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

    moveModule(oldIndex, newIndex);

    const reordered = arrayMove(currentModules, oldIndex, newIndex).map(
      (module, index) => ({
        ...module,
        order: index + 1,
        lessons: (module.lessons || []).map((lesson, lessonIndex) => ({
          ...lesson,
          order: lessonIndex + 1,
        })),
      }),
    );

    setValue("modules", reordered, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onLessonDragEnd =
    (moduleIndex: number) =>
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return;

      const currentLessons =
        (watch(`modules.${moduleIndex}.lessons`) as LessonFormValues[]) || [];

      const oldIndex = currentLessons.findIndex(
        (lesson, lessonIndex) =>
          getLessonDragId(lesson, moduleIndex, lessonIndex) === active.id,
      );
      const newIndex = currentLessons.findIndex(
        (lesson, lessonIndex) =>
          getLessonDragId(lesson, moduleIndex, lessonIndex) === over.id,
      );

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

      const reordered = arrayMove(currentLessons, oldIndex, newIndex).map(
        (lesson, index) => ({
          ...lesson,
          order: index + 1,
        }),
      );

      setValue(`modules.${moduleIndex}.lessons`, reordered, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    };

  return {
    sensors,
    onModuleDragEnd,
    onLessonDragEnd,
    MODULES_SORTABLE_ID,
    LESSONS_SORTABLE_PREFIX,
    getModuleDragId,
    getLessonDragId,
  };
};
