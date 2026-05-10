import { authClient } from "@/src/lib/auth-client";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null;

  if (session?.user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
