import { usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { authClient } from "../lib/auth-client";

interface WorkspaceRouteProps {
  children: React.ReactNode;
}

export function WorkspaceRoute({ children }: WorkspaceRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: org, isPending } = authClient.useActiveOrganization();

  useEffect(() => {
    if (!isPending && !org && pathname !== "/switch-barbershop") {
      router.replace("/switch-barbershop");
    }
  }, [org, isPending, pathname]);

  return <>{children}</>;
}
