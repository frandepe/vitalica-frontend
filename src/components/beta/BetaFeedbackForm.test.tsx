import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BetaFeedbackForm } from "./BetaFeedbackForm";

const mocks = vi.hoisted(() => ({ sendBetaFeedback: vi.fn() }));

vi.mock("@/api", () => ({ sendBetaFeedback: mocks.sendBetaFeedback }));

describe("BetaFeedbackForm success feedback", () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    mocks.sendBetaFeedback.mockReset();
    scrollIntoView.mockReset();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
  });

  afterEach(cleanup);

  const submitValidFeedback = () => {
    fireEvent.click(
      screen.getByRole("button", { name: /Tengo una idea o sugerencia/i }),
    );
    fireEvent.change(screen.getByLabelText("Contanos un poco más"), {
      target: { value: "Me gustaría mejorar esta pantalla." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar comentario" }));
  };

  it("highlights, focuses and scrolls to a confirmed submission", async () => {
    mocks.sendBetaFeedback.mockResolvedValue({ success: true });
    render(<BetaFeedbackForm originPath="/beta" />);

    submitValidFeedback();

    const confirmation = await screen.findByRole("status");
    expect(confirmation).toHaveTextContent(
      "¡Gracias! Recibimos tu comentario.",
    );
    expect(confirmation).toHaveClass("bg-emerald-50", "text-emerald-950");
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledTimes(1));
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center",
    });
    expect(confirmation).toHaveFocus();
  });

  it("does not show a false success state when the API rejects the submission", async () => {
    mocks.sendBetaFeedback.mockResolvedValue({
      success: false,
      message: "No se pudo guardar.",
    });
    render(<BetaFeedbackForm />);

    submitValidFeedback();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo guardar.",
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
