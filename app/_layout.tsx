import "../global.css";

import { QueryProvider } from "@/src/lib/providers";
import { PWAInstallBanner } from "@/src/components/PWAInstallBanner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Stack } from "expo-router";
import { View } from "react-native";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  return (
    <QueryProvider>
      <View style={{ flex: 1 }}>
        <PWAInstallBanner />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="d" options={{ headerShown: false }} />
        </Stack>
      </View>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  );
}
