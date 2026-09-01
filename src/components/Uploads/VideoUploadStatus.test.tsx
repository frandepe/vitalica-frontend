import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VideoUploadStatus } from "./VideoUploadStatus";

describe("VideoUploadStatus", () => {
  it("distinguishes transfer completion from a ready video", () => {
    render(
      <VideoUploadStatus
        phase="processing"
        status="Procesando el video..."
        progress={100}
      />,
    );

    expect(
      screen.getByText("Carga completa · Procesando video"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Video listo")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Procesando el video...",
    );
  });

  it("shows retry only for terminal error and supports keyboard click", () => {
    const onRetry = vi.fn();
    render(
      <VideoUploadStatus
        phase="error"
        status="Intentá nuevamente."
        progress={0}
        onRetry={onRetry}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not offer a misleading cancel action while confirming", () => {
    render(
      <VideoUploadStatus
        phase="confirming"
        status="Guardando video..."
        progress={100}
        onCancel={vi.fn()}
        cancelDisabled
      />,
    );

    expect(
      screen.getByRole("button", { name: "Cancelar carga" }),
    ).toBeDisabled();
  });
});
