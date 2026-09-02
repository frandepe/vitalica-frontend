import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, matchRoutes } from "react-router-dom";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { router } from "@/routes";
import ResetPasswordPage from "./ResetPasswordPage";

const { confirmPasswordReset } = vi.hoisted(() => ({
  confirmPasswordReset: vi.fn(),
}));

vi.mock("@/api", () => ({
  confirmPasswordReset: (...args: unknown[]) => confirmPasswordReset(...args),
}));

const renderPage = (fragment = "#token=opaque-token") => {
  window.history.replaceState(
    {},
    "",
    `/auth/restablecer-contrasena${fragment}`,
  );
  return render(
    <StrictMode>
      <MemoryRouter initialEntries={[`/auth/restablecer-contrasena${fragment}`]}>
        <ResetPasswordPage />
      </MemoryRouter>
    </StrictMode>,
  );
};

const completeForm = (password = "NuevaClave123", confirmation = password) => {
  fireEvent.change(screen.getByLabelText("Nueva contraseña"), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText("Confirmar nueva contraseña"), {
    target: { value: confirmation },
  });
  fireEvent.click(screen.getByRole("button", { name: "Actualizar contraseña" }));
};

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    confirmPasswordReset.mockReset();
    confirmPasswordReset.mockResolvedValue({
      success: true,
      message: "Contraseña actualizada correctamente. Ya podés iniciar sesión.",
    });
  });

  afterEach(() => {
    cleanup();
    window.history.replaceState({}, "", "/");
  });

  it("is registered at /auth/restablecer-contrasena", () => {
    const matches = matchRoutes(router.routes, "/auth/restablecer-contrasena");
    expect(matches?.at(-1)?.route.path).toBe("restablecer-contrasena");
  });

  it("captures the fragment token and removes it from the URL immediately", async () => {
    renderPage("#token=opaque%20token");
    expect(window.location.hash).toBe("");

    completeForm();

    await waitFor(() =>
      expect(confirmPasswordReset).toHaveBeenCalledWith({
        token: "opaque token",
        newPassword: "NuevaClave123",
      }),
    );
  });

  it("rejects policy failures and mismatched confirmation locally", async () => {
    renderPage();
    completeForm("password1", "different1A");

    expect(
      await screen.findByText(/La contraseña debe tener entre 8 y 128/),
    ).toBeInTheDocument();
    expect(await screen.findByText("Las contraseñas no coinciden")).toBeInTheDocument();
    expect(confirmPasswordReset).not.toHaveBeenCalled();
  });

  it("offers a new request when the token is missing or implausible", () => {
    renderPage("");
    expect(screen.getByText("El enlace es inválido o expiró")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitar otro enlace" })).toHaveAttribute(
      "href",
      "/auth/recuperar-contrasena",
    );
  });

  it("shows the generic backend token error and allows requesting another link", async () => {
    confirmPasswordReset.mockResolvedValue({
      success: false,
      message: "El enlace es inválido o expiró",
    });
    renderPage();
    completeForm();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El enlace es inválido o expiró",
    );
    expect(screen.getByRole("link", { name: "Solicitar otro enlace" })).toBeInTheDocument();
  });

  it("clears the in-memory token after success and offers login without creating a session", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    renderPage();
    completeForm();

    expect(
      await screen.findByRole("heading", { name: "Contraseña actualizada" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toHaveAttribute(
      "href",
      "/auth/login",
    );
    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
  });
});
