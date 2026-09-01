import { describe, expect, it, vi } from "vitest";
import {
  AVATAR_BASE_SIZE,
  AVATAR_MAX_ORIGINAL_BYTES,
  getAvatarCropPlan,
  processAvatarFile,
  validateAvatarFile,
} from "./avatar-processing";

const file = (type: string, size = 10) =>
  new File([new Uint8Array(size)], "avatar", { type });

describe("avatar processing", () => {
  it.each(["image/jpeg", "image/png", "image/webp"])(
    "acepta %s",
    (type) => expect(() => validateAvatarFile(file(type))).not.toThrow(),
  );

  it("rechaza formatos no permitidos y originales demasiado pesados", () => {
    expect(() => validateAvatarFile(file("image/gif"))).toThrow("JPEG, PNG o WebP");
    expect(() =>
      validateAvatarFile(file("image/jpeg", AVATAR_MAX_ORIGINAL_BYTES + 1)),
    ).toThrow("8 MB");
  });

  it.each([
    [800, 1600, { sourceX: 0, sourceY: 400, sourceSize: 800, outputSize: 800 }],
    [1600, 800, { sourceX: 400, sourceY: 0, sourceSize: 800, outputSize: 800 }],
    [1600, 1600, { sourceX: 0, sourceY: 0, sourceSize: 1600, outputSize: AVATAR_BASE_SIZE }],
    [400, 400, { sourceX: 0, sourceY: 0, sourceSize: 400, outputSize: 400 }],
  ])("calcula crop centrado para %sx%s sin upscale", (width, height, expected) => {
    expect(getAvatarCropPlan(width as number, height as number)).toEqual(expected);
  });

  it("produce un JPEG cuadrado con el límite base esperado", async () => {
    const drawImage = vi.fn();
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => ({
        imageSmoothingEnabled: false,
        imageSmoothingQuality: "low",
        fillStyle: "",
        fillRect: vi.fn(),
        drawImage,
      }),
      toDataURL: vi.fn(() => "data:image/jpeg;base64,/9j/2Q=="),
    } as unknown as HTMLCanvasElement;

    const result = await processAvatarFile(file("image/png"), {
      loadImage: async () => ({
        source: {} as CanvasImageSource,
        width: 2000,
        height: 1600,
      }),
      createCanvas: () => canvas,
    });

    expect(canvas.width).toBe(AVATAR_BASE_SIZE);
    expect(canvas.height).toBe(AVATAR_BASE_SIZE);
    expect(drawImage).toHaveBeenCalledWith(
      expect.anything(),
      200,
      0,
      1600,
      1600,
      0,
      0,
      AVATAR_BASE_SIZE,
      AVATAR_BASE_SIZE,
    );
    expect(result).toMatch(/^data:image\/jpeg;base64,/);
  });
});
