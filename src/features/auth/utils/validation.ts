export function validateEmail(email: string): {
  isValid: boolean;
  message: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return { isValid: false, message: "auth.validation.emailRequired" };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "auth.validation.invalidEmail" };
  }
  return { isValid: true, message: "" };
}

export function validatePassword(
  password: string,
  minLength = 8,
): { isValid: boolean; message: string; params?: Record<string, string> } {
  if (!password) {
    return { isValid: false, message: "auth.validation.passwordRequired" };
  }
  if (password.length < minLength) {
    return {
      isValid: false,
      message: "auth.validation.passwordMinLength",
      params: { minLength: String(minLength) },
    };
  }
  return { isValid: true, message: "" };
}

export function validatePasswordsMatch(
  password: string,
  confirmPassword: string,
): { isValid: boolean; message: string } {
  if (password !== confirmPassword) {
    return { isValid: false, message: "auth.validation.passwordMismatch" };
  }
  return { isValid: true, message: "" };
}

export function validateName(name: string): {
  isValid: boolean;
  message: string;
} {
  if (!name.trim()) {
    return { isValid: false, message: "auth.validation.nameRequired" };
  }
  return { isValid: true, message: "" };
}
