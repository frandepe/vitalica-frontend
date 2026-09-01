import MuxUploader, {
  type MuxUploaderRefAttributes,
} from "@mux/mux-uploader-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { MAX_VIDEO_SIZE_BYTES } from "@/constants/video";
import type { VideoUploadPhase } from "@/types/video-upload.types";

export type MuxVideoUploadPhase = Extract<
  VideoUploadPhase,
  | "idle"
  | "preparing"
  | "uploading"
  | "paused"
  | "offline"
  | "transfer-complete"
  | "error"
  | "aborted"
>;

export type MuxDirectUpload = {
  uploadUrl: string;
  uploadId: string;
};

export type MuxVideoUploadContext = {
  sessionId: number;
  file: File;
  uploadId?: string;
};

export type MuxVideoUploaderHandle = {
  start: (file: File) => number;
  retry: () => number | null;
  abort: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

type MuxVideoUploaderProps = {
  createDirectUpload: (file: File) => Promise<MuxDirectUpload>;
  onPhaseChange?: (
    phase: MuxVideoUploadPhase,
    context?: MuxVideoUploadContext,
  ) => void;
  onProgress?: (progress: number, context: MuxVideoUploadContext) => void;
  onTransferComplete: (context: Required<MuxVideoUploadContext>) => void;
  onError?: (error: Error, context: MuxVideoUploadContext) => void;
  maxFileSizeBytes?: number;
};

type UploadSession = {
  id: number;
  file: File;
  uploadId?: string;
  endpointPromise?: Promise<string>;
  completed: boolean;
};

type UploaderInstanceProps = MuxVideoUploaderProps & {
  session: UploadSession;
  isCurrent: (sessionId: number) => boolean;
  deactivateSession: (sessionId: number) => void;
  registerElement: (element: MuxUploaderRefAttributes | null) => void;
};

const toContext = (session: UploadSession): MuxVideoUploadContext => ({
  sessionId: session.id,
  file: session.file,
  uploadId: session.uploadId,
});

const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(String(value));

const UploaderInstance = ({
  session,
  createDirectUpload,
  onPhaseChange,
  onProgress,
  onTransferComplete,
  onError,
  maxFileSizeBytes,
  isCurrent,
  deactivateSession,
  registerElement,
}: UploaderInstanceProps) => {
  const uploaderRef = useRef<MuxUploaderRefAttributes>(null);
  const startedRef = useRef(false);
  const cleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const endpoint = useCallback(() => {
    if (!session.endpointPromise) {
      onPhaseChange?.("preparing", toContext(session));
      session.endpointPromise = createDirectUpload(session.file).then(
        ({ uploadUrl, uploadId }) => {
          if (!uploadUrl || !uploadId) {
            throw new Error("MUX_DIRECT_UPLOAD_RESPONSE_INVALID");
          }

          session.uploadId = uploadId;
          return uploadUrl;
        },
      );
    }

    return session.endpointPromise;
  }, [createDirectUpload, onPhaseChange, session]);

  useEffect(() => {
    const element = uploaderRef.current;
    if (!element) return;

    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }

    registerElement(element);

    const handleOffline = () => {
      if (isCurrent(session.id)) {
        onPhaseChange?.("offline", toContext(session));
      }
    };
    const handleOnline = () => {
      if (isCurrent(session.id)) {
        onPhaseChange?.(
          element.paused ? "paused" : "uploading",
          toContext(session),
        );
      }
    };
    const handlePausedChange = (event: Event) => {
      if (!isCurrent(session.id)) return;
      const paused = (event as CustomEvent<boolean>).detail;
      onPhaseChange?.(paused ? "paused" : "uploading", toContext(session));
    };

    element.addEventListener("offline", handleOffline);
    element.addEventListener("online", handleOnline);
    element.addEventListener("pausedchange", handlePausedChange);

    if (!startedRef.current) {
      startedRef.current = true;
      element.dispatchEvent(
        new CustomEvent("file-ready", {
          detail: session.file,
        }),
      );
    }

    return () => {
      element.removeEventListener("offline", handleOffline);
      element.removeEventListener("online", handleOnline);
      element.removeEventListener("pausedchange", handlePausedChange);
      registerElement(null);
      cleanupTimeoutRef.current = setTimeout(() => {
        deactivateSession(session.id);
        element.upload?.abort();
      }, 0);
    };
  }, [deactivateSession, isCurrent, onPhaseChange, registerElement, session]);

  return (
    <MuxUploader
      ref={uploaderRef}
      endpoint={endpoint}
      maxFileSize={Math.floor(
        (maxFileSizeBytes ?? MAX_VIDEO_SIZE_BYTES) / 1024,
      )}
      noDrop
      noProgress
      noStatus
      noRetry
      aria-hidden="true"
      style={{ display: "none" }}
      onUploadStart={() => {
        if (isCurrent(session.id)) {
          onPhaseChange?.("uploading", toContext(session));
        }
      }}
      onProgress={(event) => {
        if (isCurrent(session.id)) {
          onProgress?.(
            (event as CustomEvent<number>).detail,
            toContext(session),
          );
        }
      }}
      onUploadError={(event) => {
        if (!isCurrent(session.id)) return;
        const error = new Error(event.detail.message || "MUX_UPLOAD_FAILED");
        onPhaseChange?.("error", toContext(session));
        onError?.(error, toContext(session));
      }}
      onSuccess={() => {
        if (!isCurrent(session.id) || session.completed) return;
        if (!session.uploadId) {
          const error = toError("MUX_UPLOAD_ID_MISSING");
          onPhaseChange?.("error", toContext(session));
          onError?.(error, toContext(session));
          return;
        }

        session.completed = true;
        const context = toContext(session) as Required<MuxVideoUploadContext>;
        onPhaseChange?.("transfer-complete", context);
        onTransferComplete(context);
      }}
    />
  );
};

