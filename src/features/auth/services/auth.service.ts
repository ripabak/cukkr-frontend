import { authClient } from "@/src/lib/auth-client";

export const authService = {
  async signIn(email: string, password: string) {
    return authClient.signIn.email({ email, password });
  },

  async signUp(name: string, email: string, password: string) {
    return authClient.signUp.email({ name, email, password });
  },
};
