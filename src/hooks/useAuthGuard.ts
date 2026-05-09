import { authClient } from "@/src/lib/auth-client";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useAuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { data: session, isPending } = authClient.useSession();

  const isAuthenticated = !!session?.user;

  useEffect(() => {
    if (isPending) return;

    if (!isAuthenticated && !segments[0]?.includes("auth")) {
      router.replace("/(auth)/login");
    }
  }, [isPending, isAuthenticated, segments]);

  return { isLoading: isPending, isAuthenticated };
}
