// lib/eden-app.ts
import type { App } from "@/src/types/app.d.ts";
import { treaty } from "@elysia/eden";
import { authClient } from "./auth-client";

export const app = treaty<App>(
  process.env.EXPO_PUBLIC_ENV_API_URL!,
  {
    onRequest: async () => {
      const cookies = authClient.getCookie();
      const headers = {
        "Cookie": cookies,
      };

      return {
        headers,
        credentials: "omit"
      };
    },

    fetch: {
      credentials: "include",
    },
  }
);