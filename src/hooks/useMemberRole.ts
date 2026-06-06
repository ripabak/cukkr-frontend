import { authClient } from "@/src/lib/auth-client";

export type MemberRole = "owner" | "admin" | "member";

export function useMemberRole() {
  const { data: activeMember, isPending, error, refetch } =
    authClient.useActiveMember();

  return {
    role: (activeMember?.role as MemberRole) ?? null,
    isPending,
    error,
    refetch,
  };
}
