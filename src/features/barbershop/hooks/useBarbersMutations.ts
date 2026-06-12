import { useMutation, useQueryClient } from "@tanstack/react-query";
import { barbersService } from "../services/barbers.service";
import { BARBERS_QUERY_KEYS } from "./useBarbersQueries";

// Schedule resource key prefix — avoids a circular import with the schedule feature
const SCHEDULE_BARBERS_KEY = ["schedule-barbers"] as const;

export function useInviteBarber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => barbersService.inviteSingle(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERS_QUERY_KEYS.all });
    },
  });
}

export function useRemoveBarber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberIdOrEmail: string) =>
      barbersService.removeMember(memberIdOrEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SCHEDULE_BARBERS_KEY });
    },
  });
}

export function useCancelBarberInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      barbersService.cancelInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERS_QUERY_KEYS.all });
    },
  });
}
