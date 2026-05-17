import { useQuery } from "@tanstack/react-query";
import { notificationsService } from "../services/notifications.service";

export const NOTIFICATIONS_QUERY_KEYS = {
  all: ["notifications"] as const,
  list: (options?: { page?: number; pageSize?: number; unreadOnly?: boolean }) =>
    [...NOTIFICATIONS_QUERY_KEYS.all, "list", options ?? {}] as const,
  unreadCount: () => [...NOTIFICATIONS_QUERY_KEYS.all, "unread-count"] as const,
};

export function useNotificationsList(options?: {
  page?: number;
  pageSize?: number;
  unreadOnly?: boolean;
}) {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.list(options),
    queryFn: () => notificationsService.getList(options),
  });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.unreadCount(),
    queryFn: () => notificationsService.getUnreadCount(),
  });
}
