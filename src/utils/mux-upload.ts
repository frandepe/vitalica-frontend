import { PromoUploadStatus } from "@/types/endpoints.types";

type UploadProgressCallback = (progress: number) => void;

type PollMuxOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
};

const DEFAULT_POLL_TIMEOUT_MS = 10 * 60 * 1000;
const DEFAULT_UPLOAD_TIMEOUT_MS = 15 * 60 * 1000;

const delay = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("UPLOAD_ABORTED"));
      return;
    }

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(new Error("UPLOAD_ABORTED"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });

export const isUploadAbortError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  return error.message === "UPLOAD_ABORTED";
};

export const uploadFileToMux = async (
  uploadUrl: string,
  file: File,
  onProgress?: UploadProgressCallback,
  signal?: AbortSignal,
  timeoutMs: number = DEFAULT_UPLOAD_TIMEOUT_MS,
): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      signal?.removeEventListener("abort", abortUpload);
    };

    const abortUpload = () => {
      cleanup();
      xhr.abort();
      reject(new Error("UPLOAD_ABORTED"));
    };

    if (signal?.aborted) {
      reject(new Error("UPLOAD_ABORTED"));
      return;
    }

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress(progress);
    };

    xhr.onload = () => {
      cleanup();
      if (xhr.status === 200) {
        resolve();
        return;
      }

      reject(new Error("MUX_UPLOAD_FAILED"));
    };

    xhr.onerror = () => {
      cleanup();
      reject(new Error("MUX_UPLOAD_FAILED"));
    };

    timeoutId = setTimeout(() => {
      cleanup();
      xhr.abort();
      reject(new Error("UPLOAD_TIMEOUT"));
    }, timeoutMs);

    signal?.addEventListener("abort", abortUpload, { once: true });
    xhr.send(file);
  });
};

export const waitForMuxAssetReady = async (
  uploadId: string,
  getStatus: (uploadId: string) => Promise<PromoUploadStatus>,
  options: PollMuxOptions = {},
) => {
  const {
    signal,
    timeoutMs = DEFAULT_POLL_TIMEOUT_MS,
    initialDelayMs = 2000,
    maxDelayMs = 10000,
    backoffFactor = 1.5,
  } = options;

  const start = Date.now();
  let currentDelayMs = initialDelayMs;

  while (Date.now() - start < timeoutMs) {
    if (signal?.aborted) throw new Error("UPLOAD_ABORTED");

    const statusResponse = await getStatus(uploadId);
    if (!statusResponse.success) {
      throw new Error(statusResponse.message || "MUX_STATUS_FAILED");
    }

    if (statusResponse.status === "ready") {
      return {
        assetId: statusResponse.assetId,
        playbackId: statusResponse.playbackId,
      };
    }

    if (statusResponse.status === "errored") {
      throw new Error("MUX_PROCESSING_FAILED");
    }

    await delay(currentDelayMs, signal);
    currentDelayMs = Math.min(
      maxDelayMs,
      Math.round(currentDelayMs * backoffFactor),
    );
  }

  throw new Error("UPLOAD_TIMEOUT");
};
