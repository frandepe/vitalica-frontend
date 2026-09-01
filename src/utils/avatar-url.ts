const CLOUDINARY_UPLOAD_MARKER = "/image/upload/";
const CLOUDINARY_HOST = "res.cloudinary.com";

export const isTransformableCloudinaryAvatar = (source?: string | null) => {
  if (!source) return false;

  try {
    const url = new URL(source);
    if (url.protocol !== "https:" || url.hostname !== CLOUDINARY_HOST) return false;

    const markerIndex = url.pathname.indexOf(CLOUDINARY_UPLOAD_MARKER);
    if (markerIndex < 0) return false;

    const assetPath = url.pathname.slice(
      markerIndex + CLOUDINARY_UPLOAD_MARKER.length,
    );
    return /^v\d+\//.test(assetPath);
  } catch {
    return false;
  }
};

export const getCloudinaryAvatarUrl = (
  source: string,
  size: number,
) => {
  if (!isTransformableCloudinaryAvatar(source)) return source;

  const normalizedSize = Math.max(1, Math.round(size));
  return source.replace(
    CLOUDINARY_UPLOAD_MARKER,
    `${CLOUDINARY_UPLOAD_MARKER}c_fill,g_auto,h_${normalizedSize},w_${normalizedSize}/q_auto/f_auto/`,
  );
};

export const getAvatarDeliveryProps = (
  source: string,
  displaySize: number,
) => {
  if (!isTransformableCloudinaryAvatar(source)) {
    return { src: source };
  }

  return {
    src: getCloudinaryAvatarUrl(source, displaySize),
    srcSet: [1, 2, 3]
      .map(
        (density) =>
          `${getCloudinaryAvatarUrl(source, displaySize * density)} ${density}x`,
      )
      .join(", "),
  };
};
