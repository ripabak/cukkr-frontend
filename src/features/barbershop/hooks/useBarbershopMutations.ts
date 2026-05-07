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
      queryClient.invalidateQueries({ queryKey: BARBERSHOP_QUERY_KEYS.current() });
      queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.barbershop() });
    },
  });
}

export function useLeaveBarbershop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgId: string) => barbershopService.leave(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERSHOP_QUERY_KEYS.current() });
      queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.all });
    },
  });
}
