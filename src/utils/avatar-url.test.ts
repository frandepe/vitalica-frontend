import { describe, expect, it } from "vitest";
import {
  getAvatarDeliveryProps,
  getCloudinaryAvatarUrl,
  isTransformableCloudinaryAvatar,
} from "./avatar-url";

const CLOUDINARY_URL =
  "https://res.cloudinary.com/vitalica/image/upload/v123/images/avatars/user/avatar.jpg";

describe("avatar delivery URLs", () => {
  it("aplica crop, formato y calidad automáticos al tamaño solicitado", () => {
    expect(getCloudinaryAvatarUrl(CLOUDINARY_URL, 80)).toBe(
      "https://res.cloudinary.com/vitalica/image/upload/c_fill,g_auto,h_80,w_80/q_auto/f_auto/v123/images/avatars/user/avatar.jpg",
    );

    const props = getAvatarDeliveryProps(CLOUDINARY_URL, 80);
    expect(props.srcSet).toContain("h_160,w_160");
    expect(props.srcSet).toContain("h_240,w_240");
  });

  it("no transforma avatares externos ni placeholders", () => {
    const googleUrl = "https://lh3.googleusercontent.com/a/avatar";
    const placeholder = "/Placeholders/no-image-profile.jpg";

    expect(isTransformableCloudinaryAvatar(googleUrl)).toBe(false);
    expect(getAvatarDeliveryProps(googleUrl, 80)).toEqual({ src: googleUrl });
    expect(getCloudinaryAvatarUrl(placeholder, 80)).toBe(placeholder);
  });
});
