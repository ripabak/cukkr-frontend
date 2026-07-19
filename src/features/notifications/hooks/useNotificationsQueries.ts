import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { pwaNotificationService } from "@/src/services/pwa-notification.service";
import { notificationsService } from "../services/notifications.service";

export const NOTIFICATIONS_QUERY_KEYS = {
  all: ["notifications"] as const,
  list: (options?: {
    page?: number;
    pageSize?: number;
    unreadOnly?: boolean;
  }) => [...NOTIFICATIONS_QUERY_KEYS.all, "list", options ?? {}] as const,
  unreadCount: () => [...NOTIFICATIONS_QUERY_KEYS.all, "unread-count"] as const,
  unreadCountByOrg: () =>
    [...NOTIFICATIONS_QUERY_KEYS.all, "unread-count-by-org"] as const,
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
  const query = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.unreadCount(),
    queryFn: () => notificationsService.getUnreadCount(),
  });

  useEffect(() => {
    if (query.data != null) {
      pwaNotificationService.setBadge(query.data);
    }
  }, [query.data]);

  return query;
}

export function useUnreadCountByOrg() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.unreadCountByOrg(),
    queryFn: () => notificationsService.getUnreadCountByOrg(),
  });
}
