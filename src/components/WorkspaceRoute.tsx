import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import { organizationService } from "../features/workspace/services/organization.service";

interface WorkspaceRouteProps {
  children: React.ReactNode;
}

export function WorkspaceRoute({ children }: WorkspaceRouteProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isResolving, setIsResolving] = useState(false);

  const isAuthenticated = !!session?.user;
  const hasActiveOrg = !!session?.session?.activeOrganizationId;

  useEffect(() => {
    if (isPending || !isAuthenticated || hasActiveOrg || isResolving) return;

    setIsResolving(true);

    authClient.organization
      .list({ query: {} })
      .then(({ data: orgs }) => {
        if (!orgs || orgs.length === 0) {
          router.replace("/d/create-barbershop-name-logo");
          setIsResolving(false);
          return;
        }

        const oldest = [...orgs].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )[0];

        organizationService
          .setActive(oldest.id)
          .then(() => authClient.getSession())
          .then(() => {
            setIsResolving(false);
          })
          .catch(() => {
            router.replace("/d/create-barbershop-name-logo");
            setIsResolving(false);
          });
      })
      .catch(() => {
        router.replace("/d/create-barbershop-name-logo");
        setIsResolving(false);
      });
  }, [hasActiveOrg, isPending, isAuthenticated]);

  if (isPending || isResolving || !hasActiveOrg) return null;

  return <>{children}</>;
}
