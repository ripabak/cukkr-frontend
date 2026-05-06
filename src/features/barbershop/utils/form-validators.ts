type ValidationResult = { isValid: boolean; message: string };

export function validateServiceName(name: string): ValidationResult {
  if (!name.trim()) return { isValid: false, message: "Service name is required" };
  if (name.length < 2) return { isValid: false, message: "Name must be at least 2 characters" };
  return { isValid: true, message: "" };
}

export function validatePrice(price: number): ValidationResult {
  if (!price || price <= 0) return { isValid: false, message: "Price must be greater than 0" };
  if (price > 10_000_000) return { isValid: false, message: "Price is too high" };
  return { isValid: true, message: "" };
}

export function validateDuration(minutes: number): ValidationResult {
  if (!minutes || minutes < 5) return { isValid: false, message: "Duration must be at least 5 minutes" };
  if (minutes > 480) return { isValid: false, message: "Duration must be less than 8 hours" };
  return { isValid: true, message: "" };
}

export function validateDiscount(discount: number): ValidationResult {
  if (discount < 0) return { isValid: false, message: "Discount cannot be negative" };
  if (discount > 100) return { isValid: false, message: "Discount cannot exceed 100%" };
  return { isValid: true, message: "" };
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return { isValid: false, message: "Email is required" };
  if (!emailRegex.test(email)) return { isValid: false, message: "Invalid email format" };
  return { isValid: true, message: "" };
}

export function formatCurrency(amount: number): string {
  return `Rp. ${amount.toLocaleString("id-ID")}`;
}
