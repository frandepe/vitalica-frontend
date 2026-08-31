import {
  getLessonMuxUploadStatus,
  saveLessonVideoToCourse,
} from "@/api/videoEndpoints";
import type {
  CourseModuleFormValues,
  LessonFormValues,
} from "@/types/course.types";
import { waitForMuxAssetReady } from "@/utils/mux-upload";

type LessonVideoProcessingOptions = {
  lessonId: string;
  uploadId: string;
  signal?: AbortSignal;
  onReadyToConfirm?: () => void;
};

type LessonVideoProcessingDependencies = {
  getStatus?: typeof getLessonMuxUploadStatus;
  confirm?: typeof saveLessonVideoToCourse;
};

export const findLessonLocation = (
  modules: CourseModuleFormValues[],
  lessonId: string,
) => {
  for (const [moduleIndex, module] of modules.entries()) {
    const lessonIndex = (module.lessons || []).findIndex(
      (lesson: LessonFormValues) => lesson.id === lessonId,
    );
    if (lessonIndex >= 0) return { moduleIndex, lessonIndex };
  }
  return null;
};

export const processAndConfirmLessonVideo = async (
  {
    lessonId,
    uploadId,
    signal,
    onReadyToConfirm,
  }: LessonVideoProcessingOptions,
  {
    getStatus = getLessonMuxUploadStatus,
    confirm = saveLessonVideoToCourse,
  }: LessonVideoProcessingDependencies = {},
) => {
  const { playbackId } = await waitForMuxAssetReady(
    uploadId,
    (currentUploadId) => getStatus(lessonId, currentUploadId),
    { signal },
  );

  onReadyToConfirm?.();
  const confirmation = await confirm(lessonId, uploadId);
  return { playbackId, confirmation };
};
