export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string, minLength: number = 8): boolean {
  return password.length >= minLength;
}

export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}
