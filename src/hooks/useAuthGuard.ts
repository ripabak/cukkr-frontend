import { authClient } from "@/src/lib/auth-client";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export function useAuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await authClient.getSession();

      if (user.data?.user) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
        // Only redirect if we're in a protected route
        if (!segments[0]?.includes("auth")) {
          router.replace("/(auth)/login");
        }
      }
    } catch (error) {
      console.warn("Auth check failed:", error);
      setIsAuthenticated(false);
      setIsLoading(false);
      if (!segments[0]?.includes("auth")) {
        router.replace("/(auth)/login");
      }
    }
  };

  return { isLoading, isAuthenticated };
}
