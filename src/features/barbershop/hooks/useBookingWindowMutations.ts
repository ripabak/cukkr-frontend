import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingPreferencesService } from "../services/booking-preferences.service";
import { BARBERSHOP_QUERY_KEYS } from "./useBarbershopQueries";

export function useUpdateBookingWindow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      minAdvanceHours: number;
      maxAdvanceDays: number;
    }) => bookingPreferencesService.updateBookingWindow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BARBERSHOP_QUERY_KEYS.current(),
      });
    },
  });
}
