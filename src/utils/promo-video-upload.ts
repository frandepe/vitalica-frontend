import {
  getPromoMuxUploadStatus,
  savePromoVideoToCourse,
} from "@/api/videoEndpoints";
import { waitForMuxAssetReady } from "@/utils/mux-upload";

type PromoVideoProcessingOptions = {
  courseId: string;
  uploadId: string;
  signal?: AbortSignal;
  onReadyToConfirm?: () => void;
};

type PromoVideoProcessingDependencies = {
  getStatus?: typeof getPromoMuxUploadStatus;
  confirm?: typeof savePromoVideoToCourse;
};

export const processAndConfirmPromoVideo = async (
  {
    courseId,
    uploadId,
    signal,
    onReadyToConfirm,
  }: PromoVideoProcessingOptions,
  {
    getStatus = getPromoMuxUploadStatus,
    confirm = savePromoVideoToCourse,
  }: PromoVideoProcessingDependencies = {},
) => {
  const { assetId, playbackId } = await waitForMuxAssetReady(
    uploadId,
    (currentUploadId) => getStatus(courseId, currentUploadId),
    { signal },
  );

  onReadyToConfirm?.();
  const confirmation = await confirm(courseId, uploadId);

  return { assetId, playbackId, confirmation };
};
