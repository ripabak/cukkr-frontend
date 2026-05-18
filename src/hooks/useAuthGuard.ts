import { authClient } from "@/src/lib/auth-client";
import { useGlobalSearchParams, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useAuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const globalParams = useGlobalSearchParams<Record<string, string>>();
  const { data: session, isPending } = authClient.useSession();

  const isAuthenticated = !!session?.user;

  useEffect(() => {
    if (isPending) return;

    if (!isAuthenticated && !segments.some(s => s?.includes("auth"))) {
      const queryString = Object.entries(globalParams)
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join("&");
      const redirectTo = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace({
        pathname: "/d/(auth)/login",
        params: { redirect: redirectTo },
      });
    }
  }, [isPending, isAuthenticated, segments]);

  return { isLoading: isPending, isAuthenticated };
}
