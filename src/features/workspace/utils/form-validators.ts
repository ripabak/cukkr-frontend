export function validateBarbershopName(name: string): {
  isValid: boolean;
  message: string;
} {
  if (!name.trim()) {
    return { isValid: false, message: "Barbershop name is required" };
  }
  if (name.length < 3) {
    return { isValid: false, message: "Name must be at least 3 characters" };
  }
  if (name.length > 100) {
    return { isValid: false, message: "Name must be less than 100 characters" };
  }
  return { isValid: true, message: "" };
}

export function validateServiceName(name: string): {
  isValid: boolean;
  message: string;
} {
  if (!name.trim()) {
    return { isValid: false, message: "Service name is required" };
  }
  if (name.length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters" };
  }
  return { isValid: true, message: "" };
}

export function validatePrice(price: number): {
  isValid: boolean;
  message: string;
} {
  if (price <= 0) {
    return { isValid: false, message: "Price must be greater than 0" };
  }
  if (price > 10000000) {
    return { isValid: false, message: "Price is too high" };
  }
  return { isValid: true, message: "" };
}

export function validateDuration(minutes: number): {
  isValid: boolean;
  message: string;
} {
  if (minutes < 5) {
    return { isValid: false, message: "Duration must be at least 5 minutes" };
  }
  if (minutes > 480) {
    return { isValid: false, message: "Duration must be less than 8 hours" };
  }
  return { isValid: true, message: "" };
}

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
