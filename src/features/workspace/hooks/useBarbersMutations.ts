import { useMutation, useQueryClient } from '@tanstack/react-query';
import { barbersService } from '../services/barbers.service';
import { BARBERS_QUERY_KEYS } from './useBarbersQueries';

export function useInviteBarber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string }) => barbersService.inviteSingle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERS_QUERY_KEYS.list() });
    },
  });
}

export function useCancelBarberInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => barbersService.cancelInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERS_QUERY_KEYS.list() });
    },
  });
}

export function useRemoveBarber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => barbersService.removeMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERS_QUERY_KEYS.list() });
    },
  });
}

export function useAcceptBarberInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => barbersService.acceptInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERS_QUERY_KEYS.list() });
    },
  });
}

export function useDeclineBarberInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => barbersService.declineInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBERS_QUERY_KEYS.list() });
    },
  });
}
