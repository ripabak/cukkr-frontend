import { authClient } from "@/src/lib/auth-client";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { data: session, isPending } = authClient.useSession();

  // Do NOT return null when isPending — unmounting the Stack resets navigation
  // state, causing users mid-auth-flow (e.g. OTP screen) to lose their position
  // when they return from another app (Gmail, etc.).
  if (!isPending && session?.user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
