import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, matchRoutes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { router } from "@/routes";
import ForgotPasswordPage from "./ForgotPasswordPage";

const { requestPasswordReset } = vi.hoisted(() => ({
  requestPasswordReset: vi.fn(),
}));

vi.mock("@/api", () => ({
  requestPasswordReset: (...args: unknown[]) => requestPasswordReset(...args),
}));

const genericMessage =
  "Si existe una cuenta compatible con recuperación para ese correo, recibirás un enlace con los próximos pasos.";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/auth/recuperar-contrasena"]}>
      <ForgotPasswordPage />
    </MemoryRouter>,
  );

describe("ForgotPasswordPage", () => {
  afterEach(cleanup);

  beforeEach(() => {
    requestPasswordReset.mockReset();
    requestPasswordReset.mockResolvedValue({
      success: true,
      message: genericMessage,
    });
  });

  it("is registered at /auth/recuperar-contrasena", () => {
    const matches = matchRoutes(
      router.routes,
      "/auth/recuperar-contrasena",
    );

    expect(matches?.at(-1)?.route.path).toBe("recuperar-contrasena");
  });

  it("validates the email before sending", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "invalid-email" },
    });
    fireEvent.submit(screen.getByLabelText("Correo electrónico").closest("form")!);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ingresa un email válido",
    );
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  it("submits the email and presents the generic confirmation", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar enlace" }));

    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenCalledWith({
        email: "user@example.com",
      });
    });
    expect(await screen.findByText(genericMessage)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Revisá tu correo" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Volver a ingresar" }),
    ).toHaveAttribute("href", "/auth/login");
  });

  it("prevents a second submit while the request is pending", async () => {
    let resolveRequest: ((value: unknown) => void) | undefined;
    requestPasswordReset.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    renderPage();

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "user@example.com" },
    });
    const submitButton = screen.getByRole("button", { name: "Enviar enlace" });
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).toBeDisabled());
    fireEvent.click(submitButton);
    expect(requestPasswordReset).toHaveBeenCalledTimes(1);

    resolveRequest?.({ success: true, message: genericMessage });
    expect(await screen.findByText(genericMessage)).toBeInTheDocument();
  });

  it("shows a rate limit or network error without showing confirmation", async () => {
    requestPasswordReset.mockResolvedValue({
      success: false,
      message: "Demasiadas solicitudes. Intenta nuevamente más tarde.",
    });
    renderPage();

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(
      await screen.findByText(
        "Demasiadas solicitudes. Intenta nuevamente más tarde.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Revisá tu correo")).not.toBeInTheDocument();
  });

  it("allows restarting without retaining the previous email", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar enlace" }));
    await screen.findByText(genericMessage);

    fireEvent.click(screen.getByRole("button", { name: "Usar otro correo" }));

    expect(screen.getByLabelText("Correo electrónico")).toHaveValue("");
  });
});
