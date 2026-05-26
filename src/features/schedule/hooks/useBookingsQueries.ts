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
  requests: (dateFrom: string, dateTo: string) =>
    [...BOOKINGS_QUERY_KEYS.all, "requests", dateFrom, dateTo] as const,
  byId: (id: string) => [...BOOKINGS_QUERY_KEYS.all, "detail", id] as const,
  inProgress: ["schedule-bookings", "in-progress"] as const,
};

export function useBookings(
  date: string,
  options?: {
    status?: BookingApiStatus;
    sort?: "oldest_first" | "recently_added";
    barberId?: string;
  },
) {
  return useQuery({
    queryKey: BOOKINGS_QUERY_KEYS.list(date, options?.status, options?.barberId),
    queryFn: () => bookingsService.getBookings(date, options),
    enabled: !!date,
  });
}

export function useBookingRequestedDates(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: BOOKINGS_QUERY_KEYS.requests(dateFrom, dateTo),
    queryFn: () => bookingsService.getRequestedBookings(dateFrom, dateTo),
    enabled: !!dateFrom && !!dateTo,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBookingById(id: string) {
  return useQuery({
    queryKey: BOOKINGS_QUERY_KEYS.byId(id),
    queryFn: () => bookingsService.getById(id),
    enabled: !!id,
  });
}

export function useInProgressBooking() {
  return useQuery({
    queryKey: BOOKINGS_QUERY_KEYS.inProgress,
    queryFn: () => bookingsService.getInProgress(),
  });
}
