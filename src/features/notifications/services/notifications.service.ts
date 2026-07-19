import { app } from "@/src/lib/eden-app";
import { authClient } from "@/src/lib/auth-client";
import { Platform } from "react-native";

const apiBaseUrl = process.env.EXPO_PUBLIC_ENV_API_URL ?? "";

async function apiFetch(path: string, options?: RequestInit) {
  const baseOptions: RequestInit =
    Platform.OS === "web"
      ? { credentials: "include" }
      : { headers: { Cookie: authClient.getCookie() }, credentials: "omit" };

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...baseOptions,
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(baseOptions.headers as Record<string, string> | undefined),
      ...(options?.headers as Record<string, string> | undefined),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || "Request failed");
  }

  return response.json() as Promise<{ data: unknown }>;
}

export const notificationsService = {
  async getList(options?: {
    page?: number;
    pageSize?: number;
    unreadOnly?: boolean;
  }) {
    const { data: response, error } = await app.api.notifications.get({
      query: options,
    });
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch notifications");
    return response;
  },

  async getUnreadCount() {
    const { data: response, error } =
      await app.api.notifications["unread-count"].get();
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch unread count");
    return response.data.count;
  },

  async getUnreadCountByOrg() {
    const { data: response, error } =
      await app.api.notifications["unread-count-by-org"].get();
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch unread count by org",
      );
    return response.data;
  },

  async markAsRead(id: string) {
    const { data: response, error } = await app.api
      .notifications({ id })
      .read.patch();
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to mark notification as read",
      );
    return response.data;
  },

  async markAllAsRead() {
    const { data: response, error } =
      await app.api.notifications["read-all"].patch();
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to mark all notifications as read",
      );
    return response.data;
  },

  async accept(id: string) {
    const { data: response, error } = await app.api
      .notifications({ id })
      .actions.accept.post({});
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to accept notification");
    return response.data;
  },

  async decline(id: string, reason?: string) {
    const { data: response, error } = await app.api
      .notifications({ id })
      .actions.decline.post({ reason });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to decline notification",
      );
    return response.data;
  },

  async registerToken(token: string) {
    const { data: response, error } = await app.api.notifications[
      "register-token"
    ].post({ token });
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to register push token");
    return response.data;
  },

  async getVapidPublicKey(): Promise<string> {
    const { data: response, error } =
      await app.api.notifications["vapid-public-key"].get();
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch VAPID public key",
      );
    return response.data.publicKey;
  },

  async registerWebPush(subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  }): Promise<void> {
    // Eden Treaty intercepts `.subscribe` as a WebSocket method — use apiFetch directly.
    await apiFetch("/api/notifications/web-push/subscribe", {
      method: "POST",
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      }),
    });
  },
};
