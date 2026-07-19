export function validateBarbershopName(name: string): {
  isValid: boolean;
  message: string;
} {
  if (!name.trim()) {
    return { isValid: false, message: "createBarbershop.validation.nameRequired" };
  }
  if (name.length < 3) {
    return { isValid: false, message: "createBarbershop.validation.nameMinLength" };
  }
  if (name.length > 100) {
    return { isValid: false, message: "createBarbershop.validation.nameMaxLength" };
  }
  return { isValid: true, message: "" };
}

export function validateServiceName(name: string): {
  isValid: boolean;
  message: string;
} {
  if (!name.trim()) {
    return { isValid: false, message: "createBarbershop.validation.serviceNameRequired" };
  }
  if (name.length < 2) {
    return { isValid: false, message: "createBarbershop.validation.serviceNameMinLength" };
  }
  return { isValid: true, message: "" };
}

export function validatePrice(price: number): {
  isValid: boolean;
  message: string;
} {
  if (price <= 0) {
    return { isValid: false, message: "createBarbershop.validation.priceRequired" };
  }
  if (price > 10000000) {
    return { isValid: false, message: "createBarbershop.validation.priceMax" };
  }
  return { isValid: true, message: "" };
}

export function validateDuration(minutes: number): {
  isValid: boolean;
  message: string;
} {
  if (minutes < 5) {
    return { isValid: false, message: "createBarbershop.validation.durationMin" };
  }
  if (minutes > 480) {
    return { isValid: false, message: "createBarbershop.validation.durationMax" };
  }
  return { isValid: true, message: "" };
}

export function validateEmail(email: string): {
  isValid: boolean;
  message: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return { isValid: false, message: "createBarbershop.validation.emailRequired" };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "createBarbershop.validation.invalidEmail" };
  }
  return { isValid: true, message: "" };
}
