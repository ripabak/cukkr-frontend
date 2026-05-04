import { authClient } from "@/src/lib/auth-client";

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await authClient.signIn.email({ email, password });

    if (error) {
      throw new Error(error.message || "Failed to sign in");
    }

    if (!data) {
      throw new Error("Failed to sign in");
    }

    return data;
  },

  async signUp(name: string, email: string, password: string) {
    const { data, error } = await authClient.signUp.email({ name, email, password });

    if (error) {
      throw new Error(error.message || "Failed to sign up");
    }

    if (!data) {
      throw new Error("Failed to sign up");
    }

    return data;
  },
};
