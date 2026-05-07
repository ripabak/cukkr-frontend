import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesService } from "../services/services.service";
import { SERVICES_QUERY_KEYS } from "./useServicesQueries";

// Schedule resource key prefix — avoids a circular import with the schedule feature
const SCHEDULE_SERVICES_KEY = ["schedule-services"] as const;

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      price: number;
      duration: number;
      description?: string | null;
      discount?: number;
      isActive?: boolean;
    }) => servicesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SCHEDULE_SERVICES_KEY });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        price?: number;
        duration?: number;
        description?: string | null;
        discount?: number;
      };
    }) => servicesService.update(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.byId(id) });
      queryClient.invalidateQueries({ queryKey: SCHEDULE_SERVICES_KEY });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SCHEDULE_SERVICES_KEY });
    },
  });
}

export function useToggleServiceActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.toggleActive(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.byId(id) });
      queryClient.invalidateQueries({ queryKey: SCHEDULE_SERVICES_KEY });
    },
  });
}

export function useSetServiceDefault() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SCHEDULE_SERVICES_KEY });
    },
  });
}
