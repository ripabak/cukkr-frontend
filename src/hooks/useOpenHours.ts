import { useQuery } from "@tanstack/react-query";
import { openHoursService } from "@/src/services/open-hours.service";

export const OPEN_HOURS_QUERY_KEYS = {
  all: ["barbershop-open-hours"] as const,
  list: () => [...OPEN_HOURS_QUERY_KEYS.all, "list"] as const,
};

export function useOpenHours() {
  return useQuery({
    queryKey: OPEN_HOURS_QUERY_KEYS.list(),
    queryFn: () => openHoursService.getList(),
  });
}
