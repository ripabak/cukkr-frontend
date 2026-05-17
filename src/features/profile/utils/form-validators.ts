export const profileValidators = {
  validateName(name: string): { isValid: boolean; message: string } {
    if (!name || name.trim().length === 0) {
      return { isValid: false, message: "Name is required" };
    }
    return { isValid: true, message: "" };
  },

  validateBio(bio: string | null | undefined): { isValid: boolean; message: string } {
    if (bio && bio.length > 500) {
      return { isValid: false, message: "Bio must be less than 500 characters" };
    }
    return { isValid: true, message: "" };
  },

  validatePhone(phone: string): { isValid: boolean; message: string } {
    if (!phone || phone.trim().length === 0) {
      return { isValid: false, message: "Phone number is required" };
    }
    if (phone.trim().length < 6) {
      return { isValid: false, message: "Invalid phone number" };
    }
    return { isValid: true, message: "" };
  },

  validatePassword(password: string): { isValid: boolean; message: string } {
    if (!password || password.length === 0) {
      return { isValid: false, message: "Password is required" };
    }
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters" };
    }
    return { isValid: true, message: "" };
  },
};
