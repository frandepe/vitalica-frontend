import { API_ROUTES } from "@/constants";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLessonDirectUpload,
  createPromoVideoDirectUpload,
  getLessonMuxUploadStatus,
  getPromoMuxUploadStatus,
  saveLessonVideoToCourse,
  savePromoVideoToCourse,
} from "./videoEndpoints";

const mocks = vi.hoisted(() => ({ apiRequest: vi.fn() }));

vi.mock("./configEndpoint", () => ({ apiRequest: mocks.apiRequest }));

describe("Mux video endpoint contracts", () => {
  beforeEach(() => mocks.apiRequest.mockReset().mockResolvedValue({}));

  it("creates promo and lesson uploads with entity IDs and file metadata only", async () => {
    const promo = new File(["promo"], "promo.mp4", { type: "video/mp4" });
    const lesson = new File(["lesson"], "lesson.mp4", { type: "video/mp4" });

    await createPromoVideoDirectUpload("course-1", promo);
    await createLessonDirectUpload("lesson-1", lesson);

    expect(mocks.apiRequest).toHaveBeenNthCalledWith(1, {
      url: `${API_ROUTES.VIDEO}/promo/direct-upload`,
      method: "POST",
      data: {
        courseId: "course-1",
        fileName: "promo.mp4",
        contentType: "video/mp4",
      },
    });
    expect(mocks.apiRequest).toHaveBeenNthCalledWith(2, {
      url: `${API_ROUTES.VIDEO}/lesson/direct-upload`,
      method: "POST",
      data: {
        lessonId: "lesson-1",
        fileName: "lesson.mp4",
        contentType: "video/mp4",
      },
    });
  });

  it("binds status requests to both the entity and upload IDs", async () => {
    await getPromoMuxUploadStatus("course-1", "upload-promo");
    await getLessonMuxUploadStatus("lesson-1", "upload-lesson");

    expect(mocks.apiRequest).toHaveBeenNthCalledWith(1, {
      url: `${API_ROUTES.VIDEO}/promo/course-1/upload-status/upload-promo`,
      method: "GET",
    });
    expect(mocks.apiRequest).toHaveBeenNthCalledWith(2, {
      url: `${API_ROUTES.VIDEO}/lesson/lesson-1/upload-status/upload-lesson`,
      method: "GET",
    });
  });

  it("confirms with entity and upload IDs without accepting asset or playback IDs", async () => {
    await savePromoVideoToCourse("course-1", "upload-promo");
    await saveLessonVideoToCourse("lesson-1", "upload-lesson");

    expect(mocks.apiRequest).toHaveBeenNthCalledWith(1, {
      url: `${API_ROUTES.VIDEO}/promo/confirm`,
      method: "POST",
      data: { courseId: "course-1", uploadId: "upload-promo" },
    });
    expect(mocks.apiRequest).toHaveBeenNthCalledWith(2, {
      url: `${API_ROUTES.VIDEO}/lesson/video/confirm`,
      method: "POST",
      data: { lessonId: "lesson-1", uploadId: "upload-lesson" },
    });
  });
});
