import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "./LoginPage";

vi.mock("@/components/Buttons/GoogleLoginButton", () => ({
  default: () => <button type="button">Continuar con Google</button>,
}));

vi.mock("@/api", () => ({
  loginUser: vi.fn(),
}));

describe("LoginPage password reset link", () => {
  it("links to the password recovery page", () => {
    render(
      <MemoryRouter initialEntries={["/auth/login"]}>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: "Olvidé mi contraseña" }),
    ).toHaveAttribute("href", "/auth/recuperar-contrasena");
  });
});
