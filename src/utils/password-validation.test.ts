import { describe, expect, it } from "vitest";
import {
  PASSWORD_MAX_LENGTH,
  isPasswordValid,
  validatePassword,
} from "./password-validation";

describe("password validation", () => {
  it.each([
    "Corta1A",
    "SINMINUSCULA1",
    "sinmayuscula1",
    "SinNumero",
    `Aa1${"x".repeat(PASSWORD_MAX_LENGTH - 2)}`,
  ])("rejects a password outside the shared policy", (password) => {
    expect(isPasswordValid(password)).toBe(false);
    expect(validatePassword(password)).toEqual(expect.any(String));
  });

  it("accepts the same policy used by register and reset", () => {
    expect(isPasswordValid("NuevaClave123")).toBe(true);
    expect(validatePassword("NuevaClave123")).toBe(true);
  });
});
