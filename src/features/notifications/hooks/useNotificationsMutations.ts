import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "../services/notifications.service";
import { NOTIFICATIONS_QUERY_KEYS } from "./useNotificationsQueries";

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all });
    },
  });
}

export function useAcceptNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all });
      // Accepting a team invitation changes workspace membership — refresh barbershop and home
      queryClient.invalidateQueries({ queryKey: ["barbershop"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });
}

export function useDeclineNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      notificationsService.decline(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all });
    },
  });
}

export function useRegisterPushToken() {
  return useMutation({
    mutationFn: (token: string) => notificationsService.registerToken(token),
  });
}
