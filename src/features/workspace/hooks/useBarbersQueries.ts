import { useQuery } from "@tanstack/react-query";
import { barbersService } from "../services/barbers.service";

export const BARBERS_QUERY_KEYS = {
  all: ["barbershop-barbers"] as const,
  list: (search?: string) => [...BARBERS_QUERY_KEYS.all, "list", search ?? ""] as const,
};

export function useGetInvitation(invitationId: string, isAuthenticated = false) {
  return useQuery({
    queryKey: [...BARBERS_QUERY_KEYS.all, "invitation", invitationId] as const,
    queryFn: () => barbersService.getInvitation(invitationId),
    enabled: !!invitationId && isAuthenticated,
    retry: false,
  });
}
