import { useQuery } from "@tanstack/react-query";
import { scheduleResourcesService } from "../services/schedule-resources.service";

export const SCHEDULE_RESOURCES_QUERY_KEYS = {
  barbers: (search?: string) => ["schedule-barbers", search ?? ""] as const,
  services: (search?: string) => ["schedule-services", search ?? ""] as const,
};

export function useScheduleBarbers(search?: string) {
  return useQuery({
    queryKey: SCHEDULE_RESOURCES_QUERY_KEYS.barbers(search),
    queryFn: () => scheduleResourcesService.getBarbers(search),
  });
}

export function useScheduleServices(search?: string) {
  return useQuery({
    queryKey: SCHEDULE_RESOURCES_QUERY_KEYS.services(search),
    queryFn: () => scheduleResourcesService.getServices(search),
  });
}
