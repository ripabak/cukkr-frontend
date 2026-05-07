import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export function useWorkspaceGuard() {
  const router = useRouter();
  const { data: org, isPending } = authClient.useActiveOrganization();

  useEffect(() => {
    if (!isPending && !org) {
      router.replace("/switch-barbershop" as any);
    }
  }, [isPending, org]);

  return { isLoading: isPending, hasWorkspace: !!org };
}
