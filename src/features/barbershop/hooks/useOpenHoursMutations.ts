import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openHoursService } from "../services/open-hours.service";
import { OPEN_HOURS_QUERY_KEYS } from "./useOpenHoursQueries";

interface DayHours {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

export function useUpdateOpenHours() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (days: DayHours[]) => openHoursService.update(days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPEN_HOURS_QUERY_KEYS.list() });
    },
  });
}
