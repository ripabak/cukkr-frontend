import { authClient } from "@/src/lib/auth-client";
import { useEffect, useState } from "react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const session = await authClient.getSession();
      setUser((session.data?.user as AuthUser) || null);
    } catch (error) {
      console.warn("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading };
}
