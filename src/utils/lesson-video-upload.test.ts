import type { CourseModuleFormValues } from "@/types/course.types";
import { describe, expect, it, vi } from "vitest";
import {
  findLessonLocation,
  processAndConfirmLessonVideo,
} from "./lesson-video-upload";

const modules = [
  {
    id: "module-a",
    title: "A",
    description: "",
    order: 1,
    lessons: [
      { id: "lesson-a", title: "A", order: 1 },
      { id: "lesson-b", title: "B", order: 2 },
    ],
  },
] as CourseModuleFormValues[];

describe("lesson video upload helpers", () => {
  it("finds a lesson by stable id after reorder", () => {
    const originalLessons = modules[0]!.lessons ?? [];
    const reordered = [
      {
        ...modules[0]!,
        lessons: [originalLessons[1]!, originalLessons[0]!],
      },
    ];

    expect(findLessonLocation(reordered, "lesson-a")).toEqual({
      moduleIndex: 0,
      lessonIndex: 1,
    });
  });

  it("keeps lessonId and uploadId isolated through polling and confirm", async () => {
    const getStatusA = vi.fn().mockResolvedValue({
      success: true,
      status: "ready",
      playbackId: "playback-a",
    });
    const confirmA = vi.fn().mockResolvedValue({ success: true });
    const getStatusB = vi.fn().mockResolvedValue({
      success: true,
      status: "ready",
      playbackId: "playback-b",
    });
    const confirmB = vi.fn().mockResolvedValue({ success: true });

    const [resultA, resultB] = await Promise.all([
      processAndConfirmLessonVideo(
        { lessonId: "lesson-a", uploadId: "upload-a" },
        { getStatus: getStatusA, confirm: confirmA },
      ),
      processAndConfirmLessonVideo(
        { lessonId: "lesson-b", uploadId: "upload-b" },
        { getStatus: getStatusB, confirm: confirmB },
      ),
    ]);

    expect(getStatusA).toHaveBeenCalledWith("lesson-a", "upload-a");
    expect(confirmA).toHaveBeenCalledWith("lesson-a", "upload-a");
    expect(getStatusB).toHaveBeenCalledWith("lesson-b", "upload-b");
    expect(confirmB).toHaveBeenCalledWith("lesson-b", "upload-b");
    expect(resultA.playbackId).toBe("playback-a");
    expect(resultB.playbackId).toBe("playback-b");
  });

  it("does not confirm an aborted lesson", async () => {
    const controller = new AbortController();
    const getStatus = vi.fn().mockImplementation(async () => {
      controller.abort();
      return { success: true, status: "waiting" };
    });
    const confirm = vi.fn();

    await expect(
      processAndConfirmLessonVideo(
        {
          lessonId: "lesson-a",
          uploadId: "upload-a",
          signal: controller.signal,
        },
        { getStatus, confirm },
      ),
    ).rejects.toThrow("UPLOAD_ABORTED");
    expect(confirm).not.toHaveBeenCalled();
  });

  it("reports a failed confirmation without mutating the lesson collection", async () => {
    const originalModules = structuredClone(modules);
    const result = await processAndConfirmLessonVideo(
      { lessonId: "lesson-a", uploadId: "upload-a" },
      {
        getStatus: vi.fn().mockResolvedValue({
          success: true,
          status: "ready",
          playbackId: "playback-new",
        }),
        confirm: vi.fn().mockResolvedValue({ success: false }),
      },
    );

    expect(result.confirmation.success).toBe(false);
    expect(modules).toEqual(originalModules);
  });
});
