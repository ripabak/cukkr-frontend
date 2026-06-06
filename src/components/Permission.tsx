import { type MemberRole, useMemberRole } from "@/src/hooks/useMemberRole";
import { type ReactNode } from "react";

interface PermissionProps {
  roles: MemberRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function Permission({ roles, fallback, children }: PermissionProps) {
  const { role, isPending } = useMemberRole();

  if (isPending) return null;

  if (!role || !roles.includes(role)) {
    return fallback ?? null;
  }

  return children;
}
