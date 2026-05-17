// lib/eden-app.ts
import type { App } from "@/src/types/app.d.ts";
import { treaty } from "@elysia/eden";
import { Platform } from "react-native";
import { authClient } from "./auth-client";

export const app = treaty<App>(
  process.env.EXPO_PUBLIC_ENV_API_URL!,
  {
    onRequest: async () => {
      // Web: browsers block manual Cookie header — let browser send cookies automatically via credentials: "include"
      // Mobile: no such restriction, so manually attach cookie from authClient
      if (Platform.OS === "web") {
        return { credentials: "include" };
      }

      const cookies = authClient.getCookie();
      return {
        headers: { "Cookie": cookies },
        credentials: "omit",
      };
    },
  }
);