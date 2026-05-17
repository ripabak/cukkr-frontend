import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/src/lib/auth-client";
import { homeService } from "../services/home.service";

export const HOME_QUERY_KEYS = {
  all: ["home"] as const,
  summary: (date: string) => [...HOME_QUERY_KEYS.all, "summary", date] as const,
  activeBookings: (date: string) => [...HOME_QUERY_KEYS.all, "active-bookings", date] as const,
  currentPin: [...["home"], "current-pin"] as const,
};

export function useBookingSummary(date: string) {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.summary(date),
    queryFn: () => homeService.getBookingSummary(date),
    enabled: !!date,
  });
}

export function useHomeActiveBookings(date: string) {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.activeBookings(date),
    queryFn: () => homeService.getActiveBookings(date),
    enabled: !!date,
  });
}

export function useCurrentPin() {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.currentPin,
    queryFn: () => homeService.getCurrentPin(),
  });
}

// Uses authClient directly — active org is managed by better-auth session state,
// not React Query, so it updates automatically when setActive is called.
export function useCurrentBarbershop() {
  return authClient.useActiveOrganization();
}

export function useMyOrgRole() {
  return authClient.useActiveMember();
}
