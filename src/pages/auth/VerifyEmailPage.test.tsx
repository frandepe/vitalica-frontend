import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, matchRoutes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { router } from "@/routes";
import VerifyEmailPage from "./VerifyEmailPage";

const { confirmVerification } = vi.hoisted(() => ({
  confirmVerification: vi.fn(),
}));

vi.mock("@/api", () => ({
  confirmVerification: (...args: unknown[]) => confirmVerification(...args),
}));

describe("VerifyEmailPage", () => {
  beforeEach(() => {
    confirmVerification.mockReset();
    confirmVerification.mockResolvedValue({ message: "Email verificado" });
  });

  it("esta registrada en /auth/verificar-email", () => {
    const matches = matchRoutes(
      router.routes,
      "/auth/verificar-email?token=verification-token",
    );

    expect(matches?.at(-1)?.route.path).toBe("verificar-email");
  });

  it("lee el token del query param y confirma la verificacion", async () => {
    render(
      <MemoryRouter
        initialEntries={["/auth/verificar-email?token=verification-token"]}
      >
        <VerifyEmailPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(confirmVerification).toHaveBeenCalledTimes(1);
      expect(confirmVerification).toHaveBeenCalledWith("verification-token");
    });
  });
});
