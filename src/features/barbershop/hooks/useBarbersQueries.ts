import { useQuery } from "@tanstack/react-query";
import { barbersService } from "../services/barbers.service";

export const BARBERS_QUERY_KEYS = {
  all: ["barbershop-barbers"] as const,
  list: (search?: string) => [...BARBERS_QUERY_KEYS.all, "list", search ?? ""] as const,
};

export function useBarbersList(search?: string) {
  return useQuery({
    queryKey: BARBERS_QUERY_KEYS.list(search),
    queryFn: () => barbersService.getListMember(search),
  });
}

export function useBarbersInvitations() {
  return useQuery({
    queryKey: [...BARBERS_QUERY_KEYS.all, "invitations"] as const,
    queryFn: () => barbersService.getListInvitation(),
  });
}
