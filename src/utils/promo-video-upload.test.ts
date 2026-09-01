import { describe, expect, it, vi } from "vitest";
import { processAndConfirmPromoVideo } from "./promo-video-upload";

describe("processAndConfirmPromoVideo", () => {
  it("polls and confirms with the uploadId bound to the course", async () => {
    const getStatus = vi.fn().mockResolvedValue({
      success: true,
      status: "ready",
      assetId: "asset-one",
      playbackId: "playback-one",
    });
    const confirm = vi.fn().mockResolvedValue({ success: true });
    const onReadyToConfirm = vi.fn();

    const result = await processAndConfirmPromoVideo(
      {
        courseId: "course-one",
        uploadId: "upload-one",
        onReadyToConfirm,
      },
      { getStatus, confirm },
    );

    expect(getStatus).toHaveBeenCalledWith("course-one", "upload-one");
    expect(confirm).toHaveBeenCalledWith("course-one", "upload-one");
    expect(onReadyToConfirm.mock.invocationCallOrder[0]).toBeLessThan(
      confirm.mock.invocationCallOrder[0],
    );
    expect(result).toEqual({
      assetId: "asset-one",
      playbackId: "playback-one",
      confirmation: { success: true },
    });
  });

  it("does not confirm while Mux is not ready and the polling is aborted", async () => {
    const controller = new AbortController();
    const getStatus = vi.fn().mockImplementation(async () => {
      controller.abort();
      return { success: true, status: "waiting" };
    });
    const confirm = vi.fn();

    await expect(
      processAndConfirmPromoVideo(
        {
          courseId: "course-one",
          uploadId: "upload-one",
          signal: controller.signal,
        },
        { getStatus, confirm },
      ),
    ).rejects.toThrow("UPLOAD_ABORTED");

    expect(confirm).not.toHaveBeenCalled();
  });

  it("returns a failed confirmation without replacing playback data itself", async () => {
    const confirm = vi.fn().mockResolvedValue({
      success: false,
      message: "confirmation rejected",
    });

    const result = await processAndConfirmPromoVideo(
      { courseId: "course-one", uploadId: "upload-one" },
      {
        getStatus: vi.fn().mockResolvedValue({
          success: true,
          status: "ready",
          assetId: "asset-new",
          playbackId: "playback-new",
        }),
        confirm,
      },
    );

    expect(result.confirmation.success).toBe(false);
    expect(confirm).toHaveBeenCalledWith("course-one", "upload-one");
  });
});
