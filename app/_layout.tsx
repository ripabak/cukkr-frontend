import "../global.css";

import { QueryProvider } from "@/src/lib/providers";
import { PWAInstallBanner } from "@/src/components/PWAInstallBanner";
import { I18nProvider } from "@/src/lib/i18n/provider";
import type { Language } from "@/src/lib/i18n";
import { authClient } from "@/src/lib/auth-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Stack } from "expo-router";
import { View } from "react-native";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const { data: session } = authClient.useSession();
  const language = (session?.user?.language as Language) ?? "id";

  return (
    <QueryProvider>
      <I18nProvider language={language}>
        <View style={{ flex: 1 }}>
          <PWAInstallBanner />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="d" options={{ headerShown: false }} />
          </Stack>
        </View>
        <ReactQueryDevtools initialIsOpen={false} />
      </I18nProvider>
    </QueryProvider>
  );
}
