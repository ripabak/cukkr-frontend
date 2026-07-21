import { useMutation, useQueryClient } from "@tanstack/react-query";
import { barbershopService } from "../services/barbershop.service";
import { BARBERSHOP_QUERY_KEYS } from "./useBarbershopQueries";
import { HOME_QUERY_KEYS } from "../../home/hooks/useHomeDashboardQueries";

export function useUpdateBarbershopSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name?: string;
      slug?: string;
      description?: string | null;
      address?: string | null;
      onboardingCompleted?: boolean;
    }) => barbershopService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BARBERSHOP_QUERY_KEYS.current(),
      });
    },
  });
}

export function useLeaveBarbershop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgId: string) => barbershopService.leave(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERSHOP_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.all });
    },
  });
}

export function useDeleteBarbershop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgId: string) => barbershopService.delete(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERSHOP_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.all });
    },
  });
}

export function useUploadLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: { uri: string; name: string; type: string }) =>
      barbershopService.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BARBERSHOP_QUERY_KEYS.current(),
      });
    },
  });
}
