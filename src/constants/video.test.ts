import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getLocalVideoDurationSeconds,
  isMp4VideoFile,
  MAX_VIDEO_DURATION_SECONDS,
  MAX_VIDEO_SIZE_BYTES,
} from "./video";

const file = (name: string, type: string) =>
  new File(["video"], name, { type });

describe("video validation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("accepts MP4 files and rejects manipulated extension or MIME combinations", () => {
    expect(isMp4VideoFile(file("lesson.MP4", "video/mp4"))).toBe(true);
    expect(isMp4VideoFile(file("lesson.mp4", ""))).toBe(true);
    expect(isMp4VideoFile(file("lesson.mov", "video/mp4"))).toBe(false);
    expect(isMp4VideoFile(file("lesson.mp4", "video/quicktime"))).toBe(false);
  });

  it("keeps the agreed client limits at 500 MB and 20 minutes", () => {
    expect(MAX_VIDEO_SIZE_BYTES).toBe(500 * 1024 * 1024);
    expect(MAX_VIDEO_DURATION_SECONDS).toBe(20 * 60);
  });

  it("reads local duration metadata when available", async () => {
    const video = {
      duration: 1201,
      preload: "",
      onloadedmetadata: null as (() => void) | null,
      onerror: null as (() => void) | null,
      removeAttribute: vi.fn(),
      load: vi.fn(),
      set src(_value: string) {
        queueMicrotask(() => this.onloadedmetadata?.());
      },
    };
    vi.spyOn(document, "createElement").mockReturnValue(
      video as unknown as HTMLVideoElement,
    );
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => "blob:video"),
      revokeObjectURL: vi.fn(),
    });

    await expect(
      getLocalVideoDurationSeconds(file("long.mp4", "video/mp4")),
    ).resolves.toBe(1201);
  });

  it("returns null when metadata cannot be read so backend confirmation remains authoritative", async () => {
    const video = {
      duration: Number.NaN,
      preload: "",
      onloadedmetadata: null as (() => void) | null,
      onerror: null as (() => void) | null,
      removeAttribute: vi.fn(),
      load: vi.fn(),
      set src(_value: string) {
        queueMicrotask(() => this.onerror?.());
      },
    };
    vi.spyOn(document, "createElement").mockReturnValue(
      video as unknown as HTMLVideoElement,
    );
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => "blob:invalid-video"),
      revokeObjectURL: vi.fn(),
    });

    await expect(
      getLocalVideoDurationSeconds(file("unknown.mp4", "video/mp4")),
    ).resolves.toBeNull();
  });
});
