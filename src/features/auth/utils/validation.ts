export function validateEmail(email: string): {
  isValid: boolean;
  message: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return { isValid: false, message: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format" };
  }
  return { isValid: true, message: "" };
}

export function validatePassword(
  password: string,
  minLength = 8,
): { isValid: boolean; message: string } {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters`,
    };
  }
  return { isValid: true, message: "" };
}

export function validatePasswordsMatch(
  password: string,
  confirmPassword: string,
): { isValid: boolean; message: string } {
  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }
  return { isValid: true, message: "" };
}

export function validateName(name: string): {
  isValid: boolean;
  message: string;
} {
  if (!name.trim()) {
    return { isValid: false, message: "Name is required" };
  }
  return { isValid: true, message: "" };
}
