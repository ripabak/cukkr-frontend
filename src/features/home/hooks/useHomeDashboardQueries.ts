import { useQuery } from "@tanstack/react-query";
import { homeService } from "../services/home.service";

export const HOME_QUERY_KEYS = {
  all: ["home"] as const,
  summary: (date: string) => [...HOME_QUERY_KEYS.all, "summary", date] as const,
  activeBookings: (date: string) => [...HOME_QUERY_KEYS.all, "active-bookings", date] as const,
  barbershop: () => [...HOME_QUERY_KEYS.all, "barbershop"] as const,
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

export function useCurrentBarbershop() {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.barbershop(),
    queryFn: () => homeService.getCurrentBarbershop(),
  });
}
