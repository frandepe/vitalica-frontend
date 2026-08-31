export const MAX_VIDEO_SIZE_MB = 500;
export const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;
export const MAX_VIDEO_SIZE_ERROR_MESSAGE = `El archivo supera el maximo permitido de ${MAX_VIDEO_SIZE_MB} MB.`;
export const MAX_VIDEO_DURATION_MINUTES = 20;
export const MAX_VIDEO_DURATION_SECONDS = MAX_VIDEO_DURATION_MINUTES * 60;
export const MAX_VIDEO_DURATION_ERROR_MESSAGE = `El video supera la duracion maxima de ${MAX_VIDEO_DURATION_MINUTES} minutos.`;
export const ALLOWED_VIDEO_EXTENSION = ".mp4";
export const ALLOWED_VIDEO_MIME_TYPE = "video/mp4";
export const VIDEO_FORMAT_ERROR_MESSAGE =
  "Solo se permiten videos en formato .mp4.";
export const BETA_EXPLAINER_MUX_PLAYBACK_ID =
  "Y01UnmjSZLZ02fzgS3VD00Eq5qnDaCIxtTN1601SiBdr3gQ";

export const isMp4VideoFile = (file: File): boolean => {
  const hasMp4Extension = file.name
    .toLowerCase()
    .endsWith(ALLOWED_VIDEO_EXTENSION);
  const hasValidMimeType =
    file.type === "" || file.type.toLowerCase() === ALLOWED_VIDEO_MIME_TYPE;

  return hasMp4Extension && hasValidMimeType;
};

export const getLocalVideoDurationSeconds = (
  file: File,
): Promise<number | null> =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    let settled = false;

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(objectUrl);
    };

    const finish = (duration: number | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      cleanup();
      resolve(duration);
    };

    const timeoutId = setTimeout(() => finish(null), 5000);

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : null;
      finish(duration);
    };
    video.onerror = () => finish(null);
    video.src = objectUrl;
  });
