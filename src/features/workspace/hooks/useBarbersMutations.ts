import { useMutation, useQueryClient } from "@tanstack/react-query";
import { barbersService } from "../services/barbers.service";
import { BARBERSHOP_QUERY_KEYS } from "./useBarbershopQueries";

export function useInviteBarber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string }) => barbersService.inviteSingle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERSHOP_QUERY_KEYS.all });
    },
  });
}
