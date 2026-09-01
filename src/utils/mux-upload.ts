import { PromoUploadStatus } from "@/types/endpoints.types";

type PollMuxOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
};

const DEFAULT_POLL_TIMEOUT_MS = 10 * 60 * 1000;

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
