import { act, cleanup, render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MuxVideoUploader, {
  type MuxVideoUploaderHandle,
} from "./MuxVideoUploader";

type MockUploaderProps = {
  endpoint: () => Promise<string>;
  maxFileSize?: number;
  noDrop?: boolean;
  noProgress?: boolean;
  noStatus?: boolean;
  noRetry?: boolean;
  pausable?: boolean;
  onUploadStart?: () => void;
  onProgress?: (event: CustomEvent<number>) => void;
  onUploadError?: (event: CustomEvent<{ message: string }>) => void;
  onSuccess?: () => void;
};

type MockUploader = EventTarget & {
  upload: {
    abort: ReturnType<typeof vi.fn>;
  };
  paused: boolean;
  currentProps: MockUploaderProps;
};

const muxMock = vi.hoisted(() => ({
  instances: [] as MockUploader[],
  props: [] as MockUploaderProps[],
}));

vi.mock("@mux/mux-uploader-react", async () => {
  const React = await import("react");

  return {
    default: React.forwardRef(
      (props: MockUploaderProps, ref: React.ForwardedRef<MockUploader>) => {
        const instanceRef = React.useRef<MockUploader | null>(null);
        if (!instanceRef.current) {
          const instance = new EventTarget() as MockUploader;
          instance.upload = { abort: vi.fn() };
          instance.paused = false;
          instance.currentProps = props;
          const nativeDispatch = instance.dispatchEvent.bind(instance);
          instance.dispatchEvent = (event: Event) => {
            const result = nativeDispatch(event);
            if (event.type === "file-ready") {
              void props.endpoint().then(() => props.onUploadStart?.());
            }
            return result;
          };
          instanceRef.current = instance;
          muxMock.instances.push(instance);
        }
        instanceRef.current.currentProps = props;

        React.useImperativeHandle(ref, () => instanceRef.current as MockUploader);
        muxMock.props.push(props);
        return React.createElement("div", { "data-testid": "mux-uploader" });
      },
    ),
  };
});

const createFile = (name = "video.mp4") =>
  new File(["video"], name, { type: "video/mp4" });

describe("MuxVideoUploader", () => {
  beforeEach(() => {
    muxMock.instances.length = 0;
    muxMock.props.length = 0;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("creates one endpoint, captures uploadId and completes only once", async () => {
    const createDirectUpload = vi.fn().mockResolvedValue({
      uploadUrl: "https://upload.example/one",
      uploadId: "upload-one",
    });
    const onProgress = vi.fn();
    const onTransferComplete = vi.fn();
    const onPhaseChange = vi.fn();
    const ref = createRef<MuxVideoUploaderHandle>();

    render(
      <MuxVideoUploader
        ref={ref}
        createDirectUpload={createDirectUpload}
        onPhaseChange={onPhaseChange}
        onProgress={onProgress}
        onTransferComplete={onTransferComplete}
      />,
    );

    const file = createFile();
    act(() => {
      ref.current?.start(file);
    });

    await waitFor(() => expect(createDirectUpload).toHaveBeenCalledTimes(1));
    const props = muxMock.props.at(-1) as MockUploaderProps;
    await expect(props.endpoint()).resolves.toBe("https://upload.example/one");

    act(() => {
      props.onProgress?.(new CustomEvent("progress", { detail: 42 }));
      props.onProgress?.(new CustomEvent("progress", { detail: 100 }));
      props.onSuccess?.();
      props.onSuccess?.();
    });

    expect(onProgress).toHaveBeenCalledWith(
      42,
      expect.objectContaining({ uploadId: "upload-one", file }),
    );
    expect(onProgress).toHaveBeenCalledWith(
      100,
      expect.objectContaining({ uploadId: "upload-one", file }),
    );
    expect(onTransferComplete).toHaveBeenCalledTimes(1);
    expect(onTransferComplete).toHaveBeenCalledWith(
      expect.objectContaining({ uploadId: "upload-one", file }),
    );
    expect(onPhaseChange).toHaveBeenCalledWith(
      "transfer-complete",
      expect.objectContaining({ uploadId: "upload-one" }),
    );
    expect(onPhaseChange).not.toHaveBeenCalledWith(
      "ready",
      expect.anything(),
    );
  });

  it("configures the 500 MB UX limit and keeps optional Mux UI disabled", async () => {
    const ref = createRef<MuxVideoUploaderHandle>();

    render(
      <MuxVideoUploader
        ref={ref}
        createDirectUpload={vi.fn().mockResolvedValue({
          uploadUrl: "https://upload.example/config",
          uploadId: "upload-config",
        })}
        onTransferComplete={vi.fn()}
      />,
    );

    act(() => ref.current?.start(createFile()));
    await waitFor(() => expect(muxMock.props.length).toBeGreaterThan(0));

    const props = muxMock.props.at(-1) as MockUploaderProps;
    expect(props.maxFileSize).toBe(500 * 1024);
    expect(props.noDrop).toBe(true);
    expect(props.noProgress).toBe(true);
    expect(props.noStatus).toBe(true);
    expect(props.noRetry).toBe(true);
    expect(props.pausable).toBeUndefined();
  });

  it("maps offline, online, pause and upload errors", async () => {
    const onPhaseChange = vi.fn();
    const onError = vi.fn();
    const ref = createRef<MuxVideoUploaderHandle>();

    render(
      <MuxVideoUploader
        ref={ref}
        createDirectUpload={vi.fn().mockResolvedValue({
          uploadUrl: "https://upload.example/events",
          uploadId: "upload-events",
        })}
        onPhaseChange={onPhaseChange}
        onError={onError}
        onTransferComplete={vi.fn()}
      />,
    );

    act(() => {
      ref.current?.start(createFile());
    });
    await waitFor(() =>
      expect(onPhaseChange).toHaveBeenCalledWith(
        "uploading",
        expect.objectContaining({ uploadId: "upload-events" }),
      ),
    );

    const instance = muxMock.instances[0];
    const props = muxMock.props.at(-1) as MockUploaderProps;
    act(() => {
      instance.dispatchEvent(new Event("offline"));
      instance.dispatchEvent(new Event("online"));
      instance.dispatchEvent(
        new CustomEvent("pausedchange", { detail: true }),
      );
      props.onUploadError?.(
        new CustomEvent("uploaderror", {
          detail: { message: "network failed" },
        }),
      );
    });

    expect(onPhaseChange).toHaveBeenCalledWith(
      "offline",
      expect.objectContaining({ uploadId: "upload-events", sessionId: 1 }),
    );
    expect(onPhaseChange).toHaveBeenCalledWith(
      "uploading",
      expect.objectContaining({ uploadId: "upload-events", sessionId: 1 }),
    );
    expect(onPhaseChange).toHaveBeenCalledWith(
      "paused",
      expect.any(Object),
    );
    expect(onPhaseChange).toHaveBeenCalledWith("error", expect.any(Object));
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "network failed" }),
      expect.any(Object),
    );
  });

  it("retries with a new session and ignores stale events", async () => {
    const createDirectUpload = vi
      .fn()
      .mockResolvedValueOnce({
        uploadUrl: "https://upload.example/old",
        uploadId: "upload-old",
      })
      .mockResolvedValueOnce({
        uploadUrl: "https://upload.example/new",
        uploadId: "upload-new",
      });
    const onTransferComplete = vi.fn();
    const onError = vi.fn();
    const ref = createRef<MuxVideoUploaderHandle>();

    render(
      <MuxVideoUploader
        ref={ref}
        createDirectUpload={createDirectUpload}
        onTransferComplete={onTransferComplete}
        onError={onError}
      />,
    );

    act(() => {
      ref.current?.start(createFile());
    });
    await waitFor(() => expect(createDirectUpload).toHaveBeenCalledTimes(1));
    const oldProps = muxMock.props.at(-1) as MockUploaderProps;
    const oldInstance = muxMock.instances[0];

    act(() => {
      oldProps.onUploadError?.(
        new CustomEvent("uploaderror", {
          detail: { message: "network retries exhausted" },
        }),
      );
      ref.current?.retry();
    });
    await waitFor(() => expect(createDirectUpload).toHaveBeenCalledTimes(2));
    const newProps = muxMock.props.at(-1) as MockUploaderProps;

    act(() => {
      oldProps.onSuccess?.();
      newProps.onSuccess?.();
    });

    expect(oldInstance.upload.abort).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "network retries exhausted" }),
      expect.objectContaining({ uploadId: "upload-old" }),
    );
    expect(onTransferComplete).toHaveBeenCalledTimes(1);
    expect(onTransferComplete).toHaveBeenCalledWith(
      expect.objectContaining({ uploadId: "upload-new" }),
    );
  });

  it("aborts the active upload and discards success after unmount", async () => {
    const onTransferComplete = vi.fn();
    const ref = createRef<MuxVideoUploaderHandle>();
    const view = render(
      <MuxVideoUploader
        ref={ref}
        createDirectUpload={vi.fn().mockResolvedValue({
          uploadUrl: "https://upload.example/unmount",
          uploadId: "upload-unmount",
        })}
        onTransferComplete={onTransferComplete}
      />,
    );

    act(() => {
      ref.current?.start(createFile());
    });
    await waitFor(() => expect(muxMock.instances).toHaveLength(1));
    const instance = muxMock.instances[0];
    const props = muxMock.props.at(-1) as MockUploaderProps;

    view.unmount();
    await waitFor(() => expect(instance.upload.abort).toHaveBeenCalled());
    act(() => props.onSuccess?.());

    expect(onTransferComplete).not.toHaveBeenCalled();
  });

  it("keeps simultaneous uploader instances isolated", async () => {
    const refA = createRef<MuxVideoUploaderHandle>();
    const refB = createRef<MuxVideoUploaderHandle>();
    const completeA = vi.fn();
    const completeB = vi.fn();
    const createA = vi.fn().mockResolvedValue({
      uploadUrl: "https://upload.example/a",
      uploadId: "upload-a",
    });
    const createB = vi.fn().mockResolvedValue({
      uploadUrl: "https://upload.example/b",
      uploadId: "upload-b",
    });

    render(
      <>
        <MuxVideoUploader
          ref={refA}
          createDirectUpload={createA}
          onTransferComplete={completeA}
        />
        <MuxVideoUploader
          ref={refB}
          createDirectUpload={createB}
          onTransferComplete={completeB}
        />
      </>,
    );

    act(() => {
      refA.current?.start(createFile("a.mp4"));
      refB.current?.start(createFile("b.mp4"));
    });
    await waitFor(() => expect(muxMock.instances).toHaveLength(2));
    await waitFor(() => expect(createA).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(createB).toHaveBeenCalledTimes(1));

    act(() => {
      muxMock.instances[1]!.currentProps.onSuccess?.();
      muxMock.instances[0]!.currentProps.onSuccess?.();
    });

    expect(completeA).toHaveBeenCalledWith(
      expect.objectContaining({ uploadId: "upload-a" }),
    );
    expect(completeB).toHaveBeenCalledWith(
      expect.objectContaining({ uploadId: "upload-b" }),
    );
  });
});
