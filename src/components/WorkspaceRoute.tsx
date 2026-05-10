import { usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { authClient } from "../lib/auth-client";

interface WorkspaceRouteProps {
  children: React.ReactNode;
}

export function WorkspaceRoute({ children }: WorkspaceRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const hasActiveOrg = !!session?.session?.activeOrganizationId;

  useEffect(() => {
    if (!isPending && !hasActiveOrg && pathname !== "/switch-barbershop") {
      router.replace("/switch-barbershop");
    }
  }, [hasActiveOrg, isPending, pathname]);

  if (isPending || !hasActiveOrg) return null;

  return <>{children}</>;
}
