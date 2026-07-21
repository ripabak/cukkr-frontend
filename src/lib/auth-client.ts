import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient, organizationClient, inferAdditionalFields, inferOrgAdditionalFields } from "better-auth/client/plugins";
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
    organizationClient({
      schema: inferOrgAdditionalFields({
        organization: {
          additionalFields: {
            logoThumb: { type: "string" },
            logoMed: { type: "string" },
            logoFull: { type: "string" },
          },
        },
      }),
    }),
    inferAdditionalFields({
      user: {
        language: { type: "string", required: false },
        imageThumb: { type: "string", required: false },
        imageMed: { type: "string", required: false },
        imageFull: { type: "string", required: false },
      }
    }),
  ],
});
