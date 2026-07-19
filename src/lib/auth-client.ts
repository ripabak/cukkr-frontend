import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient, organizationClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Lazy proxy so localStorage is only accessed after hydration, not during SSR
const webStorage = {
  getItem: (key: string) =>
    typeof localStorage !== "undefined" ? localStorage.getItem(key) : null,
  setItem: (key: string, value: string) => {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
  },
};

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_ENV_AUTH_URL,
  plugins: [
    expoClient({
      scheme: "cukkrfrontend",
      storagePrefix: "cukkrfrontend",
      storage: Platform.OS === "web" ? webStorage : SecureStore,
    }),
    emailOTPClient(),
    organizationClient(),
    inferAdditionalFields({
      user: { language: { type: "string", required: false } }
    }),
  ],
});
