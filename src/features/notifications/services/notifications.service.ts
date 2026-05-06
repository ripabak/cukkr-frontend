import { app } from "@/src/lib/eden-app";

export const notificationsService = {
  async getList(options?: { page?: number; pageSize?: number; unreadOnly?: boolean }) {
    const { data: response, error } = await app.api.notifications.get({
      query: options,
    });
    if (error || !response) throw new Error("Failed to fetch notifications");
    return response;
  },

  async getUnreadCount() {
    const { data: response, error } = await app.api.notifications["unread-count"].get();
    if (error || !response) throw new Error("Failed to fetch unread count");
    return response.data.count;
  },

  async markAsRead(id: string) {
    const { data: response, error } = await app.api.notifications({ id }).read.patch();
    if (error || !response) throw new Error("Failed to mark notification as read");
    return response.data;
  },

  async markAllAsRead() {
    const { data: response, error } = await app.api.notifications["read-all"].patch();
    if (error || !response) throw new Error("Failed to mark all notifications as read");
    return response.data;
  },

  async accept(id: string) {
    const { data: response, error } = await app.api.notifications({ id }).actions.accept.post({});
    if (error || !response) throw new Error("Failed to accept notification");
    return response.data;
  },

  async decline(id: string, reason?: string) {
    const { data: response, error } = await app.api.notifications({ id }).actions.decline.post({ reason });
    if (error || !response) throw new Error("Failed to decline notification");
    return response.data;
  },

  async registerToken(token: string) {
    const { data: response, error } = await app.api.notifications["register-token"].post({ token });
    if (error || !response) throw new Error("Failed to register push token");
    return response.data;
  },
};
