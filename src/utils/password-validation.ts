export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const PASSWORD_REQUIREMENTS = [
  {
    test: (password: string) => password.length >= PASSWORD_MIN_LENGTH,
    text: `Al menos ${PASSWORD_MIN_LENGTH} caracteres`,
  },
  {
    test: (password: string) => password.length <= PASSWORD_MAX_LENGTH,
    text: `Como máximo ${PASSWORD_MAX_LENGTH} caracteres`,
  },
  { test: (password: string) => /[0-9]/.test(password), text: "Al menos 1 número" },
  {
    test: (password: string) => /[a-z]/.test(password),
    text: "Al menos 1 letra minúscula",
  },
  {
    test: (password: string) => /[A-Z]/.test(password),
    text: "Al menos 1 letra mayúscula",
  },
] as const;

export const isPasswordValid = (password: string) =>
  PASSWORD_REQUIREMENTS.every((requirement) => requirement.test(password));

export const validatePassword = (password: string) =>
  isPasswordValid(password) ||
  "La contraseña debe tener entre 8 y 128 caracteres, una minúscula, una mayúscula y un número";
