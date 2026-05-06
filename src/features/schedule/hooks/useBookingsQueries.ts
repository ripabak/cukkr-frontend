import { useQuery } from "@tanstack/react-query";
import { bookingsService } from "../services/bookings.service";

type BookingApiStatus =
  | "pending"
  | "requested"
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "all";

export const BOOKINGS_QUERY_KEYS = {
  all: ["schedule-bookings"] as const,
  list: (date: string, status?: BookingApiStatus, barberId?: string) =>
    [...BOOKINGS_QUERY_KEYS.all, "list", date, status ?? "", barberId ?? ""] as const,
  byId: (id: string) => [...BOOKINGS_QUERY_KEYS.all, "detail", id] as const,
};

export function useActiveBookings(
  date: string,
  options?: {
    status?: BookingApiStatus;
    sort?: "oldest_first" | "recently_added";
    barberId?: string;
  },
) {
  return useQuery({
    queryKey: BOOKINGS_QUERY_KEYS.list(date, options?.status, options?.barberId),
    queryFn: () => bookingsService.getActiveBookings(date, options),
    enabled: !!date,
  });
}

export function useBookingById(id: string) {
  return useQuery({
    queryKey: BOOKINGS_QUERY_KEYS.byId(id),
    queryFn: () => bookingsService.getById(id),
    enabled: !!id,
  });
}
