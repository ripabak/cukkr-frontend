import { authClient } from "@/src/lib/auth-client";

export const authService = {
  /**
   * Sign in dengan callbackURL milik Better Auth — target redirect di-bawa
   * oleh SDK dan dikembalikan sebagai `data.url` setelah login sukses.
   */
  async signIn(email: string, password: string, callbackURL?: string) {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL,
    });

    if (error) {
      const err = new Error(error.message || "Failed to sign in");
      (err as any).code = error.code;
      throw err;
    }

    if (!data) {
      throw new Error("Failed to sign in");
    }

    return data;
  },

  async signUp(name: string, email: string, password: string) {
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || "Failed to sign up");
    }

    if (!data) {
      throw new Error("Failed to sign up");
    }

    return data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const { data, error } = await authClient.changePassword({
      currentPassword,
      newPassword,
    });

    if (error) {
      throw new Error(error.message || "Failed to change password");
    }

    return data;
  },

  async signOut() {
    const { error } = await authClient.signOut();

    if (error) {
      throw new Error(error.message || "Failed to sign out");
    }
  },
};
