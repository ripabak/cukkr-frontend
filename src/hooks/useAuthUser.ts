import { authClient } from "@/src/lib/auth-client";
import { useEffect, useState } from "react";

export function useAuthUser() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const session = await authClient.getSession();
      setUser(session.data?.user || null);
    } catch (error) {
      console.warn("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading };
}
