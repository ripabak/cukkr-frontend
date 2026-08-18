import { authClient } from "@/src/lib/auth-client";
import { Redirect, Stack, useLocalSearchParams, usePathname } from "expo-router";
import { getUrlParam, resolveRedirect } from "@/src/features/auth/utils/redirect";

// These routes must remain accessible even when authenticated (password reset flow)
const PASSWORD_RESET_ROUTES = [
  "/d/forgot-password",
  "/d/verify-otp",
  "/d/create-password",
];

export default function AuthLayout() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const { callbackURL } = useLocalSearchParams<{ callbackURL?: string }>();

  const isPasswordResetFlow = PASSWORD_RESET_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Do NOT return null when isPending — unmounting the Stack resets navigation
  // state, causing users mid-auth-flow (e.g. OTP screen) to lose their position
  // when they return from another app (Gmail, etc.).
  if (!isPending && session?.user && !isPasswordResetFlow) {
    // User sudah login membuka /login?callbackURL=... → hormati callbackURL
    // (handoff dari landing) alih-alih selalu lempar ke home.
    const callback = getUrlParam("callbackURL", callbackURL);
    return <Redirect href={resolveRedirect(callback) ?? "/d/(tabs)/home"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}