const MuxVideoUploader = forwardRef<
  MuxVideoUploaderHandle,
  MuxVideoUploaderProps
>(
  (
    {
      createDirectUpload,
      onPhaseChange,
      onProgress,
      onTransferComplete,
      onError,
      maxFileSizeBytes = MAX_VIDEO_SIZE_BYTES,
    },
    ref,
  ) => {
    const [session, setSession] = useState<UploadSession | null>(null);
    const activeSessionRef = useRef<UploadSession | null>(null);
    const uploaderElementRef = useRef<MuxUploaderRefAttributes | null>(null);
    const nextSessionIdRef = useRef(0);

    const isCurrent = useCallback(
      (sessionId: number) => activeSessionRef.current?.id === sessionId,
      [],
    );

    const registerElement = useCallback(
      (element: MuxUploaderRefAttributes | null) => {
        uploaderElementRef.current = element;
      },
      [],
    );

    const deactivateSession = useCallback((sessionId: number) => {
      if (activeSessionRef.current?.id === sessionId) {
        activeSessionRef.current = null;
      }
    }, []);

    const start = useCallback(
      (file: File) => {
        uploaderElementRef.current?.upload?.abort();
        const nextSession: UploadSession = {
          id: ++nextSessionIdRef.current,
          file,
          completed: false,
        };
        activeSessionRef.current = nextSession;
        setSession(nextSession);
        return nextSession.id;
      },
      [],
    );

    const abort = useCallback(() => {
      const currentSession = activeSessionRef.current;
      if (!currentSession) return;
      uploaderElementRef.current?.upload?.abort();
      activeSessionRef.current = null;
      setSession(null);
      onPhaseChange?.("aborted", toContext(currentSession));
    }, [onPhaseChange]);

    const reset = useCallback(() => {
      uploaderElementRef.current?.upload?.abort();
      activeSessionRef.current = null;
      setSession(null);
      onPhaseChange?.("idle");
    }, [onPhaseChange]);

    useImperativeHandle(
      ref,
      () => ({
        start,
        retry: () => {
          const currentFile = activeSessionRef.current?.file;
          return currentFile ? start(currentFile) : null;
        },
        abort,
        pause: () => {
          if (uploaderElementRef.current?.upload) {
            uploaderElementRef.current.paused = true;
          }
        },
        resume: () => {
          if (uploaderElementRef.current?.upload) {
            uploaderElementRef.current.paused = false;
          }
        },
        reset,
      }),
      [abort, reset, start],
    );

    if (!session) return null;

    return (
      <UploaderInstance
        key={session.id}
        session={session}
        createDirectUpload={createDirectUpload}
        onPhaseChange={onPhaseChange}
        onProgress={onProgress}
        onTransferComplete={onTransferComplete}
        onError={onError}
        maxFileSizeBytes={maxFileSizeBytes}
        isCurrent={isCurrent}
        deactivateSession={deactivateSession}
        registerElement={registerElement}
      />
    );
  },
);

MuxVideoUploader.displayName = "MuxVideoUploader";

export default MuxVideoUploader;
