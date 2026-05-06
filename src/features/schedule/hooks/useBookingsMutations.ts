import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsService, CreateBookingPayload } from "../services/bookings.service";
import { BOOKINGS_QUERY_KEYS } from "./useBookingsQueries";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.all });
    },
  });
}

export function useAcceptBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsService.accept(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.byId(id) });
    },
  });
}

export function useDeclineBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingsService.decline(id, reason),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.byId(id) });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      cancelReason,
    }: {
      id: string;
      status: "pending" | "requested" | "waiting" | "in_progress" | "completed" | "cancelled";
      cancelReason?: string | null;
    }) => bookingsService.updateStatus(id, status, cancelReason),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.byId(id) });
    },
  });
}
