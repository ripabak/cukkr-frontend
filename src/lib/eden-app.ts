// lib/eden-app.ts
import type { App } from "@/src/types/app.d.ts";
import { treaty } from "@elysia/eden";
import { authClient } from "./auth-client";

export const app = treaty<App>(
  process.env.EXPO_PUBLIC_ENV_API_URL!,
  {
    onRequest: async (path, options) => {
      const cookies = authClient.getCookie();

      return {
        ...options,
        headers: {
          ...(options?.headers || {}),
          ...(cookies ? { Cookie: cookies } : {}),
        },
      };
    },

    fetch: {
      credentials: "include",
    },
  }
);